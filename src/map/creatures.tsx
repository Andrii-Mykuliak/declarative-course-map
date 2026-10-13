import React, { useEffect, useMemo, useState } from "react";
import { P } from "./palette";
import { Pt, rng, smooth } from "./geo";

const MONO = "JetBrains Mono, monospace";

/** Speech bubble sized for monospace text. */
export const Bubble: React.FC<{ x: number; y: number; text: string; color?: string; size?: number }> = ({ x, y, text, color = P.ink, size = 18 }) => {
  const w = text.length * size * 0.6 + 26;
  const h = size + 20;
  return (
    <g className="pop" pointerEvents="none">
      <path
        d={`M ${x - w / 2} ${y - h - 12} h ${w} a 10 10 0 0 1 10 10 v ${h - 20} a 10 10 0 0 1 -10 10 h ${-w / 2 + 14} l -14 12 l -2 -12 h ${-w / 2 + 2} a 10 10 0 0 1 -10 -10 v ${-h + 20} a 10 10 0 0 1 10 -10 Z`}
        fill="#fffaf0"
        stroke={P.ink}
        strokeWidth={2}
      />
      <text x={x + 5} y={y - 12 - h / 2 + size * 0.36} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={size} fill={color}>
        {text}
      </text>
    </g>
  );
};

export type MonadKind = "maybe" | "either" | "io" | "state" | "list" | "lazy" | "plain";

const PHRASES: Record<MonadKind, string[]> = {
  maybe: ["Just 5!", "Nothing…", "Just (Just 5)?"],
  either: ["Right 42", "Left \"ой\"", "Right ()"],
  io: ["putStrLn \"Привіт!\"", "getLine…", "IO ()"],
  state: ["s -> (a, s)", "get >>= put", "стан +1"],
  list: ["[1, 2, 3]", "concatMap!", "[]"],
  lazy: ["обчислено!", "ще 5 хвилин…", "thunk!"],
  plain: [">>=", "pure 7", "join!"],
};

const furPath = (r: number, seed: number) => {
  const g = rng(seed);
  const n = 30;
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = i % 2 ? 1.1 + g() * 0.06 : 0.95 + g() * 0.04;
    const squash = Math.sin(a) > 0 ? 0.92 : 1.05;
    pts.push([Math.cos(a) * r * k, Math.sin(a) * r * k * squash]);
  }
  return smooth(pts, true, 0.13);
};

