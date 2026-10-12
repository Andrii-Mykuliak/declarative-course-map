# Карта курсу «Декларативне програмування»

An interactive fantasy map of the course: every lecture is a stop on the path, labs are signposts,
the test is a dragon guarding the bridge, the exam is the siege of the castle. Clicking a stop opens
a scroll with the topic, the VNS link (new tab) and, where one exists, the motion deck.

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
- `SEMESTER_START`: the first Monday of the semester (`"2026-09-01"`). When set, the traveller with
  the λ-staff stands on the current week and that week's pin pulses; when empty, the traveller waits at the start.
- `x`, `y`, `labelSide`: where a stop sits on the 2400×1600 map and on which side its label goes.
- `ROUTE`: the path in travel order; the extra points only shape the curve.

Topics, lab titles, weeks and points come from the 2026 work programme.

## Things to click

- the dragon breathes λ-fire, the monads talk, the lazy river flows only while you look at it,
- the recursive trees in the forest grow one more level of recursion per click,
- the rune circle in the caves asks Prolog a question, the signboard creaks.
