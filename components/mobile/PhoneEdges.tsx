import type { CSSProperties } from "react";
import "./phone-edges.css";

const SEGMENTS = 8;
const arcStep = Math.PI / 2 / SEGMENTS;
const chord = (2 * Math.sin(arcStep / 2)).toFixed(8);
const apothem = Math.cos(arcStep / 2);
const corners = [
  { x: "calc(100% - var(--phone-radius))", y: "var(--phone-radius)", start: -90 },
  { x: "calc(100% - var(--phone-radius))", y: "calc(100% - var(--phone-radius))", start: 0 },
  { x: "var(--phone-radius)", y: "calc(100% - var(--phone-radius))", start: 90 },
  { x: "var(--phone-radius)", y: "var(--phone-radius)", start: 180 },
];

/** Metal walls join the two device faces; each rounded corner uses eight facets. */
export default function PhoneEdges() {
  return (
    <div className="phone-edges" aria-hidden="true">
      <span className="phone-edge phone-edge-top" />
      <span className="phone-edge phone-edge-right" />
      <span className="phone-edge phone-edge-bottom" />
      <span className="phone-edge phone-edge-left" />
      {corners.flatMap((corner, cornerIndex) => Array.from({ length: SEGMENTS }, (_, segment) => {
        const degrees = corner.start + (segment + .5) * 90 / SEGMENTS;
        const radians = degrees * Math.PI / 180;
        // Round trigonometric values for identical server/browser serialization.
        // The chord's midpoint lies inside the circle, so adjoining facets meet.
        const x = (Math.cos(radians) * apothem).toFixed(8);
        const y = (Math.sin(radians) * apothem).toFixed(8);
        const light = (.12 + .15 * Math.max(0, -Math.cos(radians) - Math.sin(radians))).toFixed(8);
        return (
          <span
            key={`${cornerIndex}-${segment}`}
            className="phone-edge phone-edge-corner"
            style={{
              "--edge-x": `calc(${corner.x} + var(--phone-radius) * ${x})`,
              "--edge-y": `calc(${corner.y} + var(--phone-radius) * ${y})`,
              "--edge-length": `calc(var(--phone-radius) * ${chord} + .3px)`,
              "--edge-angle": `${degrees + 90}deg`,
              "--edge-light": light,
            } as CSSProperties}
          />
        );
      }))}
    </div>
  );
}
