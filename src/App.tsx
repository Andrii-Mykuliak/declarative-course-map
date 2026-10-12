import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { MapSvg } from "./map/MapSvg";
import { H, W } from "./map/geo";
import { EXAM, LABS, LECTURES, SEMESTER_START, START, Stop, TEST } from "./data/course";

const Icon: React.FC<{ d: string }> = ({ d }) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const I = {
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  fit: "M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6zM9 3v15M15 6v15",
  full: "M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  close: "M18 6 6 18M6 6l12 12",
  out: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
};

/** Week of the semester for today, or null when the start date is not configured. */
const currentWeekOf = (start: string): number | null => {
  if (!start) {
    return null;
  }
  const t0 = new Date(`${start}T00:00:00`).getTime();
  if (Number.isNaN(t0)) {
    return null;
  }
  const week = Math.floor((Date.now() - t0) / (7 * 24 * 3600 * 1000)) + 1;
  return week < 1 ? null : Math.min(16, week);
};

const KIND_LABEL: Record<Stop["kind"], string> = {
  start: "Старт",
  lecture: "Лекція",
  lab: "Лабораторна",
  test: "Контрольна",
  exam: "Іспит",
};

/** Stops in travel order, grouped by region, for the route list. */
const ORDER: { region: string; ids: string[] }[] = [
  { region: "Початок подорожі", ids: ["start", "w1"] },
  { region: "Долина функцій", ids: ["w2", "lab1", "w3", "w4", "lab2", "w5"] },
  { region: "Ліс рекурсії", ids: ["w6", "lab3", "w7"] },
  { region: "Монадні пагорби", ids: ["w8", "lab4", "w9"] },
  { region: "Міст дракона", ids: ["test"] },
  { region: "Печери логіки", ids: ["w10", "w11", "lab5"] },
  { region: "Місто потоків і мов", ids: ["w12", "w13", "lab6", "w14", "w15"] },
  { region: "Замок іспиту", ids: ["exam"] },
];

const BY_ID: Record<string, Stop> = Object.fromEntries([START, ...LECTURES, ...LABS, TEST, EXAM].map((s) => [s.id, s]));

const Panel: React.FC<{ s: Stop; onClose: () => void }> = ({ s, onClose }) => {
  const when = s.kind === "lecture" || s.kind === "test" ? `Тиждень ${s.week}` : s.weeks;
  return (
    <aside className="panel" role="dialog" aria-label={s.title}>
      <button className="close" onClick={onClose} aria-label="Закрити">
        <Icon d={I.close} />
      </button>
      <span className={`kind ${s.kind}`}>{KIND_LABEL[s.kind]}</span>
      <h2>{s.title}</h2>
      {(when || s.points) && <p className="when">{[when, s.points].filter(Boolean).join(", ")}</p>}
      <p>{s.desc}</p>
      <div className="links">
        {s.vns ? (
          <a className="link" href={s.vns} target="_blank" rel="noopener noreferrer">
            Відкрити у ВНС <Icon d={I.out} />
          </a>
        ) : (
          <span className="link off" title="Посилання на ВНС ще не додано">
            ВНС: посилання згодом
          </span>
        )}
        {s.deck && (
          <a className="link alt" href={s.deck} target="_blank" rel="noopener noreferrer">
            Презентація <Icon d={I.out} />
          </a>
        )}
      </div>
    </aside>
  );
};

