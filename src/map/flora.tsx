import React, { useMemo, useState } from "react";
import { P } from "./palette";
import { inside, nearest, Pt, rng } from "./geo";

export type Tree = { x: number; y: number; s: number; kind: "pine" | "round" | "bush"; tone: number };

const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
};

export const Pine: React.FC<{ t: Tree }> = ({ t }) => {
  const { x, y, s } = t;
  const c = shade(P.pine, 0.9 + t.tone * 0.25);
  const hi = shade(P.pineHi, 0.9 + t.tone * 0.2);
  const tier = (w: number, top: number, bot: number) => (
    <>
      <polygon points={`${x - w},${y - bot} ${x},${y - top} ${x + w},${y - bot}`} fill={c} stroke={P.ink} strokeWidth={1.3} strokeLinejoin="round" />
      <polygon points={`${x - w * 0.95},${y - bot} ${x},${y - top} ${x - w * 0.1},${y - bot}`} fill={hi} opacity={0.6} />
    </>
  );
  return (
    <g>
      <ellipse cx={x + 4 * s} cy={y} rx={13 * s} ry={4 * s} fill="#000" opacity={0.14} />
      <rect x={x - 2.5 * s} y={y - 10 * s} width={5 * s} height={10 * s} fill={P.trunk} />
      {tier(15 * s, 30 * s, 8 * s)}
      {tier(12 * s, 44 * s, 22 * s)}
      {tier(8.5 * s, 56 * s, 36 * s)}
    </g>
  );
};

export const Round: React.FC<{ t: Tree }> = ({ t }) => {
  const { x, y, s } = t;
  const c = shade(P.leaf, 0.88 + t.tone * 0.3);
  const hi = shade(P.leafHi, 0.9 + t.tone * 0.2);
  return (
    <g>
      <ellipse cx={x + 5 * s} cy={y} rx={15 * s} ry={4.5 * s} fill="#000" opacity={0.14} />
      <rect x={x - 3 * s} y={y - 16 * s} width={6 * s} height={16 * s} fill={P.trunk} stroke={P.ink} strokeWidth={1} />
      <circle cx={x - 8 * s} cy={y - 24 * s} r={11 * s} fill={c} stroke={P.ink} strokeWidth={1.3} />
      <circle cx={x + 8 * s} cy={y - 24 * s} r={11 * s} fill={c} stroke={P.ink} strokeWidth={1.3} />
      <circle cx={x} cy={y - 33 * s} r={13 * s} fill={c} stroke={P.ink} strokeWidth={1.3} />
      <circle cx={x - 4 * s} cy={y - 37 * s} r={5 * s} fill={hi} opacity={0.7} />
    </g>
  );
};

export const Bush: React.FC<{ t: Tree }> = ({ t }) => {
  const { x, y, s } = t;
  const c = shade(P.leaf, 0.95 + t.tone * 0.2);
  return (
    <g>
      <circle cx={x - 6 * s} cy={y - 6 * s} r={7 * s} fill={c} stroke={P.ink} strokeWidth={1.1} />
      <circle cx={x + 6 * s} cy={y - 6 * s} r={7 * s} fill={c} stroke={P.ink} strokeWidth={1.1} />
      <circle cx={x} cy={y - 10 * s} r={8 * s} fill={c} stroke={P.ink} strokeWidth={1.1} />
    </g>
  );
};

export const TreeShape: React.FC<{ t: Tree }> = ({ t }) =>
  t.kind === "pine" ? <Pine t={t} /> : t.kind === "round" ? <Round t={t} /> : <Bush t={t} />;

type Keep = { route: Pt[]; routeGap: number; spots: Pt[]; spotGap: number; boxes?: [number, number, number, number][] };

/** Jittered grid inside a polygon, keeping clear of the path, the stops and the label boxes. */
export const scatter = (
  poly: Pt[],
  seed: number,
  step: number,
  keep: Keep,
  pick: (r: () => number) => Tree["kind"],
  scale: [number, number],
  density = 1,
): Tree[] => {
  const r = rng(seed);
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  const out: Tree[] = [];
  for (let y = Math.min(...ys); y < Math.max(...ys); y += step * 0.8) {
    for (let x = Math.min(...xs); x < Math.max(...xs); x += step) {
      if (r() > density) {
        continue;
      }
      const p: Pt = [x + (r() - 0.5) * step * 0.9, y + (r() - 0.5) * step * 0.7];
      if (!inside(p, poly)) {
        continue;
      }
      if (nearest(p, keep.route) < keep.routeGap || nearest(p, keep.spots) < keep.spotGap) {
        continue;
      }
      if (keep.boxes?.some(([bx, by, bw, bh]) => p[0] > bx && p[0] < bx + bw && p[1] > by && p[1] < by + bh)) {
        continue;
      }
      out.push({ x: p[0], y: p[1], s: scale[0] + r() * (scale[1] - scale[0]), kind: pick(r), tone: r() });
    }
  }
  return out;
};

type Branch = { x1: number; y1: number; x2: number; y2: number; d: number };

const grow = (x: number, y: number, a: number, len: number, depth: number, max: number, out: Branch[]) => {
  if (depth > max) {
    return;
  }
  const x2 = x + Math.cos(a) * len;
  const y2 = y + Math.sin(a) * len;
  out.push({ x1: x, y1: y, x2, y2, d: depth });
  grow(x2, y2, a - 0.42, len * 0.74, depth + 1, max, out);
  grow(x2, y2, a + 0.36, len * 0.7, depth + 1, max, out);
};

/** A tree that is literally recursive; a click adds one more level of recursion. */
export const FractalTree: React.FC<{ x: number; y: number; size: number; delay?: number }> = ({ x, y, size, delay = 0 }) => {
  const [depth, setDepth] = useState(6);
  const branches = useMemo(() => {
    const out: Branch[] = [];
    grow(x, y, -Math.PI / 2, size, 0, depth, out);
    return out;
  }, [x, y, size, depth]);
  return (
    <g
      className="sway"
      style={{ animationDelay: `${delay}s`, cursor: "pointer" }}
      onClick={(e) => {
        e.stopPropagation();
        setDepth((d) => (d >= 9 ? 5 : d + 1));
      }}
    >
      <title>Рекурсивне дерево: клацніть, щоб додати рівень рекурсії</title>
      <ellipse cx={x + 6} cy={y + 2} rx={size * 0.5} ry={size * 0.12} fill="#000" opacity={0.15} />
      {branches.map((b, i) => (
        <line
          key={i}
          x1={b.x1}
          y1={b.y1}
          x2={b.x2}
          y2={b.y2}
          stroke={b.d < 3 ? P.trunk : b.d < depth - 1 ? "#5a7f3e" : P.leafHi}
          strokeWidth={Math.max(1.2, (depth + 1 - b.d) * 1.6)}
          strokeLinecap="round"
        />
      ))}
      {branches
        .filter((b) => b.d === depth)
        .map((b, i) => (
          <circle key={`l${i}`} cx={b.x2} cy={b.y2} r={3.4} fill={i % 7 === 0 ? P.flower : P.leafHi} opacity={0.95} />
        ))}
    </g>
  );
};
