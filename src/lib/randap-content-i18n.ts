/**
 * DB kontenti (fanlar, testlar, darslar, savollar) uchun tarjimalar.
 * Kalitlar barqaror: subject.slug, quiz.order, lesson.order, question.order.
 * lang === "uz" bo'lsa — DB dagi asl (o'zbekcha) matn qaytadi.
 */
import { isLang, type Lang } from "./randap-i18n";

type SubjectTr = { name: string; description: string };
type QuizTr = { title: string; description: string };
type LessonTr = { title: string; summary: string; content: string };
type QuestionTr = { text: string; options?: string[] };

type ContentPack = {
  subjects: Record<string, SubjectTr>;
  quizzes: Record<string, QuizTr>;
  lessons: Record<string, LessonTr>;
  questions: Record<string, QuestionTr>;
};

const qk = (slug: string, quizOrder: number, qOrder: number) =>
  `${slug}:${quizOrder}:${qOrder}`;
const zk = (slug: string, order: number) => `${slug}:${order}`;

const EN: ContentPack = {
  subjects: {
    matematika: {
      name: "Mathematics",
      description:
        "Arithmetic, algebra and logic problems — learn step by step.",
    },
    "ingliz-tili": {
      name: "English",
      description:
        "Strengthen the language with grammar and vocabulary tests.",
    },
    tarix: {
      name: "History",
      description: "Interesting tests from world and Uzbekistan history.",
    },
    fizika: {
      name: "Physics",
      description:
        "Mechanics, heat, electricity and optics — tests at three difficulty levels.",
    },
    kimyo: {
      name: "Chemistry",
      description:
        "Matter, atoms, the periodic table and reactions — three difficulty levels.",
    },
    geografiya: {
      name: "Geography",
      description:
        "Continents, oceans, Uzbekistan and the world — three difficulty levels.",
    },
    "ona-tili": {
      name: "Native language",
      description:
        "Alphabet, parts of speech, rules and syntax — three difficulty levels.",
    },
    adabiyot: {
      name: "Literature",
      description:
        "Classical and modern Uzbek literature — three difficulty levels.",
    },
  },
  quizzes: {
    "matematika:0": {
      title: "Arithmetic basics",
      description:
        "Addition, subtraction, multiplication and percentages — 10 questions.",
    },
    "matematika:1": {
      title: "Algebra and logic",
      description: "Equations, sequences and geometry — 10 questions.",
    },
    "ingliz-tili:0": {
      title: "Grammar basics",
      description: "To be, tenses, articles — 10 questions.",
    },
    "ingliz-tili:1": {
      title: "Vocabulary",
      description: "Translation, synonyms and antonyms — 10 questions.",
    },
    "ingliz-tili:7": {
      title: "VERY HARD 1 — Vocabulary & idioms (C2)",
      description:
        "300 ruthless questions: rare words, idioms and phrasal verbs. 10 random ones each attempt — experts only!",
    },
    "ingliz-tili:8": {
      title: "VERY HARD 2 — Grammar (C2)",
      description:
        "300 ruthless questions: inversion, subjunctive, mixed conditionals and modal nuances. 10 random ones each attempt.",
    },
    "tarix:0": {
      title: "World history",
      description:
        "Great discoveries, wars and culture — 10 questions.",
    },
    "tarix:1": {
      title: "History of Uzbekistan",
      description:
        "The Timurids, the Silk Road and independence — 10 questions.",
    },
  },
  lessons: {
    "matematika:0": {
      title: "Secrets of addition and subtraction",
      summary:
        "Learn to add and subtract large numbers quickly with the column method.",
      content: `Column arithmetic is the most convenient way to add and subtract large numbers. We write the numbers one under the other: units under units, tens under tens.

In addition we start from the units. If the sum of the units exceeds 10, we 'remember' 1 for the tens — this is called carrying. For example: 47 + 38 = 85, because 7+8=15, we write 5 and remember 1; 4+3+1=8.

In subtraction the smaller number is subtracted from the larger one. If a column does not have enough, we 'borrow' 1 from the neighboring ten. For example: 52 − 27: in the units 2−7 is not enough, we write 12−7=5, we borrowed 1 from the tens: 4−2=2. The answer is 25.

The secret of practice: solve 10 examples every day. In a week column arithmetic becomes automatic and there will be enough time in tests.`,
    },
    "matematika:1": {
      title: "Working with percentages",
      summary:
        "We learn the connection between percentages, fractions and decimals with simple examples.",
      content: `A percent is one hundredth of a whole. 100% is the whole thing, 50% is its half, 25% is its quarter.

To find the percent of a number, multiply the number by the percent and divide by 100. For example: 20% of 250 = 250 × 20 : 100 = 50. A quick way: 20% = 1/5, so we divide 250 by 5 — 50.

Finding the number from a percent is the reverse problem. '25% of 40 equals what?' — 40 × 25 : 100 = 10. Or 25% = 1/4, 40 : 4 = 10.

Using it in life: if a 15,000 item gets a 30% discount in a shop, the discount is 15,000 × 30 : 100 = 4,500, and 10,500 remains to pay. Percent problems in tests are solved in exactly this way.`,
    },
    "matematika:2": {
      title: "The 3 steps of solving an equation",
      summary: "Any simple equation is solved with the same 3 steps.",
      content: `An equation is an equality with an unknown number (x). Any simple equation is solved in 3 steps.

Step 1: open the brackets and combine like terms. For example: 2x + 3 + x = 18 → 3x + 3 = 18.

Step 2: move the numbers to the other side of the equality. When moving, the sign becomes the opposite: if it was '+', it becomes '−'. 3x = 18 − 3 = 15.

Step 3: divide by the coefficient of x. x = 15 : 3 = 5.

Checking is a mandatory step: 2×5 + 3 + 5 = 18 — the equality holds, so the answer is right. In tests also always check the answer — in 1 minute you save 1 point.`,
    },
    "ingliz-tili:0": {
      title: "The Present Simple rule",
      summary:
        "The main rule for talking about regularly repeated actions.",
      content: `Present Simple is used for regular, repeated actions: I go to school every day.

Rule: with I, you, we, they the verb does not change (they play). With he, she, it, -s is added to the verb: she plays, he goes. For example: 'She watches TV' — she watches television.

In questions and negatives the helper do/does is used: Do you play? He does not (doesn't) play. Note: when does is used, -s is not added to the verb, because the -s is already inside does.

Signal words: always, usually, often, sometimes, never, every day. If these words appear in the sentence — Present Simple is used. In tests, first find the signal words, then choose the answer.`,
    },
    "ingliz-tili:1": {
      title: "The articles A / An / The",
      summary:
        "We explain when the three articles are used in 5 rules.",
      content: `In English there are 3 articles: a, an, the.

'A' comes before words beginning with a consonant sound: a book, a car. 'An' before words beginning with a vowel sound: an apple, an egg. Note: the sound matters, not the letter — 'an hour' (the h is not pronounced), 'a university' (pronounced 'yu').

'The' comes before a definite, known thing: The sun is bright (the sun — the only one). It is also used when mentioned the second time: I saw a dog. The dog was big.

No article is placed before uncountable food and abstract concepts: I like water, Life is beautiful. In tests, first ask 'definite or general?' — the answer comes out of that question.`,
    },
    "ingliz-tili:2": {
      title: "The 10-words-a-day method",
      summary: "A scientifically grounded way to grow vocabulary quickly.",
      content: `Vocabulary is the foundation of language learning. According to research, a person who sees one word 7 times in different contexts remembers it forever.

Method: 10 new words every day + 7 days of repetition. On the first day write them, on the second use them in a sentence, on the fourth quiz yourself, on the seventh check your old notebook.

Learn words by topic: one day 'kitchen' words, another day 'road' words. Topic groups create connections for the brain.

Tip: change your phone's language to English — you naturally see 50+ words a day. This method with 10 words a day means 3,650 words in a year — enough for everyday speech.`,
    },
    "tarix:0": {
      title: "Amir Temur and the Timurid era",
      summary:
        "The rise of the great commander and the cultural heritage of the Timurid dynasty.",
      content: `Amir Temur (1336–1405) was the great commander and statesman of Movarounnahr. He made Samarkand his capital and created a huge empire — from India to the Near East.

Temur was not only a commander but also a statesman: he paid attention to science and turned Samarkand into one of the most beautiful cities in the world. The Bibi-Khanym mosque, the Go'ri Amir complex — monuments of that period.

His grandson Mirzo Ulughbeg is a world-famous astronomer and scholar. Ulughbeg's observatory and his star table 'Ziji jadidi Sultoniy' were the most precise astronomical calculations of that era.

The Timurid period is called the 'Timurid renaissance': the poet Navoiy, the scholar Koshiy, the miniaturist Kamoliddin Behzod — all children of that era. Dates for tests: Temur was born in 1336 and died in 1405.`,
    },
    "tarix:1": {
      title: "The Great Silk Road",
      summary:
        "The history of the oldest trade route connecting East and West.",
      content: `The Great Silk Road is the ancient trade road stretching from China to the Mediterranean. Its length is more than 7,000 km. It opened in the 2nd century BC.

The road carried not only silk: spices, paper, glass, jewelry and books were also exchanged. Through this road religions (Buddhism, Islam), sciences and art also spread.

The territory of today's Uzbekistan is the center of the Silk Road. Samarkand, Bukhara, Khiva, Termez, Shahrisabz — caravan cities. Bukhara, praised as the 'dome of the world', was one of the biggest centers of knowledge.

Caravans walked 30-40 km a day. A journey connecting China with the Mediterranean lasted months. In every city there were rabats (inns) and bazaars. These city names and dates often appear in tests.`,
    },
    "tarix:2": {
      title: "The years of independent Uzbekistan",
      summary:
        "The years of independence since 1991 — main dates and events.",
      content: `August 31, 1991 is the day the independence of the Republic of Uzbekistan was declared. On September 1, 1991 the Supreme Council confirmed this decision. Now September 1 is Independence Day, a holiday.

In December 1991 Uzbekistan became a member of the UN. 1992 — the Constitution was adopted and the transition to the national currency sum-coupon began. In 1994 the sum was introduced as the national currency.

In the first years of independence the state language became Uzbek (the transition to the Latin script began in 1993), and the state emblem, flag and anthem were adopted.

Today Uzbekistan has diplomatic relations with 100+ countries of the world. The most important date in tests is August 31, 1991. Always keep this date in mind.`,
    },
  },
  questions: {
    // ---- Matematika: arifmetika ----
    "matematika:0:3": { text: "How much is 20% of 250?" },
    "matematika:0:5": { text: "9² (9 squared) = ?" },
    "matematika:0:6": {
      text: "Express the fraction 3/4 as a percentage.",
    },
    "matematika:0:7": { text: "How many meters are in 1 km?" },
    "matematika:0:9": {
      text: "Continue the sequence: 2, 4, 8, 16, ...",
    },
    // ---- Matematika: algebra ----
    "matematika:1:0": { text: "If x + 7 = 15, then x = ?" },
    "matematika:1:1": { text: "If 3x = 27, then x = ?" },
    "matematika:1:2": { text: "If 2x − 5 = 11, then x = ?" },
    "matematika:1:4": { text: "If a = 4, b = 3, then a² + b² = ?" },
    "matematika:1:5": {
      text: "Fibonacci sequence: 1, 1, 2, 3, 5, 8, ...",
    },
    "matematika:1:6": {
      text: "How many divisors does the number 18 have?",
    },
    "matematika:1:7": {
      text: "What is the perimeter of a rectangle with sides 6 and 8?",
    },
    "matematika:1:9": {
      text: "If 5 pencils cost 15,000, how much do 8 pencils cost?",
    },
    // ---- Ingliz tili: grammatika ----
    "ingliz-tili:0:4": {
      text: "What is the past form of the verb 'go'?",
    },
    "ingliz-tili:0:8": {
      text: "What is the comparative degree of 'big'?",
    },
    // ---- Ingliz tili: vocab ----
    "ingliz-tili:1:0": { text: "What is 'kitob' in English?" },
    "ingliz-tili:1:1": { text: "What is 'do'st' in English?" },
    "ingliz-tili:1:2": {
      text: "What does 'water' mean?",
      options: ["air", "fire", "water", "soil"],
    },
    "ingliz-tili:1:3": { text: "What is the antonym of 'hot'?" },
    "ingliz-tili:1:4": {
      text: "What is a 'teacher'?",
      options: ["doctor", "engineer", "teacher", "driver"],
    },
    "ingliz-tili:1:5": {
      text: "When is 'morning'?",
      options: [
        "in the morning",
        "at noon",
        "in the evening",
        "at night",
      ],
    },
    "ingliz-tili:1:6": {
      text: "What is the antonym of the verb 'buy'?",
    },
    "ingliz-tili:1:7": {
      text: "What does 'family' mean?",
      options: ["school", "family", "city", "state"],
    },
    "ingliz-tili:1:8": { text: "Which number is 'three'?" },
    "ingliz-tili:1:9": { text: "What is a synonym of 'beautiful'?" },
    // ---- Tarix: jahon ----
    "tarix:0:0": {
      text: "In which years did World War II take place?",
    },
    "tarix:0:1": {
      text: "Who was the first president of the USA?",
      options: [
        "George Washington",
        "Abraham Lincoln",
        "Thomas Jefferson",
        "Franklin Roosevelt",
      ],
    },
    "tarix:0:2": {
      text: "Which centuries does the Age of Discovery cover?",
    },
    "tarix:0:3": {
      text: "Which Roman commander wrote 'Veni, vidi, vici' — 'I came, I saw, I conquered'?",
      options: [
        "Julius Caesar",
        "Nero",
        "Augustus",
        "Charlemagne",
      ],
    },
    "tarix:0:4": {
      text: "Which sailor reached the American continent in 1492?",
      options: [
        "Christopher Columbus",
        "Magellan",
        "Vasco da Gama",
        "James Cook",
      ],
    },
    "tarix:0:5": {
      text: "In which year did World War I begin?",
    },
    "tarix:0:6": {
      text: "In which country did the Great Revolution of 1789 happen?",
      options: ["England", "France", "Germany", "Russia"],
    },
    "tarix:0:7": {
      text: "In which year did the Berlin Wall fall?",
    },
    "tarix:0:8": {
      text: "In which country was paper first invented?",
      options: ["Egypt", "Greece", "China", "India"],
    },
    "tarix:0:9": {
      text: "Who is the author of the painting 'Mona Lisa'?",
      options: [
        "Leonardo da Vinci",
        "Raphael",
        "Michelangelo",
        "Van Gogh",
      ],
    },
    // ---- Tarix: O'zbekiston ----
    "tarix:1:0": {
      text: "Which city did Amir Temur make his capital?",
      options: ["Bukhara", "Khiva", "Samarkand", "Tashkent"],
    },
    "tarix:1:1": {
      text: "Through which cities did the Great Silk Road pass?",
      options: [
        "Samarkand and Bukhara",
        "Paris and London",
        "Moscow and Kyiv",
        "Tokyo and Seoul",
      ],
    },
    "tarix:1:2": {
      text: "In which field was Al-Khwarizmi a scholar?",
      options: ["Poet", "Mathematician", "Commander", "Artist"],
    },
    "tarix:1:3": {
      text: "When was the independence of Uzbekistan declared?",
      options: [
        "1990",
        "August 31, 1991",
        "1992",
        "1993",
      ],
    },
    "tarix:1:4": {
      text: "In which city is the Registan square located?",
      options: ["Bukhara", "Samarkand", "Khiva", "Tashkent"],
    },
    "tarix:1:5": {
      text: "Where was Imam al-Bukhari buried?",
      options: [
        "In Khiva",
        "Near Bukhara",
        "In Samarkand",
        "In Tashkent",
      ],
    },
    "tarix:1:6": {
      text: "Which dynasty did Babur found in India?",
      options: [
        "The Seljuks",
        "The Great Mughals",
        "The Timurids",
        "The Safavids",
      ],
    },
    "tarix:1:7": {
      text: "What did the word 'o'zbek' originally mean?",
      options: [
        "A free person",
        "One's own master",
        "A warrior",
        "A farmer",
      ],
    },
    "tarix:1:8": {
      text: "In which field was Mirzo Ulughbeg mainly active?",
      options: ["Astronomy", "Medicine", "Trade", "Sport"],
    },
    "tarix:1:9": {
      text: "In which year did the Tashkent metro open?",
    },
  },
};

