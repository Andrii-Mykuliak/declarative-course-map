// Course structure from «Декларативне програмування_робоча програма_2026.docx».
// Paste VNS links into `vns`; an empty value shows a disabled button.

export type StopKind = "start" | "lecture" | "lab" | "test" | "exam";

export type Stop = {
  id: string;
  kind: StopKind;
  week?: number;
  weeks?: string;
  short: string;
  title: string;
  desc: string;
  points?: string;
  vns?: string;
  deck?: string;
  x: number;
  y: number;
  labelSide?: "left" | "right" | "below" | "above";
};

const DECK = (repo: string) => `https://andrii-mykuliak.github.io/${repo}/`;

/** VNS course page; leave empty until the link is known. */
export const COURSE_VNS = "";

/**
 * First Monday of the semester (YYYY-MM-DD). When set, the traveller stands on the current week
 * and the lands ahead are under a light mist; when empty, the traveller waits at the start.
 */
export const SEMESTER_START = "";

export const LECTURES: Stop[] = [
  {
    id: "w1",
    kind: "lecture",
    week: 1,
    short: "Парадигми",
    title: "Парадигми програмування. Декларативна парадигма",
    desc: "Імперативний і декларативний підходи, основні види декларативного програмування, чисті функції та прозорість посилань.",
    x: 360,
    y: 330,
    labelSide: "right",
  },
  {
    id: "w2",
    kind: "lecture",
    week: 2,
    short: "Основи ФП",
    title: "Основи функційного програмування",
    desc: "Функції як об’єкти першого класу, чисті та анонімні функції, замикання, каррування і часткове застосування.",
    deck: DECK("haskell-functions-deck"),
    x: 500,
    y: 430,
    labelSide: "right",
  },
  {
    id: "w3",
    kind: "lecture",
    week: 3,
    short: "Лямбда-числення",
    title: "Лямбда-числення та обчислювальні моделі",
    desc: "Абстракція та аплікація, вільні та зв’язані змінні, α-, β- та η-перетворення, теза Черча–Тюрінга і межі обчислюваності.",
    deck: DECK("haskell-lambda-deck"),
    x: 640,
    y: 530,
    labelSide: "right",
  },
  {
    id: "w4",
    kind: "lecture",
    week: 4,
    short: "Типи Haskell",
    title: "Система типів Haskell",
    desc: "Базові, складені та параметризовані типи, алгебраїчні типи даних, зіставлення зі зразком, поліморфізм і виведення типів.",
    deck: DECK("haskell-types-deck"),
    x: 780,
    y: 630,
    labelSide: "right",
  },
  {
    id: "w5",
    kind: "lecture",
    week: 5,
    short: "Абстракції і лінивість",
    title: "Функційні абстракції та ліниві обчислення",
    desc: "Функції вищого порядку, типові операції над колекціями, композиція функцій, лінива модель обчислень.",
    deck: DECK("haskell-laziness-deck"),
    x: 920,
    y: 730,
    labelSide: "right",
  },
  {
    id: "w6",
    kind: "lecture",
    week: 6,
    short: "Рекурсія",
    title: "Рекурсія та структурна індукція",
    desc: "Рекурсивні функції та структури даних, хвостова і взаємна рекурсія, нескінченні структури, структурна індукція.",
    deck: DECK("haskell-recursion-deck"),
    x: 1325,
    y: 374,
    labelSide: "left",
  },
  {
    id: "w7",
    kind: "lecture",
    week: 7,
    short: "Потоки даних",
    title: "Потоки даних і композиція функційних програм",
    desc: "Обчислення як послідовність перетворень даних, згортки, функційні конвеєри та структура функційних програм.",
    x: 1635,
    y: 374,
    labelSide: "right",
  },
  {
    id: "w8",
    kind: "lecture",
    week: 8,
    short: "Функтори і монади",
    title: "Класи типів, функтори та монади",
    desc: "Класи типів, функтори та обчислення в контексті, монади та їхні закони, Maybe, Either, IO і State, do-нотація.",
    deck: DECK("haskell-monads-deck"),
    x: 1870,
    y: 600,
    labelSide: "left",
  },
  {
    id: "w9",
    kind: "lecture",
    week: 9,
    short: "Стан без мутації",
    title: "Стан без мутації",
    desc: "Явне передавання і перетворення стану, стан разом із результатом обчислення, абстракція State.",
    x: 2120,
    y: 760,
    labelSide: "right",
  },
  {
    id: "w10",
    kind: "lecture",
    week: 10,
    short: "Логічне програмування",
    title: "Основні принципи логічного програмування",
    desc: "Факти, правила і запити, уніфікація і резолюція, зворотний пошук у Prolog.",
    x: 960,
    y: 1050,
    labelSide: "below",
  },
  {
    id: "w11",
    kind: "lecture",
    week: 11,
    short: "Пошук у Prolog",
    title: "Пошук і керування виконанням у логічному програмуванні",
    desc: "Дерево пошуку, порядок правил і цілей, відсікання, заперечення як невдача, запобігання зацикленню.",
    x: 560,
    y: 1050,
    labelSide: "below",
  },
  {
    id: "w12",
    kind: "lecture",
    week: 12,
    short: "Реактивне програмування",
    title: "Реактивне програмування",
    desc: "Асинхронні події, реактивні потоки і спостережувані значення, перетворення, об’єднання та фільтрація потоків.",
    x: 560,
    y: 1300,
    labelSide: "right",
  },
  {
    id: "w13",
    kind: "lecture",
    week: 13,
    short: "Метапрограмування",
    title: "Метапрограмування",
    desc: "Програма як дані, абстрактні синтаксичні дерева, рефлексія, макроси та генерація коду.",
    x: 880,
    y: 1420,
    labelSide: "below",
  },
  {
    id: "w14",
    kind: "lecture",
    week: 14,
    short: "Предметні мови",
    title: "Предметно-орієнтовані мови",
    desc: "Вбудовані та зовнішні DSL, формальні граматики, синтаксичний аналіз і комбінатори синтаксичних аналізаторів.",
    x: 1220,
    y: 1330,
    labelSide: "above",
  },
  {
    id: "w15",
    kind: "lecture",
    week: 15,
    short: "Декларативність сьогодні",
    title: "Декларативність у сучасному програмуванні",
    desc: "Мультипарадигмові мови, декларативні інтерфейси, запити та конфігурації: React, SQL і Terraform.",
    x: 1560,
    y: 1440,
    labelSide: "below",
  },
];

