# Карта курсу «Декларативне програмування»

A plain list of the course on a quiet starry background: modules as sections, the 15 lectures in week
order with the labs, the test and the exam in between. Each row links to the VNS page (new tab) and,
where one exists, to the motion deck of the lecture.

Live: https://andrii-mykuliak.github.io/declarative-course-map/

## Run

```bash
npm install
npm run dev
```

## Editing the course

Everything course-specific lives in `src/data/course.ts`:

- `vns` on any lecture, lab, the test or the exam: paste the VNS (Moodle) link; the ВНС button
  appears only once a link is set.
- `deck`: the motion deck of a lecture.
- `COURSE_VNS`: the course page; when set, a «Курс у ВНС» button appears under the title.
- `SEMESTER_START`: the first Monday of the semester (`"2026-09-01"`); when set, the current week is
  highlighted.

The grouping into sections and the order of rows are in `SECTIONS` in `src/App.tsx`.
Topics, lab titles, weeks and points come from the 2026 work programme.
