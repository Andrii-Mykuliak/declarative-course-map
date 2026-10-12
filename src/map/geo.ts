import React from "react";

export type Pt = [number, number];

/** SMIL rotation around (cx, cy); steadier than CSS transform-origin inside nested SVG groups. */
export const Spin = ({ cx = 0, cy = 0, dur, dir = 1 }: { cx?: number; cy?: number; dur: number; dir?: 1 | -1 }) =>
  React.createElement("animateTransform", {
    attributeName: "transform",
    type: "rotate",
    from: `0 ${cx} ${cy}`,
    to: `${dir * 360} ${cx} ${cy}`,
    dur: `${dur}s`,
    repeatCount: "indefinite",
  });

/** SMIL rocking between two angles around (cx, cy). */
export const Rock = ({ cx, cy, a, dur }: { cx: number; cy: number; a: number; dur: number }) =>
  React.createElement("animateTransform", {
    attributeName: "transform",
    type: "rotate",
    values: `${-a} ${cx} ${cy}; ${a} ${cx} ${cy}; ${-a} ${cx} ${cy}`,
    dur: `${dur}s`,
    repeatCount: "indefinite",
    calcMode: "spline",
    keySplines: "0.45 0 0.55 1; 0.45 0 0.55 1",
  });

export const W = 2400;
export const H = 1600;

/** Deterministic PRNG so the scenery is the same on every load. */
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Smooth path through the points (Catmull–Rom converted to cubic Béziers). */
export const smooth = (pts: Pt[], closed = false, k = 1 / 6): string => {
  if (pts.length < 2) {
    return "";
  }
  const n = pts.length;
  const at = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return closed ? d + " Z" : d;
};

/** Points sampled along the same Catmull–Rom curve, for spacing objects away from the path. */
export const sampleCurve = (pts: Pt[], perSeg = 16): Pt[] => {
  const out: Pt[] = [];
  const n = pts.length;
  const at = (i: number) => pts[Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < n - 1; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    for (let s = 0; s < perSeg; s++) {
      const t = s / perSeg;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[n - 1]);
  return out;
};

export const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);

export const nearest = (p: Pt, cloud: Pt[]) => cloud.reduce((m, q) => Math.min(m, dist(p, q)), Infinity);

/** Ray-casting point-in-polygon test. */
export const inside = (p: Pt, poly: Pt[]) => {
  let r = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) {
      r = !r;
    }
  }
  return r;
};

/** A wobbly closed outline around a centre, for blobs, rocks and fluffy creatures. */
export const blob = (cx: number, cy: number, rx: number, ry: number, n: number, wobble: number, seed: number): Pt[] => {
  const r = rng(seed);
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + (r() - 0.5) * 2 * wobble;
    out.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return out;
};
