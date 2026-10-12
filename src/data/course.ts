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
    x: 365,
    y: 520,
    labelSide: "above",
  },
  {
    id: "w2",
    kind: "lecture",
    week: 2,
    short: "Основи ФП",
    title: "Основи функційного програмування",
    desc: "Функції як об’єкти першого класу, чисті та анонімні функції, замикання, каррування і часткове застосування.",
    deck: DECK("haskell-functions-deck"),
    x: 545,
    y: 420,
    labelSide: "above",
  },
  {
    id: "w3",
    kind: "lecture",
    week: 3,
    short: "Лямбда-числення",
    title: "Лямбда-числення та обчислювальні моделі",
    desc: "Абстракція та аплікація, вільні та зв’язані змінні, α-, β- та η-перетворення, теза Черча–Тюрінга і межі обчислюваності.",
    deck: DECK("haskell-lambda-deck"),
    x: 725,
    y: 530,
    labelSide: "below",
  },
  {
    id: "w4",
    kind: "lecture",
    week: 4,
    short: "Типи Haskell",
    title: "Система типів Haskell",
    desc: "Базові, складені та параметризовані типи, алгебраїчні типи даних, зіставлення зі зразком, поліморфізм і виведення типів.",
    deck: DECK("haskell-types-deck"),
    x: 905,
    y: 420,
    labelSide: "above",
  },
  {
    id: "w5",
    kind: "lecture",
    week: 5,
    short: "Абстракції і лінивість",
    title: "Функційні абстракції та ліниві обчислення",
    desc: "Функції вищого порядку, типові операції над колекціями, композиція функцій, лінива модель обчислень.",
    deck: DECK("haskell-laziness-deck"),
    x: 1075,
    y: 530,
    labelSide: "below",
  },
  {
    id: "w6",
    kind: "lecture",
    week: 6,
    short: "Рекурсія",
    title: "Рекурсія та структурна індукція",
    desc: "Рекурсивні функції та структури даних, хвостова і взаємна рекурсія, нескінченні структури, структурна індукція.",
    deck: DECK("haskell-recursion-deck"),
    x: 1460,
    y: 450,
    labelSide: "above",
  },
  {
    id: "w7",
    kind: "lecture",
    week: 7,
    short: "Потоки даних",
    title: "Потоки даних і композиція функційних програм",
    desc: "Обчислення як послідовність перетворень даних, згортки, функційні конвеєри та структура функційних програм.",
    x: 1790,
    y: 390,
    labelSide: "above",
  },
  {
    id: "w8",
    kind: "lecture",
    week: 8,
    short: "Функтори і монади",
    title: "Класи типів, функтори та монади",
    desc: "Класи типів, функтори та обчислення в контексті, монади та їхні закони, Maybe, Either, IO і State, do-нотація.",
    deck: DECK("haskell-monads-deck"),
    x: 2100,
    y: 760,
    labelSide: "above",
  },
  {
    id: "w9",
    kind: "lecture",
    week: 9,
    short: "Стан без мутації",
    title: "Стан без мутації",
    desc: "Явне передавання і перетворення стану, стан разом із результатом обчислення, абстракція State.",
    x: 1720,
    y: 880,
    labelSide: "left",
  },
  {
    id: "w10",
    kind: "lecture",
    week: 10,
    short: "Логічне програмування",
    title: "Основні принципи логічного програмування",
    desc: "Факти, правила і запити, уніфікація і резолюція, зворотний пошук у Prolog.",
    x: 905,
    y: 870,
    labelSide: "above",
  },
  {
    id: "w11",
    kind: "lecture",
    week: 11,
    short: "Пошук у Prolog",
    title: "Пошук і керування виконанням у логічному програмуванні",
    desc: "Дерево пошуку, порядок правил і цілей, відсікання, заперечення як невдача, запобігання зацикленню.",
    x: 560,
    y: 975,
    labelSide: "above",
  },
  {
    id: "w12",
    kind: "lecture",
    week: 12,
    short: "Реактивне програмування",
    title: "Реактивне програмування",
    desc: "Асинхронні події, реактивні потоки і спостережувані значення, перетворення, об’єднання та фільтрація потоків.",
    x: 560,
    y: 1330,
    labelSide: "above",
  },
  {
    id: "w13",
    kind: "lecture",
    week: 13,
    short: "Метапрограмування",
    title: "Метапрограмування",
    desc: "Програма як дані, абстрактні синтаксичні дерева, рефлексія, макроси та генерація коду.",
    x: 860,
    y: 1430,
    labelSide: "below",
  },
  {
    id: "w14",
    kind: "lecture",
    week: 14,
    short: "Предметні мови",
    title: "Предметно-орієнтовані мови",
    desc: "Вбудовані та зовнішні DSL, формальні граматики, синтаксичний аналіз і комбінатори синтаксичних аналізаторів.",
    x: 1150,
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
    x: 1510,
    y: 1430,
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
    x: 590,
    y: 630,
  },
  {
    id: "lab2",
    kind: "lab",
    weeks: "виконання – тиждень 4, здача – тиждень 5",
    short: "ЛР 2",
    title: "Лабораторна робота № 2 «Система типів функційних мов»",
    desc: "Алгебраїчні типи даних, зіставлення зі зразком і поліморфізм.",
    points: "4 бали",
    x: 905,
    y: 630,
  },
  {
    id: "lab3",
    kind: "lab",
    weeks: "виконання – тиждень 6, здача – тиждень 7",
    short: "ЛР 3",
    title: "Лабораторна робота № 3 «Рекурсія та функційні абстракції»",
    desc: "Рекурсивні функції та структури даних, функції вищого порядку.",
    points: "5 балів",
    x: 1625,
    y: 500,
  },
  {
    id: "lab4",
    kind: "lab",
    weeks: "виконання – тижні 8–9, здача – тиждень 10",
    short: "ЛР 4",
    title: "Лабораторна робота № 4 «Функтори та монади в Haskell»",
    desc: "Власні екземпляри Functor, Applicative і Monad та обчислення в контексті.",
    points: "6 балів",
    x: 1880,
    y: 760,
  },
  {
    id: "lab5",
    kind: "lab",
    weeks: "виконання – тиждень 11, здача – тиждень 12",
    short: "ЛР 5",
    title: "Лабораторна робота № 5 «Логічне програмування»",
    desc: "Факти, правила і запити мовою Prolog.",
    points: "5 балів",
    x: 330,
    y: 1060,
  },
  {
    id: "lab6",
    kind: "lab",
    weeks: "виконання – тиждень 13, здача – тиждень 14",
    short: "ЛР 6",
    title: "Лабораторна робота № 6 «Реактивне програмування»",
    desc: "Реактивні потоки із застосуванням бібліотек реактивного програмування.",
    points: "6 балів",
    x: 1010,
    y: 1490,
  },
];

