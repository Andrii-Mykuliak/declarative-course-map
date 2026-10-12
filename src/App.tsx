import React, { useMemo } from "react";
import { COURSE_VNS, EXAM, LABS, LECTURES, SEMESTER_START, Stop, TEST } from "./data/course";
import { LPNU_CIRCLES, LPNU_PATHS, LPNU_VIEWBOX } from "./data/lpnuLogo";
import { Emblem, EmblemKind, Sky } from "./Decor";

type Section = { title: string; note?: string; emblem: EmblemKind; ids: string[] };

const SECTIONS: Section[] = [
  { title: "Функції, типи, лінивість", emblem: "lambda", ids: ["w1", "w2", "lab1", "w3", "w4", "lab2", "w5"] },
  { title: "Рекурсія та потоки даних", emblem: "ouroboros", ids: ["w6", "lab3", "w7"] },
  { title: "Функтори, монади, стан", note: "тут живуть монади", emblem: "nebula", ids: ["w8", "lab4", "w9", "test"] },
  { title: "Логічне програмування", emblem: "scales", ids: ["w10", "w11", "lab5"] },
  { title: "Сучасна декларативність", emblem: "river", ids: ["w12", "w13", "lab6", "w14", "w15"] },
  { title: "Підсумковий контроль", emblem: "fortress", ids: ["exam"] },
];

const BY_ID: Record<string, Stop> = Object.fromEntries([...LECTURES, ...LABS, TEST, EXAM].map((s) => [s.id, s]));

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
  return week >= 1 && week <= 16 ? week : null;
};

const Out: React.FC = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
);

const Links: React.FC<{ s: Stop }> = ({ s }) =>
  s.deck || s.vns ? (
    <div className="links">
      {s.deck && (
        <a className="link" href={s.deck} target="_blank" rel="noopener noreferrer">
          Презентація <Out />
        </a>
      )}
      {s.vns && (
        <a className="link vns" href={s.vns} target="_blank" rel="noopener noreferrer">
          ВНС <Out />
        </a>
      )}
    </div>
  ) : null;

const labName = (s: Stop) => s.title.match(/«.*»/)?.[0] ?? s.title;

const Row: React.FC<{ s: Stop; current: boolean }> = ({ s, current }) => {
  const mark = s.kind === "lecture" ? String(s.week).padStart(2, "0") : s.kind === "lab" ? s.short : s.kind === "test" ? "✦" : "★";
  const title = s.kind === "lab" ? labName(s) : s.title;
  const meta =
    s.kind === "lecture"
      ? s.desc
      : s.kind === "lab"
        ? `${s.weeks}, ${s.points}`
        : s.kind === "test"
          ? `Тиждень ${s.week}, ${s.points}. ${s.desc}`
          : `${s.points}. ${s.desc}`;
  return (
    <li className={`row ${s.kind}${current ? " current" : ""}`}>
      <span className="mark" aria-hidden>
        {mark}
      </span>
      <div className="body">
        <h3>
          {s.kind === "lab" && <span className="sr">{s.short} </span>}
          {s.kind === "lecture" && <span className="sr">Тиждень {s.week}. </span>}
          {title}
          {current && <span className="now">цього тижня</span>}
        </h3>
        <p>{meta}</p>
      </div>
      <Links s={s} />
    </li>
  );
};

export const App: React.FC = () => {
  const week = useMemo(() => currentWeekOf(SEMESTER_START), []);
  return (
    <>
      <Sky />
      <div className="page">
        <header>
          <div className="ornament" aria-hidden>
            <span />
            ✦
            <span />
          </div>
          <h1>Декларативне програмування</h1>
          <p className="sub">Карта курсу, 2026</p>
          <p className="facts">15 лекцій, 6 лабораторних робіт, контрольна робота та іспит</p>
          {COURSE_VNS && (
            <a className="link course" href={COURSE_VNS} target="_blank" rel="noopener noreferrer">
              Курс у ВНС <Out />
            </a>
          )}
        </header>

        <main>
          {SECTIONS.map((sec) => (
            <section key={sec.title}>
              <h2>
                <Emblem kind={sec.emblem} />
                <span>{sec.title}</span>
                {sec.note && <em>{sec.note}</em>}
              </h2>
              <ol>
                {sec.ids.map((id) => {
                  const s = BY_ID[id];
                  return <Row key={id} s={s} current={week !== null && s.kind === "lecture" && s.week === week} />;
                })}
              </ol>
            </section>
          ))}
        </main>

        <footer>
          <svg className="seal" viewBox={LPNU_VIEWBOX} aria-hidden>
            {LPNU_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
            {LPNU_CIRCLES.map((c, i) => (
              <circle key={`c${i}`} cx={c.cx} cy={c.cy} r={c.r} transform={c.transform} />
            ))}
          </svg>
          <div>
            <p>Уклав ас. каф. ПЗ Микуляк Андрій, 2026</p>
            <p className="credit">made with Claude Opus 5.5</p>
          </div>
        </footer>
      </div>
    </>
  );
};
