import React, { useMemo } from "react";
import { P } from "./palette";
import { blob, H, Pt, rng, sampleCurve, smooth, W } from "./geo";

const INK = { stroke: P.ink, strokeWidth: 2.2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** Grain texture rendered once into a small canvas and tiled over the parchment. */
export const useNoise = () =>
  useMemo(() => {
    if (typeof document === "undefined") {
      return "";
    }
    const c = document.createElement("canvas");
    c.width = c.height = 192;
    const g = c.getContext("2d");
    if (!g) {
      return "";
    }
    const img = g.createImageData(192, 192);
    const r = rng(7);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 120 + r() * 100;
      img.data[i] = v * 0.8;
      img.data[i + 1] = v * 0.62;
      img.data[i + 2] = v * 0.38;
      img.data[i + 3] = r() < 0.5 ? 0 : 26 + r() * 30;
    }
    g.putImageData(img, 0, 0);
    return c.toDataURL();
  }, []);

export const Defs: React.FC<{ noise: string }> = ({ noise }) => (
  <defs>
    {noise && (
      <pattern id="grain" width={192} height={192} patternUnits="userSpaceOnUse">
        <image href={noise} width={192} height={192} />
      </pattern>
    )}
    <radialGradient id="vignette" cx="50%" cy="50%" r="72%">
      <stop offset="0.62" stopColor={P.burnt} stopOpacity="0" />
      <stop offset="0.92" stopColor={P.burnt} stopOpacity="0.35" />
      <stop offset="1" stopColor={P.burnt} stopOpacity="0.75" />
    </radialGradient>
    <linearGradient id="water" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor={P.waterDeep} />
      <stop offset="0.5" stopColor={P.water} />
      <stop offset="1" stopColor={P.waterDeep} />
    </linearGradient>
    <radialGradient id="glowPurple">
      <stop offset="0" stopColor={P.crystal} stopOpacity="0.75" />
      <stop offset="1" stopColor={P.crystal} stopOpacity="0" />
    </radialGradient>
    <radialGradient id="glowFire">
      <stop offset="0" stopColor="#ffd27a" stopOpacity="0.85" />
      <stop offset="1" stopColor="#ff9a3c" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="glowGold">
      <stop offset="0" stopColor="#fff1b8" stopOpacity="0.9" />
      <stop offset="1" stopColor={P.gold} stopOpacity="0" />
    </radialGradient>
    <linearGradient id="mtn" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor={P.mountain} />
      <stop offset="1" stopColor="#bdb6c7" />
    </linearGradient>
    <linearGradient id="caveGrad" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor={P.caveMid} />
      <stop offset="1" stopColor={P.cave} />
    </linearGradient>
    <linearGradient id="castleRock" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#a8a1b6" />
      <stop offset="0.55" stopColor="#857e98" />
      <stop offset="1" stopColor="#5f5875" />
    </linearGradient>
    <linearGradient id="stalag" x1="0" x2="0" y1="1" y2="0">
      <stop offset="0" stopColor={P.caveMid} />
      <stop offset="1" stopColor="#7a6c96" />
    </linearGradient>
    <clipPath id="landSides">
      <rect x={48} y={0} width={W - 96} height={H} />
    </clipPath>
  </defs>
);

export const Parchment: React.FC = () => (
  <g>
    <rect width={W} height={H} fill={P.parchment} />
    <rect width={W} height={H} fill="url(#grain)" />
    <rect width={W} height={H} fill="url(#vignette)" />
  </g>
);

export const Frame: React.FC = () => {
  const c = (x: number, y: number, sx: number, sy: number) => (
    <g transform={`translate(${x} ${y}) scale(${sx} ${sy})`} fill="none" stroke={P.ink} strokeWidth={2.5} strokeLinecap="round">
      <path d="M 0 60 C 0 20, 20 0, 60 0" />
      <path d="M 14 70 C 14 32, 32 14, 70 14" opacity={0.6} />
      <circle cx={22} cy={22} r={7} fill={P.purple} stroke={P.gold} strokeWidth={2} />
    </g>
  );
  return (
    <g pointerEvents="none">
      <rect x={18} y={18} width={W - 36} height={H - 36} fill="none" stroke={P.ink} strokeWidth={3} opacity={0.75} />
      <rect x={28} y={28} width={W - 56} height={H - 56} fill="none" stroke={P.ink} strokeWidth={1.2} opacity={0.6} />
      {c(18, 18, 1, 1)}
      {c(W - 18, 18, -1, 1)}
      {c(18, H - 18, 1, -1)}
      {c(W - 18, H - 18, -1, -1)}
    </g>
  );
};

