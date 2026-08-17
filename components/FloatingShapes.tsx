"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";

/**
 * A field of wireframe shapes drifting behind the page, in the manner of
 * dala.craftedbygc.com. Three motions compose, one per nested element, so
 * none of them clobbers another's transform:
 *
 *   .shape        scroll parallax  (scroll-driven, CSS only)
 *   .shape-mouse  pointer parallax (reads --mx/--my, set on <html>)
 *   .shape-spin   idle drift + rotation
 *
 * Depth (--d) scales both parallaxes, so near shapes travel further than
 * far ones and the field reads as layered rather than flat.
 */

type Shape = {
  /** viewport position, % */
  x: number;
  y: number;
  /** px */
  size: number;
  /** parallax depth, 0.15 (far) → 1 (near) */
  d: number;
  /** starting rotation, deg */
  r: number;
  /** idle drift duration, s */
  dur: number;
  kind: "tri" | "tetra" | "diamond" | "square";
  color: string;
  opacity: number;
};

/*
 * Hand-placed rather than random: this renders on the server too, so the
 * values have to be identical on both sides of hydration.
 */
const SHAPES: Shape[] = [
  { x: 6, y: 14, size: 30, d: 0.9, r: 14, dur: 24, kind: "tetra", color: "#8b5cf6", opacity: 0.5 },
  { x: 14, y: 62, size: 18, d: 0.45, r: 38, dur: 31, kind: "tri", color: "#3b82f6", opacity: 0.4 },
  { x: 3, y: 84, size: 24, d: 0.75, r: 62, dur: 27, kind: "diamond", color: "#22d3a7", opacity: 0.35 },
  { x: 21, y: 32, size: 14, d: 0.3, r: 8, dur: 36, kind: "tri", color: "#eef1f8", opacity: 0.22 },
  { x: 27, y: 88, size: 34, d: 1, r: 25, dur: 22, kind: "tetra", color: "#ec4899", opacity: 0.4 },
  { x: 35, y: 8, size: 20, d: 0.6, r: 47, dur: 29, kind: "square", color: "#fbbf24", opacity: 0.3 },
  { x: 44, y: 46, size: 12, d: 0.25, r: 19, dur: 38, kind: "tri", color: "#eef1f8", opacity: 0.18 },
  { x: 39, y: 72, size: 26, d: 0.8, r: 71, dur: 25, kind: "tetra", color: "#3b82f6", opacity: 0.38 },
  { x: 52, y: 18, size: 16, d: 0.4, r: 33, dur: 33, kind: "diamond", color: "#8b5cf6", opacity: 0.32 },
  { x: 58, y: 92, size: 22, d: 0.7, r: 5, dur: 28, kind: "tri", color: "#22d3a7", opacity: 0.34 },
  { x: 49, y: 66, size: 38, d: 1, r: 52, dur: 21, kind: "tetra", color: "#8b5cf6", opacity: 0.34 },
  { x: 66, y: 36, size: 13, d: 0.28, r: 27, dur: 37, kind: "tri", color: "#eef1f8", opacity: 0.2 },
  { x: 72, y: 10, size: 28, d: 0.85, r: 66, dur: 24, kind: "tetra", color: "#fbbf24", opacity: 0.36 },
  { x: 78, y: 74, size: 18, d: 0.5, r: 11, dur: 32, kind: "square", color: "#3b82f6", opacity: 0.3 },
  { x: 88, y: 24, size: 32, d: 0.95, r: 41, dur: 23, kind: "tetra", color: "#ec4899", opacity: 0.38 },
  { x: 94, y: 58, size: 20, d: 0.6, r: 74, dur: 30, kind: "diamond", color: "#8b5cf6", opacity: 0.33 },
  { x: 84, y: 94, size: 15, d: 0.35, r: 22, dur: 35, kind: "tri", color: "#eef1f8", opacity: 0.2 },
  { x: 97, y: 86, size: 26, d: 0.8, r: 58, dur: 26, kind: "tetra", color: "#22d3a7", opacity: 0.32 },
  { x: 63, y: 54, size: 11, d: 0.22, r: 45, dur: 40, kind: "tri", color: "#eef1f8", opacity: 0.16 },
  { x: 31, y: 24, size: 17, d: 0.45, r: 69, dur: 34, kind: "diamond", color: "#3b82f6", opacity: 0.28 },
  { x: 9, y: 42, size: 22, d: 0.7, r: 30, dur: 27, kind: "tri", color: "#8b5cf6", opacity: 0.3 },
  { x: 76, y: 46, size: 24, d: 0.75, r: 15, dur: 29, kind: "square", color: "#ec4899", opacity: 0.26 },
];

const PATHS: Record<Shape["kind"], string> = {
  tri: "M12 2 L22 21 L2 21 Z",
  // triangle plus a spine, which is what reads as a wireframe solid
  tetra: "M12 2 L22 21 L2 21 Z M12 2 L12 21 M12 21 L22 21",
  diamond: "M12 1 L21 12 L12 23 L3 12 Z",
  square: "M4 4 H20 V20 H4 Z",
};

export default function FloatingShapes() {
  /*
   * One pointer listener for the whole page, writing --mx/--my on <html> so
   * anything can read them. Values are eased toward the cursor rather than
   * snapped to it — that glide is most of the effect.
   */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let frame = 0;

    const tick = () => {
      curX += (targetX - curX) * 0.075;
      curY += (targetY - curY) * 0.075;
      root.style.setProperty("--mx", curX.toFixed(4));
      root.style.setProperty("--my", curY.toFixed(4));

      const settled =
        Math.abs(targetX - curX) < 0.0005 && Math.abs(targetY - curY) < 0.0005;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // normalised to -1..1 from the viewport centre
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
      root.style.removeProperty("--mx");
      root.style.removeProperty("--my");
    };
  }, []);

  return (
    <div className="shape-field">
      {SHAPES.map((s, i) => (
        <span
          key={i}
          className="shape"
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              "--d": s.d,
            } as CSSProperties
          }
        >
          <span className="shape-mouse">
            <span
              className="shape-spin"
              style={
                { "--r": s.r, "--dur": `${s.dur}s` } as CSSProperties
              }
            >
              <svg
                width={s.size}
                height={s.size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={s.color}
                strokeWidth="1.1"
                strokeLinejoin="round"
                opacity={s.opacity}
                aria-hidden="true"
              >
                <path d={PATHS[s.kind]} />
              </svg>
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
