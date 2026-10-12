import React, { useMemo, useState } from "react";
import { P } from "./palette";
import { inside, nearest, Pt, rng } from "./geo";

const ink = { stroke: P.ink, strokeWidth: 1.6, strokeLinejoin: "round" as const };

const Flag: React.FC<{ x: number; y: number; color?: string; s?: number; delay?: number }> = ({ x, y, color = P.purple, s = 1, delay = 0 }) => (
  <g>
    <line x1={x} y1={y} x2={x} y2={y - 34 * s} stroke={P.ink} strokeWidth={2} />
    <path
      className="flag"
      style={{ animationDelay: `${delay}s` }}
      d={`M ${x} ${y - 34 * s} q ${12 * s} ${-5 * s} ${24 * s} ${2 * s} l ${-6 * s} ${7 * s} l ${6 * s} ${7 * s} q ${-12 * s} ${-6 * s} ${-24 * s} ${-2 * s} Z`}
      fill={color}
      {...ink}
      strokeWidth={1.2}
    />
  </g>
);

const Crenels: React.FC<{ x: number; y: number; w: number; n: number; fill: string }> = ({ x, y, w, n, fill }) => (
  <>
    {Array.from({ length: n }, (_, i) => (
      <rect key={i} x={x + (i * w) / n + w / n / 4} y={y - 9} width={w / n / 2} height={10} fill={fill} {...ink} strokeWidth={1.2} />
    ))}
  </>
);

const Tower: React.FC<{ x: number; y: number; w: number; h: number; roof?: string; flag?: boolean; delay?: number }> = ({
  x,
  y,
  w,
  h,
  roof = P.royal,
  flag,
  delay,
}) => (
  <g>
    <rect x={x - w / 2} y={y - h} width={w} height={h} fill={P.wall} {...ink} />
    <rect x={x + w * 0.12} y={y - h} width={w * 0.38} height={h} fill={P.wallShade} opacity={0.55} />
    <polygon points={`${x - w / 2 - 5},${y - h} ${x},${y - h - w * 1.35} ${x + w / 2 + 5},${y - h}`} fill={roof} {...ink} />
    <polygon points={`${x},${y - h - w * 1.35} ${x + w / 2 + 5},${y - h} ${x + w * 0.1},${y - h}`} fill="#000" opacity={0.18} />
    <rect x={x - 4} y={y - h * 0.62} width={8} height={13} rx={4} fill="#3a2a48" />
    {flag && <Flag x={x} y={y - h - w * 1.35} delay={delay} />}
  </g>
);

/** A castle; `gate` adds the λ on the gate. */
export const Castle: React.FC<{ x: number; y: number; s?: number; gate?: boolean }> = ({ x, y, s = 1, gate }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
    <ellipse cx={x} cy={y + 4} rx={170} ry={18} fill="#000" opacity={0.18} />
    <Tower x={x - 80} y={y - 40} w={44} h={140} flag delay={0.3} />
    <Tower x={x + 80} y={y - 40} w={44} h={140} flag delay={0.8} />
    <rect x={x - 50} y={y - 200} width={100} height={160} fill={P.wall} {...ink} />
    <rect x={x + 8} y={y - 200} width={42} height={160} fill={P.wallShade} opacity={0.5} />
    <Crenels x={x - 50} y={y - 200} w={100} n={5} fill={P.wall} />
    <Tower x={x} y={y - 200} w={56} h={70} flag delay={0.1} />
    {[-30, 0, 30].map((dx) => (
      <rect key={dx} x={x + dx - 5} y={y - 160} width={10} height={18} rx={5} fill="#3a2a48" />
    ))}
    <rect x={x - 160} y={y - 70} width={320} height={70} fill={P.wall} {...ink} />
    <Crenels x={x - 160} y={y - 70} w={320} n={12} fill={P.wall} />
    <rect x={x - 160} y={y - 70} width={320} height={14} fill="#000" opacity={0.06} />
    <Tower x={x - 160} y={y} w={40} h={100} roof={P.roof2} />
    <Tower x={x + 160} y={y} w={40} h={100} roof={P.roof2} />
    <path d={`M ${x - 26} ${y} L ${x - 26} ${y - 34} A 26 26 0 0 1 ${x + 26} ${y - 34} L ${x + 26} ${y} Z`} fill="#2b1f36" {...ink} />
    {gate && (
      <g className="gate-glow">
        <circle cx={x} cy={y - 32} r={20} fill="url(#glowPurple)" />
        <text x={x} y={y - 22} textAnchor="middle" fontFamily="Yeseva One, serif" fontSize={30} fill={P.crystalHi}>
          λ
        </text>
      </g>
    )}
  </g>
);

