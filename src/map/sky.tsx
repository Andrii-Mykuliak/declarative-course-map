import React, { useMemo } from "react";
import { H, rng, Spin, W } from "./geo";
import { LPNU_CIRCLES, LPNU_PATHS, LPNU_VIEWBOX } from "../data/lpnuLogo";

export const S = {
  bg0: "#080b1e",
  bg1: "#10163a",
  bg2: "#1b2358",
  gold: "#d8b46a",
  goldHi: "#f4e2a8",
  goldDim: "rgba(216,180,106,0.45)",
  goldFaint: "rgba(216,180,106,0.22)",
  ivory: "#efe6d0",
  ivoryDim: "rgba(239,230,208,0.62)",
  violet: "#a58cff",
  violetSoft: "rgba(165,140,255,0.35)",
  ember: "#ff8a5c",
  teal: "#7fd6cc",
  grid: "rgba(140,160,230,0.13)",
};

export const SERIF = "Cormorant Garamond, Georgia, serif";
export const TEXT = "Lora, Georgia, serif";
export const MONO = "JetBrains Mono, monospace";

export const SkyDefs: React.FC = () => (
  <defs>
    <radialGradient id="sky" cx="52%" cy="46%" r="78%">
      <stop offset="0" stopColor={S.bg2} />
      <stop offset="0.55" stopColor={S.bg1} />
      <stop offset="1" stopColor={S.bg0} />
    </radialGradient>
    <radialGradient id="starGlow">
      <stop offset="0" stopColor="#fff6d8" stopOpacity="0.95" />
      <stop offset="0.25" stopColor={S.goldHi} stopOpacity="0.45" />
      <stop offset="1" stopColor={S.gold} stopOpacity="0" />
    </radialGradient>
    <radialGradient id="emberGlow">
      <stop offset="0" stopColor="#ffd2b8" stopOpacity="1" />
      <stop offset="0.3" stopColor={S.ember} stopOpacity="0.55" />
      <stop offset="1" stopColor={S.ember} stopOpacity="0" />
    </radialGradient>
    <radialGradient id="violetGlow">
      <stop offset="0" stopColor="#e8dcff" stopOpacity="0.9" />
      <stop offset="0.35" stopColor={S.violet} stopOpacity="0.45" />
      <stop offset="1" stopColor={S.violet} stopOpacity="0" />
    </radialGradient>
    <radialGradient id="nebulaA">
      <stop offset="0" stopColor="#8f6bff" stopOpacity="0.42" />
      <stop offset="1" stopColor="#8f6bff" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="nebulaB">
      <stop offset="0" stopColor="#d36bd8" stopOpacity="0.28" />
      <stop offset="1" stopColor="#d36bd8" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="nebulaC">
      <stop offset="0" stopColor="#5f8cff" stopOpacity="0.26" />
      <stop offset="1" stopColor="#5f8cff" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="milky">
      <stop offset="0" stopColor="#c8d2ff" stopOpacity="0.12" />
      <stop offset="1" stopColor="#c8d2ff" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="planetA" cx="35%" cy="35%">
      <stop offset="0" stopColor="#ffe9b8" />
      <stop offset="1" stopColor="#b9853f" />
    </radialGradient>
    <radialGradient id="planetB" cx="35%" cy="35%">
      <stop offset="0" stopColor="#d8fff8" />
      <stop offset="1" stopColor="#3f8f88" />
    </radialGradient>
    <linearGradient id="river" x1="0" x2="1">
      <stop offset="0" stopColor="#6f8cff" stopOpacity="0.05" />
      <stop offset="0.5" stopColor="#8fb2ff" stopOpacity="0.16" />
      <stop offset="1" stopColor="#6f8cff" stopOpacity="0.05" />
    </linearGradient>
  </defs>
);

