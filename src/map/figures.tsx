import React, { useEffect, useState } from "react";
import { MONO, S, SERIF } from "./sky";
import { Pt, Rock, rng, smooth, Spin } from "./geo";

const LINE = { stroke: S.goldFaint, strokeWidth: 1.3, fill: "none" };
const ART = { stroke: S.goldDim, strokeWidth: 1.6, fill: "none", strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** Engraved double line: a gold tube with the sky showing through its middle. */
const Tube: React.FC<{ d: string; w: number; className?: string }> = ({ d, w, className }) => (
  <g className={className}>
    <path d={d} fill="none" stroke={S.goldDim} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} fill="none" stroke={S.bg1} strokeWidth={w - 3.2} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const MinorStar: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 2.4 }) => (
  <g pointerEvents="none">
    <circle cx={x} cy={y} r={r * 4} fill="url(#starGlow)" opacity={0.7} />
    <circle cx={x} cy={y} r={r} fill="#fff6d8" />
  </g>
);

export const Name: React.FC<{ x: number; y: number; title: string; note?: string; anchor?: "middle" | "start" | "end" }> = ({ x, y, title, note, anchor = "middle" }) => (
  <g pointerEvents="none">
    <text x={x} y={y} textAnchor={anchor} fontFamily={SERIF} fontWeight={600} fontSize={26} letterSpacing={7} fill={S.gold}>
      {title}
    </text>
    {note && (
      <text x={x} y={y + 28} textAnchor={anchor} fontFamily={SERIF} fontStyle="italic" fontSize={21} fill={S.ivoryDim}>
        {note}
      </text>
    )}
  </g>
);

export const Lambda: React.FC<{ pts: Pt[] }> = ({ pts }) => {
  const leg: Pt[] = [pts[2], [540, 645], [440, 765]];
  return (
    <g pointerEvents="none">
      <text x={560} y={720} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={640} fill={S.gold} opacity={0.045}>
        λ
      </text>
      <polyline points={pts.map((p) => p.join(",")).join(" ")} {...LINE} />
      <polyline points={leg.map((p) => p.join(",")).join(" ")} {...LINE} />
      <MinorStar x={540} y={645} />
      <MinorStar x={440} y={765} r={2.8} />
      <Name x={300} y={860} title="ЛЯМБДА" note="функції, типи, лінивість" anchor="start" />
    </g>
  );
};

export const Ouroboros: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => {
  const ring = `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy}`;
  const hx = cx;
  const hy = cy + r;
  return (
    <g pointerEvents="none">
      <Tube d={ring} w={20} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={S.gold} strokeWidth={6} strokeDasharray="5 11" opacity={0.28} className="slither" />
      <path
        d={`M ${hx - 30} ${hy - 6} C ${hx - 10} ${hy - 22}, ${hx + 26} ${hy - 20}, ${hx + 42} ${hy - 2} C ${hx + 30} ${hy + 10}, ${hx + 8} ${hy + 18}, ${hx - 20} ${hy + 12} Z`}
        {...ART}
        fill={S.bg1}
      />
      <path d={`M ${hx + 42} ${hy - 2} L ${hx + 20} ${hy + 1}`} {...ART} />
      <circle cx={hx + 18} cy={hy - 9} r={2.6} fill={S.goldHi} />
      <path d={`M ${hx - 6} ${hy - 18} C ${hx - 12} ${hy - 34}, ${hx - 24} ${hy - 40}, ${hx - 36} ${hy - 38}`} {...ART} strokeWidth={1.2} />
      <Name x={cx} y={cy + r + 76} title="УРОБОРОС" note="рекурсія та потоки даних" />
    </g>
  );
};

type PuffKind = "maybe" | "either" | "io" | "state" | "list" | "lazy";