/** Ladders, a catapult and the λ-army climbing the exam castle. */
export const Siege: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    {[
      [x - 120, y - 70],
      [x + 40, y - 70],
    ].map(([lx, ly], i) => (
      <g key={i}>
        <line x1={lx - 30} y1={ly + 70} x2={lx} y2={ly} stroke={P.trunk} strokeWidth={4} />
        <line x1={lx - 14} y1={ly + 74} x2={lx + 16} y2={ly + 4} stroke={P.trunk} strokeWidth={4} />
        {[0.2, 0.4, 0.6, 0.8].map((k) => (
          <line key={k} x1={lx - 30 + 30 * k} y1={ly + 70 - 70 * k} x2={lx - 14 + 30 * k} y2={ly + 74 - 70 * k} stroke={P.trunk} strokeWidth={2.5} />
        ))}
        <g className="climb" style={{ animationDelay: `${-i * 1.4}s` }}>
          <circle cx={lx - 20} cy={ly + 50} r={6} fill={P.purple} stroke={P.ink} strokeWidth={1.2} />
          <rect x={lx - 26} y={ly + 55} width={12} height={12} rx={3} fill={P.roof2} stroke={P.ink} strokeWidth={1} />
          <text x={lx - 20} y={ly + 65} textAnchor="middle" fontSize={9} fill="#fff" fontFamily="serif">
            λ
          </text>
        </g>
      </g>
    ))}
    <g transform={`translate(${x - 270} ${y + 30})`}>
      <rect x={-34} y={-8} width={68} height={14} rx={3} fill={P.trunk} {...ink} />
      <circle cx={-22} cy={8} r={9} fill={P.trunk} {...ink} />
      <circle cx={22} cy={8} r={9} fill={P.trunk} {...ink} />
      <g className="catapult">
        <line x1={0} y1={-6} x2={-46} y2={-52} stroke={P.trunk} strokeWidth={5} strokeLinecap="round" />
        <circle cx={-48} cy={-54} r={8} fill="#8b8b8b" stroke={P.ink} strokeWidth={1.2} />
      </g>
    </g>
    {[
      [x - 330, y - 20, P.roof2],
      [x - 210, y + 70, P.purple],
    ].map(([tx, ty, c], i) => (
      <g key={i}>
        <polygon points={`${+tx - 30},${+ty} ${tx},${+ty - 44} ${+tx + 30},${+ty}`} fill={c as string} {...ink} />
        <polygon points={`${tx},${+ty - 44} ${+tx + 30},${+ty} ${+tx + 4},${+ty}`} fill="#000" opacity={0.2} />
        <path d={`M ${+tx - 7} ${ty} L ${tx} ${+ty - 22} L ${+tx + 7} ${ty} Z`} fill="#2b1f36" />
        <Flag x={+tx} y={+ty - 44} color={P.gold} s={0.6} delay={i * 0.5} />
      </g>
    ))}
  </g>
);

type Building = { x: number; y: number; w: number; h: number; kind: "house" | "tower" | "dome"; roof: string };

/** Houses, towers and domes of the city, kept off the path and the river. */
export const useCity = (poly: Pt[], route: Pt[], spots: Pt[], river: Pt[]) =>
  useMemo(() => {
    const r = rng(61);
    const out: Building[] = [];
    for (let i = 0; i < 900 && out.length < 70; i++) {
      const p: Pt = [380 + r() * 1460, 1200 + r() * 330];
      if (!inside(p, poly)) {
        continue;
      }
      if (nearest(p, route) < 62 || nearest(p, spots) < 95 || nearest(p, river) < 70) {
        continue;
      }
      if (out.some((b) => Math.abs(b.x - p[0]) < 46 && Math.abs(b.y - p[1]) < 34)) {
        continue;
      }
      const t = r();
      const kind: Building["kind"] = t < 0.16 ? "tower" : t < 0.27 ? "dome" : "house";
      out.push({
        x: p[0],
        y: p[1],
        w: kind === "tower" ? 24 : 34 + r() * 18,
        h: kind === "tower" ? 70 + r() * 30 : 26 + r() * 18,
        kind,
        roof: [P.roof1, P.roof2, P.roof3, P.roof1][Math.floor(r() * 4)],
      });
    }
    return out.sort((a, b) => a.y - b.y);
  }, [poly, route, spots, river]);