export const LABS: Stop[] = [
  {
    id: "lab1",
    kind: "lab",
    weeks: "виконання – тиждень 2, здача – тиждень 3",
    short: "ЛР 1",
    title: "Лабораторна робота № 1 «Функції як об’єкти першого класу»",
    desc: "Перша робота мовою Haskell: функції як значення, аргументи та результати.",
    points: "4 бали",
    x: 350,
    y: 545,
  },
  {
    id: "lab2",
    kind: "lab",
    weeks: "виконання – тиждень 4, здача – тиждень 5",
    short: "ЛР 2",
    title: "Лабораторна робота № 2 «Система типів функційних мов»",
    desc: "Алгебраїчні типи даних, зіставлення зі зразком і поліморфізм.",
    points: "4 бали",
    x: 1010,
    y: 560,
  },
  {
    id: "lab3",
    kind: "lab",
    weeks: "виконання – тиждень 6, здача – тиждень 7",
    short: "ЛР 3",
    title: "Лабораторна робота № 3 «Рекурсія та функційні абстракції»",
    desc: "Рекурсивні функції та структури даних, функції вищого порядку.",
    points: "5 балів",
    x: 1480,
    y: 440,
  },
  {
    id: "lab4",
    kind: "lab",
    weeks: "виконання – тижні 8–9, здача – тиждень 10",
    short: "ЛР 4",
    title: "Лабораторна робота № 4 «Функтори та монади в Haskell»",
    desc: "Власні екземпляри Functor, Applicative і Monad та обчислення в контексті.",
    points: "6 балів",
    x: 2230,
    y: 610,
  },
  {
    id: "lab5",
    kind: "lab",
    weeks: "виконання – тиждень 11, здача – тиждень 12",
    short: "ЛР 5",
    title: "Лабораторна робота № 5 «Логічне програмування»",
    desc: "Факти, правила і запити мовою Prolog.",
    points: "5 балів",
    x: 380,
    y: 1170,
  },
  {
    id: "lab6",
    kind: "lab",
    weeks: "виконання – тиждень 13, здача – тиждень 14",
    short: "ЛР 6",
    title: "Лабораторна робота № 6 «Реактивне програмування»",
    desc: "Реактивні потоки із застосуванням бібліотек реактивного програмування.",
    points: "6 балів",
    x: 1050,
    y: 1515,
  },
];

export const START: Stop = {
  id: "start",
  kind: "start",
  short: "Початок подорожі",
  title: "Початок подорожі",
  desc: "Тут починається курс «Декларативне програмування»: 15 лекцій, 6 лабораторних, контрольна робота та іспит.",
  vns: COURSE_VNS,
  x: 230,
  y: 250,
};

export const TEST: Stop = {
  id: "test",
  kind: "test",
  week: 9,
  short: "Контрольна",
  title: "Контрольна робота",
  desc: "Сузір’я Дракона стереже перехід від функційного програмування до логічного. Контрольна проводиться на лекції 9 тижня і охоплює функційне програмування.",
  points: "15 балів",
  x: 1662,
  y: 848,
};

export const EXAM: Stop = {
  id: "exam",
  kind: "exam",
  short: "Іспит",
  title: "Іспит – штурм фортеці",
  desc: "Письмова частина (тест) та усна частина (індивідуальне опитування). Допуск – шість захищених лабораторних робіт.",
  points: "50 + 5 балів",
  x: 2050,
  y: 1385,
};

export const ALL_STOPS: Stop[] = [START, ...LECTURES, TEST, EXAM, ...LABS];

/** The path in travel order; extra points only shape the curve. */
export const ROUTE: [number, number][] = [
  [START.x, START.y],
  ...LECTURES.slice(0, 5).map((l) => [l.x, l.y] as [number, number]),
  [1120, 560],
  [LECTURES[5].x, LECTURES[5].y],
  [1405, 284],
  [1480, 265],
  [1555, 284],
  [LECTURES[6].x, LECTURES[6].y],
  [1760, 470],
  [LECTURES[7].x, LECTURES[7].y],
  [2000, 690],
  [LECTURES[8].x, LECTURES[8].y],
  [1900, 830],
  [TEST.x, TEST.y],
  [1540, 935],
  [1400, 975],
  [1290, 940],
  [1180, 1060],
  [LECTURES[9].x, LECTURES[9].y],
  [760, 1030],
  [LECTURES[10].x, LECTURES[10].y],
  [430, 1185],
  [LECTURES[11].x, LECTURES[11].y],
  [LECTURES[12].x, LECTURES[12].y],
  [LECTURES[13].x, LECTURES[13].y],
  [LECTURES[14].x, LECTURES[14].y],
  [1820, 1430],
  [EXAM.x, EXAM.y],
];