export const START: Stop = {
  id: "start",
  kind: "start",
  short: "Початок подорожі",
  title: "Початок подорожі",
  desc: "Тут починається курс «Декларативне програмування»: 15 лекцій, 6 лабораторних, контрольна робота та іспит.",
  vns: COURSE_VNS,
  x: 190,
  y: 410,
};

export const TEST: Stop = {
  id: "test",
  kind: "test",
  week: 9,
  short: "Контрольна",
  title: "Контрольна робота",
  desc: "Дракон охороняє міст між землями функцій і печерами логіки. Контрольна проводиться на лекції 9 тижня і охоплює функційне програмування.",
  points: "15 балів",
  x: 1410,
  y: 880,
};

export const EXAM: Stop = {
  id: "exam",
  kind: "exam",
  short: "Іспит",
  title: "Іспит – штурм замку",
  desc: "Письмова частина (тест) та усна частина (індивідуальне опитування). Допуск – шість захищених лабораторних робіт.",
  points: "50 + 5 балів",
  x: 1990,
  y: 1350,
};

export const ALL_STOPS: Stop[] = [START, ...LECTURES, TEST, EXAM, ...LABS];

/** The path in travel order; extra points only shape the curve. */
export const ROUTE: [number, number][] = [
  [START.x, START.y],
  [LECTURES[0].x, LECTURES[0].y],
  [LECTURES[1].x, LECTURES[1].y],
  [LECTURES[2].x, LECTURES[2].y],
  [LECTURES[3].x, LECTURES[3].y],
  [LECTURES[4].x, LECTURES[4].y],
  [1180, 505],
  [1290, 480],
  [LECTURES[5].x, LECTURES[5].y],
  [LECTURES[6].x, LECTURES[6].y],
  [2060, 430],
  [2190, 570],
  [LECTURES[7].x, LECTURES[7].y],
  [1900, 850],
  [LECTURES[8].x, LECTURES[8].y],
  [1540, 885],
  [TEST.x, TEST.y],
  [1250, 878],
  [1080, 872],
  [LECTURES[9].x, LECTURES[9].y],
  [740, 940],
  [LECTURES[10].x, LECTURES[10].y],
  [380, 1010],
  [290, 1140],
  [400, 1250],
  [LECTURES[11].x, LECTURES[11].y],
  [LECTURES[12].x, LECTURES[12].y],
  [LECTURES[13].x, LECTURES[13].y],
  [1330, 1390],
  [LECTURES[14].x, LECTURES[14].y],
  [1760, 1400],
  [EXAM.x, EXAM.y],
];