/** The land itself; the margin outside it stays bare parchment, as on an old map. */
const LAND: Pt[] = [
  [60, 150], [400, 130], [800, 140], [1150, 120], [1600, 135], [2000, 120], [2340, 150],
  [2355, 500], [2345, 900], [2355, 1300], [2330, 1545], [1900, 1555], [1560, 1548],
  [1460, 1505], [1300, 1480], [1150, 1510], [1040, 1552], [600, 1546], [250, 1555], [55, 1540],
  [48, 1100], [58, 700], [45, 400],
];

export const Land: React.FC = () => (
  <g>
    <path d={smooth(LAND, true)} fill={P.grass1} {...INK} strokeWidth={3} />
    <path d={smooth(LAND, true)} fill="url(#grain)" opacity={0.6} />
  </g>
);

export const Bay: React.FC = () => {
  const shore: Pt[] = [
    [1040, 1600], [1080, 1530], [1170, 1495], [1300, 1478], [1430, 1492], [1520, 1530], [1580, 1600],
  ];
  return (
    <g>
      <path d={smooth(shore) + " Z"} fill={P.water} {...INK} />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          className="wave"
          style={{ animationDelay: `${-i * 1.3}s` }}
          d={`M ${1150 + i * 90} ${1530 + (i % 2) * 22} q 14 -9 28 0 q 14 9 28 0`}
          fill="none"
          stroke={P.waterHi}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
};

type Peak = { x: number; base: number; h: number; w: number; snow: boolean };

const peaks = (seed: number, x0: number, x1: number, base: number, hMin: number, hMax: number, step: number): Peak[] => {
  const r = rng(seed);
  const out: Peak[] = [];
  for (let x = x0; x < x1; x += step * (0.7 + r() * 0.6)) {
    const h = hMin + r() * (hMax - hMin);
    out.push({ x, base: base + r() * 20, h, w: h * (1.1 + r() * 0.5), snow: h > (hMin + hMax) / 2 });
  }
  return out;
};

const Mountain: React.FC<{ p: Peak; tint?: number }> = ({ p, tint = 1 }) => {
  const top: Pt = [p.x, p.base - p.h];
  const l: Pt = [p.x - p.w / 2, p.base];
  const rr: Pt = [p.x + p.w / 2, p.base];
  const mid: Pt = [p.x + p.w * 0.06, p.base];
  const sw = p.w * 0.16;
  return (
    <g opacity={tint}>
      <polygon points={`${l} ${top} ${rr}`} fill="url(#mtn)" {...INK} />
      <polygon points={`${top} ${rr} ${mid}`} fill={P.mountainShade} opacity={0.55} />
      {p.snow && (
        <polygon
          points={`${top} ${top[0] + sw},${top[1] + sw * 1.15} ${top[0] + sw * 0.35},${top[1] + sw * 0.9} ${top[0]},${top[1] + sw * 1.25} ${top[0] - sw * 0.4},${top[1] + sw * 0.85} ${top[0] - sw * 0.9},${top[1] + sw * 1.1}`}
          fill={P.snow}
          stroke={P.ink}
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      )}
      {[0.35, 0.55, 0.75].map((k, i) => (
        <line
          key={i}
          x1={top[0] + (rr[0] - top[0]) * k}
          y1={top[1] + (rr[1] - top[1]) * k}
          x2={top[0] + (rr[0] - top[0]) * k - 14}
          y2={top[1] + (rr[1] - top[1]) * k + 18}
          stroke={P.ink}
          strokeWidth={1.2}
          opacity={0.45}
        />
      ))}
    </g>
  );
};

export const Mountains: React.FC = () => {
  const back = useMemo(() => peaks(11, 90, 2320, 300, 110, 190, 95), []);
  const front = useMemo(() => [...peaks(12, 380, 1080, 345, 70, 120, 120), ...peaks(13, 1320, 2300, 330, 70, 125, 120)], []);
  return (
    <g clipPath="url(#landSides)">
      {back.map((p, i) => (
        <Mountain key={`b${i}`} p={p} tint={0.75} />
      ))}
      {front.map((p, i) => (
        <Mountain key={`f${i}`} p={p} />
      ))}
    </g>
  );
};

/** Rolling hill bands of the Valley of functions. */
export const Valley: React.FC = () => {
  const bands = useMemo(() => {
    const r = rng(21);
    const fills = [P.grass2, P.grass3, P.grass2, P.grass3, P.grass4];
    return fills.map((fill, i) => {
      const y = 330 + i * 70;
      const pts: Pt[] = [];
      for (let x = 50; x <= 1240; x += 90) {
        pts.push([x, y + Math.sin(x / 140 + i * 1.7) * 26 + (r() - 0.5) * 16]);
      }
      return { d: smooth(pts) + ` L 1240 720 L 50 720 Z`, fill };
    });
  }, []);
  return (
    <g>
      {bands.map((b, i) => (
        <path key={i} d={b.d} fill={b.fill} stroke={P.ink} strokeWidth={1.6} strokeOpacity={0.55} />
      ))}
    </g>
  );
};

const FOREST: Pt[] = [
  [1320, 330], [1500, 290], [1750, 280], [2000, 285], [2250, 300], [2345, 360],
  [2345, 640], [2150, 660], [1900, 610], [1650, 640], [1420, 650], [1330, 560],
];

export const FOREST_POLY = FOREST;

export const ForestFloor: React.FC = () => (
  <g>
    <path d={smooth(FOREST, true)} fill={P.forestFloor} {...INK} strokeWidth={1.8} strokeOpacity={0.7} />
    <path d={smooth(FOREST, true)} fill="url(#grain)" opacity={0.7} />
  </g>
);

const MEADOW: Pt[] = [
  [1390, 640], [1650, 650], [1900, 625], [2150, 670], [2350, 650], [2350, 1090], [2100, 1100],
  [1800, 1080], [1560, 1060], [1400, 1000], [1385, 800],
];

export const MEADOW_POLY = MEADOW;

export const Meadow: React.FC = () => {
  const domes = useMemo(() => {
    const r = rng(31);
    const list: { x: number; y: number; rx: number; ry: number }[] = [];
    for (let i = 0; i < 9; i++) {
      list.push({ x: 1450 + r() * 880, y: 700 + r() * 330, rx: 90 + r() * 90, ry: 45 + r() * 30 });
    }
    return list.sort((a, b) => a.y - b.y);
  }, []);
  const flowers = useMemo(() => {
    const r = rng(32);
    return Array.from({ length: 70 }, () => ({ x: 1420 + r() * 920, y: 680 + r() * 380, c: r() < 0.6 ? P.flower : "#f2d36b" }));
  }, []);
  return (
    <g>
      <path d={smooth(MEADOW, true)} fill={P.meadow} {...INK} strokeWidth={1.8} strokeOpacity={0.6} />
      {domes.map((d, i) => (
        <g key={i}>
          <path
            d={`M ${d.x - d.rx} ${d.y} A ${d.rx} ${d.ry} 0 0 1 ${d.x + d.rx} ${d.y} Z`}
            fill={i % 2 ? P.hill : P.meadowHi}
            stroke={P.ink}
            strokeWidth={1.5}
            strokeOpacity={0.6}
          />
          <path d={`M ${d.x + d.rx * 0.1} ${d.y - d.ry * 0.98} A ${d.rx} ${d.ry} 0 0 1 ${d.x + d.rx} ${d.y} L ${d.x + d.rx * 0.2} ${d.y} Z`} fill={P.hillShade} opacity={0.35} />
        </g>
      ))}
      {flowers.map((f, i) => (
        <circle key={i} cx={f.x} cy={f.y} r={3.2} fill={f.c} stroke={P.ink} strokeWidth={0.6} strokeOpacity={0.5} />
      ))}
    </g>
  );
};

/** The dark massif of the Caves of logic, with an opened cavern along the path. */
const CAVES: Pt[] = [
  [50, 690], [180, 640], [330, 665], [470, 615], [640, 655], [790, 610], [950, 650], [1090, 640], [1140, 760],
  [1130, 980], [1060, 1110], [880, 1160], [650, 1150], [460, 1190], [250, 1180], [55, 1200],
];

export const CAVES_POLY = CAVES;

export const Caves: React.FC = () => {
  const spikes = useMemo(() => {
    const r = rng(41);
    const out: { x: number; y: number; h: number }[] = [];
    for (let i = 0; i < 26; i++) {
      out.push({ x: 120 + r() * 960, y: 700 + r() * 380, h: 18 + r() * 30 });
    }
    return out;
  }, []);
  const drips = useMemo(() => {
    const r = rng(42);
    const top = CAVES.slice(0, 9);
    const yAt = (x: number) => {
      for (let i = 0; i < top.length - 1; i++) {
        const [x0, y0] = top[i];
        const [x1, y1] = top[i + 1];
        if (x >= x0 && x <= x1) {
          return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
        }
      }
      return top[top.length - 1][1];
    };
    return Array.from({ length: 22 }, (_, i) => {
      const x = 90 + i * 45 + r() * 20;
      return { x, y: yAt(x) + 6, h: 14 + r() * 26, w: 5 + r() * 4 };
    });
  }, []);
  const hall: Pt[] = [
    [1120, 820], [960, 800], [760, 860], [560, 900], [380, 950], [250, 1060], [260, 1150], [360, 1080],
    [560, 1050], [760, 1010], [960, 950], [1120, 950],
  ];
  return (
    <g>
      <path d={smooth(CAVES, true)} fill="url(#caveGrad)" {...INK} strokeWidth={2.6} />
      {spikes.map((s, i) => (
        <path
          key={i}
          d={`M ${s.x - s.h * 0.32} ${s.y} Q ${s.x - s.h * 0.1} ${s.y - s.h * 0.55} ${s.x} ${s.y - s.h} Q ${s.x + s.h * 0.12} ${s.y - s.h * 0.55} ${s.x + s.h * 0.32} ${s.y} Z`}
          fill="url(#stalag)"
          stroke="#1c1825"
          strokeWidth={1.2}
        />
      ))}
      {drips.map((d, i) => (
        <path key={`d${i}`} d={`M ${d.x - d.w} ${d.y} Q ${d.x} ${d.y + d.h * 0.4} ${d.x} ${d.y + d.h} Q ${d.x} ${d.y + d.h * 0.4} ${d.x + d.w} ${d.y} Z`} fill={P.caveMid} stroke="#1c1825" strokeWidth={1.1} />
      ))}
      <path d={smooth(hall, true)} fill={P.caveFloor} stroke="#1c1825" strokeWidth={2} opacity={0.95} />
      <path d={smooth(hall, true)} fill="url(#grain)" opacity={0.8} />
      {[
        [1110, 880, 70, 64],
        [300, 1120, 64, 58],
      ].map(([x, y, w, h], i) => (
        <path key={i} d={`M ${x - w / 2} ${y + h / 2} L ${x - w / 2} ${y} A ${w / 2} ${h / 2} 0 0 1 ${x + w / 2} ${y} L ${x + w / 2} ${y + h / 2} Z`} fill="#120f18" opacity={0.75} />
      ))}
    </g>
  );
};

/** The gorge between the caves and the monad meadow, with cliffs on both sides of the river. */
export const Gorge: React.FC = () => {
  const left: Pt[] = [[1140, 640], [1170, 700], [1160, 820], [1175, 950], [1150, 1080], [1170, 1140], [1130, 1150], [1110, 1000], [1120, 760]];
  const right: Pt[] = [[1395, 640], [1350, 720], [1360, 840], [1345, 960], [1365, 1080], [1340, 1150], [1410, 1150], [1420, 1000], [1410, 780]];
  const hatch = (x: number, y0: number, y1: number, dir: number) =>
    Array.from({ length: Math.floor((y1 - y0) / 26) }, (_, i) => (
      <line key={i} x1={x} y1={y0 + i * 26} x2={x + dir * 18} y2={y0 + i * 26 + 10} stroke={P.ink} strokeWidth={1.3} opacity={0.5} />
    ));
  return (
    <g>
      <path d={`M 1130 650 L 1400 650 L 1400 1150 L 1130 1150 Z`} fill="#6a6380" />
      <path d={smooth(left, true)} fill={P.rock} {...INK} />
      <path d={smooth(right, true)} fill={P.rockShade} {...INK} />
      {hatch(1150, 700, 1120, 1)}
      {hatch(1372, 700, 1120, -1)}
    </g>
  );
};

/** River centre line, from the spring under the mountains to the bay. */
export const RIVER: Pt[] = [
  [1205, 300], [1212, 380], [1222, 470], [1232, 560], [1245, 640], [1252, 720], [1254, 800], [1252, 885],
  [1246, 980], [1240, 1080], [1248, 1180], [1258, 1280], [1268, 1380], [1285, 1470],
];

const ribbon = (pts: Pt[], w0: number, w1: number) => {
  const s = sampleCurve(pts, 8);
  const L: Pt[] = [];
  const R: Pt[] = [];
  s.forEach((p, i) => {
    const q = s[Math.min(s.length - 1, i + 1)];
    const o = s[Math.max(0, i - 1)];
    const dx = q[0] - o[0];
    const dy = q[1] - o[1];
    const len = Math.hypot(dx, dy) || 1;
    const w = (w0 + ((w1 - w0) * i) / (s.length - 1)) / 2;
    L.push([p[0] - (dy / len) * w, p[1] + (dx / len) * w]);
    R.push([p[0] + (dy / len) * w, p[1] - (dx / len) * w]);
  });
  return smooth(L) + " L " + smooth(R.reverse()).slice(2) + " Z";
};

/** The lazy river: it barely moves until someone looks at it. */
export const River: React.FC<{ flowing: boolean; onWake: () => void }> = ({ flowing, onWake }) => {
  const shape = useMemo(() => ribbon(RIVER, 26, 74), []);
  const centre = useMemo(() => smooth(RIVER), []);
  return (
    <g onPointerEnter={onWake} onClick={onWake} style={{ cursor: "pointer" }} className={flowing ? "river flowing" : "river"}>
      <path d={shape} fill="url(#water)" {...INK} />
      <path d={centre} className="river-flow" fill="none" stroke={P.waterHi} strokeWidth={4} strokeDasharray="18 46" strokeLinecap="round" opacity={0.85} />
      <path d={centre} className="river-flow slow" fill="none" stroke="#ffffff" strokeWidth={2} strokeDasharray="6 80" strokeLinecap="round" opacity={0.7} />
      <g className="waterfall">
        <path d="M 1196 214 L 1214 214 L 1214 300 L 1196 300 Z" fill={P.water} {...INK} strokeWidth={1.6} />
        {[0, 1, 2].map((i) => (
          <line key={i} x1={1200 + i * 5} y1={216} x2={1200 + i * 5} y2={298} className="fall" style={{ animationDelay: `${-i * 0.3}s` }} stroke="#fff" strokeWidth={2} strokeDasharray="10 14" />
        ))}
      </g>
      <g className="waterfall">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={1236 + i * 8} y1={650} x2={1238 + i * 8} y2={735} className="fall" style={{ animationDelay: `${-i * 0.25}s` }} stroke="#fff" strokeWidth={2.4} strokeDasharray="12 12" />
        ))}
        <ellipse cx={1254} cy={738} rx={40} ry={10} fill="#fff" opacity={0.7} className="foam" />
      </g>
    </g>
  );
};

