// Apple's accessory drawing, iPhone 18 Pro Max, 2026-09-09, sheet 1.
// https://developer.apple.com/download/files/accessories/dimensional-drawings/iphone-18-pro-max.pdf
// This is an interpolated visualization of the published dimensions, not CAD.
export const PHONE_SIZE = { width: 77.98, height: 163.43, depth: 8.75 } as const;
export const PHONE_SCREEN_INSET = 2.56;
export const PHONE_DISPLAY_SIZE = { width: 72.86, height: 158.31 } as const;

export type PhonePoint = readonly [number, number];

// Detail A: distance inward from the upper-left bounding-box corner, in mm.
// Listed from the vertical edge toward the horizontal edge; mirror at all four.
export const PHONE_CORNER_PROFILE: readonly PhonePoint[] = [
  [0, 19.43], [.04, 13.90], [.92, 8.46], [3.80, 3.80],
  [8.46, .92], [13.90, .04], [19.43, 0],
];

const SAMPLES_PER_SEGMENT = 8;
const xValues = PHONE_CORNER_PROFILE.map(point => point[0]);
const secants = xValues.slice(1).map((value, index) => value - xValues[index]);
const tangents = xValues.map((_, index) => {
  if (index === 0) return 0;
  if (index === xValues.length - 1) return (3 * secants[index - 1] - secants[index - 2]) / 2;
  const before = secants[index - 1];
  const after = secants[index];
  return 2 * before * after / (before + after);
});
// The first cubic has three collinear control points at the vertical edge.
// This makes its normal velocity and curvature zero where the straight joins.
// Three times the first secant is the monotone Hermite limit: no overshoot.
tangents[1] = 3 * secants[0];

function cubic(a: number, b: number, da: number, db: number, t: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    value: (2 * t3 - 3 * t2 + 1) * a + (t3 - 2 * t2 + t) * da
      + (-2 * t3 + 3 * t2) * b + (t3 - t2) * db,
    derivative: (6 * t2 - 6 * t) * a + (3 * t2 - 4 * t + 1) * da
      + (-6 * t2 + 6 * t) * b + (3 * t2 - 2 * t) * db,
  };
}

const cornerSamples: readonly { x: number; y: number; dx: number; dy: number }[] = (() => {
  const points = [];
  const last = xValues.length - 1;
  for (let segment = 0; segment < last; segment++) {
    for (let sample = 0; sample <= SAMPLES_PER_SEGMENT; sample++) {
      if (segment > 0 && sample === 0) continue;
      const t = sample / SAMPLES_PER_SEGMENT;
      const x = cubic(xValues[segment], xValues[segment + 1], tangents[segment], tangents[segment + 1], t);
      const y = cubic(xValues[last - segment], xValues[last - segment - 1], -tangents[last - segment], -tangents[last - segment - 1], t);
      points.push({ x: x.value, y: y.value, dx: x.derivative, dy: y.derivative });
    }
  }
  return points;
})();

/**
 * Closed, clockwise outline in centered millimeters, with positive Y upward.
 * A cubic Hermite fit passes through each published corner point. Offsets use
 * the curve's analytic inward normals, so inset glass/display contours follow
 * the enclosure rather than independently shrinking an arbitrary radius.
 */
export function phoneOutline(inset = 0): readonly PhonePoint[] {
  const halfWidth = PHONE_SIZE.width / 2;
  const halfHeight = PHONE_SIZE.height / 2;
  const points: PhonePoint[] = [];
  for (let corner = 0; corner < 4; corner++) {
    for (const { x, y, dx, dy } of cornerSamples) {
      const length = Math.hypot(dx, dy);
      const offsetX = -dy * inset / length;
      const offsetY = dx * inset / length;
      const innerX = x + offsetX;
      const innerY = y + offsetY;
      if (corner === 0) points.push([-halfWidth + innerX, halfHeight - innerY]);
      else if (corner === 1) points.push([halfWidth - innerY, halfHeight - innerX]);
      else if (corner === 2) points.push([halfWidth - innerX, -halfHeight + innerY]);
      else points.push([-halfWidth + innerY, -halfHeight + innerX]);
    }
  }
  points.push(points[0]);
  return points;
}

const percent = (value: number) => Math.min(100, Math.max(0, value)).toFixed(5);
export const SCREEN_CLIP = `polygon(${phoneOutline(PHONE_SCREEN_INSET).map(([x, y]) =>
  `${percent((x / PHONE_DISPLAY_SIZE.width + .5) * 100)}% ${percent((.5 - y / PHONE_DISPLAY_SIZE.height) * 100)}%`
).join(",")})`;