const SAYINGS: Record<PuffKind, string[]> = {
  maybe: ["Just 5", "Nothing", "Just (Just 5)"],
  either: ["Right 42", "Left \"помилка\"", "Right ()"],
  io: ["putStrLn \"Привіт!\"", "getLine", "IO ()"],
  state: ["s -> (a, s)", "get >>= put", "modify (+1)"],
  list: ["[1, 2, 3]", "concatMap f xs", "[]"],
  lazy: ["обчислено на вимогу", "thunk", "ще не потрібно"],
};

const PUFF_BITS = (seed: number): { x: number; y: number; r: number }[] => {
  const g = rng(seed);
  return Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + g();
    const d = 0.35 + g() * 0.3;
    return { x: Math.cos(a) * d, y: Math.sin(a) * d * 0.8, r: 0.45 + g() * 0.3 };
  });
};

/** A shapeless glowing monad living in the nebula; a click makes it say a value. */
export const Puff: React.FC<{ x: number; y: number; r: number; hue: string; kind: PuffKind; label: string; seed: number }> = ({ x, y, r, hue, kind, label, seed }) => {
  const [say, setSay] = useState<string | null>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!say) {
      return;
    }
    const id = setTimeout(() => setSay(null), 2800);
    return () => clearTimeout(id);
  }, [say]);
  const id = `puff${seed}`;
  const bits = PUFF_BITS(seed);
  return (
    <g
      transform={`translate(${x} ${y})`}
      className={`puff puff-${kind}`}
      style={{ cursor: "pointer" }}
      onClick={(e) => {
        e.stopPropagation();
        const list = SAYINGS[kind];
        setSay(list[n % list.length]);
        setN((v) => v + 1);
      }}
    >
      <title>{label}</title>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor="#f6f0ff" stopOpacity="0.95" />
          <stop offset="0.45" stopColor={hue} stopOpacity="0.55" />
          <stop offset="1" stopColor={hue} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="drift" style={{ animationDelay: `${-seed * 1.3}s`, animationDuration: `${9 + (seed % 5)}s` }}>
        <g className="breathe">
          {bits.map((b, i) => (
            <circle key={i} cx={b.x * r} cy={b.y * r} r={b.r * r} fill={`url(#${id})`} />
          ))}
          <circle cx={0} cy={0} r={r * 0.62} fill={`url(#${id})`} />
          <circle cx={0} cy={0} r={r * 0.12} fill="#fff" opacity={0.85} className="core" />
        </g>
        {kind === "maybe" && <circle r={r * 0.95} fill="none" stroke={S.ivoryDim} strokeWidth={1.2} strokeDasharray="3 5" className="nothing" />}
        {kind === "io" && [0, 1].map((i) => <circle key={i} r={r * 0.8} fill="none" stroke={hue} strokeWidth={1.4} className="ripple" style={{ animationDelay: `${-i * 1.4}s` }} />)}
        {kind === "state" && (
          <g>
            <Spin dur={7} />
            <circle cx={r * 1.15} cy={0} r={4} fill={S.goldHi} />
          </g>
        )}
        {kind === "list" &&
          [0, 1, 2].map((i) => (
            <g key={i} transform={`rotate(${i * 120})`}>
              <g>
                <Spin dur={4.5} />
                <circle cx={r * 1.05} cy={0} r={3.4} fill={["#ffe2a0", "#9fd7ff", "#ffb0c0"][i]} />
              </g>
            </g>
          ))}
        {kind === "either" && (
          <>
            <circle cx={-r * 0.45} cy={0} r={r * 0.5} fill="#ff9aa8" opacity={0.25} className="either-l" />
            <circle cx={r * 0.45} cy={0} r={r * 0.5} fill={S.teal} opacity={0.25} className="either-r" />
          </>
        )}
      </g>
      <text y={r + 24} textAnchor="middle" fontFamily={MONO} fontSize={15} fontWeight={700} fill={S.ivory} opacity={0.9}>
        {label}
      </text>
      {say && (
        <g className="say">
          <rect x={-(say.length * 9.6 + 28) / 2} y={-r - 58} width={say.length * 9.6 + 28} height={36} rx={4} fill="rgba(8,11,30,0.88)" stroke={S.gold} strokeWidth={1} />
          <text y={-r - 34} textAnchor="middle" fontFamily={MONO} fontSize={16} fill={S.goldHi}>
            {say}
          </text>
        </g>
      )}
    </g>
  );
};