export const BuildingShape: React.FC<{ b: Building; i: number }> = ({ b, i }) => {
  const { x, y, w, h } = b;
  if (b.kind === "tower") {
    return <Tower x={x} y={y} w={w} h={h} roof={b.roof} flag delay={i * 0.17} />;
  }
  return (
    <g>
      <ellipse cx={x + 6} cy={y + 2} rx={w * 0.7} ry={5} fill="#000" opacity={0.14} />
      <rect x={x - w / 2} y={y - h} width={w} height={h} fill={P.wall} {...ink} />
      <rect x={x + w * 0.1} y={y - h} width={w * 0.4} height={h} fill={P.wallShade} opacity={0.5} />
      {b.kind === "dome" ? (
        <path d={`M ${x - w / 2} ${y - h} A ${w / 2} ${w / 2.2} 0 0 1 ${x + w / 2} ${y - h} Z`} fill={P.dome} {...ink} />
      ) : (
        <polygon points={`${x - w / 2 - 4},${y - h} ${x},${y - h - w * 0.55} ${x + w / 2 + 4},${y - h}`} fill={b.roof} {...ink} />
      )}
      <rect x={x - 4} y={y - 12} width={8} height={12} fill="#3a2a48" />
      <rect x={x - w / 2 + 5} y={y - h + 7} width={6} height={7} fill={i % 3 === 0 ? "#ffd98a" : "#3a2a48"} className={i % 3 === 0 ? "window" : undefined} />
      <rect x={x + w / 2 - 11} y={y - h + 7} width={6} height={7} fill="#3a2a48" />
    </g>
  );
};

export const WoodBridge: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <path d={`M ${x - 62} ${y + 6} Q ${x} ${y - 12} ${x + 62} ${y + 2} L ${x + 62} ${y + 20} Q ${x} ${y + 6} ${x - 62} ${y + 24} Z`} fill="#a8774a" {...ink} />
    {Array.from({ length: 9 }, (_, i) => (
      <line key={i} x1={x - 50 + i * 12.5} y1={y - 1 + Math.abs(i - 4) * 1.8} x2={x - 50 + i * 12.5} y2={y + 18 + Math.abs(i - 4) * 0.6} stroke={P.ink} strokeWidth={1} opacity={0.6} />
    ))}
  </g>
);

export const StoneBridge: React.FC<{ x0: number; x1: number; y: number; depth?: number }> = ({ x0, x1, y, depth = 70 }) => {
  const mid = (x0 + x1) / 2;
  return (
    <g>
      <path
        d={`M ${x0} ${y - 10} L ${x1} ${y - 10} L ${x1} ${y + depth} L ${x1 - 34} ${y + depth} Q ${mid} ${y + 6} ${x0 + 34} ${y + depth} L ${x0} ${y + depth} Z`}
        fill="#b9ad97"
        {...ink}
        strokeWidth={2}
      />
      {Array.from({ length: Math.floor((x1 - x0) / 26) }, (_, i) => (
        <line key={i} x1={x0 + 13 + i * 26} y1={y - 10} x2={x0 + 13 + i * 26} y2={y + 6} stroke={P.ink} strokeWidth={1} opacity={0.5} />
      ))}
      <rect x={x0} y={y - 24} width={x1 - x0} height={10} fill="#a69a83" {...ink} strokeWidth={1.4} />
    </g>
  );
};

export const Windmill: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <polygon points={`${x - 24},${y} ${x - 14},${y - 80} ${x + 14},${y - 80} ${x + 24},${y}`} fill={P.wall} {...ink} />
    <polygon points={`${x - 20},${y - 80} ${x},${y - 106} ${x + 20},${y - 80}`} fill={P.roof3} {...ink} />
    <rect x={x - 6} y={y - 22} width={12} height={22} fill="#3a2a48" />
    <g className="spin">
      {[0, 90, 180, 270].map((a) => (
        <g key={a} transform={`rotate(${a} ${x} ${y - 78})`}>
          <line x1={x} y1={y - 78} x2={x} y2={y - 150} stroke={P.trunk} strokeWidth={3} />
          <rect x={x + 1} y={y - 148} width={13} height={58} fill="#f6eedb" {...ink} strokeWidth={1.1} />
        </g>
      ))}
      <circle cx={x} cy={y - 78} r={5} fill={P.trunk} />
    </g>
  </g>
);

