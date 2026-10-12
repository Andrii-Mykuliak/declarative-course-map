import React, { useMemo } from "react";

/** Deterministic PRNG so the sky is the same on every load. */
const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Quiet starry background behind the list. */
export const Sky: React.FC = () => {
  const stars = useMemo(() => {
    const r = rng(9);
    return Array.from({ length: 260 }, () => ({
      x: r() * 1600,
      y: r() * 1000,
      s: r() < 0.93 ? 0.5 + r() * 0.9 : 1.4 + r() * 0.9,
      o: 0.25 + r() * 0.55,
      tw: r() < 0.12,
      d: -r() * 6,
    }));
  }, []);
  return (
    <svg className="sky" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="milky">
          <stop offset="0" stopColor="#c8d2ff" stopOpacity="0.09" />
          <stop offset="1" stopColor="#c8d2ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[0.2, 0.5, 0.8].map((t, i) => (
        <ellipse key={i} cx={1600 * (1 - t)} cy={80 + t * 860} rx={360} ry={150} fill="url(#milky)" transform={`rotate(-32 ${1600 * (1 - t)} ${80 + t * 860})`} />
      ))}
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#f3ecd8" opacity={s.o} className={s.tw ? "twinkle" : undefined} style={s.tw ? { animationDelay: `${s.d}s` } : undefined} />
      ))}
    </svg>
  );
};

export type EmblemKind = "lambda" | "ouroboros" | "nebula" | "scales" | "river" | "fortress";

/** Small engraved emblem in front of a section title. */
export const Emblem: React.FC<{ kind: EmblemKind }> = ({ kind }) => (
  <svg className="emblem" viewBox="0 0 40 40" aria-hidden>
    {kind === "lambda" && (
      <text x="20" y="31" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="34">
        λ
      </text>
    )}
    {kind === "ouroboros" && (
      <>
        <circle cx="20" cy="20" r="13" fill="none" strokeWidth="2.6" />
        <circle cx="20" cy="20" r="13" fill="none" strokeWidth="1" strokeDasharray="2 3" className="bg-line" />
        <path d="M 14 31 C 17 35, 24 35, 27 31" fill="none" strokeWidth="1.6" />
      </>
    )}
    {kind === "nebula" && (
      <>
        <circle cx="15" cy="22" r="7" className="puff" />
        <circle cx="24" cy="17" r="8" className="puff" />
        <circle cx="25" cy="26" r="6" className="puff" />
      </>
    )}
    {kind === "scales" && (
      <path d="M 20 8 V 33 M 13 33 H 27 M 6 13 H 34 M 6 13 L 2 23 H 12 Z M 34 13 L 28 23 H 38 Z" fill="none" strokeWidth="1.6" strokeLinejoin="round" />
    )}
    {kind === "river" && (
      <path d="M 3 15 C 10 9, 14 21, 21 15 S 31 9, 37 15 M 3 25 C 10 19, 14 31, 21 25 S 31 19, 37 25" fill="none" strokeWidth="1.8" strokeLinecap="round" />
    )}
    {kind === "fortress" && (
      <path d="M 6 34 V 17 L 10 10 L 14 17 V 34 M 26 34 V 17 L 30 10 L 34 17 V 34 M 14 22 H 26 M 14 34 H 26 M 18 34 V 29 A 2 2 0 0 1 22 29 V 34" fill="none" strokeWidth="1.6" strokeLinejoin="round" />
    )}
  </svg>
);