/** A shapeless fluffy monster; each kind does its own thing, a click makes it talk. */
export const Monad: React.FC<{ x: number; y: number; r?: number; color: string; kind: MonadKind; label?: string; seed: number; flip?: boolean }> = ({
  x,
  y,
  r = 34,
  color,
  kind,
  label,
  seed,
  flip,
}) => {
  const fur = useMemo(() => furPath(r, seed), [r, seed]);
  const [say, setSay] = useState<string | null>(null);
  const [n, setN] = useState(0);
  const [tick, setTick] = useState(0);
  const awake = kind !== "lazy" || say !== null;

  useEffect(() => {
    if (kind !== "state" && kind !== "maybe") {
      return;
    }
    const id = setInterval(() => setTick((t) => t + 1), kind === "state" ? 1400 : 2600);
    return () => clearInterval(id);
  }, [kind]);

  useEffect(() => {
    if (!say) {
      return;
    }
    const id = setTimeout(() => setSay(null), 2600);
    return () => clearTimeout(id);
  }, [say]);

  const talk = (e: React.MouseEvent) => {
    e.stopPropagation();
    const list = PHRASES[kind];
    setSay(list[n % list.length]);
    setN((v) => v + 1);
  };

  const eyeY = -r * 0.18;
  const lighter = `color-mix(in srgb, ${color} 55%, white)`;
  const darker = `color-mix(in srgb, ${color} 70%, #1d1030)`;

  return (
    <g transform={`translate(${x} ${y})`} style={{ cursor: "pointer" }} onClick={talk}>
      <title>{label ?? "монада"}</title>
      <ellipse cx={0} cy={r * 0.95} rx={r * 0.9} ry={r * 0.22} fill="#000" opacity={0.18} />
      <g className={say ? "hop" : kind === "lazy" && !awake ? "breathe" : "bounce"} style={{ animationDelay: `${(seed % 7) * -0.37}s` }}>
        <g transform={flip ? "scale(-1 1)" : undefined}>
          <ellipse cx={-r * 0.35} cy={r * 0.92} rx={r * 0.22} ry={r * 0.12} fill={darker} />
          <ellipse cx={r * 0.35} cy={r * 0.92} rx={r * 0.22} ry={r * 0.12} fill={darker} />
          <path d={fur} fill={color} stroke={darker} strokeWidth={2.2} />
          <path d={furPath(r * 0.55, seed + 1)} transform={`translate(${-r * 0.12} ${r * 0.22})`} fill={lighter} opacity={0.5} />
          <ellipse cx={-r * 0.38} cy={-r * 0.52} rx={r * 0.2} ry={r * 0.1} fill="#fff" opacity={0.35} transform={`rotate(-30 ${-r * 0.38} ${-r * 0.52})`} />
          {awake ? (
            <g className="blink" style={{ animationDelay: `${(seed % 5) * -0.9}s` }}>
              {[-1, 1].map((sx) => (
                <g key={sx}>
                  <ellipse cx={sx * r * 0.3} cy={eyeY} rx={r * 0.2} ry={r * 0.24} fill="#fff" stroke={darker} strokeWidth={1.2} />
                  <circle cx={sx * r * 0.3 + r * 0.05} cy={eyeY + r * 0.04} r={r * 0.11} fill="#1d1030" />
                  <circle cx={sx * r * 0.3 + r * 0.09} cy={eyeY - r * 0.03} r={r * 0.04} fill="#fff" />
                </g>
              ))}
            </g>
          ) : (
            [-1, 1].map((sx) => (
              <path key={sx} d={`M ${sx * r * 0.3 - r * 0.15} ${eyeY} q ${r * 0.15} ${r * 0.12} ${r * 0.3} 0`} fill="none" stroke="#1d1030" strokeWidth={2.4} strokeLinecap="round" />
            ))
          )}
          {say ? (
            <ellipse cx={0} cy={r * 0.28} rx={r * 0.13} ry={r * 0.16} fill="#5b1f3a" />
          ) : (
            <path d={`M ${-r * 0.16} ${r * 0.22} q ${r * 0.16} ${r * 0.18} ${r * 0.32} 0`} fill="none" stroke="#1d1030" strokeWidth={2.2} strokeLinecap="round" />
          )}
          <ellipse cx={-r * 0.55} cy={r * 0.2} rx={r * 0.1} ry={r * 0.06} fill="#ff8fb8" opacity={0.6} />
          <ellipse cx={r * 0.55} cy={r * 0.2} rx={r * 0.1} ry={r * 0.06} fill="#ff8fb8" opacity={0.6} />
        </g>

        {kind === "maybe" && (
          <g transform={`translate(${r * 0.75} ${r * 0.35})`}>
            <rect x={-14} y={-12} width={28} height={24} rx={3} fill={P.gold} stroke={P.ink} strokeWidth={1.4} />
            <line x1={0} y1={-12} x2={0} y2={12} stroke={P.roof3} strokeWidth={3} />
            <g className="lid">
              <rect x={-16} y={-18} width={32} height={8} rx={2} fill="#f0c86c" stroke={P.ink} strokeWidth={1.4} />
            </g>
            <text x={0} y={-24} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={14} fill={tick % 2 ? "#9b3b2e" : "#2e7d4f"} className="peek">
              {tick % 2 ? "∅" : "5"}
            </text>
          </g>
        )}
        {kind === "either" && (
          <g>
            {[
              [-1, "L", "#c8553d"],
              [1, "R", "#3f9a5f"],
            ].map(([sx, t, c]) => (
              <g key={t as string} className={sx === -1 ? "wave-l" : "wave-r"}>
                <line x1={(sx as number) * r * 0.85} y1={r * 0.3} x2={(sx as number) * r * 1.05} y2={-r * 0.6} stroke={P.trunk} strokeWidth={2.4} />
                <path d={`M ${(sx as number) * r * 1.05} ${-r * 0.6} l ${(sx as number) * 20} 6 l ${(sx as number) * -18} 10 Z`} fill={c as string} stroke={P.ink} strokeWidth={1} />
                <text x={(sx as number) * r * 1.05 + (sx as number) * 8} y={-r * 0.6 + 12} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff" fontFamily={MONO}>
                  {t as string}
                </text>
              </g>
            ))}
          </g>
        )}
        {kind === "state" && (
          <g transform={`translate(${r * 0.85} ${r * 0.1})`}>
            <rect x={-18} y={-16} width={36} height={30} rx={4} fill="#3b3346" stroke={P.trunk} strokeWidth={3} />
            <text x={0} y={5} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={15} fill="#f5f1e6">
              {5 + (tick % 10)}
            </text>
          </g>
        )}
        {kind === "list" && (
          <g className="juggle">
            {["1", "2", "3"].map((t, i) => {
              const a = (i / 3) * Math.PI * 2;
              return (
                <g key={t}>
                  <circle cx={Math.cos(a) * r * 0.7} cy={-r * 1.15 + Math.sin(a) * r * 0.32} r={9} fill={["#f2d36b", "#7ec0e0", "#ef8a8a"][i]} stroke={P.ink} strokeWidth={1.2} />
                  <text x={Math.cos(a) * r * 0.7} y={-r * 1.15 + Math.sin(a) * r * 0.32 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily={MONO} fill={P.ink}>
                    {t}
                  </text>
                </g>
              );
            })}
          </g>
        )}
        {kind === "lazy" && !awake && (
          <g className="zzz" fill={P.purpleDeep} fontFamily="Yeseva One, serif">
            <text x={r * 0.7} y={-r * 0.7} fontSize={18}>
              z
            </text>
            <text x={r * 1.0} y={-r * 1.1} fontSize={23}>
              z
            </text>
            <text x={r * 1.35} y={-r * 1.55} fontSize={28}>
              Z
            </text>
          </g>
        )}
      </g>
      {label && (
        <text x={0} y={r * 1.5} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={15} fill={P.purpleDeep} stroke={P.parchment} strokeWidth={4} paintOrder="stroke">
          {label}
        </text>
      )}
      {kind === "io" && !say && <IoChatter r={r} seed={seed} />}
      {say && <Bubble x={0} y={-r * (kind === "list" ? 1.6 : 1.05)} text={say} />}
    </g>
  );
};

const IoChatter: React.FC<{ r: number; seed: number }> = ({ r, seed }) => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setOn((o) => !o), 2300 + (seed % 5) * 200);
    return () => clearInterval(id);
  }, [seed]);
  return on ? <Bubble x={0} y={-r * 1.05} text="Hello, World!" size={15} /> : null;
};