export const Ship: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g className="bob">
    <path d={`M ${x - 40} ${y} L ${x + 40} ${y} L ${x + 28} ${y + 16} L ${x - 28} ${y + 16} Z`} fill={P.trunk} {...ink} />
    <line x1={x} y1={y} x2={x} y2={y - 64} stroke={P.ink} strokeWidth={2.2} />
    <path d={`M ${x + 2} ${y - 60} Q ${x + 36} ${y - 34} ${x + 2} ${y - 8} Z`} fill={P.parchment} {...ink} />
    <path d={`M ${x - 2} ${y - 56} Q ${x - 28} ${y - 34} ${x - 2} ${y - 12} Z`} fill={P.roof2} {...ink} />
    <text x={x + 12} y={y - 28} fontSize={16} fill={P.purple} fontFamily="Yeseva One, serif">
      λ
    </text>
  </g>
);

export const Crystal: React.FC<{ x: number; y: number; s?: number; delay?: number }> = ({ x, y, s = 1, delay = 0 }) => {
  const shards: [number, number, number][] = [
    [-12, 30, -0.25],
    [0, 46, 0],
    [12, 34, 0.3],
    [-4, 22, 0.55],
  ];
  return (
    <g className="crystal" style={{ animationDelay: `${delay}s` }}>
      <circle cx={x} cy={y - 24 * s} r={46 * s} fill="url(#glowPurple)" className="glow" style={{ animationDelay: `${delay}s` }} />
      {shards.map(([dx, h, a], i) => (
        <g key={i} transform={`rotate(${a * 57} ${x + dx * s} ${y})`}>
          <polygon
            points={`${x + dx * s - 6 * s},${y} ${x + dx * s - 6 * s},${y - h * s * 0.7} ${x + dx * s},${y - h * s} ${x + dx * s + 6 * s},${y - h * s * 0.7} ${x + dx * s + 6 * s},${y}`}
            fill={P.crystal}
            stroke="#3b2266"
            strokeWidth={1.2}
          />
          <polygon points={`${x + dx * s - 6 * s},${y - h * s * 0.7} ${x + dx * s},${y - h * s} ${x + dx * s},${y}`} fill={P.crystalHi} opacity={0.55} />
        </g>
      ))}
    </g>
  );
};

export const Torch: React.FC<{ x: number; y: number; delay?: number }> = ({ x, y, delay = 0 }) => (
  <g>
    <circle cx={x} cy={y - 34} r={34} fill="url(#glowFire)" className="glow" style={{ animationDelay: `${delay}s` }} />
    <line x1={x} y1={y} x2={x} y2={y - 26} stroke={P.trunk} strokeWidth={4} />
    <path
      className="flame"
      style={{ animationDelay: `${delay}s` }}
      d={`M ${x} ${y - 50} Q ${x + 10} ${y - 36} ${x + 5} ${y - 28} Q ${x} ${y - 24} ${x - 5} ${y - 28} Q ${x - 10} ${y - 36} ${x} ${y - 50} Z`}
      fill="#ffb347"
      stroke="#c25b14"
      strokeWidth={1}
    />
  </g>
);

/** A rune circle; a click asks Prolog a question. */
export const RuneCircle: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const [open, setOpen] = useState(false);
  const glyphs = [":-", "?-", "∀", "¬", "∃", "!", "⊢", "∧"];
  return (
    <g
      style={{ cursor: "pointer" }}
      onClick={(e) => {
        e.stopPropagation();
        setOpen((o) => !o);
      }}
    >
      <title>Запитати Prolog</title>
      <ellipse cx={x} cy={y} rx={92} ry={40} fill="url(#glowPurple)" className="glow" />
      <ellipse cx={x} cy={y} rx={70} ry={28} fill="none" stroke={P.crystal} strokeWidth={2.5} opacity={0.85} />
      <ellipse cx={x} cy={y} rx={50} ry={19} fill="none" stroke={P.crystal} strokeWidth={1.5} opacity={0.6} />
      <g className="runes">
        {glyphs.map((g, i) => {
          const a = (i / glyphs.length) * Math.PI * 2;
          return (
            <text key={i} x={x + Math.cos(a) * 62} y={y + Math.sin(a) * 25 + 6} textAnchor="middle" fontSize={19} fontWeight={700} fill={P.crystalHi} fontFamily="JetBrains Mono, monospace">
              {g}
            </text>
          );
        })}
      </g>
      {open && (
        <g className="pop">
          <rect x={x - 150} y={y - 112} width={300} height={66} rx={12} fill={P.parchment} stroke={P.ink} strokeWidth={2} />
          <text x={x} y={y - 84} textAnchor="middle" fontSize={17} fill={P.ink} fontFamily="JetBrains Mono, monospace">
            ?- готовий(ти, prolog).
          </text>
          <text x={x} y={y - 60} textAnchor="middle" fontSize={17} fill="#2e7d4f" fontFamily="JetBrains Mono, monospace">
            true.
          </text>
        </g>
      )}
    </g>
  );
};

