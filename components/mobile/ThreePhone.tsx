"use client";

import { useEffect, useRef, type RefObject } from "react";
import { PHONE_SIZE } from "./phone3d/dimensions";

type ThreePhoneProps = {
  sceneRef: RefObject<HTMLDivElement | null>;
  phoneRef: RefObject<HTMLDivElement | null>;
  wrapperRef: RefObject<HTMLDivElement | null>;
  phase: string;
  onReady: () => void;
  onUnavailable: () => void;
};

const PERSPECTIVE = 1400;
const MOVING_PHASES = new Set(["back", "flipping", "opening"]);
let areaLightTablesReady = false;

/** The hardware shares the DOM display's pose, projection, and opening fade. */
export default function ThreePhone({ sceneRef, phoneRef, wrapperRef, phase, onReady, onUnavailable }: ThreePhoneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(phase);
  const readyRef = useRef(onReady);
  const unavailableRef = useRef(onUnavailable);
  const wakeRef = useRef<(() => void) | null>(null);
  phaseRef.current = phase;
  readyRef.current = onReady;
  unavailableRef.current = onUnavailable;

  useEffect(() => { wakeRef.current?.(); }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = sceneRef.current;
    const phone = phoneRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !container || !phone || !wrapper) return;

    let cancelled = false;
    let unavailable = false;
    let frame = 0;
    let settlingFrames = 0;
    let release: (() => void) | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let loadingTimer: ReturnType<typeof setTimeout> | undefined;
    const environmentRequest = new AbortController();

    const fail = () => {
      if (cancelled || unavailable) return;
      unavailable = true;
      clearTimeout(loadingTimer);
      environmentRequest.abort();
      canvas.dataset.state = "unavailable";
      canvas.style.visibility = "hidden";
      cancelAnimationFrame(frame);
      frame = 0;
      resizeObserver?.disconnect();
      release?.();
      release = undefined;
      unavailableRef.current();
    };
    const contextLost = (event: Event) => {
      // The static hardware remains a usable fallback for this intro run.
      event.preventDefault();
      fail();
    };
    canvas.addEventListener("webglcontextlost", contextLost);
    loadingTimer = setTimeout(fail, 12000);

    void (async () => {
      const [THREE, { loadPhoneModel }, { RectAreaLightUniformsLib }] = await Promise.all([
        import("three"),
        import("./phone3d/model"),
        import("three/addons/lights/RectAreaLightUniformsLib.js"),
      ]);
      if (cancelled || unavailable) return;
      if (!areaLightTablesReady) {
        RectAreaLightUniformsLib.init();
        areaLightTablesReady = true;
      }

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
      // Own the context immediately, including failures before full scene setup.
      release = () => { renderer.dispose(); renderer.forceContextLoss(); };
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.02;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

      const scene = new THREE.Scene();
      // Scene units are CSS pixels; this keeps fine glass/inlay depth precise.
      const camera = new THREE.PerspectiveCamera(40, 1, 100, 3000);
      camera.position.z = PERSPECTIVE;
      const pose = new THREE.Group();
      pose.matrixAutoUpdate = false;
      const millimeterScale = new THREE.Group();
      pose.add(millimeterScale);
      scene.add(pose);

      // Bright studio cards provide broad, moving reflections as the phone turns.
      // The room is baked once into a small environment map, not rendered per frame.
      const studio = new THREE.Scene();
      studio.background = new THREE.Color(.075, .084, .097);
      const studioGeometries: InstanceType<typeof THREE.PlaneGeometry>[] = [];
      const studioMaterials: InstanceType<typeof THREE.MeshBasicMaterial>[] = [];
      const addSoftbox = (width: number, height: number, position: [number, number, number], color: [number, number, number]) => {
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(...color), side: THREE.DoubleSide, toneMapped: false });
        const card = new THREE.Mesh(geometry, material);
        card.position.set(...position);
        card.lookAt(0, 0, 0);
        studio.add(card);
        studioGeometries.push(geometry);
        studioMaterials.push(material);
      };
      addSoftbox(5, 12, [-7, 4, 7], [5.2, 4.85, 4.55]);
      addSoftbox(2.2, 14, [7, 1, -4], [3.1, 3.4, 3.8]);
      addSoftbox(8, 4, [0, 8, -6], [4.2, 4.2, 4.35]);
      addSoftbox(5, 6, [1, -6, 5], [.7, .8, .85]);
      const pmrem = new THREE.PMREMGenerator(renderer);
      let environment: ReturnType<typeof pmrem.fromScene> | undefined;
      let model: Awaited<ReturnType<typeof loadPhoneModel>> | undefined;
      let disposed = false;

      release = () => {
        if (disposed) return;
        disposed = true;
        model?.dispose();
        environment?.dispose();
        pmrem.dispose();
        studioGeometries.forEach(geometry => geometry.dispose());
        studioMaterials.forEach(material => material.dispose());
        renderer.dispose();
        renderer.forceContextLoss();
      };
      const environmentTimeout = setTimeout(() => environmentRequest.abort(), 5000);
      try {
        const [{ HDRLoader }, response] = await Promise.all([
          import("three/addons/loaders/HDRLoader.js"),
          fetch("/device/studio-small-09-1k.hdr", { signal: environmentRequest.signal }),
        ]);
        if (!response.ok) throw new Error("Studio environment unavailable");
        const data = await response.arrayBuffer();
        if (cancelled || unavailable) return;
        const texture = new HDRLoader().createDataTexture(data);
        try { environment = pmrem.fromEquirectangular(texture); }
        finally { texture.dispose(); }
        canvas.dataset.environment = "studio-hdr";
      } catch {
        if (cancelled || unavailable) return;
        environment = pmrem.fromScene(studio, .045, .1, 100, { size: 256 });
        canvas.dataset.environment = "studio-softboxes";
      } finally {
        clearTimeout(environmentTimeout);
      }
      scene.environment = environment.texture;
      scene.environmentIntensity = 1.15;
      scene.environmentRotation.set(.08, .62, 0);

      // Area lights create broad photographic highlights on the flat logo and
      // camera plateau; punctual lights only picked out their thin bevels.
      const lighting = new THREE.Group();
      const key = new THREE.RectAreaLight(0xfff1e7, 3.8, 680, 900);
      key.position.set(-160, 190, 560);
      key.lookAt(0, -40, 0);
      const strip = new THREE.RectAreaLight(0xe1ecff, 5.2, 130, 950);
      strip.position.set(440, 60, 240);
      strip.lookAt(0, 0, 0);
      const returnLight = new THREE.RectAreaLight(0xfff2e9, 2.5, 500, 800);
      returnLight.position.set(-170, 170, -530);
      returnLight.lookAt(0, 0, 0);
      lighting.add(key, strip, returnLight);
      scene.add(lighting);

      model = await loadPhoneModel();
      if (cancelled || unavailable) {
        // Initialization may finish after cleanup already disposed the renderer.
        if (disposed) model.dispose();
        else release?.();
        release = undefined;
        return;
      }
      millimeterScale.add(model.group);

      const translation = new THREE.Matrix4();
      const domTransform = new THREE.Matrix4();
      let width = 0;
      let height = 0;
      let pixelRatio = 0;
      const syncPose = () => {
        const bounds = container.getBoundingClientRect();
        const wrapperBounds = wrapper.getBoundingClientRect();
        const nextWidth = Math.max(1, bounds.width);
        const nextHeight = Math.max(1, bounds.height);
        const nextRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        if (width !== nextWidth || height !== nextHeight || pixelRatio !== nextRatio) {
          width = nextWidth;
          height = nextHeight;
          pixelRatio = nextRatio;
          renderer.setPixelRatio(pixelRatio);
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(height / (2 * PERSPECTIVE)));
          camera.updateProjectionMatrix();
        }
        const style = getComputedStyle(phone);
        const matrix = new DOMMatrixReadOnly(style.transform === "none" ? undefined : style.transform);
        // CSS uses downward-positive Y; Three's scene uses upward-positive Y.
        domTransform.set(
          matrix.m11, -matrix.m21, matrix.m31, matrix.m41,
          -matrix.m12, matrix.m22, -matrix.m32, -matrix.m42,
          matrix.m13, -matrix.m23, matrix.m33, matrix.m43,
          matrix.m14, -matrix.m24, matrix.m34, matrix.m44,
        );
        translation.makeTranslation(
          wrapperBounds.left + wrapperBounds.width / 2 - bounds.left - width / 2,
          -(wrapperBounds.top + wrapperBounds.height / 2 - bounds.top - height / 2),
          0,
        );
        pose.matrix.multiplyMatrices(translation, domTransform);
        pose.matrixWorldNeedsUpdate = true;
        millimeterScale.scale.setScalar(wrapperBounds.width / PHONE_SIZE.width);
        // Preserve the same light coverage on the smaller mobile presentation.
        const lightScale = wrapperBounds.width / 332;
        lighting.scale.setScalar(lightScale);
        // Three reads emitter dimensions directly, without parent scale.
        key.width = 680 * lightScale; key.height = 900 * lightScale;
        strip.width = 130 * lightScale; strip.height = 950 * lightScale;
        returnLight.width = 500 * lightScale; returnLight.height = 800 * lightScale;
        lighting.position.setFromMatrixPosition(translation);
        canvas.style.opacity = getComputedStyle(wrapper).opacity;
        canvas.dataset.phase = phaseRef.current;
      };

      const render = () => {
        frame = 0;
        if (cancelled || unavailable) return;
        try {
          syncPose();
          renderer.render(scene, camera);
        } catch {
          fail();
          return;
        }
        // Settling frames cover the React/CSS commit at either end of a phase.
        if (MOVING_PHASES.has(phaseRef.current) || settlingFrames-- > 0) frame = requestAnimationFrame(render);
      };
      const wake = () => {
        if (cancelled || unavailable) return;
        settlingFrames = 3;
        if (!frame) frame = requestAnimationFrame(render);
      };

      syncPose();
      await renderer.compileAsync(scene, camera);
      if (cancelled || unavailable) return;
      renderer.render(scene, camera);
      clearTimeout(loadingTimer);
      canvas.dataset.state = "ready";
      canvas.style.visibility = "visible";
      readyRef.current();
      wakeRef.current = wake;
      resizeObserver = new ResizeObserver(wake);
      resizeObserver.observe(container);
      resizeObserver.observe(wrapper);
      wake();
    })().catch(fail);

    return () => {
      cancelled = true;
      environmentRequest.abort();
      clearTimeout(loadingTimer);
      cancelAnimationFrame(frame);
      wakeRef.current = null;
      resizeObserver?.disconnect();
      canvas.removeEventListener("webglcontextlost", contextLost);
      release?.();
      release = undefined;
    };
  }, [sceneRef, phoneRef, wrapperRef]);

  return <canvas ref={canvasRef} className="launch-hardware-canvas" data-renderer="three" data-state="loading" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 4, pointerEvents: "none", visibility: "hidden" }} />;
}