const RouteList: React.FC<{ onPick: (s: Stop) => void; onClose: () => void }> = ({ onPick, onClose }) => (
  <nav className="route" aria-label="Маршрут курсу">
    <button className="close" onClick={onClose} aria-label="Закрити">
      <Icon d={I.close} />
    </button>
    <h2>Маршрут курсу</h2>
    {ORDER.map((g) => (
      <section key={g.region}>
        <div className="region">{g.region}</div>
        <ol>
          {g.ids.map((id) => {
            const s = BY_ID[id];
            const mark = s.kind === "lecture" ? s.week : s.kind === "lab" ? s.short.replace("ЛР ", "") : s.kind === "test" ? "⚔" : s.kind === "exam" ? "♛" : "⚑";
            return (
              <li key={id}>
                <button onClick={() => onPick(s)}>
                  <span className={`dot ${s.kind}`}>{mark}</span>
                  <span>{s.kind === "lecture" ? s.title : s.kind === "lab" ? s.title.replace(/^Лабораторна робота № \d+ /, `${s.short}: `) : s.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>
    ))}
  </nav>
);

export const App: React.FC = () => {
  const [selected, setSelected] = useState<Stop | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const zoom = useRef<ReactZoomPanPinchRef>(null);
  const down = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);
  const currentWeek = useMemo(() => currentWeekOf(SEMESTER_START), []);

  const fit = useMemo(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    return { contain: Math.min(vw / W, vh / H), cover: Math.max(vw / W, vh / H), portrait: vh > vw * 1.1 };
  }, []);
  const touch = useMemo(() => window.matchMedia("(pointer: coarse)").matches, []);

  const focusOn = useCallback((s: Stop) => {
    const z = zoom.current;
    if (!z) {
      return;
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.max(z.state.scale, Math.min(1.1, Math.max(vw, vh) / 1500));
    const offsetX = vw > 640 ? -Math.min(220, vw * 0.18) : 0;
    const offsetY = vw > 640 ? 0 : -vh * 0.22;
    z.setTransform(vw / 2 + offsetX - s.x * scale, vh / 2 + offsetY - (s.y - 40) * scale, scale, 600, "easeOut");
  }, []);

  const pick = useCallback(
    (s: Stop) => {
      if (moved.current) {
        return;
      }
      setSelected(s);
    },
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
        setListOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (document.fullscreenEnabled) {
      document.documentElement.requestFullscreen().catch(() => window.open(location.href, "_blank", "noopener"));
    } else {
      window.open(location.href, "_blank", "noopener");
    }
  };

  return (
    <div
      className="stage"
      onPointerDownCapture={(e) => {
        down.current = { x: e.clientX, y: e.clientY };
        moved.current = false;
      }}
      onPointerMoveCapture={(e) => {
        if (down.current && Math.hypot(e.clientX - down.current.x, e.clientY - down.current.y) > 7) {
          moved.current = true;
        }
      }}
      onPointerUpCapture={() => {
        down.current = null;
      }}
    >
      <TransformWrapper
        ref={zoom}
        initialScale={fit.portrait ? fit.cover : fit.contain}
        initialPositionX={fit.portrait ? -(START.x - 70) * fit.cover : undefined}
        initialPositionY={fit.portrait ? 0 : undefined}
        minScale={fit.contain * 0.9}
        maxScale={3.5}
        centerOnInit={!fit.portrait}
        limitToBounds
        wheel={{ step: 0.12 }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
          <div onClick={() => !moved.current && setSelected(null)}>
            <MapSvg selected={selected?.id ?? null} onSelect={pick} currentWeek={currentWeek} />
          </div>
        </TransformComponent>
      </TransformWrapper>

      <div className="controls">
        <button className="btn" onClick={() => setListOpen((o) => !o)} aria-label="Маршрут курсу" title="Маршрут курсу">
          <Icon d={I.list} />
        </button>
        {!touch && (
          <>
            <button className="btn" onClick={() => zoom.current?.zoomIn(0.3)} aria-label="Наблизити" title="Наблизити">
              <Icon d={I.plus} />
            </button>
            <button className="btn" onClick={() => zoom.current?.zoomOut(0.3)} aria-label="Віддалити" title="Віддалити">
              <Icon d={I.minus} />
            </button>
          </>
        )}
        <button className="btn" onClick={() => zoom.current?.centerView(fit.contain, 500)} aria-label="Уся карта" title="Уся карта">
          <Icon d={I.fit} />
        </button>
        <button className="btn" onClick={toggleFullscreen} aria-label="На весь екран" title="На весь екран">
          <Icon d={I.full} />
        </button>
      </div>

      {listOpen && (
        <RouteList
          onClose={() => setListOpen(false)}
          onPick={(s) => {
            setSelected(s);
            focusOn(s);
            if (window.innerWidth < 900) {
              setListOpen(false);
            }
          }}
        />
      )}
      {selected && <Panel s={selected} onClose={() => setSelected(null)} />}
      <div className="hint">{touch ? "Тягніть карту, зводьте пальці, торкайтеся позначок" : "Тягніть карту, коліщатком наближайте, клацайте по позначках"}</div>
    </div>
  );
};