export const Crossroads: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <line x1={x} y1={y} x2={x} y2={y - 78} stroke={P.trunk} strokeWidth={5} strokeLinecap="round" />
    <g transform={`rotate(-6 ${x} ${y - 62})`}>
      <path d={`M ${x - 6} ${y - 74} L ${x + 120} ${y - 74} L ${x + 136} ${y - 62} L ${x + 120} ${y - 50} L ${x - 6} ${y - 50} Z`} fill="#c99a62" {...ink} />
      <text x={x + 58} y={y - 56} textAnchor="middle" fontSize={16} fill={P.ink} fontFamily="Kurale, serif">
        декларативно
      </text>
    </g>
    <g transform={`rotate(8 ${x} ${y - 36})`}>
      <path d={`M ${x + 6} ${y - 46} L ${x - 112} ${y - 46} L ${x - 128} ${y - 34} L ${x - 112} ${y - 22} L ${x + 6} ${y - 22} Z`} fill="#b48a58" {...ink} />
      <text x={x - 54} y={y - 28} textAnchor="middle" fontSize={16} fill={P.ink} fontFamily="Kurale, serif" opacity={0.7}>
        імперативно
      </text>
      <line x1={x - 108} y1={y - 34} x2={x - 4} y2={y - 34} stroke="#9b3b2e" strokeWidth={2} opacity={0.75} />
    </g>
  </g>
);

/** The broken signboard of the Monad hills. */
export const MonadSign: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const [shake, setShake] = useState(0);
  return (
    <g
      style={{ cursor: "pointer" }}
      onClick={(e) => {
        e.stopPropagation();
        setShake((n) => n + 1);
      }}
    >
      <title>Тут живуть монади</title>
      <line x1={x - 70} y1={y + 70} x2={x - 64} y2={y - 30} stroke={P.trunk} strokeWidth={9} strokeLinecap="round" />
      <path d={`M ${x + 66} ${y + 70} L ${x + 70} ${y + 10} L ${x + 62} ${y + 2} L ${x + 74} ${y - 6}`} fill="none" stroke={P.trunk} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      <g key={shake} className={shake ? "creak" : "swing"}>
        <path
          d={`M ${x - 112} ${y - 52} L ${x + 92} ${y - 30} L ${x + 86} ${y + 26} L ${x + 40} ${y + 22} L ${x + 30} ${y + 34} L ${x + 18} ${y + 20} L ${x - 116} ${y + 4} Z`}
          fill="#a87747"
          stroke={P.ink}
          strokeWidth={2.4}
          strokeLinejoin="round"
        />
        <path d={`M ${x - 110} ${y - 24} L ${x + 88} ${y - 4}`} stroke={P.ink} strokeWidth={1.2} opacity={0.4} />
        <path d={`M ${x + 30} ${y + 34} L ${x + 14} ${y - 4} L ${x + 24} ${y - 18}`} fill="none" stroke={P.ink} strokeWidth={1.6} opacity={0.7} />
        <circle cx={x - 100} cy={y - 40} r={3.5} fill="#5a5a5a" />
        <circle cx={x + 80} cy={y - 20} r={3.5} fill="#5a5a5a" />
        <text x={x - 12} y={y - 16} textAnchor="middle" fontSize={26} fill="#3a2414" fontFamily="Marck Script, cursive" transform={`rotate(6 ${x} ${y})`}>
          Тут живуть
        </text>
        <text x={x - 6} y={y + 14} textAnchor="middle" fontSize={30} fill="#3a2414" fontFamily="Marck Script, cursive" transform={`rotate(6 ${x} ${y})`}>
          монади
        </text>
      </g>
    </g>
  );
};
