import React from "react";
import type { Stop } from "../data/course";
import { S, SERIF, TEXT } from "./sky";
import { Spin } from "./geo";

type Press = (s: Stop) => void;

const keyPress = (fn: () => void) => (e: React.KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
};

const sparkle = (x: number, y: number, long: number, short: number, w = 0.13) =>
  `M ${x} ${y - long} L ${x + long * w} ${y - long * w} L ${x + short} ${y} L ${x + long * w} ${y + long * w} L ${x} ${y + long} L ${x - long * w} ${y + long * w} L ${x - short} ${y} L ${x - long * w} ${y - long * w} Z`;

const Interactive: React.FC<{ s: Stop; onPress: Press; className: string; label: string; children: React.ReactNode }> = ({ s, onPress, className, label, children }) => {
  const press = () => onPress(s);
  return (
    <g
      className={className}
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        press();
      }}
      onKeyDown={keyPress(press)}
    >
      {children}
    </g>
  );
};

export const LectureStar: React.FC<{ s: Stop; onPress: Press; selected: boolean; current: boolean }> = ({ s, onPress, selected, current }) => {
  const side = s.labelSide ?? "right";
  const lx = side === "right" ? s.x + 30 : side === "left" ? s.x - 30 : s.x;
  const ly = side === "below" ? s.y + 50 : side === "above" ? s.y - 36 : s.y + 8;
  const anchor = side === "right" ? "start" : side === "left" ? "end" : "middle";
  return (
    <Interactive s={s} onPress={onPress} className={`star${selected ? " selected" : ""}${current ? " current" : ""}`} label={`Тиждень ${s.week}: ${s.title}`}>
      <circle cx={s.x} cy={s.y} r={36} fill="transparent" />
      <circle cx={s.x} cy={s.y} r={30} fill="url(#starGlow)" className="star-glow" />
      {s.deck && (
        <circle cx={s.x} cy={s.y} r={20} fill="none" stroke={S.violet} strokeWidth={1.3} strokeDasharray="3 4" className="deck-ring">
          <Spin cx={s.x} cy={s.y} dur={30} />
        </circle>
      )}
      {current && <circle cx={s.x} cy={s.y} r={26} fill="none" stroke={S.goldHi} strokeWidth={1.5} className="now" />}
      <path d={sparkle(s.x, s.y, 17, 6)} fill="#fff6d8" className="spikes" />
      <circle cx={s.x} cy={s.y} r={3.4} fill="#fff" />
      <text x={s.x - 16} y={s.y - 16} textAnchor="end" fontFamily={SERIF} fontWeight={700} fontSize={26} fill={S.gold}>
        {s.week}
      </text>
      <text x={lx} y={ly} textAnchor={anchor} fontFamily={TEXT} fontSize={22} fill={S.ivory} className="star-label" stroke={S.bg1} strokeWidth={5} paintOrder="stroke">
        {s.short}
      </text>
    </Interactive>
  );
};

export const LabPlanet: React.FC<{ s: Stop; onPress: Press; selected: boolean; teal?: boolean }> = ({ s, onPress, selected, teal }) => (
  <Interactive s={s} onPress={onPress} className={`planet${selected ? " selected" : ""}`} label={s.title}>
    <circle cx={s.x} cy={s.y} r={30} fill="transparent" />
    <circle cx={s.x} cy={s.y} r={24} fill="url(#starGlow)" opacity={0.35} className="star-glow" />
    <ellipse cx={s.x} cy={s.y} rx={22} ry={6.5} fill="none" stroke={S.goldHi} strokeWidth={1.3} opacity={0.55} transform={`rotate(-18 ${s.x} ${s.y})`} />
    <circle cx={s.x} cy={s.y} r={10.5} fill={teal ? "url(#planetB)" : "url(#planetA)"} />
    <path d={`M ${s.x - 22} ${s.y} A 22 6.5 0 0 0 ${s.x + 22} ${s.y}`} fill="none" stroke={S.goldHi} strokeWidth={1.4} transform={`rotate(-18 ${s.x} ${s.y})`} />
    <text x={s.x + 30} y={s.y + 7} fontFamily={SERIF} fontStyle="italic" fontWeight={600} fontSize={22} fill={S.goldHi} stroke={S.bg1} strokeWidth={5} paintOrder="stroke" className="star-label">
      {s.short}
    </text>
  </Interactive>
);

/** Start (Polaris), test (the dragon's eye) and exam (the fortress gate). */
export const SpecialStar: React.FC<{ s: Stop; onPress: Press; selected: boolean; tone: "ivory" | "ember" | "gold"; size?: number }> = ({ s, onPress, selected, tone, size = 1 }) => {
  const glow = tone === "ember" ? "url(#emberGlow)" : "url(#starGlow)";
  const fill = tone === "ember" ? "#ffd2b8" : tone === "gold" ? S.goldHi : "#fffdf3";
  return (
    <Interactive s={s} onPress={onPress} className={`star special${selected ? " selected" : ""}`} label={s.title}>
      <circle cx={s.x} cy={s.y} r={40 * size} fill="transparent" />
      <circle cx={s.x} cy={s.y} r={44 * size} fill={glow} className="star-glow pulse" />
      <path d={sparkle(s.x, s.y, 34 * size, 9 * size, 0.1)} fill={fill} className="spikes" />
      <path d={sparkle(s.x, s.y, 16 * size, 4 * size, 0.18)} fill={fill} transform={`rotate(45 ${s.x} ${s.y})`} opacity={0.85} />
      <circle cx={s.x} cy={s.y} r={4.5 * size} fill="#fff" />
    </Interactive>
  );
};
