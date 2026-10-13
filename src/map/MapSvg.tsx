import React, { useMemo, useRef, useState } from "react";
import { P } from "./palette";
import { H, Pt, sampleCurve, smooth, W } from "./geo";
import { ALL_STOPS, EXAM, LABS, LECTURES, ROUTE, START, Stop, TEST } from "../data/course";
import {
  Bay,
  CastleRock,
  Caves,
  CAVES_POLY,
  CityGround,
  CITY_POLY,
  Defs,
  FOREST_POLY,
  ForestFloor,
  Frame,
  Gorge,
  Land,
  Meadow,
  MEADOW_POLY,
  Mountains,
  Parchment,
  River,
  RIVER,
  useNoise,
  Valley,
} from "./terrain";
import { FractalTree, scatter, Tree, TreeShape } from "./flora";
import { BuildingShape, Castle, Crossroads, Crystal, MonadSign, RuneCircle, Ship, Siege, StoneBridge, Torch, useCity, Windmill, WoodBridge } from "./props";
import { Dragon, Monad, Traveller, WalkingMonad } from "./creatures";
import { Banner, Cartographer, Clouds, Compass, LabSign, LecturePin, Legend, SpecialPin, StartPin, Title } from "./markers";

const VALLEY_POLY: Pt[] = [
  [60, 330], [1180, 330], [1180, 640], [60, 640],
];

const FIELDS: Pt[] = [
  [1400, 1090], [1820, 1100], [1840, 1230], [1700, 1220], [1400, 1200],
];