/** A monad strolling back and forth between two points. */
export const WalkingMonad: React.FC<{ from: Pt; to: Pt; color: string; seed: number; label?: string; period?: number }> = ({
  from,
  to,
  color,
  seed,
  label,
  period = 14,
}) => {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const loop = () => {
      setT((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const ph = (t % period) / period;
  const k = ph < 0.5 ? ph * 2 : 2 - ph * 2;
  const e = k * k * (3 - 2 * k);
  const x = from[0] + (to[0] - from[0]) * e;
  const y = from[1] + (to[1] - from[1]) * e;
  const goingRight = ph < 0.5 ? to[0] > from[0] : to[0] < from[0];
  return <Monad x={x} y={y - Math.abs(Math.sin(t * 7)) * 6} r={24} color={color} kind="plain" seed={seed} label={label} flip={!goingRight} />;
};

/** The dragon of the test, sitting on the bridge and facing travellers from the east. */
export const Dragon: React.FC<{ x: number; y: number; onClick: () => void }> = ({ x, y, onClick }) => {
  const [fire, setFire] = useState(0);
  useEffect(() => {
    if (!fire) {
      return;
    }
    const id = setTimeout(() => setFire(0), 1900);
    return () => clearTimeout(id);
  }, [fire]);
  const body = "#4a2f72";
  const dark = "#2f1d4c";
  const belly = "#a687d4";
  const membrane = "#6c49a6";
  return (
    <g
      transform={`translate(${x} ${y})`}
      style={{ cursor: "pointer" }}
      onClick={(e) => {
        e.stopPropagation();
        setFire((f) => f + 1);
        onClick();
      }}
    >
      <title>Дракон контрольної</title>
      <ellipse cx={0} cy={58} rx={110} ry={14} fill="#000" opacity={0.25} />
      <path d="M -40 30 C -100 40, -120 90, -80 110 C -50 124, -30 100, -54 92" fill="none" stroke={body} strokeWidth={18} strokeLinecap="round" />
      <path d="M -54 92 l -10 -14 l 18 4 Z" fill={dark} />
      <g className="wing-back">
        <path d="M -10 -20 L -120 -150 L -105 -95 L -150 -110 L -110 -60 L -150 -55 L -60 -18 Z" fill={membrane} stroke={dark} strokeWidth={3} strokeLinejoin="round" opacity={0.9} />
        <path d="M -10 -20 L -120 -150 M -10 -20 L -150 -110 M -10 -20 L -150 -55" stroke={dark} strokeWidth={3} />
      </g>
      <g className="breathe-dragon">
        <ellipse cx={0} cy={10} rx={64} ry={48} fill={body} stroke={dark} strokeWidth={3} />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M ${18 + i * 4} ${-18 + i * 15} q 22 6 26 0`} fill="none" stroke={belly} strokeWidth={6} strokeLinecap="round" />
        ))}
        <circle cx={-28} cy={30} r={26} fill={body} stroke={dark} strokeWidth={3} />
        <path d="M -40 52 l -6 10 M -30 54 l -2 11 M -20 54 l 3 10" stroke="#e8dcc0" strokeWidth={3} strokeLinecap="round" />
        <path d="M 30 40 L 34 60 M 40 40 L 46 60" stroke={body} strokeWidth={12} strokeLinecap="round" />
        <path d="M 30 62 l -4 6 M 38 62 l 0 7 M 46 62 l 4 6" stroke="#e8dcc0" strokeWidth={3} strokeLinecap="round" />
        <path d="M 30 -20 C 40 -60, 70 -80, 92 -84" fill="none" stroke={body} strokeWidth={30} strokeLinecap="round" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M ${36 + i * 13} ${-40 - i * 13} l -8 -14 l 14 6 Z`} fill={dark} />
        ))}
        <g className="head">
          <path d="M 70 -100 C 100 -118, 140 -104, 150 -88 C 152 -80, 140 -74, 124 -76 L 100 -70 C 82 -66, 68 -76, 70 -100 Z" fill={body} stroke={dark} strokeWidth={3} strokeLinejoin="round" />
          <path d={fire ? "M 100 -76 C 120 -60, 140 -58, 150 -66" : "M 100 -74 C 118 -70, 134 -72, 146 -80"} fill="none" stroke={dark} strokeWidth={3} strokeLinecap="round" />
          <path d="M 78 -104 C 66 -130, 52 -138, 40 -134 C 56 -126, 64 -114, 70 -100" fill="#e8dcc0" stroke={P.ink} strokeWidth={1.5} />
          <path d="M 92 -110 C 88 -136, 78 -150, 66 -152 C 78 -140, 84 -126, 84 -108" fill="#e8dcc0" stroke={P.ink} strokeWidth={1.5} />
          <circle cx={108} cy={-96} r={12} fill="url(#glowFire)" className="glow" />
          <ellipse cx={108} cy={-96} rx={7} ry={6} fill="#ffcf4d" stroke={dark} strokeWidth={1.5} />
          <ellipse cx={109} cy={-96} rx={1.8} ry={5} fill="#2a1406" />
          <circle cx={144} cy={-90} r={2.5} fill={dark} />
          {!fire &&
            [0, 1, 2].map((i) => (
              <circle key={i} className="smoke" style={{ animationDelay: `${-i * 1.1}s` }} cx={150} cy={-94} r={7} fill="#cfc8d8" opacity={0.6} />
            ))}
        </g>
      </g>
      <g className="wing-front">
        <path d="M 10 -24 L -30 -190 L -10 -130 L -70 -150 L -30 -96 L -80 -86 L -16 -40 Z" fill={membrane} stroke={dark} strokeWidth={3} strokeLinejoin="round" />
        <path d="M 10 -24 L -30 -190 M 10 -24 L -70 -150 M 10 -24 L -80 -86" stroke={dark} strokeWidth={3} />
      </g>
      {fire > 0 && (
        <g key={fire} className="fire">
          <path d="M 150 -84 C 200 -110, 260 -96, 300 -70 C 260 -60, 220 -48, 150 -78 Z" fill="#ffb347" opacity={0.9} />
          <path d="M 150 -84 C 190 -96, 230 -88, 262 -74 C 228 -68, 196 -62, 150 -80 Z" fill="#fff1a8" />
          {Array.from({ length: 8 }, (_, i) => (
            <text key={i} className="ember" style={{ animationDelay: `${i * 0.08}s` }} x={170 + i * 16} y={-84 + ((i * 37) % 30) - 15} fontFamily="Yeseva One, serif" fontSize={20 + (i % 3) * 6} fill={i % 2 ? "#ff7a1a" : "#ffd24a"}>
              λ
            </text>
          ))}
        </g>
      )}
    </g>
  );
};

/** The traveller with a λ-staff, standing where the course currently is. */
export const Traveller: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} pointerEvents="none">
    <ellipse cx={0} cy={2} rx={18} ry={5} fill="#000" opacity={0.25} />
    <g className="bounce-soft">
      <path d="M -14 0 L -10 -36 C -8 -46, 8 -46, 10 -36 L 14 0 Z" fill={P.purple} stroke={P.ink} strokeWidth={1.6} />
      <circle cx={0} cy={-48} r={9} fill="#f1d3b3" stroke={P.ink} strokeWidth={1.4} />
      <path d="M -14 -46 C -12 -66, 6 -76, 16 -82 C 12 -66, 14 -56, 14 -44 Z" fill={P.purpleDeep} stroke={P.ink} strokeWidth={1.6} />
      <line x1={18} y1={2} x2={20} y2={-62} stroke={P.trunk} strokeWidth={3} strokeLinecap="round" />
      <circle cx={20} cy={-66} r={14} fill="url(#glowPurple)" className="glow" />
      <text x={20} y={-60} textAnchor="middle" fontFamily="Yeseva One, serif" fontSize={16} fill={P.crystalHi}>
        λ
      </text>
    </g>
  </g>
);