/** Conic graticule: arcs of declination around a pole above the chart and meridians from it. */
const Graticule: React.FC = () => {
  const pole = { x: W / 2, y: -2300 };
  const arcs = [2500, 2800, 3100, 3400, 3700, 4000];
  const meridians = Array.from({ length: 15 }, (_, i) => -0.42 + i * 0.06);
  return (
    <g stroke={S.grid} fill="none" strokeWidth={1.2}>
      {arcs.map((r) => (
        <circle key={r} cx={pole.x} cy={pole.y} r={r} />
      ))}
      {meridians.map((a, i) => (
        <line key={i} x1={pole.x + Math.sin(a) * 2400} y1={pole.y + Math.cos(a) * 2400} x2={pole.x + Math.sin(a) * 4200} y2={pole.y + Math.cos(a) * 4200} />
      ))}
      <path d={`M 0 ${H * 0.78} C ${W * 0.3} ${H * 0.52}, ${W * 0.62} ${H * 0.5}, ${W} ${H * 0.18}`} stroke="rgba(216,180,106,0.14)" strokeDasharray="10 10" strokeWidth={1.6} />
    </g>
  );
};

/** The band of the Milky Way crossing the chart from the upper right to the lower left. */
const MilkyWay: React.FC = () => {
  const dots = useMemo(() => {
    const r = rng(5);
    const out: { x: number; y: number; s: number; o: number }[] = [];
    for (let i = 0; i < 1100; i++) {
      const t = r();
      const g = (r() + r() + r() - 1.5) * 170;
      out.push({ x: W * (1 - t) + g * 0.55, y: H * 0.08 + t * H * 0.9 + g, s: 0.4 + r() * 0.9, o: 0.12 + r() * 0.35 });
    }
    return out;
  }, []);
  return (
    <g pointerEvents="none">
      {[0.15, 0.38, 0.6, 0.82].map((t, i) => (
        <ellipse key={i} cx={W * (1 - t)} cy={H * 0.08 + t * H * 0.9} rx={420} ry={210} fill="url(#milky)" transform={`rotate(-34 ${W * (1 - t)} ${H * 0.08 + t * H * 0.9})`} />
      ))}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.s} fill="#dfe6ff" opacity={d.o} />
      ))}
    </g>
  );
};

const StarField: React.FC = () => {
  const stars = useMemo(() => {
    const r = rng(9);
    const tints = ["#fff8e6", "#dfe8ff", "#ffe2b0", "#ffffff"];
    return Array.from({ length: 620 }, (_, i) => ({
      x: 30 + r() * (W - 60),
      y: 30 + r() * (H - 60),
      s: r() < 0.92 ? 0.5 + r() * 1.1 : 1.6 + r() * 1.2,
      c: tints[i % 4],
      tw: r() < 0.18,
      d: -r() * 6,
      o: 0.35 + r() * 0.6,
    }));
  }, []);
  return (
    <g pointerEvents="none">
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.s} fill={s.c} opacity={s.o} className={s.tw ? "twinkle" : undefined} style={s.tw ? { animationDelay: `${s.d}s` } : undefined} />
      ))}
    </g>
  );
};

const SHOTS = [
  [1650, 120, 1350, 300, 0],
  [760, 1060, 440, 1250, -7],
  [2300, 520, 2020, 640, -13],
];

const Shooting: React.FC = () => (
  <g pointerEvents="none">
    <defs>
      {SHOTS.map(([x1, y1, x2, y2], i) => (
        <linearGradient key={i} id={`shot${i}`} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.95" />
        </linearGradient>
      ))}
    </defs>
    {SHOTS.map(([x1, y1, x2, y2, d], i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="shoot" style={{ animationDelay: `${d}s` }} stroke={`url(#shot${i})`} strokeWidth={2.2} strokeLinecap="round" />
    ))}
  </g>
);

export const Sky: React.FC = () => (
  <g>
    <rect width={W} height={H} fill="url(#sky)" />
    <Graticule />
    <MilkyWay />
    <StarField />
    <Shooting />
  </g>
);

