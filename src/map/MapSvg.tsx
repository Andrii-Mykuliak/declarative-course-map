import React, { useMemo } from "react";
import { H, Pt, smooth, W } from "./geo";
import { EXAM, LABS, LECTURES, ROUTE, START, Stop, TEST } from "../data/course";
import { Astrolabe, Frame, Legend, S, Signature, Sky, SkyDefs, Title } from "./sky";
import { Dragon, Eridanus, Fortress, Lambda, Libra, MonadRibbon, Nebula, Ouroboros, Polaris, Puff } from "./figures";
import { LabPlanet, LectureStar, SpecialStar } from "./stars";

export const MapSvg: React.FC<{
  selected: string | null;
  onSelect: (s: Stop) => void;
  currentWeek: number | null;
}> = ({ selected, onSelect, currentWeek }) => {
  const routeD = useMemo(() => smooth(ROUTE), []);
  const lambda = useMemo(() => LECTURES.slice(0, 5).map((l) => [l.x, l.y] as Pt), []);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="map" role="img" aria-label="Зоряна карта курсу «Декларативне програмування»">
      <SkyDefs />
      <Sky />

      <Lambda pts={lambda} />
      <Ouroboros cx={1480} cy={430} r={165} />
      <Nebula />
      <Libra />
      <Eridanus />

      <path d={routeD} fill="none" stroke={S.gold} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={0.08} />
      <path d={routeD} fill="none" stroke={S.goldHi} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 10" className="trail" />

      <Dragon onClick={() => onSelect(TEST)} />
      <Fortress onClick={() => onSelect(EXAM)} />
      <MonadRibbon x={2120} y={1010} />

      <Puff x={2070} y={560} r={34} hue="#9b7bff" kind="maybe" label="Maybe" seed={3} />
      <Puff x={2045} y={905} r={30} hue="#c27bff" kind="either" label="Either" seed={8} />
      <Puff x={2280} y={700} r={28} hue="#7b9bff" kind="io" label="IO" seed={13} />
      <Puff x={2250} y={880} r={30} hue="#b48cff" kind="state" label="State" seed={17} />
      <Puff x={1835} y={965} r={32} hue="#a77bff" kind="list" label="[ ]" seed={23} />
      <Puff x={1050} y={845} r={22} hue="#8f7bdd" kind="lazy" label="thunk" seed={29} />

      <Polaris />
      <SpecialStar s={START} onPress={onSelect} selected={selected === START.id} tone="ivory" size={1.15} />
      {LECTURES.map((s) => (
        <LectureStar key={s.id} s={s} onPress={onSelect} selected={selected === s.id} current={currentWeek === s.week} />
      ))}
      {LABS.map((s, i) => (
        <LabPlanet key={s.id} s={s} onPress={onSelect} selected={selected === s.id} teal={i % 2 === 1} />
      ))}
      <SpecialStar s={TEST} onPress={onSelect} selected={selected === TEST.id} tone="ember" size={0.62} />
      <SpecialStar s={EXAM} onPress={onSelect} selected={selected === EXAM.id} tone="gold" size={1.1} />

      <Title />
      <Astrolabe x={2140} y={185} />
      <Legend x={56} y={1236} />
      <Signature x={480} y={1528} />
      <Frame />
    </svg>
  );
};