export const Nebula: React.FC = () => {
  const dust = React.useMemo(() => {
    const g = rng(77);
    return Array.from({ length: 70 }, () => ({ x: 1760 + g() * 560, y: 500 + g() * 470, r: 0.6 + g() * 1.4, o: 0.3 + g() * 0.6 }));
  }, []);
  return (
    <g pointerEvents="none">
      <ellipse cx={2010} cy={700} rx={330} ry={230} fill="url(#nebulaA)" className="nebula-breathe" />
      <ellipse cx={2130} cy={640} rx={230} ry={150} fill="url(#nebulaB)" className="nebula-breathe" style={{ animationDelay: "-3s" }} />
      <ellipse cx={1910} cy={810} rx={230} ry={160} fill="url(#nebulaC)" className="nebula-breathe" style={{ animationDelay: "-6s" }} />
      {dust.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#efe6ff" opacity={d.o} />
      ))}
      <Name x={2010} y={460} title="ТУМАННІСТЬ МОНАД" note="функтори, монади, стан" />
    </g>
  );
};

/** The engraved ribbon of the monad nebula, a little torn at one end. */
export const MonadRibbon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y}) rotate(-4)`} pointerEvents="none" className="ribbon">
    <path d="M -190 -8 L -150 -20 L -150 22 L -190 10 L -176 2 Z" {...ART} fill={S.bg1} />
    <path d="M 190 -14 L 150 -20 L 150 22 L 168 16 L 160 8 L 176 4 L 166 -4 Z" {...ART} fill={S.bg1} />
    <path d="M -150 -20 Q 0 -34 150 -20 L 150 22 Q 0 8 -150 22 Z" fill="rgba(8,11,30,0.85)" stroke={S.gold} strokeWidth={1.4} />
    <text x={0} y={8} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={600} fontSize={27} fill={S.goldHi}>
      Тут живуть монади
    </text>
  </g>
);

/** Line-art dragon of the test, facing east; a click makes it breathe λ-fire. */
export const Dragon: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [fire, setFire] = useState(0);
  useEffect(() => {
    if (!fire) {
      return;
    }
    const id = setTimeout(() => setFire(0), 2000);
    return () => clearTimeout(id);
  }, [fire]);
  const body = "M 1612 864 C 1566 884, 1546 944, 1482 962 C 1404 986, 1362 930, 1292 940 C 1222 950, 1204 1012, 1162 1042 C 1124 1070, 1140 1112, 1180 1106 C 1210 1100, 1204 1070, 1178 1072";
  const spines: Pt[] = [
    [1560, 900],
    [1520, 935],
    [1460, 962],
    [1410, 966],
    [1350, 944],
    [1300, 938],
    [1246, 960],
    [1205, 1010],
  ];
  return (
    <g
      style={{ cursor: "pointer" }}
      onClick={(e) => {
        e.stopPropagation();
        setFire((f) => f + 1);
        onClick();
      }}
    >
      <title>Сузір’я Дракона: контрольна робота</title>
      <path d={body} fill="none" stroke="transparent" strokeWidth={40} />
      <g>
        <Rock cx={1500} cy={952} a={3} dur={5} />
        <path d="M 1500 952 L 1470 760 L 1436 842 L 1378 730 L 1364 846 L 1290 770 L 1316 880 L 1252 842 L 1300 926 Z" {...ART} fill="rgba(165,140,255,0.1)" strokeWidth={1.4} />
        <path d="M 1500 952 L 1436 842 M 1500 952 L 1364 846 M 1500 952 L 1316 880" {...ART} strokeWidth={1.1} opacity={0.85} />
      </g>
      <Tube d={body} w={15} />
      {spines.map(([sx, sy], i) => (
        <path key={i} d={`M ${sx - 6} ${sy - 4} L ${sx} ${sy - 16} L ${sx + 6} ${sy - 4}`} {...ART} strokeWidth={1.1} />
      ))}
      <path d="M 1420 978 L 1412 1012 L 1402 1018 M 1412 1012 L 1418 1020 M 1262 952 L 1254 990 L 1244 996 M 1254 990 L 1262 998" {...ART} strokeWidth={1.2} />
      <path d="M 1598 854 C 1624 820, 1676 816, 1712 836 L 1742 852 C 1718 868, 1690 876, 1664 878 C 1640 890, 1612 884, 1596 868 Z" {...ART} fill={S.bg1} />
      <path d={fire ? "M 1660 872 C 1680 886, 1702 888, 1720 878" : "M 1662 868 C 1680 870, 1700 866, 1716 858"} {...ART} strokeWidth={1.2} />
      <path d="M 1620 836 C 1600 804, 1578 794, 1560 794 M 1640 830 C 1630 798, 1614 784, 1598 778" {...ART} strokeWidth={1.4} />
      <path d="M 1700 838 L 1712 828 M 1722 846 L 1736 840" {...ART} strokeWidth={1} />
      {[1530, 1400, 1292, 1180].map((sx, i) => (
        <MinorStar key={i} x={sx} y={[938, 975, 940, 1062][i]} />
      ))}
      {fire > 0 && (
        <g key={fire} className="breath">
          {Array.from({ length: 12 }, (_, i) => (
            <text
              key={i}
              className="ember"
              style={{ animationDelay: `${i * 0.06}s` }}
              x={1730}
              y={852 + ((i * 13) % 22) - 11}
              fontFamily={SERIF}
              fontStyle="italic"
              fontSize={18 + (i % 4) * 7}
              fill={i % 3 ? S.goldHi : S.ember}
            >
              λ
            </text>
          ))}
        </g>
      )}
      <Name x={1430} y={1110} title="ДРАКОН" note="контрольна робота" />
    </g>
  );
};

export const Libra: React.FC = () => (
  <g pointerEvents="none">
    <path d="M 760 952 L 760 1132 M 716 1140 L 804 1140 M 730 1132 L 790 1132" {...ART} />
    <circle cx={760} cy={948} r={8} {...ART} fill={S.bg1} />
    <path d="M 760 940 L 760 918" {...ART} />
    <g>
      <Rock cx={760} cy={948} a={1.2} dur={7} />
      <path d="M 560 952 L 960 952" {...ART} />
      <path d="M 560 952 L 508 1038 M 560 952 L 612 1038 M 960 952 L 908 1038 M 960 952 L 1012 1038" {...ART} strokeWidth={1.1} />
      <path d="M 500 1038 Q 560 1072 620 1038 Z" {...ART} fill="rgba(216,180,106,0.06)" />
      <path d="M 900 1038 Q 960 1072 1020 1038 Z" {...ART} fill="rgba(216,180,106,0.06)" />
    </g>
    <Name x={760} y={868} title="ТЕРЕЗИ" note="логічне програмування" />
  </g>
);

export const ERIDANUS: Pt[] = [
  [430, 1185], [560, 1300], [700, 1395], [880, 1420], [1050, 1362], [1220, 1330], [1390, 1398], [1560, 1440], [1700, 1440], [1830, 1430],
];

/** The river Eridanus: reactive streams of tiny stars flowing towards the fortress. */
export const Eridanus: React.FC = () => {
  const d = smooth(ERIDANUS);
  const up = smooth(ERIDANUS.map(([x, y]) => [x, y - 20] as Pt));
  const down = smooth(ERIDANUS.map(([x, y]) => [x, y + 20] as Pt));
  return (
    <g pointerEvents="none">
      <path d={d} fill="none" stroke="url(#river)" strokeWidth={44} strokeLinecap="round" />
      <path d={up} {...LINE} strokeDasharray="14 10" />
      <path d={down} {...LINE} strokeDasharray="14 10" />
      <path id="eridanus" d={d} fill="none" stroke="none" />
      {Array.from({ length: 16 }, (_, i) => (
        <circle key={i} r={i % 4 === 0 ? 2.6 : 1.6} fill={i % 5 === 0 ? S.teal : "#dfe8ff"} opacity={0.9}>
          <animateMotion dur={`${11 + (i % 3)}s`} begin={`${-i * 0.75}s`} repeatCount="indefinite">
            <mpath href="#eridanus" />
          </animateMotion>
        </circle>
      ))}
      <Name x={1640} y={1262} title="ЕРІДАН" note="ріка потоків: реактивність, метапрограми, DSL" />
    </g>
  );
};

export const Fortress: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const cx = 2050;
  const base = 1420;
  const tower = (x0: number, x1: number, top: number, apex: number) => (
    <>
      <path d={`M ${x0} ${base} L ${x0} ${top} L ${x1} ${top} L ${x1} ${base}`} {...ART} fill="rgba(216,180,106,0.05)" />
      <path d={`M ${x0 - 6} ${top} L ${(x0 + x1) / 2} ${apex} L ${x1 + 6} ${top} Z`} {...ART} fill="rgba(165,140,255,0.08)" />
      <path d={`M ${(x0 + x1) / 2} ${apex} L ${(x0 + x1) / 2} ${apex - 30}`} {...ART} strokeWidth={1.2} />
      <path className="pennant" d={`M ${(x0 + x1) / 2} ${apex - 30} l 22 6 l -22 7 Z`} fill={S.goldDim} stroke="none" />
      <MinorStar x={(x0 + x1) / 2} y={apex} r={2} />
    </>
  );
  return (
    <g style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <title>Фортеця іспиту</title>
      <path d={`M 1890 ${base} L 1890 1340 L 2210 1340 L 2210 ${base}`} {...ART} fill="rgba(216,180,106,0.05)" />
      {Array.from({ length: 11 }, (_, i) => (
        <path key={i} d={`M ${1896 + i * 29} 1340 l 0 -12 l 14 0 l 0 12`} {...ART} strokeWidth={1.2} />
      ))}
      {tower(1872, 1930, 1270, 1210)}
      {tower(2170, 2228, 1270, 1210)}
      {tower(2000, 2100, 1230, 1158)}
      <path d={`M ${cx - 28} ${base} L ${cx - 28} 1392 A 28 28 0 0 1 ${cx + 28} 1392 L ${cx + 28} ${base}`} {...ART} fill="rgba(8,11,30,0.6)" />
      {[2028, 2050, 2072].map((wx) => (
        <path key={wx} d={`M ${wx - 4} 1290 l 0 -12 a 4 4 0 0 1 8 0 l 0 12 Z`} fill={S.goldFaint} stroke="none" />
      ))}
      <path d="M 1950 1420 L 1984 1336 M 1964 1420 L 1998 1336 M 1955 1406 L 1969 1406 M 1960 1392 L 1974 1392 M 1966 1378 L 1980 1378 M 1971 1364 L 1985 1364 M 1977 1350 L 1991 1350" {...ART} strokeWidth={1} />
      <path d="M 2150 1420 L 2116 1336 M 2136 1420 L 2102 1336 M 2145 1406 L 2131 1406 M 2140 1392 L 2126 1392 M 2134 1378 L 2120 1378 M 2129 1364 L 2115 1364 M 2123 1350 L 2109 1350" {...ART} strokeWidth={1} />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} className="siege" style={{ animationDelay: `${-i * 1.1}s` }} x1={1700 + i * 20} y1={1520 - i * 14} x2={1930 + i * 40} y2={1360 - i * 6} stroke={S.goldHi} strokeWidth={1.6} strokeLinecap="round" />
      ))}
      <Name x={cx} y={1480} title="ФОРТЕЦЯ" note="іспит: штурм фортеці" />
    </g>
  );
};

export const Polaris: React.FC = () => <Name x={290} y={208} title="ПОЛЯРНА ЗОРЯ" note="початок подорожі" anchor="start" />;