const RU: ContentPack = {
  subjects: {
    matematika: {
      name: "Математика",
      description:
        "Арифметика, алгебра и логические задачи — учитесь шаг за шагом.",
    },
    "ingliz-tili": {
      name: "Английский язык",
      description:
        "Укрепите язык тестами по грамматике и словарному запасу.",
    },
    tarix: {
      name: "История",
      description:
        "Интересные тесты по истории мира и Узбекистана.",
    },
    fizika: {
      name: "Физика",
      description:
        "Механика, тепло, электричество и оптика — тесты трёх уровней сложности.",
    },
    kimyo: {
      name: "Химия",
      description:
        "Вещества, атомы, периодическая таблица и реакции — три уровня сложности.",
    },
    geografiya: {
      name: "География",
      description:
        "Континенты, океаны, Узбекистан и мир — три уровня сложности.",
    },
    "ona-tili": {
      name: "Родной язык",
      description:
        "Алфавит, части речи, правила и синтаксис — три уровня сложности.",
    },
    adabiyot: {
      name: "Литература",
      description:
        "Классическая и современная узбекская литература — три уровня сложности.",
    },
  },
  quizzes: {
    "matematika:0": {
      title: "Основы арифметики",
      description:
        "Сложение, вычитание, умножение и проценты — 10 вопросов.",
    },
    "matematika:1": {
      title: "Алгебра и логика",
      description:
        "Уравнения, последовательности и геометрия — 10 вопросов.",
    },
    "ingliz-tili:0": {
      title: "Основы грамматики",
      description: "To be, времена, артикли — 10 вопросов.",
    },
    "ingliz-tili:1": {
      title: "Словарный запас",
      description:
        "Перевод, синонимы и антонимы — 10 вопросов.",
    },
    "ingliz-tili:7": {
      title: "VERY HARD 1 — Лексика и идиомы (C2)",
      description:
        "300 безжалостных вопросов: редкие слова, идиомы и фразовые глаголы. Каждый раз — 10 случайных. Только для мастеров!",
    },
    "ingliz-tili:8": {
      title: "VERY HARD 2 — Грамматика (C2)",
      description:
        "300 безжалостных вопросов: инверсия, сослагательное наклонение, смешанные условные предложения. Каждый раз — 10 случайных.",
    },
    "tarix:0": {
      title: "Всемирная история",
      description:
        "Великие открытия, войны и культура — 10 вопросов.",
    },
    "tarix:1": {
      title: "История Узбекистана",
      description:
        "Тимуриды, Шёлковый путь и независимость — 10 вопросов.",
    },
  },
  lessons: {
    "matematika:0": {
      title: "Секреты сложения и вычитания",
      summary:
        "Научитесь быстро складывать и вычитать большие числа методом столбика.",
      content: `Столбиковый счёт — самый удобный способ складывать и вычитать большие числа. Пишем числа одно под другим: единицы под единицами, десятки под десятками.

В сложении начинаем с единиц. Если сумма единиц больше 10, «запоминаем» 1 для десятков — это называется переносом. Например: 47 + 38 = 85, потому что 7+8=15, пишем 5 и помним 1; 4+3+1=8.

В вычитании меньшее число вычитается из большего. Если в столбике не хватает, «занимаем» 1 у соседнего десятка. Например: 52 − 27: в единицах 2−7 не хватает, пишем 12−7=5, у десятков заняли 1: 4−2=2. Ответ 25.

Секрет практики: решайте по 10 примеров каждый день. За неделю столбиковый счёт станет автоматическим, и на тестах времени хватит.`,
    },
    "matematika:1": {
      title: "Работа с процентами",
      summary:
        "На простых примерах изучим связь между процентами, дробями и десятичными дробями.",
      content: `Процент — одна сотая часть целого. 100% — целая вещь, 50% — её половина, 25% — её четверть.

Чтобы найти процент от числа, умножьте число на процент и разделите на 100. Например: 20% от 250 = 250 × 20 : 100 = 50. Быстрый способ: 20% = 1/5, значит 250 делим на 5 — 50.

Найти число от процента — обратная задача. «25% от 40 чему равно?» — 40 × 25 : 100 = 10. Или 25% = 1/4, 40 : 4 = 10.

Применение в жизни: если в магазине на вещь за 15 000 скидка 30%, скидка равна 15 000 × 30 : 100 = 4 500, на оплату остаётся 10 500. Процентные задачи в тестах решаются именно так.`,
    },
    "matematika:2": {
      title: "3 шага решения уравнения",
      summary:
        "Любое простое уравнение решается одними и теми же 3 шагами.",
      content: `Уравнение — это равенство с неизвестным числом (x). Любое простое уравнение решается в 3 шага.

Шаг 1: раскрыть скобки и привести подобные слагаемые. Например: 2x + 3 + x = 18 → 3x + 3 = 18.

Шаг 2: перенести числа на другую сторону равенства. При переносе знак меняется на противоположный: если был «+», станет «−». 3x = 18 − 3 = 15.

Шаг 3: разделить на коэффициент x. x = 15 : 3 = 5.

Проверка — обязательный шаг: 2×5 + 3 + 5 = 18 — равенство выполнено, значит ответ верный. И на тестах всегда проверяйте ответ — за 1 минуту вы сохраняете 1 балл.`,
    },
    "ingliz-tili:0": {
      title: "Правило Present Simple",
      summary:
        "Основное правило для рассказа о регулярно повторяющихся действиях.",
      content: `Present Simple используется для регулярных, повторяющихся действий: I go to school every day (Я хожу в школу каждый день).

Правило: с I, you, we, they глагол не меняется (they play). С he, she, it к глаголу добавляется -s: she plays, he goes. Например: «She watches TV» — она смотрит телевизор.

В вопросах и отрицаниях используется вспомогательный do/does: Do you play? He does not (doesn't) play. Напомним: когда используется does, к глаголу -s не добавляется, потому что -s уже внутри does.

Слова-сигналы: always, usually, often, sometimes, never, every day. Если в предложении есть эти слова — используется Present Simple. В тестах сначала найдите слова-сигналы, потом выберите ответ.`,
    },
    "ingliz-tili:1": {
      title: "Артикли A / An / The",
      summary:
        "Объясняем в 5 правилах, когда используются три артикля.",
      content: `В английском языке 3 артикля: a, an, the.

«A» ставится перед словами, начинающимися с согласного звука: a book, a car. «An» — перед словами на гласный звук: an apple, an egg. Внимание: важен звук, а не буква — «an hour» (h не произносится), «a university» (читается «ю»).

«The» ставится перед определённым, известным предметом: The sun is bright (солнце — единственное). Используется и при втором упоминании: I saw a dog. The dog was big.

Перед неисчисляемой едой и абстрактными понятиями артикль не ставится: I like water, Life is beautiful. В тестах сначала спросите «определённое или общее?» — ответ вытекает из этого вопроса.`,
    },
    "ingliz-tili:2": {
      title: "Метод 10 слов каждый день",
      summary:
        "Научно обоснованный способ быстро поднять словарный запас.",
      content: `Словарный запас — фундамент изучения языка. По исследованиям, человек, который видит одно слово 7 раз в разных контекстах, запоминает его навсегда.

Метод: каждый день 10 новых слов + 7 дней повторения. В первый день запишите, во второй используйте в предложении, на четвёртый задайте себе вопросы, на седьмой проверьте старую тетрадь.

Учите слова по темам: один день слова «кухни», другой день — слова «дороги». Тематические группы создают связи для мозга.

Совет: смените язык телефона на английский — вы естественно будете видеть 50+ слов в день. Этот метод с 10 словами в день — это 3 650 слов за год — достаточно для повседневной речи.`,
    },
    "tarix:0": {
      title: "Амир Темур и эпоха Тимуридов",
      summary:
        "Возвышение великого полководца и культурное наследие династии Тимуридов.",
      content: `Амир Темур (1336–1405) — великий полководец и государственный деятель Мавераннахра. Он сделал Самарканд столицей и создал огромную империю — от Индии до Ближнего Востока.

Темур был не только полководцем, но и государственным деятелем: уделял внимание науке и превратил Самарканд в один из красивейших городов мира. Мечеть Бибиханым, комплекс Гури Амир — памятники того периода.

Его внук Мирзо Улугбек — всемирно известный астроном и учёный. Обсерватория Улугбека и его таблица звёзд «Зиджи джадиди Султони» были самыми точными астрономическими расчётами той эпохи.

Эпоху Тимуридов называют «тимуридским ренессансом»: поэт Навои, учёный Коши, миниатюрист Камолиддин Бехзод — все дети той эпохи. Даты для тестов: Темур родился в 1336 году, умер в 1405 году.`,
    },
    "tarix:1": {
      title: "Великий шёлковый путь",
      summary:
        "История древнейшего торгового пути, соединявшего Восток и Запад.",
      content: `Великий шёлковый путь — древняя торговая дорога, протянувшаяся от Китая до Средиземного моря. Её длина — более 7 000 км. Открыт во II веке до нашей эры.

По дороге возили не только шёлк: специи, бумагу, стекло, ювелирные изделия и книги тоже обменивались. Через эту дорогу распространялись и религии (буддизм, ислам), науки и искусство.

Территория сегодняшнего Узбекистана — центр шёлкового пути. Самарканд, Бухара, Хива, Термез, Шахрисабз — караванные города. Бухара, воспеваемая как «купол мира», была одним из крупнейших центров знаний.

Караваны проходили 30-40 км в день. Путешествие, соединявшее Китай со Средиземным морем, длилось месяцами. В каждом городе были рабаты (гостиницы) и базары. Эти названия городов и даты часто встречаются в тестах.`,
    },
    "tarix:2": {
      title: "Годы независимого Узбекистана",
      summary:
        "Годы независимости с 1991 года — основные даты и события.",
      content: `31 августа 1991 года — день провозглашения независимости Республики Узбекистан. 1 сентября 1991 года Верховный Совет подтвердил это решение. Сейчас 1 сентября — День независимости, праздничный день.

В декабре 1991 года Узбекистан стал членом ООН. 1992 год — принята Конституция, начался переход к национальной валюте сум-купон. В 1994 году сум введён как национальная валюта.

В первые годы независимости государственным языком стал узбекский (переход на латинскую графику начался в 1993 году), приняты государственный герб, флаг и гимн.

Сегодня Узбекистан имеет дипломатические отношения со 100+ странами мира. Самая важная дата в тестах — 31 августа 1991 года. Всегда помните эту дату.`,
    },
  },
  questions: {
    "matematika:0:3": { text: "Сколько составляет 20% от 250?" },
    "matematika:0:5": { text: "9² (9 в квадрате) = ?" },
    "matematika:0:6": {
      text: "Выразите дробь 3/4 в процентах.",
    },
    "matematika:0:7": { text: "Сколько метров в 1 км?" },
    "matematika:0:9": {
      text: "Продолжите последовательность: 2, 4, 8, 16, ...",
    },
    "matematika:1:0": { text: "Если x + 7 = 15, то x = ?" },
    "matematika:1:1": { text: "Если 3x = 27, то x = ?" },
    "matematika:1:2": { text: "Если 2x − 5 = 11, то x = ?" },
    "matematika:1:4": { text: "Если a = 4, b = 3, то a² + b² = ?" },
    "matematika:1:5": {
      text: "Последовательность Фибоначчи: 1, 1, 2, 3, 5, 8, ...",
    },
    "matematika:1:6": {
      text: "Сколько делителей у числа 18?",
    },
    "matematika:1:7": {
      text: "Чему равен периметр прямоугольника со сторонами 6 и 8?",
    },
    "matematika:1:9": {
      text: "Если 5 карандашей стоят 15 000, сколько стоят 8 карандашей?",
    },
    "ingliz-tili:0:4": {
      text: "Прошедшая форма глагола «go»?",
    },
    "ingliz-tili:0:8": {
      text: "Сравнительная степень слова «big»?",
    },
    "ingliz-tili:1:0": { text: "Как будет «kitob» по-английски?" },
    "ingliz-tili:1:1": { text: "Как будет «do'st» по-английски?" },
    "ingliz-tili:1:2": {
      text: "Что значит «water»?",
      options: ["воздух", "огонь", "вода", "земля"],
    },
    "ingliz-tili:1:3": { text: "Антоним слова «hot»?" },
    "ingliz-tili:1:4": {
      text: "Кто такой «teacher»?",
      options: ["врач", "инженер", "учитель", "водитель"],
    },
    "ingliz-tili:1:5": {
      text: "Когда бывает «morning»?",
      options: ["утром", "в полдень", "вечером", "ночью"],
    },
    "ingliz-tili:1:6": {
      text: "Антоним глагола «buy»?",
    },
    "ingliz-tili:1:7": {
      text: "Что значит «family»?",
      options: ["школа", "семья", "город", "государство"],
    },
    "ingliz-tili:1:8": { text: "Какое число — «three»?" },
    "ingliz-tili:1:9": { text: "Синоним слова «beautiful»?" },
    "tarix:0:0": {
      text: "В какие годы шла Вторая мировая война?",
    },
    "tarix:0:1": {
      text: "Кто был первым президентом США?",
      options: [
        "Джордж Вашингтон",
        "Авраам Линкольн",
        "Томас Джефферсон",
        "Франклин Рузвельт",
      ],
    },
    "tarix:0:2": {
      text: "Какие века охватывает эпоха Великих географических открытий?",
    },
    "tarix:0:3": {
      text: "Какой римский полководец написал «Veni, vidi, vici» — «Пришёл, увидел, победил»?",
      options: [
        "Юлий Цезарь",
        "Нерон",
        "Август",
        "Карл Великий",
      ],
    },
    "tarix:0:4": {
      text: "Какой мореплаватель достиг американского континента в 1492 году?",
      options: [
        "Христофор Колумб",
        "Магеллан",
        "Васко да Гама",
        "Джеймс Кук",
      ],
    },
    "tarix:0:5": {
      text: "В каком году началась Первая мировая война?",
    },
    "tarix:0:6": {
      text: "В какой стране произошла Великая революция 1789 года?",
      options: ["Англия", "Франция", "Германия", "Россия"],
    },
    "tarix:0:7": {
      text: "В каком году пала Берлинская стена?",
    },
    "tarix:0:8": {
      text: "В какой стране впервые изобрели бумагу?",
      options: ["Египет", "Греция", "Китай", "Индия"],
    },
    "tarix:0:9": {
      text: "Кто написал картину «Мона Лиза»?",
      options: [
        "Леонардо да Винчи",
        "Рафаэль",
        "Микеланджело",
        "Ван Гог",
      ],
    },
    "tarix:1:0": {
      text: "Какой город Амир Темур сделал столицей?",
      options: ["Бухара", "Хива", "Самарканд", "Ташкент"],
    },
    "tarix:1:1": {
      text: "Через какие города проходил Великий шёлковый путь?",
      options: [
        "Самарканд и Бухара",
        "Париж и Лондон",
        "Москва и Киев",
        "Токио и Сеул",
      ],
    },
    "tarix:1:2": {
      text: "В какой области был учёным Аль-Хорезми?",
      options: ["Поэт", "Математик", "Полководец", "Художник"],
    },
    "tarix:1:3": {
      text: "Когда была провозглашена независимость Узбекистана?",
      options: [
        "1990 год",
        "31 августа 1991 года",
        "1992 год",
        "1993 год",
      ],
    },
    "tarix:1:4": {
      text: "В каком городе находится площадь Регистан?",
      options: ["Бухара", "Самарканд", "Хива", "Ташкент"],
    },
    "tarix:1:5": {
      text: "Где похоронен Имам аль-Бухари?",
      options: [
        "В Хиве",
        "Около Бухары",
        "В Самарканде",
        "В Ташкенте",
      ],
    },
    "tarix:1:6": {
      text: "Какую династию основал Бабур в Индии?",
      options: [
        "Сельджуки",
        "Великие Моголы",
        "Тимуриды",
        "Сефевиды",
      ],
    },
    "tarix:1:7": {
      text: "Что изначально означало слово «узбек»?",
      options: [
        "Свободный человек",
        "Хозяин самого себя",
        "Воин",
        "Земледелец",
      ],
    },
    "tarix:1:8": {
      text: "Какой сферой в основном занимался Мирзо Улугбек?",
      options: ["Астрономия", "Медицина", "Торговля", "Спорт"],
    },
    "tarix:1:9": {
      text: "В каком году открылся Ташкентский метрополитен?",
    },
  },
};

