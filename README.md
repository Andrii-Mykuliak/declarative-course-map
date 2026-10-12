# Карта курсу «Декларативне програмування»

An interactive star chart of the course, drawn like an old celestial atlas: every lecture is a star,
each module is a constellation (Лямбда, Уроборос, Туманність монад, Дракон, Терези, Ерідан, Фортеця),
labs are planets, the test is the eye of the Dragon and the exam is the star at the gate of the
Fortress. Clicking a star opens a card with the topic, the VNS link (new tab) and, where one exists,
the motion deck.

Live: https://andrii-mykuliak.github.io/declarative-course-map/

## Run

```bash
npm install
npm run dev
```

## Editing the course

Everything course-specific lives in `src/data/course.ts`:

- `vns` on any stop: paste the VNS (Moodle) link; an empty value shows a disabled button.
- `COURSE_VNS`: the course page, used by the start of the journey.
- `SEMESTER_START`: the first Monday of the semester (`"2026-09-01"`). When set, the star of the
  current week pulses.
- `x`, `y`, `labelSide`: where a star sits on the 2400×1600 chart and on which side its label goes.
- `ROUTE`: the path in travel order; the extra points only shape the curve.

Topics, lab titles, weeks and points come from the 2026 work programme.

## Things to click

- the Dragon breathes λ-fire,
- the monads in the nebula answer with a value (`Just 5`, `Right 42`, `[1, 2, 3]`…),
- the lazy `thunk` only lights up when you look at it.
