"use client";

import { useEffect, useRef } from "react";

/**
 * A point cloud in the shape of the React atom, sitting behind the hero.
 * It holds together at rest and blows apart as you scroll, in the manner of
 * dala.craftedbygc.com — theirs is WebGL, this is a plain 2D canvas.
 *
 * Every particle knows two positions: `home` on the logo, and `away` out in
 * space. Scroll progress lerps between them, so the shape scatters as you
 * start moving and is gone by the time the hero has left.
 */

/** Deterministic, so the cloud is identical on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* React blue leading, then the site's own gradient, so it reads as ours */
const COLORS = ["#61dafb", "#38bdf8", "#3b82f6", "#8b5cf6", "#ec4899", "#eef1f8"];

const PER_RING = 950;
const NUCLEUS = 430;
/** particles per ellipse band, before jitter */
const RING_ROTATIONS = [0, Math.PI / 3, (2 * Math.PI) / 3];

type Particle = {
  /** position on the logo, in unit space (-1..1) */
  hx: number;
  hy: number;
  /** where it flies to when scattered, same units */
  ax: number;
  ay: number;
  depth: number;
  size: number;
  alpha: number;
  /** index into COLORS — particles are drawn grouped by colour */
  c: number;
};

export default function ParticleLogo() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const rand = mulberry32(73_010);
    const buckets: Particle[][] = COLORS.map(() => []);

    const push = (hx: number, hy: number, colorBias: number) => {
      // scatter target: outward from where it sits, well past the frame
      const a = Math.atan2(hy, hx) + (rand() - 0.5) * 1.6;
      const r = 1.5 + rand() * 3.2;
      const c =
        rand() < 0.72
          ? colorBias
          : (rand() * COLORS.length) | 0;
      buckets[c].push({
        hx,
        hy,
        ax: Math.cos(a) * r,
        ay: Math.sin(a) * r * 0.8,
        depth: 0.25 + rand() * 0.75,
        size: rand() < 0.86 ? 1.3 : 2.3,
        alpha: 0.5 + rand() * 0.5,
        c,
      });
    };

    // three ellipses at 60° to each other, plus the nucleus — the React mark
    RING_ROTATIONS.forEach((rot, ring) => {
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      for (let i = 0; i < PER_RING; i++) {
        const t = (i / PER_RING) * Math.PI * 2;
        // jitter turns a hairline ellipse into a band with some volume
        const ex = Math.cos(t) + (rand() - 0.5) * 0.05;
        const ey = Math.sin(t) * 0.38 + (rand() - 0.5) * 0.05;
        push(ex * cos - ey * sin, ex * sin + ey * cos, ring);
      }
    });

    for (let i = 0; i < NUCLEUS; i++) {
      const a = rand() * Math.PI * 2;
      // sqrt keeps the disc evenly filled rather than clumped at the centre
      const r = Math.sqrt(rand()) * 0.15;
      push(Math.cos(a) * r, Math.sin(a) * r, 0);
    }

    let w = 0;
    let h = 0;
    let radius = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.min(w * 0.34, h * 0.46);
    }

    let pxTarget = 0;
    let pyTarget = 0;
    let px = 0;
    let py = 0;
    let scatterTarget = 0;
    let scatter = 0;
    let spin = 0;
    let frame = 0;

    function progress() {
      // fully scattered after most of a viewport of scrolling
      return Math.min(window.scrollY / (window.innerHeight * 0.75), 1);
    }

    function paint() {
      ctx!.clearRect(0, 0, w, h);

      const cx = w / 2 + px * 26;
      const cy = h / 2 + py * 26;
      const cos = Math.cos(spin);
      const sin = Math.sin(spin);
      // ease the scatter so the edges of the range aren't abrupt
      const s = scatter * scatter * (3 - 2 * scatter);
      const fade = 1 - s;

      for (let b = 0; b < buckets.length; b++) {
        const list = buckets[b];
        if (!list.length) continue;
        ctx!.fillStyle = COLORS[b];

        for (let i = 0; i < list.length; i++) {
          const p = list[i];
          // spin the logo about its centre while it is still assembled
          const rx = p.hx * cos - p.hy * sin;
          const ry = p.hx * sin + p.hy * cos;

          const ux = rx + (p.ax - rx) * s;
          const uy = ry + (p.ay - ry) * s;

          ctx!.globalAlpha = p.alpha * fade;
          ctx!.fillRect(
            cx + ux * radius + px * p.depth * 18,
            cy + uy * radius + py * p.depth * 18,
            p.size,
            p.size,
          );
        }
      }
      ctx!.globalAlpha = 1;
    }

    function render() {
      px += (pxTarget - px) * 0.05;
      py += (pyTarget - py) * 0.05;
      scatter += (scatterTarget - scatter) * 0.08;
      spin += 0.0009;
      paint();
      frame = requestAnimationFrame(render);
    }

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pxTarget = (e.clientX / window.innerWidth) * 2 - 1;
      pyTarget = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scatterTarget = progress();
    };
    const onResize = () => {
      resize();
      if (reduced) paint();
    };

    resize();

    if (reduced) {
      // assembled, still, no scatter
      paint();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    scatterTarget = progress();
    scatter = scatterTarget;

    const onVisibility = () => {
      if (document.hidden) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
      } else if (!frame) {
        frame = requestAnimationFrame(render);
      }
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(render);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="particle-logo" aria-hidden="true" />;
}
