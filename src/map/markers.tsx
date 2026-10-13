import React from "react";
import { P } from "./palette";
import type { Stop } from "../data/course";
import { LPNU_CIRCLES, LPNU_PATHS, LPNU_VIEWBOX } from "../data/lpnuLogo";

export const SERIF = "Yeseva One, serif";
export const BOOK = "Kurale, serif";
export const HAND = "Marck Script, cursive";

/** Rough text width for the map fonts; good enough to size scrolls and plaques. */
export const textW = (t: string, size: number, k = 0.5) => t.length * size * k;

type Press = (s: Stop) => void;

const keyPress = (fn: () => void) => (e: React.KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
};

const Scroll: React.FC<{ x: number; y: number; text: string; size?: number; anchor?: "middle" | "start" | "end" }> = ({ x, y, text, size = 21, anchor = "middle" }) => {
  const w = textW(text, size, 0.5) + 30;
  const h = size + 16;
  const left = anchor === "middle" ? x - w / 2 : anchor === "start" ? x : x - w;
  return (
    <g pointerEvents="none">
      <rect x={left} y={y - h / 2} width={w} height={h} rx={7} fill="#fbf1d6" stroke={P.ink} strokeWidth={1.8} />
      <path d={`M ${left} ${y - h / 2 + 4} q -9 ${h / 2 - 4} 0 ${h - 8}`} fill="#ead9ad" stroke={P.ink} strokeWidth={1.4} />
      <path d={`M ${left + w} ${y - h / 2 + 4} q 9 ${h / 2 - 4} 0 ${h - 8}`} fill="#ead9ad" stroke={P.ink} strokeWidth={1.4} />
      <text x={left + w / 2} y={y + size * 0.34} textAnchor="middle" fontFamily={BOOK} fontSize={size} fill={P.ink}>
        {text}
      </text>
    </g>
  );
};

const pinPath = (r: number) => `M 0 0 C ${-r * 0.35} ${-r * 0.7}, ${-r} ${-r * 1.05}, ${-r} ${-r * 1.7} A ${r} ${r} 0 1 1 ${r} ${-r * 1.7} C ${r} ${-r * 1.05}, ${r * 0.35} ${-r * 0.7}, 0 0 Z`;

export const LecturePin: React.FC<{ s: Stop; onPress: Press; selected: boolean; current: boolean; dim: boolean }> = ({ s, onPress, selected, current, dim }) => {
  const r = 27;
  const cy = -r * 1.7;
  const side = s.labelSide ?? "right";
  const lx = side === "right" ? r + 14 : side === "left" ? -r - 14 : 0;
  const ly = side === "below" ? 34 : side === "above" ? cy - r - 26 : cy;
  const anchor = side === "right" ? "start" : side === "left" ? "end" : "middle";
  const press = () => onPress(s);
  return (
    <g transform={`translate(${s.x} ${s.y})`} opacity={dim ? 0.78 : 1}>
      <g
        className={`pin${selected ? " selected" : ""}${current ? " current" : ""}`}
        role="button"
        tabIndex={0}
        aria-label={`Тиждень ${s.week}: ${s.title}`}
        onClick={(e) => {
          e.stopPropagation();
          press();
        }}
        onKeyDown={keyPress(press)}
      >
        <ellipse cx={0} cy={1} rx={13} ry={4} fill="#000" opacity={0.25} />
        <circle cx={0} cy={cy} r={r + 12} className="pin-halo" fill="url(#glowGold)" />
        <path d={pinPath(r)} fill={P.purple} stroke={P.purpleDeep} strokeWidth={2.4} />
        <circle cx={0} cy={cy} r={r - 3} fill={P.purpleDeep} stroke={P.gold} strokeWidth={3} />
        <text x={0} y={cy + 9} textAnchor="middle" fontFamily={SERIF} fontSize={s.week! > 9 ? 23 : 26} fill="#fff">
          {s.week}
        </text>
        {s.deck && (
          <g transform={`translate(${r * 0.78} ${cy - r * 0.78})`}>
            <circle r={10} fill={P.gold} stroke={P.ink} strokeWidth={1.5} />
            <path d="M -3 -5 L 5 0 L -3 5 Z" fill={P.purpleDeep} />
          </g>
        )}
      </g>
      <Scroll x={lx} y={ly} text={s.short} anchor={anchor} />
    </g>
  );
};

