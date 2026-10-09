import * as THREE from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { PHONE_SIZE, PHONE_SCREEN_INSET, phoneOutline } from "./dimensions";

export { PHONE_SIZE } from "./dimensions";

function enclosureShape(inset = 0) {
  return new THREE.Shape(phoneOutline(inset).map(([x, y]) => new THREE.Vector2(x, y)));
}

function roundedShape(width: number, height: number, radius: number) {
  const x = -width / 2, y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  const control = radius * (1 - .5522847498);
  shape.bezierCurveTo(x + width - control, y, x + width, y + control, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.bezierCurveTo(x + width, y + height - control, x + width - control, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.bezierCurveTo(x + control, y + height, x, y + height - control, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.bezierCurveTo(x, y + control, x + control, y, x + radius, y);
  return shape;
}

function roundedSolid(width: number, height: number, depth: number, radius: number, bevel: number) {
  return extrudedSolid(roundedShape(width - bevel * 2, height - bevel * 2, radius - bevel), width, height, depth, bevel);
}

function extrudedSolid(shape: THREE.Shape, width: number, height: number, depth: number, bevel: number) {
  const raw = new THREE.ExtrudeGeometry(shape, {
    depth: depth - bevel * 2, bevelEnabled: true,
    bevelThickness: bevel, bevelSize: bevel, bevelSegments: 5, curveSegments: 24, steps: 1,
  });
  raw.translate(0, 0, -(depth - bevel * 2) / 2);
  // Smooth normals across the machined shoulders, without texture seams.
  raw.deleteAttribute("normal");
  raw.deleteAttribute("uv");
  const geometry = mergeVertices(raw, .0001);
  raw.dispose();
  geometry.computeVertexNormals();
  const positions = geometry.getAttribute("position");
  const uv = new Float32Array(positions.count * 2);
  for (let i = 0; i < positions.count; i++) {
    uv[i * 2] = positions.getX(i) / width + .5;
    uv[i * 2 + 1] = positions.getY(i) / height + .5;
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return geometry;
}

/** Original, editable product model: separate physical materials and real relief. */
export async function loadPhoneModel() {
  const group = new THREE.Group();
  group.name = "Original Burgundy Pro Max study";
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const grain = new Uint8Array(128 * 128 * 4);
  let seed = 186;
  for (let i = 0; i < grain.length; i += 4) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const value = 220 + seed % 30;
    grain[i] = grain[i + 1] = grain[i + 2] = value;
    grain[i + 3] = 255;
  }
  const finishTexture = new THREE.DataTexture(grain, 128, 128);
  finishTexture.wrapS = finishTexture.wrapT = THREE.RepeatWrapping;
  finishTexture.repeat.set(18, 36);
  finishTexture.magFilter = THREE.LinearFilter;
  finishTexture.minFilter = THREE.LinearMipmapLinearFilter;
  finishTexture.generateMipmaps = true;
  finishTexture.needsUpdate = true;
  textures.add(finishTexture);

  const physical = (name: string, properties: THREE.MeshPhysicalMaterialParameters) => {
    const material = new THREE.MeshPhysicalMaterial(properties);
    material.name = name;
    materials.add(material);
    return material;
  };
  const aluminum = physical("Burgundy anodized aluminum", { color: "#512632", metalness: .8, roughness: .4, roughnessMap: finishTexture, clearcoat: .22, clearcoatRoughness: .28 });
  const polished = physical("Polished burgundy chamfers", { color: "#623442", metalness: .9, roughness: .26, clearcoat: .25 });
  const backGlass = physical("Satin ceramic rear glass", { color: "#341c24", metalness: .08, roughness: .42, roughnessMap: finishTexture, clearcoat: .6, clearcoatRoughness: .3, ior: 1.5, envMapIntensity: .8 });
  const cameraDeck = physical("Machined camera plateau", { color: "#48202c", metalness: .76, roughness: .42, roughnessMap: finishTexture, clearcoat: .2, clearcoatRoughness: .28 });
  const darkMetal = physical("Blackened lens barrels", { color: "#15161a", metalness: .83, roughness: .22 });
  const black = physical("Recessed black inserts", { color: "#07090b", metalness: .1, roughness: .52 });
  const gasket = physical("Antenna and seal polymer", { color: "#35212b", metalness: 0, roughness: .7 });
  const logoMetal = physical("Polished logo inlay", { color: "#855565", metalness: .65, roughness: .28, clearcoat: .45, envMapIntensity: 1.4 });
  const islandGlass = physical("Opaque black island glass", { color: "#010103", metalness: 0, roughness: .16, specularIntensity: .08, envMapIntensity: .12 });
  const optics = physical("Optical coating", { color: "#050710", metalness: .3, roughness: .08, clearcoat: .8, clearcoatRoughness: .03, iridescence: .26, iridescenceIOR: 1.35, iridescenceThicknessRange: [180, 380] });
  const lensGlass = physical("Sapphire camera glass", { color: "#dce4f4", metalness: 0, roughness: .045, transmission: 1, thickness: .16, ior: 1.77, attenuationColor: "#647391", attenuationDistance: 2.5, envMapIntensity: .35 });
  const apertureBlade = physical("Graphite aperture blades", { color: "#22252c", metalness: .65, roughness: .38, envMapIntensity: .4 });
  const ultraOptic = physical("Ultra Wide violet coating", { color: "#141227", metalness: .32, roughness: .12, clearcoat: 1, iridescence: .5, iridescenceThicknessRange: [250, 380], envMapIntensity: .5 });
  const mainOptic = physical("Main blue green coating", { color: "#071b27", metalness: .4, roughness: .1, clearcoat: 1, iridescence: .35, iridescenceThicknessRange: [120, 240], envMapIntensity: .5 });
  const teleOptic = physical("Telephoto prism coating", { color: "#17132b", metalness: .45, roughness: .08, clearcoat: 1, iridescence: .4, iridescenceThicknessRange: [340, 470], envMapIntensity: .5 });
  const flashGlass = physical("Frosted flash diffuser", { color: "#e5dfcd", metalness: .05, roughness: .34, clearcoat: .7, clearcoatRoughness: .18 });

  const add = (name: string, geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) => {
    geometries.add(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(x, y, z);
    group.add(mesh);
    return mesh;
  };
  const solid = (name: string, w: number, h: number, d: number, r: number, b: number, material: THREE.Material, x = 0, y = 0, z = 0) =>
    add(name, roundedSolid(w, h, d, r, b), material, x, y, z);
  const disk = (name: string, radius: number, depth: number, material: THREE.Material, x: number, y: number, z: number) => {
    const mesh = add(name, new THREE.CylinderGeometry(radius, radius, depth, 64), material, x, y, z);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
  };
  const ring = (name: string, radius: number, tube: number, material: THREE.Material, x: number, y: number, z: number) =>
    add(name, new THREE.TorusGeometry(radius, tube, 10, 72), material, x, y, z);

  const enclosure = (name: string, inset: number, depth: number, bevel: number, material: THREE.Material, z = 0) =>
    add(name, extrudedSolid(enclosureShape(inset + bevel), PHONE_SIZE.width - inset * 2, PHONE_SIZE.height - inset * 2, depth, bevel), material, 0, 0, z);
  enclosure("Unibody enclosure", 0, PHONE_SIZE.depth, .95, aluminum);
  enclosure("Rear perimeter highlight", 1.04, .38, .12, polished, -4.26);
  enclosure("Rear backing", 1.4, .32, .1, cameraDeck, -4.47);
  solid("Rear glass seal", 71.8, 106.4, .22, 10.5, .06, gasket, 0, -25, -4.68);
  solid("Rear glass panel", 71.3, 105.9, .26, 10.3, .08, backGlass, 0, -25, -4.79);

  // Measured rear relief: back plate → plateau 2.78 mm → camera glass 2.11 mm.
  const plateauZ = -8.75 / 2 - 2.78;
  // Optical datum sits .16 mm behind the outside of the .12 mm cover.
  const cameraZ = plateauZ - 2.11 + .16;
  solid("Camera plateau shoulder", 72.86, 45.2, 2.78, 13.5, .65, cameraDeck, 0, 57.71, plateauZ + 1.39);
  solid("Camera plateau face", 71.5, 43.84, .14, 12.82, .04, cameraDeck, 0, 57.71, plateauZ + .03);
  // Positions/outer diameters follow Apple's accessory drawing. Internal optics
  // are visual reconstructions: wide pupil, smaller ultra-wide, folded telephoto.
  const lenses = [
    { name: "Ultra Wide", x: 24.62, y: 67.345, pupil: 2.05, coating: ultraOptic },
    { name: "Main", x: 24.62, y: 48.105, pupil: 3.55, coating: mainOptic },
    { name: "Telephoto", x: 6.5, y: 57.725, pupil: 2.75, coating: teleOptic },
  ];
  lenses.forEach(({ name, x, y, pupil, coating }) => {
    const curvedGlass = physical(`${name} transmitting entrance element`, {
      color: name === "Main" ? "#7b94a5" : "#9189b0", metalness: 0,
      roughness: .065, transmission: .88, thickness: .28, ior: 1.6,
      iridescence: .25, iridescenceThicknessRange: coating.iridescenceThicknessRange,
      envMapIntensity: .5,
    });
    // A hollow barrel leaves the recessed optical stack visible through glass.
    const barrel = add(`${name} barrel`, new THREE.CylinderGeometry(8.29, 8.29, 1.95, 64, 1, true), polished, x, y, plateauZ - .98);
    barrel.rotation.x = Math.PI / 2;
    ring(`${name} rim`, 7.99, .22, polished, x, y, cameraZ + .16);
    disk(`${name} retaining ring`, 7.78, .24, darkMetal, x, y, cameraZ + .3);
    disk(`${name} optical well`, 7.28, .14, black, x, y, cameraZ + .22);
    [6.4, 5.65, 4.95].forEach((r, i) => ring(`${name} baffle ${i}`, r, .07, darkMetal, x, y, cameraZ + .12));
    if (name === "Main") {
      // Overlapping diaphragm leaves give the large main lens its own structure.
      for (let i = 0; i < 9; i++) {
        const blade = new THREE.Shape();
        blade.moveTo(3.3, -.65); blade.lineTo(4.7, -.4);
        blade.lineTo(3.8, 2.7); blade.lineTo(2.7, 1.95); blade.closePath();
        const mesh = add(`Main diaphragm leaf ${i}`, new THREE.ShapeGeometry(blade), apertureBlade, x, y, cameraZ + .11);
        mesh.rotation.set(0, Math.PI, i * Math.PI * 2 / 9);
      }
    }
    if (name === "Telephoto") {
      solid("Telephoto rectangular prism surround", 6.5, 6.5, .12, 1.65, .035, darkMetal, x, y, cameraZ + .16);
      solid("Telephoto recessed prism", 4.35, 4.95, .1, 1.05, .025, coating, x, y, cameraZ + .075);
      solid("Telephoto entrance pupil", 2.5, 3.4, .07, .65, .02, black, x, y, cameraZ - .01);
      // A broad curved entrance element sits above the internal folded prism.
      const teleElement = add("Telephoto convex entrance element", new THREE.SphereGeometry(3.8, 40, 20), curvedGlass, x, y, cameraZ + .09);
      teleElement.scale.z = .045;
      teleElement.renderOrder = 4;
    } else {
      disk(`${name} optical element`, pupil + .48, .12, coating, x, y, cameraZ + .12);
      ring(`${name} optical element edge`, pupil + .4, .075, coating, x, y, cameraZ + .015);
      disk(`${name} entrance pupil`, pupil * .68, .065, black, x, y, cameraZ + .01);
      const optic = add(`${name} convex element`, new THREE.SphereGeometry(pupil, 32, 16), curvedGlass, x, y, cameraZ + .095);
      optic.scale.z = .07;
      optic.renderOrder = 4;
    }
    const cover = disk(`${name} sapphire cover`, 7.22, .12, lensGlass, x, y, cameraZ - .1);
    cover.renderOrder = 5;
  });
  disk("Flash bezel", 3.45, .22, polished, -25.17, 67.895, plateauZ - .06);
  disk("Flash diffuser", 3.1, .16, flashGlass, -25.17, 67.895, plateauZ - .23);
  disk("Flash center", 1.2, .06, flashGlass, -25.17, 67.895, plateauZ - .35);
  disk("LiDAR border", 3.45, .18, darkMetal, -25.17, 47.555, plateauZ - .08);
  disk("LiDAR glass", 3.13, .12, optics, -25.17, 47.555, plateauZ - .24);
  disk("Rear microphone aperture", .575, .15, black, -25.17, 57.725, plateauZ - .08);

  // The vector is the CC0 Simple Icons Apple mark; the inlay itself is geometry.
  const applePath = "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701";
  const logo = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${applePath}"/></svg>`);
  const logoGeometry = logo.paths.flatMap(path => SVGLoader.createShapes(path)).map(shape =>
    new THREE.ExtrudeGeometry(shape, { depth: .035, bevelEnabled: false, curveSegments: 20 }));
  const logoBounds = new THREE.Box3();
  logoGeometry.forEach(geometry => { geometry.computeBoundingBox(); logoBounds.union(geometry.boundingBox!); });
  const logoCenter = logoBounds.getCenter(new THREE.Vector3());
  const logoSize = logoBounds.getSize(new THREE.Vector3());
  logoGeometry.forEach((geometry, index) => {
    geometry.translate(-logoCenter.x, -logoCenter.y, 0);
    geometry.scale(-16.32 / logoSize.x, -20.04 / logoSize.y, 1);
    add(`Apple inlay ${index}`, geometry, logoMetal, -.11, PHONE_SIZE.height / 2 - 97.51, -4.98);
  });

  // Physical side buttons, their inset surrounds, and the bottom connector.
  const button = (name: string, side: number, y: number, h: number) => {
    const seal = solid(`${name} recess`, 3.4, h + .65, .28, 1.4, .1, gasket, side * 38.85, y, 0);
    seal.rotation.y = Math.PI / 2;
    const cap = solid(name, 2.8, h, .8, 1.15, .25, polished, side * 39.1, y, 0);
    cap.rotation.y = Math.PI / 2;
  };
  button("Action button", -1, 46, 5.8);
  button("Volume up", -1, 30, 10.4);
  button("Volume down", -1, 15.5, 10.4);
  button("Side button", 1, 26, 16.8);
  button("Camera control", 1, -32, 16);
  for (const side of [-1, 1]) for (const y of [-65, 64]) {
    const line = solid("Antenna break", 7, 1.15, .12, .3, .035, gasket, side * 38.98, y, 0);
    line.rotation.y = Math.PI / 2;
  }
  const port = solid("USB-C socket", 9.1, 2.95, .16, 1.4, .045, black, 0, -81.65, 0);
  port.rotation.x = Math.PI / 2;
  const tongue = solid("USB-C tongue", 6.5, .64, .2, .22, .04, darkMetal, 0, -81.78, 0);
  tongue.rotation.x = Math.PI / 2;
  for (const side of [-1, 1]) for (let i = 0; i < 6; i++) {
    const aperture = disk("Speaker aperture", .68, .2, black, side * (15 + i * 2.5), -81.65, 0);
    aperture.rotation.x = 0;
  }

  enclosure("Front glass perimeter", 1.2, .3, .1, black, 4.36);
  // Clear just the live-display area in this transparent canvas, with depth
  // testing so the rear and camera still occlude it while the phone rotates.
  const screenShape = enclosureShape(PHONE_SCREEN_INSET);
  const apertureMaterial = new THREE.ShaderMaterial({
    vertexShader: "void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
    fragmentShader: "void main(){gl_FragColor=vec4(0.0);}",
    blending: THREE.NoBlending, depthTest: true, depthWrite: false,
  });
  materials.add(apertureMaterial);
  const aperture = add("Live DOM screen aperture", new THREE.ShapeGeometry(screenShape, 32), apertureMaterial, 0, 0, 4.54);
  aperture.renderOrder = 30;
  // Front cover reflections composite over HTML; full transmission can only
  // refract WebGL objects, so it is reserved for the modeled camera lenses.
  const frontGlass = physical("Front cover glass reflections", { color: "#11161b", roughness: .045, metalness: .05, transparent: true, opacity: .1, depthWrite: false, clearcoat: 1, clearcoatRoughness: .025, envMapIntensity: 2.3, ior: 1.52 });
  const front = add("Front cover glass", new THREE.ShapeGeometry(screenShape, 32), frontGlass, 0, 0, 4.56);
  front.renderOrder = 40;
  const island = solid("Dynamic Island glass", 15.68, 6.07, .25, 3.035, .08, islandGlass, 0, 73.805, 4.74);
  island.renderOrder = 35;
  const frontLens = disk("Front camera lens", .78, .08, ultraOptic, 4.9, 73.805, 4.93);
  frontLens.renderOrder = 36;
  const earpiece = solid("Earpiece slot", 10, .42, .13, .2, .035, black, 0, 79.3, 4.42);
  earpiece.renderOrder = 36;

  return {
    group,
    dispose() {
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      textures.forEach(texture => texture.dispose());
      group.clear();
    },
  };
}