/** Graduated double frame, like the border of an old star atlas. */
export const Frame: React.FC = () => {
  const ticks: React.ReactNode[] = [];
  for (let x = 40; x <= W - 40; x += 20) {
    const major = (x - 40) % 200 === 0;
    ticks.push(<line key={`t${x}`} x1={x} y1={28} x2={x} y2={major ? 44 : 36} />, <line key={`b${x}`} x1={x} y1={H - 28} x2={x} y2={H - (major ? 44 : 36)} />);
  }
  for (let y = 40; y <= H - 40; y += 20) {
    const major = (y - 40) % 200 === 0;
    ticks.push(<line key={`l${y}`} x1={28} y1={y} x2={major ? 44 : 36} y2={y} />, <line key={`r${y}`} x1={W - 28} y1={y} x2={W - (major ? 44 : 36)} y2={y} />);
  }
  return (
    <g pointerEvents="none" stroke={S.goldDim} strokeWidth={1.2} fill="none">
      <rect x={14} y={14} width={W - 28} height={H - 28} />
      <rect x={28} y={28} width={W - 56} height={H - 56} />
      {ticks}
      {[
        [21, 21],
        [W - 21, 21],
        [21, H - 21],
        [W - 21, H - 21],
      ].map(([x, y], i) => (
        <path key={i} d={`M ${x} ${y - 9} L ${x + 2.5} ${y - 2.5} L ${x + 9} ${y} L ${x + 2.5} ${y + 2.5} L ${x} ${y + 9} L ${x - 2.5} ${y + 2.5} L ${x - 9} ${y} L ${x - 2.5} ${y - 2.5} Z`} fill={S.gold} stroke="none" />
      ))}
    </g>
  );
};

export const Title: React.FC = () => (
  <g pointerEvents="none">
    <path d="M 730 64 L 1670 64 L 1700 108 L 1670 152 L 730 152 L 700 108 Z" fill="rgba(8,11,30,0.72)" stroke={S.gold} strokeWidth={1.4} />
    <path d="M 742 74 L 1658 74 L 1684 108 L 1658 142 L 742 142 L 716 108 Z" fill="none" stroke={S.goldDim} strokeWidth={1} />
    <text x={1200} y={118} textAnchor="middle" fontFamily={SERIF} fontWeight={600} fontSize={44} letterSpacing={5} fill={S.goldHi}>
      ДЕКЛАРАТИВНЕ ПРОГРАМУВАННЯ
    </text>
    <text x={1200} y={190} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={30} fill={S.ivoryDim}>
      зоряна карта курсу, 2026
    </text>
    <line x1={960} y1={174} x2={1020} y2={174} stroke={S.goldDim} />
    <line x1={1380} y1={174} x2={1440} y2={174} stroke={S.goldDim} />
  </g>
);

/** Brass astrolabe rings turning slowly in the corner. */
export const Astrolabe: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} pointerEvents="none" stroke={S.goldDim} fill="none">
    <circle r={104} strokeWidth={1.4} />
    <circle r={96} strokeWidth={0.8} />
    <g>
      <Spin dur={240} />
      {Array.from({ length: 72 }, (_, i) => (
        <line key={i} x1={0} y1={-96} x2={0} y2={i % 6 === 0 ? -84 : -90} transform={`rotate(${i * 5})`} strokeWidth={1} />
      ))}
    </g>
    <g>
      <Spin dur={90} dir={-1} />
      <ellipse rx={78} ry={30} strokeWidth={1} />
      <ellipse rx={78} ry={30} strokeWidth={1} transform="rotate(60)" />
      <ellipse rx={78} ry={30} strokeWidth={1} transform="rotate(120)" />
    </g>
    <circle r={46} strokeWidth={1} strokeDasharray="3 5" />
    <path d="M 0 -70 L 7 -7 L 70 0 L 7 7 L 0 70 L -7 7 L -70 0 L -7 -7 Z" fill="rgba(216,180,106,0.12)" strokeWidth={1.2} />
    <circle r={5} fill={S.gold} stroke="none" />
    <text y={-114} textAnchor="middle" fontFamily={SERIF} fontSize={20} fill={S.gold} stroke="none" letterSpacing={2}>
      ПН
    </text>
  </g>
);