const CITY: Pt[] = [
  [380, 1210], [700, 1180], [1000, 1190], [1160, 1210], [1400, 1200], [1650, 1210], [1770, 1240],
  [1790, 1470], [1600, 1520], [1450, 1480], [1300, 1470], [1120, 1500], [900, 1530], [720, 1460], [520, 1430], [380, 1400],
];

export const CITY_POLY = CITY;

export const CityGround: React.FC = () => (
  <g>
    <path d={smooth(CITY, true)} fill={P.sand} {...INK} strokeWidth={1.8} strokeOpacity={0.7} />
    <path d={smooth(CITY, true)} fill="url(#grain)" opacity={0.8} />
  </g>
);

export const CastleRock: React.FC = () => {
  const pts = useMemo(() => blob(2070, 1330, 270, 230, 18, 0.12, 51), []);
  const plateau = useMemo(() => blob(2075, 1270, 215, 70, 14, 0.08, 52), []);
  const stones = useMemo(() => {
    const r = rng(53);
    return Array.from({ length: 9 }, () => ({ x: 1850 + r() * 450, y: 1380 + r() * 150, s: 8 + r() * 12 }));
  }, []);
  return (
    <g>
      <path d={smooth(pts, true)} fill="url(#castleRock)" {...INK} strokeWidth={2.6} />
      {Array.from({ length: 15 }, (_, i) => (
        <path key={i} d={`M ${1840 + i * 32} ${1350 + (i % 3) * 18} l ${4 - (i % 2) * 8} ${70 + (i % 4) * 22}`} stroke={P.ink} strokeWidth={1.3} opacity={0.4} />
      ))}
      <path d={smooth(plateau, true)} fill="#b9b2c6" stroke={P.ink} strokeWidth={1.6} strokeOpacity={0.7} />
      <path d={smooth(plateau, true)} fill="url(#grain)" opacity={0.6} />
      {stones.map((st, i) => (
        <ellipse key={i} cx={st.x} cy={st.y} rx={st.s} ry={st.s * 0.7} fill="#9a93ab" stroke={P.ink} strokeWidth={1.2} />
      ))}
    </g>
  );
};