const PACKS: Record<"en" | "ru", ContentPack> = { en: EN, ru: RU };

function packFor(lang: string): ContentPack | null {
  if (lang === "en") return EN;
  if (lang === "ru") return RU;
  return null;
}

export function localizeSubject(
  slug: string,
  fallbackName: string,
  fallbackDescription: string,
  lang: string
): { name: string; description: string } {
  const tr = packFor(lang)?.subjects[slug];
  return tr ?? { name: fallbackName, description: fallbackDescription };
}

export function localizeQuiz(
  slug: string,
  quizOrder: number,
  fallbackTitle: string,
  fallbackDescription: string,
  lang: string
): { title: string; description: string } {
  const tr = packFor(lang)?.quizzes[zk(slug, quizOrder)];
  return tr ?? { title: fallbackTitle, description: fallbackDescription };
}

export function localizeLesson<T extends { title: string; summary: string; content: string }>(
  slug: string,
  lessonOrder: number,
  lesson: T,
  lang: string
): T {
  const tr = packFor(lang)?.lessons[zk(slug, lessonOrder)];
  if (!tr) return lesson;
  return { ...lesson, title: tr.title, summary: tr.summary, content: tr.content };
}

export function localizeQuestion(
  slug: string,
  quizOrder: number,
  questionOrder: number,
  fallbackText: string,
  fallbackOptions: string[],
  lang: string
): { text: string; options: string[] } {
  const tr = packFor(lang)?.questions[qk(slug, quizOrder, questionOrder)];
  if (!tr) return { text: fallbackText, options: fallbackOptions };
  return {
    text: tr.text,
    options: tr.options ?? fallbackOptions,
  };
}

export type { Lang };
export { isLang };