const LegendStar: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 4 }) => (
  <g>
    <circle cx={x} cy={y} r={r * 4} fill="url(#starGlow)" />
    <path d={`M ${x} ${y - r * 3.4} L ${x + r * 0.5} ${y - r * 0.5} L ${x + r * 3.4} ${y} L ${x + r * 0.5} ${y + r * 0.5} L ${x} ${y + r * 3.4} L ${x - r * 0.5} ${y + r * 0.5} L ${x - r * 3.4} ${y} L ${x - r * 0.5} ${y - r * 0.5} Z`} fill="#fff6d8" />
  </g>
);

/** Legend with the compiler's signature and the Lviv Polytechnic seal. */
export const Legend: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} pointerEvents="none">
    <rect width={360} height={310} fill="rgba(8,11,30,0.72)" stroke={S.gold} strokeWidth={1.2} />
    <rect x={8} y={8} width={344} height={294} fill="none" stroke={S.goldFaint} />
    <text x={180} y={44} textAnchor="middle" fontFamily={SERIF} fontWeight={600} fontSize={22} letterSpacing={4} fill={S.goldHi}>
      ЛЕГЕНДА
    </text>
    <LegendStar x={40} y={82} />
    <text x={70} y={88} fontFamily={TEXT} fontSize={17} fill={S.ivory}>
      лекція, номер тижня
    </text>
    <circle cx={40} cy={122} r={14} fill="none" stroke={S.violet} strokeWidth={1.4} strokeDasharray="3 3" />
    <circle cx={40} cy={122} r={3} fill="#fff6d8" />
    <text x={70} y={128} fontFamily={TEXT} fontSize={17} fill={S.ivory}>
      є презентація
    </text>
    <circle cx={40} cy={162} r={8} fill="url(#planetA)" />
    <ellipse cx={40} cy={162} rx={15} ry={4.5} fill="none" stroke={S.goldHi} strokeWidth={1.2} transform="rotate(-18 40 162)" />
    <text x={70} y={168} fontFamily={TEXT} fontSize={17} fill={S.ivory}>
      лабораторна робота
    </text>
    <circle cx={40} cy={202} r={5} fill={S.ember} />
    <circle cx={40} cy={202} r={14} fill="url(#emberGlow)" />
    <text x={70} y={208} fontFamily={TEXT} fontSize={17} fill={S.ivory}>
      контрольна, іспит
    </text>
    <line x1={24} y1={240} x2={58} y2={240} stroke={S.gold} strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" />
    <text x={70} y={246} fontFamily={TEXT} fontSize={17} fill={S.ivory}>
      шлях курсу
    </text>
    <text x={180} y={286} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={18} fill={S.ivoryDim}>
      натисніть на зорю, щоб дізнатися більше
    </text>
  </g>
);

export const Signature: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} pointerEvents="none">
    <circle r={34} fill="none" stroke={S.gold} strokeWidth={1.2} />
    <circle r={29} fill="none" stroke={S.goldFaint} />
    <svg x={-22} y={-21} width={44} height={42} viewBox={LPNU_VIEWBOX}>
      {LPNU_PATHS.map((d, i) => (
        <path key={i} d={d} fill={S.gold} />
      ))}
      {LPNU_CIRCLES.map((c, i) => (
        <circle key={`c${i}`} cx={c.cx} cy={c.cy} r={c.r} transform={c.transform} fill={S.gold} />
      ))}
    </svg>
    <text x={50} y={-6} fontFamily={SERIF} fontStyle="italic" fontSize={22} fill={S.ivory}>
      Уклав ас. каф. ПЗ Микуляк Андрій, 2026
    </text>
    <text x={50} y={18} fontFamily={MONO} fontSize={12} fill={S.ivoryDim}>
      made with Claude Opus 5.5
    </text>
  </g>
);