export const MapSvg: React.FC<{
  selected: string | null;
  onSelect: (s: Stop) => void;
  currentWeek: number | null;
}> = ({ selected, onSelect, currentWeek }) => {
  const noise = useNoise();
  const [riverAwake, setRiverAwake] = useState(false);
  const sleepTimer = useRef(0);
  const wake = () => {
    setRiverAwake(true);
    window.clearTimeout(sleepTimer.current);
    sleepTimer.current = window.setTimeout(() => setRiverAwake(false), 4500);
  };

  const route = useMemo(() => sampleCurve(ROUTE, 18), []);
  const routeD = useMemo(() => smooth(ROUTE), []);
  const spots = useMemo(() => ALL_STOPS.map((s) => [s.x, s.y] as Pt), []);
  const river = useMemo(() => sampleCurve(RIVER, 10), []);

  const keepOut: [number, number, number, number][] = [
    [110, 520, 300, 90],
    [1860, 190, 460, 120],
    [1440, 650, 400, 130],
    [1500, 930, 820, 160],
    [2110, 820, 230, 160],
  ];

  const trees = useMemo(() => {
    const valley = scatter(VALLEY_POLY, 101, 58, { route, routeGap: 60, spots, spotGap: 95, boxes: keepOut }, (r) => (r() < 0.45 ? "pine" : r() < 0.85 ? "round" : "bush"), [0.8, 1.15], 0.42).filter(
      (t) => Math.abs(t.x - 1225) > 70 || t.y < 300,
    );
    const forest = scatter(FOREST_POLY, 202, 34, { route, routeGap: 52, spots, spotGap: 90, boxes: keepOut }, (r) => (r() < 0.82 ? "pine" : "round"), [0.9, 1.35], 0.95);
    const meadow = scatter(MEADOW_POLY, 303, 90, { route, routeGap: 60, spots, spotGap: 110, boxes: keepOut }, (r) => (r() < 0.7 ? "round" : "bush"), [0.85, 1.1], 0.22);
    const fields = scatter(FIELDS, 404, 70, { route, routeGap: 60, spots, spotGap: 120 }, () => "round", [0.8, 1], 0.5);
    return [...valley, ...forest, ...meadow, ...fields].sort((a, b) => a.y - b.y);
  }, [route, spots]);

  const city = useCity(CITY_POLY, route, spots, river);

  const reached = (s: Stop) => currentWeek === null || (s.week ?? 0) <= currentWeek;
  const traveller: Pt = useMemo(() => {
    if (currentWeek === null) {
      return [START.x + 52, START.y + 6];
    }
    const s = LECTURES.find((l) => l.week === Math.min(15, Math.max(1, currentWeek)))!;
    return [s.x - 46, s.y + 8];
  }, [currentWeek]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="map" role="img" aria-label="Карта курсу «Декларативне програмування»">
      <Defs noise={noise} />
      <Parchment />
      <Land />
      <Bay />
      <Valley />
      <Mountains />
      <ForestFloor />
      <Meadow />
      <CityGround />
      <CastleRock />
      <Gorge />
      <Caves />
      <River flowing={riverAwake} onWake={wake} />

      <WoodBridge x={1226} y={492} />

      {trees.map((t: Tree, i) => (
        <TreeShape key={i} t={t} />
      ))}
      <FractalTree x={1590} y={622} size={52} />
      <FractalTree x={2000} y={600} size={46} delay={-1.6} />
      <FractalTree x={1360} y={360} size={40} delay={-0.8} />
      <Windmill x={2245} y={430} />

      <Castle x={170} y={385} s={0.62} />
      <Crossroads x={250} y={600} />

      {[
        [160, 760, 0.9, 0],
        [700, 700, 1.1, -0.6],
        [1010, 1040, 1, -1.3],
        [620, 1110, 0.85, -0.4],
        [160, 960, 1.05, -2],
        [860, 760, 0.75, -1],
      ].map(([x, y, s, d], i) => (
        <Crystal key={i} x={x} y={y} s={s} delay={d} />
      ))}
      {[
        [1040, 820, 0],
        [760, 900, -0.4],
        [470, 930, -0.9],
        [330, 1040, -0.2],
      ].map(([x, y, d], i) => (
        <Torch key={i} x={x} y={y} delay={d} />
      ))}
      <RuneCircle x={330} y={905} />

      {city.map((b, i) => (
        <BuildingShape key={i} b={b} i={i} />
      ))}
      <StoneBridge x0={1200} x1={1330} y={1372} depth={40} />
      <Ship x={1360} y={1545} />

      <Castle x={2075} y={1290} s={1} gate />
      <Siege x={2075} y={1290} />

      <path d={routeD} fill="none" stroke="#fff6dd" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />
      <path d={routeD} fill="none" stroke="#8a4b2e" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="14 12" className="trail" />

      <StoneBridge x0={1120} x1={1385} y={888} depth={90} />
      <path d="M 1120 870 L 1385 870" fill="none" stroke="#8a4b2e" strokeWidth={6} strokeLinecap="round" strokeDasharray="14 12" opacity={0.85} />
      <Dragon x={1225} y={820} onClick={() => onSelect(TEST)} />

      <Monad x={1580} y={1012} r={38} color="#9b74d8" kind="maybe" label="Maybe" seed={3} />
      <Monad x={1765} y={1050} r={34} color="#7e58bd" kind="either" label="Either" seed={9} />
      <Monad x={1960} y={1022} r={40} color="#b08ae6" kind="list" label="[ ]" seed={14} />
      <Monad x={2280} y={745} r={32} color="#6c49ab" kind="state" label="State" seed={21} flip />
      <Monad x={2170} y={1040} r={30} color="#c4a1f2" kind="io" label="IO" seed={27} />
      <Monad x={1140} y={398} r={26} color="#a585df" kind="lazy" label="thunk" seed={33} />
      <WalkingMonad from={[1540, 948]} to={[1900, 958]} color="#8c66cc" seed={41} />
      <MonadSign x={2235} y={890} />

      <Banner x={600} y={222} title="Долина функцій" note="тут усе починається з виразів" />
      <Banner x={2090} y={228} title="Ліс рекурсії" note="де задачі повертаються до себе" size={34} />
      <Banner x={1640} y={690} title="Монадні пагорби" note="тут значення живуть у контексті" size={34} />
      <Banner x={560} y={720} title="Печери логіки" note="істина має багато шляхів" size={34} />
      <Banner x={1010} y={1160} title="Місто потоків і мов" size={34} />
      <text x={1290} y={560} fontFamily="Marck Script, cursive" fontSize={24} fill="#2f5f86" transform="rotate(78 1290 560)" stroke="#e8f6ff" strokeWidth={4} paintOrder="stroke">
        Ріка лінивості
      </text>
      <text x={1312} y={1010} fontFamily="Marck Script, cursive" fontSize={20} fill="#2f5f86" transform="rotate(84 1312 1010)" stroke="#e8f6ff" strokeWidth={4} paintOrder="stroke">
        тече, лише коли на неї дивляться
      </text>

      <StartPin s={START} onPress={onSelect} selected={selected === START.id} />
      {LECTURES.map((s) => (
        <LecturePin key={s.id} s={s} onPress={onSelect} selected={selected === s.id} current={currentWeek === s.week} dim={!reached(s)} />
      ))}
      {LABS.map((s) => (
        <LabSign key={s.id} s={s} onPress={onSelect} selected={selected === s.id} />
      ))}
      <SpecialPin s={TEST} onPress={onSelect} selected={selected === TEST.id} label="Контрольна" icon="⚔" color="#9b2c2c" ring="#9b2c2c" />
      <SpecialPin s={EXAM} onPress={onSelect} selected={selected === EXAM.id} label="Іспит – штурм замку" icon="♛" color="#b07f1e" ring={P.gold} />
      <Traveller x={traveller[0]} y={traveller[1]} />

      <Clouds />
      <Title onPress={() => onSelect(START)} />
      <Compass x={2232} y={1460} />
      <Legend x={56} y={1236} />
      <Cartographer x={420} y={1505} />
      <Frame />
    </svg>
  );
};