export const LabSign: React.FC<{ s: Stop; onPress: Press; selected: boolean }> = ({ s, onPress, selected }) => {
  const press = () => onPress(s);
  return (
    <g
      transform={`translate(${s.x} ${s.y})`}
      className={`sign${selected ? " selected" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={s.title}
      onClick={(e) => {
        e.stopPropagation();
        press();
      }}
      onKeyDown={keyPress(press)}
    >
      <ellipse cx={0} cy={2} rx={16} ry={4} fill="#000" opacity={0.22} />
      <line x1={0} y1={0} x2={0} y2={-46} stroke={P.trunk} strokeWidth={6} strokeLinecap="round" />
      <path d="M -40 -74 L 40 -76 L 42 -44 L -38 -42 Z" fill="#b98550" stroke={P.ink} strokeWidth={2} strokeLinejoin="round" />
      <line x1={-36} y1={-58} x2={38} y2={-60} stroke={P.ink} strokeWidth={1} opacity={0.35} />
      <circle cx={-31} cy={-68} r={2.5} fill="#4a4a4a" />
      <circle cx={33} cy={-69} r={2.5} fill="#4a4a4a" />
      <text x={1} y={-51} textAnchor="middle" fontFamily={SERIF} fontSize={20} fill="#3a2414">
        {s.short}
      </text>
    </g>
  );
};

/** Pin for the test (red) and the exam (gold). */
export const SpecialPin: React.FC<{ s: Stop; onPress: Press; selected: boolean; label: string; icon: string; color: string; ring: string }> = ({
  s,
  onPress,
  selected,
  label,
  icon,
  color,
  ring,
}) => {
  const r = 30;
  const cy = -r * 1.7;
  const press = () => onPress(s);
  return (
    <g transform={`translate(${s.x} ${s.y})`}>
      <g
        className={`pin${selected ? " selected" : ""}`}
        role="button"
        tabIndex={0}
        aria-label={s.title}
        onClick={(e) => {
          e.stopPropagation();
          press();
        }}
        onKeyDown={keyPress(press)}
      >
        <ellipse cx={0} cy={1} rx={14} ry={4} fill="#000" opacity={0.25} />
        <circle cx={0} cy={cy} r={r + 14} className="pin-halo" fill="url(#glowGold)" />
        <path d={pinPath(r)} fill={color} stroke={P.ink} strokeWidth={2.4} />
        <circle cx={0} cy={cy} r={r - 4} fill={P.parchment} stroke={ring} strokeWidth={3} />
        <text x={0} y={cy + 10} textAnchor="middle" fontFamily={SERIF} fontSize={28} fill={color}>
          {icon}
        </text>
      </g>
      <Scroll x={0} y={30} text={label} size={22} />
    </g>
  );
};

export const StartPin: React.FC<{ s: Stop; onPress: Press; selected: boolean }> = ({ s, onPress, selected }) => (
  <SpecialPin s={s} onPress={onPress} selected={selected} label={s.short} icon="⚑" color="#3f7f4f" ring="#3f7f4f" />
);

export const Banner: React.FC<{ x: number; y: number; title: string; note?: string; size?: number; tilt?: number }> = ({ x, y, title, note, size = 36, tilt = 0 }) => {
  const w = textW(title, size, 0.56) + 70;
  const h = size + 26;
  return (
    <g transform={`rotate(${tilt} ${x} ${y})`} pointerEvents="none">
      <path d={`M ${x - w / 2 - 34} ${y - h / 2 + 12} L ${x - w / 2 + 6} ${y - h / 2 + 12} L ${x - w / 2 + 6} ${y + h / 2 + 12} L ${x - w / 2 - 34} ${y + h / 2 + 12} L ${x - w / 2 - 20} ${y + 12} Z`} fill="#d9c08a" stroke={P.ink} strokeWidth={2} strokeLinejoin="round" />
      <path d={`M ${x + w / 2 + 34} ${y - h / 2 + 12} L ${x + w / 2 - 6} ${y - h / 2 + 12} L ${x + w / 2 - 6} ${y + h / 2 + 12} L ${x + w / 2 + 34} ${y + h / 2 + 12} L ${x + w / 2 + 20} ${y + 12} Z`} fill="#d9c08a" stroke={P.ink} strokeWidth={2} strokeLinejoin="round" />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill="#f7ebcc" stroke={P.ink} strokeWidth={2.2} />
      <text x={x} y={y + size * 0.34} textAnchor="middle" fontFamily={SERIF} fontSize={size} fill={P.purpleDeep}>
        {title}
      </text>
      {note && (
        <text x={x} y={y + h / 2 + 30} textAnchor="middle" fontFamily={HAND} fontSize={25} fill={P.ink} stroke="#f7ebcc" strokeWidth={5} paintOrder="stroke">
          {note}
        </text>
      )}
    </g>
  );
};

export const Title: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const x = 1200;
  const w = 1180;
  return (
    <g style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onPress(); }}>
      <path d={`M ${x - w / 2} 70 Q ${x} 52 ${x + w / 2} 70 L ${x + w / 2} 178 Q ${x} 160 ${x - w / 2} 178 Z`} fill="#f7ebcc" stroke={P.ink} strokeWidth={3} />
      <path d={`M ${x - w / 2} 70 q -40 54 0 108 q -26 -8 -30 -54 q 4 -46 30 -54 Z`} fill="#ddc690" stroke={P.ink} strokeWidth={2.4} />
      <path d={`M ${x + w / 2} 70 q 40 54 0 108 q 26 -8 30 -54 q -4 -46 -30 -54 Z`} fill="#ddc690" stroke={P.ink} strokeWidth={2.4} />
      <text x={x} y={140} textAnchor="middle" fontFamily={SERIF} fontSize={60} fill={P.purpleDeep}>
        Декларативне програмування
      </text>
      <rect x={x - 110} y={168} width={220} height={40} rx={6} fill="#ead9ad" stroke={P.ink} strokeWidth={2} />
      <text x={x} y={196} textAnchor="middle" fontFamily={BOOK} fontSize={24} fill={P.ink}>
        Карта курсу
      </text>
      <circle cx={x} cy={52} r={30} fill={P.purpleDeep} stroke={P.gold} strokeWidth={4} />
      <text x={x} y={65} textAnchor="middle" fontFamily={SERIF} fontSize={36} fill={P.gold}>
        λ
      </text>
    </g>
  );
};

export const Compass: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} pointerEvents="none">
    <circle r={66} fill="#f7ebcc" stroke={P.ink} strokeWidth={2.2} opacity={0.92} />
    <circle r={56} fill="none" stroke={P.ink} strokeWidth={1} opacity={0.6} />
    <g className="compass-needle">
      {[0, 90, 180, 270].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <polygon points="0,-58 9,-9 0,0" fill={a === 0 ? P.purple : P.ink} />
          <polygon points="0,-58 -9,-9 0,0" fill={a === 0 ? P.purpleDeep : "#7a6450"} />
        </g>
      ))}
      {[45, 135, 225, 315].map((a) => (
        <polygon key={a} transform={`rotate(${a})`} points="0,-38 5,-5 -5,-5" fill={P.gold} stroke={P.ink} strokeWidth={0.8} />
      ))}
    </g>
    <circle r={6} fill={P.gold} stroke={P.ink} strokeWidth={1.2} />
    <text y={-72} textAnchor="middle" fontFamily={SERIF} fontSize={20} fill={P.ink}>
      Пн
    </text>
  </g>
);

export const Legend: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} pointerEvents="none">
    <rect x={0} y={0} width={290} height={300} rx={10} fill="#f7ebcc" stroke={P.ink} strokeWidth={2.2} opacity={0.95} />
    <text x={145} y={36} textAnchor="middle" fontFamily={SERIF} fontSize={24} fill={P.purpleDeep}>
      Легенда
    </text>
    <g transform="translate(36 84) scale(0.5)">
      <path d={pinPath(27)} fill={P.purple} stroke={P.purpleDeep} strokeWidth={3} />
      <circle cx={0} cy={-46} r={24} fill={P.purpleDeep} stroke={P.gold} strokeWidth={4} />
    </g>
    <text x={66} y={72} fontFamily={BOOK} fontSize={19} fill={P.ink}>
      лекція (тиждень)
    </text>
    <g transform="translate(36 112)">
      <circle r={9} fill={P.gold} stroke={P.ink} strokeWidth={1.4} />
      <path d="M -3 -5 L 5 0 L -3 5 Z" fill={P.purpleDeep} />
    </g>
    <text x={66} y={118} fontFamily={BOOK} fontSize={19} fill={P.ink}>
      є презентація
    </text>
    <g transform="translate(36 166) scale(0.55)">
      <line x1={0} y1={0} x2={0} y2={-46} stroke={P.trunk} strokeWidth={6} />
      <path d="M -40 -74 L 40 -76 L 42 -44 L -38 -42 Z" fill="#b98550" stroke={P.ink} strokeWidth={2.5} />
    </g>
    <text x={66} y={160} fontFamily={BOOK} fontSize={19} fill={P.ink}>
      лабораторна робота
    </text>
    <text x={22} y={204} fontFamily={SERIF} fontSize={26} fill="#9b2c2c">
      ⚔
    </text>
    <text x={66} y={200} fontFamily={BOOK} fontSize={19} fill={P.ink}>
      контрольна, іспит
    </text>
    <path d="M 18 236 q 20 -10 40 0" fill="none" stroke="#8a4b2e" strokeWidth={4} strokeDasharray="8 7" strokeLinecap="round" />
    <text x={66} y={242} fontFamily={BOOK} fontSize={19} fill={P.ink}>
      шлях курсу
    </text>
    <text x={145} y={282} textAnchor="middle" fontFamily={HAND} fontSize={19} fill={P.inkSoft}>
      клацайте по позначках
    </text>
  </g>
);

/** Wax seal with the Lviv Polytechnic emblem and the cartographer's signature. */
export const Cartographer: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} pointerEvents="none">
    <circle r={44} fill="#6e3f8f" stroke="#4a2463" strokeWidth={3} />
    <circle r={36} fill="none" stroke="#9a6bbf" strokeWidth={1.5} />
    <svg x={-30} y={-29} width={60} height={57} viewBox={LPNU_VIEWBOX}>
      {LPNU_PATHS.map((d, i) => (
        <path key={i} d={d} fill="#e9d8f7" />
      ))}
      {LPNU_CIRCLES.map((c, i) => (
        <circle key={`c${i}`} cx={c.cx} cy={c.cy} r={c.r} transform={c.transform} fill="#e9d8f7" />
      ))}
    </svg>
    <text x={60} y={-10} fontFamily={HAND} fontSize={24} fill={P.ink}>
      Картограф: ас. каф. ПЗ
    </text>
    <text x={60} y={20} fontFamily={HAND} fontSize={26} fill={P.ink}>
      Микуляк Андрій, 2026
    </text>
    <text x={60} y={44} fontFamily="JetBrains Mono, monospace" fontSize={13} fill={P.inkSoft}>
      made with Claude Opus 5.5
    </text>
  </g>
);

const cloud = (x: number, y: number, s: number) =>
  `M ${x} ${y} a ${22 * s} ${18 * s} 0 0 1 ${36 * s} ${-14 * s} a ${30 * s} ${26 * s} 0 0 1 ${56 * s} ${-6 * s} a ${24 * s} ${20 * s} 0 0 1 ${40 * s} ${20 * s} a ${16 * s} ${14 * s} 0 0 1 ${-6 * s} ${26 * s} h ${-120 * s} a ${16 * s} ${14 * s} 0 0 1 ${-6 * s} ${-26 * s} Z`;

export const Clouds: React.FC = () => (
  <g pointerEvents="none">
    {[
      [140, 1.3, 120, 0],
      [520, 1.0, 150, -40],
      [980, 1.5, 180, -95],
      [1240, 0.9, 140, -20],
      [760, 1.1, 165, -130],
    ].map(([y, s, dur, delay], i) => (
      <g key={i} className="cloud" style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s` }}>
        <path d={cloud(0, y, s)} fill="#fff" opacity={0.78} stroke={P.ink} strokeOpacity={0.25} strokeWidth={1.4} />
      </g>
    ))}
    {[0, 1].map((i) => (
      <g key={`b${i}`} className="birds" style={{ animationDelay: `${-i * 23}s` }}>
        {[0, 1, 2].map((k) => (
          <path key={k} className="flap" d={`M ${k * 26} ${260 + i * 520 + (k % 2) * 12} q 8 -8 14 0 q 6 -8 14 0`} fill="none" stroke={P.ink} strokeWidth={2} strokeLinecap="round" />
        ))}
      </g>
    ))}
  </g>
);
