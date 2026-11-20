/**
 * Matematika, fizika va kimyo savollari generatori.
 * Javoblar dastur hisobida aniq chiqadi — javoblar hech qachon taxminga asoslanmaydi.
 * Har bir qiyinlik uchun ~320 nomzod savol yaratiladi (seed 300 gacha to'ldiradi).
 */
import {
  dedupe,
  ensureFour,
  numOptions,
  optionsFor,
  rangeInt,
  rngOf,
  same,
  shuffle,
  type L3,
  type QGen,
  type Rng,
} from "./gen-core";

/* ================= MATEMATIKA ================= */

function matEasy(rng: Rng): QGen[] {
  const out: QGen[] = [];
  for (let i = 0; i < 90; i++) {
    const a = rangeInt(rng, 11, 89);
    const b = rangeInt(rng, 11, 89);
    const { o, correct } = numOptions(rng, a + b, Math.max(4, Math.round((a + b) * 0.12)));
    out.push({ t: same(`${a} + ${b} = ?`), o, correct });
  }
  for (let i = 0; i < 70; i++) {
    const a = rangeInt(rng, 40, 99);
    const b = rangeInt(rng, 10, a - 10);
    const { o, correct } = numOptions(rng, a - b, 6);
    out.push({ t: same(`${a} − ${b} = ?`), o, correct });
  }
  for (let i = 0; i < 60; i++) {
    const a = rangeInt(rng, 2, 12);
    const b = rangeInt(rng, 2, 9);
    const { o, correct } = numOptions(rng, a * b, Math.max(3, Math.round(a * 0.8)));
    out.push({ t: same(`${a} × ${b} = ?`), o, correct });
  }
  for (let i = 0; i < 50; i++) {
    const a = rangeInt(rng, 12, 120);
    const b = rangeInt(rng, 5, a - 3);
    const c = a + b;
    const { o, correct } = numOptions(rng, b, 4);
    out.push({ t: same(`${a} + ? = ${c}`), o, correct });
  }
  for (let i = 0; i < 50; i++) {
    const k = rangeInt(rng, 2, 9);
    const b = rangeInt(rng, 2, 9);
    const a = b * k;
    const { o, correct } = numOptions(rng, k, 3);
    out.push({ t: same(`${a} : ${b} = ?`), o, correct });
  }
  for (let i = 0; i < 60; i++) {
    const a = rangeInt(rng, 15, 140);
    const b = rangeInt(rng, 6, 90);
    const { o, correct } = numOptions(rng, a + b, 7);
    out.push({
      t: {
        uz: `Bir qutida ${a} ta olma bor. Unga yana ${b} ta olma qo'shildi. Qutida jami nechta olma bor?`,
        ru: `В одной коробке ${a} яблок. Туда добавили ещё ${b} яблок. Сколько яблок в коробке?`,
        en: `There are ${a} apples in a box. Then ${b} more apples are added. How many apples are in the box?`,
      },
      o,
      correct,
    });
  }
  return dedupe(out);
}

function matMiddle(rng: Rng): QGen[] {
  const out: QGen[] = [];
  for (let i = 0; i < 60; i++) {
    const a = rangeInt(rng, 102, 499);
    const b = rangeInt(rng, 2, 9);
    const { o, correct } = numOptions(rng, a * b, Math.max(6, Math.round(a * 0.06)));
    out.push({ t: same(`${a} × ${b} = ?`), o, correct });
  }
  for (let i = 0; i < 55; i++) {
    const k = rangeInt(rng, 12, 99);
    const b = rangeInt(rng, 3, 9);
    const a = b * k;
    const { o, correct } = numOptions(rng, k, 4);
    out.push({ t: same(`${a} : ${b} = ?`), o, correct });
  }
  // Foiz
  for (let i = 0; i < 70; i++) {
    const p = [10, 20, 25, 50, 75][rangeInt(rng, 0, 4)] as number;
    const r = p === 75 ? 3 * rangeInt(rng, 2, 40) : rangeInt(rng, 5, 150);
    const N = (100 * r) / p;
    if (!Number.isInteger(N)) { i--; continue; }
    const { o, correct } = numOptions(rng, r, Math.max(3, Math.round(r * 0.2)));
    out.push({
      t: {
        uz: `${N} ning ${p}% i nechaga teng?`,
        ru: `Чему равны ${p}% от ${N}?`,
        en: `What is ${p}% of ${N}?`,
      },
      o,
      correct,
    });
  }
  // Kasr ulush
  for (let i = 0; i < 55; i++) {
    const b = [2, 3, 4, 5][rangeInt(rng, 0, 3)] as number;
    const a = rangeInt(rng, 1, b - 1);
    const k = rangeInt(rng, 3, 40);
    const N = b * k;
    const { o, correct } = numOptions(rng, a * k, Math.max(3, Math.round(a * k * 0.2)));
    out.push({
      t: {
        uz: `${N} ning ${a}/${b} qismi nechaga teng?`,
        ru: `Чему равна ${a}/${b} часть от ${N}?`,
        en: `What is ${a}/${b} of ${N}?`,
      },
      o,
      correct,
    });
  }
  // Chiziqli tenglama
  for (let i = 0; i < 60; i++) {
    const a = rangeInt(rng, 2, 9);
    const x = rangeInt(rng, 2, 15);
    const b = rangeInt(rng, 1, 20);
    const c = a * x + b;
    const { o, correct } = numOptions(rng, x, 3);
    out.push({
      t: {
        uz: `x ni toping: ${a}x + ${b} = ${c}`,
        ru: `Найдите x: ${a}x + ${b} = ${c}`,
        en: `Find x: ${a}x + ${b} = ${c}`,
      },
      o,
      correct,
    });
  }
  for (let i = 0; i < 40; i++) {
    const n = rangeInt(rng, 11, 25);
    const { o, correct } = numOptions(rng, n * n, Math.max(4, Math.round(2 * n)));
    out.push({ t: same(`${n}² = ?`), o, correct });
  }
  // Tezlik matni
  for (let i = 0; i < 40; i++) {
    const v = rangeInt(rng, 3, 15);
    const t = rangeInt(rng, 2, 9);
    const s = v * t;
    const { o, correct } = numOptions(rng, s, Math.max(4, Math.round(s * 0.15)));
    out.push({
      t: {
        uz: `Poyezd ${v} km/soat tezlik bilan ${t} soat yurdi. U qancha yo'l bosib o'tdi (km)?`,
        ru: `Поезд шёл ${t} ч со скоростью ${v} км/ч. Какое расстояние он прошёл?`,
        en: `A train travelled for ${t} hours at ${v} km/h. What distance did it cover?`,
      },
      o,
      correct,
    });
  }
  return dedupe(out);
}

function matHard(rng: Rng): QGen[] {
  const out: QGen[] = [];
  // Kvadrat tenglama
  for (let i = 0; i < 100; i++) {
    let r1 = rangeInt(rng, -9, 9);
    let r2 = rangeInt(rng, -9, 9);
    if (r1 === r2 || r1 === 0 || r2 === 0) { i--; continue; }
    if (r1 > r2) { const tmp = r1; r1 = r2; r2 = tmp; }
    const p = -(r1 + r2);
    const q = r1 * r2;
    const px = p === 0 ? "" : p > 0 ? ` + ${p}x` : ` − ${-p}x`;
    const qx = q === 0 ? "" : q > 0 ? ` + ${q}` : ` − ${-q}`;
    const distr = [r1, r1 + r2, -r2, r2 + 1, r2 - 1].filter((v) => v !== r2);
    const { o, correct } = numOptions(rng, r2, 1);
    out.push({
      t: {
        uz: `x²${px}${qx} = 0 tenglamaning eng katta ildizi nechaga teng?`,
        ru: `Каков наибольший корень уравнения x²${px.replace("+", "+").replace("−", "-")}${qx.replace("+", "+").replace("−", "-")} = 0?`,
        en: `What is the largest root of the equation x²${px.replace("−", "-")}${qx.replace("−", "-")} = 0?`,
      },
      o,
      correct,
    });
    void distr;
  }
  // Tenglamalar sistemasi
  for (let i = 0; i < 90; i++) {
    const x = rangeInt(rng, 2, 20);
    const y = rangeInt(rng, 1, 15);
    const S = x + y;
    const D = x - y;
    const { o, correct } = numOptions(rng, x, 3);
    out.push({
      t: {
        uz: `x + y = ${S}, x − y = ${D} bo'lsa, x ning qiymati nechaga teng?`,
        ru: `Если x + y = ${S} и x − y = ${D}, чему равно x?`,
        en: `If x + y = ${S} and x − y = ${D}, what is the value of x?`,
      },
      o,
      correct,
    });
  }
  // Arifmetik progressiya
  for (let i = 0; i < 80; i++) {
    const a1 = rangeInt(rng, 2, 12);
    const d = rangeInt(rng, 2, 9);
    const n = rangeInt(rng, 8, 16);
    const an = a1 + (n - 1) * d;
    const { o, correct } = numOptions(rng, an, Math.max(4, Math.round(d * 1.5)));
    out.push({
      t: {
        uz: `Arifmetik progressiyada a₁ = ${a1}, d = ${d}. a${n} nechaga teng?`,
        ru: `В арифметической прогрессии a₁ = ${a1}, d = ${d}. Чему равен a${n}?`,
        en: `In an arithmetic progression, a₁ = ${a1}, d = ${d}. What is a${n}?`,
      },
      o,
      correct,
    });
  }
  // Geometrik progressiya
  for (let i = 0; i < 40; i++) {
    const b1 = rangeInt(rng, 1, 5);
    const q = rangeInt(rng, 2, 3);
    const n = rangeInt(rng, 5, 9);
    const bn = b1 * Math.pow(q, n - 1);
    const { o, correct } = numOptions(rng, bn, Math.max(3, Math.round(bn * 0.15)));
    out.push({
      t: {
        uz: `Geometrik progressiyada b₁ = ${b1}, q = ${q}. b${n} nechaga teng?`,
        ru: `В геометрической прогрессии b₁ = ${b1}, q = ${q}. Чему равен b${n}?`,
        en: `In a geometric progression, b₁ = ${b1}, q = ${q}. What is b${n}?`,
      },
      o,
      correct,
    });
  }
  // Doira yuzasi (π ≈ 3.14)
  for (let i = 0; i < 45; i++) {
    const r = [5, 10, 20, 30][rangeInt(rng, 0, 3)] as number;
    const A = Math.round(3.14 * r * r);
    const { o, correct } = numOptions(rng, A, Math.max(4, Math.round(A * 0.15)));
    out.push({
      t: {
        uz: `Doira radiusi ${r} sm. Yuzasi nechaga teng (π ≈ 3.14)?`,
        ru: `Радиус круга ${r} см. Чему равна его площадь (π ≈ 3.14)?`,
        en: `The radius of a circle is ${r} cm. What is its area (π ≈ 3.14)?`,
      },
      o,
      correct,
    });
  }
  // Ilg'or darajalar
  for (let i = 0; i < 45; i++) {
    const base = [2, 3, 5][rangeInt(rng, 0, 2)] as number;
    const n = base === 2 ? rangeInt(rng, 6, 10) : rangeInt(rng, 4, 6);
    const v = Math.pow(base, n);
    const { o, correct } = numOptions(rng, v, Math.max(3, Math.round(v * 0.12)));
    out.push({ t: same(`${base}^${n} = ?`), o, correct });
  }
  for (let i = 0; i < 45; i++) {
    const n = rangeInt(rng, 11, 25);
    const { o, correct } = numOptions(rng, n, 2);
    out.push({ t: same(`√${n * n} = ?`), o, correct });
  }
  // Narx foiz
  for (let i = 0; i < 40; i++) {
    const P = 100 * rangeInt(rng, 2, 20);
    const p = [10, 20, 25, 50][rangeInt(rng, 0, 3)] as number;
    const up = rng() < 0.5;
    const v = up ? P + (P * p) / 100 : P - (P * p) / 100;
    const { o, correct } = numOptions(rng, v, Math.max(4, Math.round(v * 0.12)));
    out.push({
      t: up
        ? {
            uz: `Mahsulot narxi ${P} so'mdan ${p}% ga qimmatlashdi. Yangi narx necha so'm?`,
            ru: `Цена товара выросла с ${P} сум на ${p}%. Какова новая цена?`,
            en: `The price of a product increased from ${P} soums by ${p}%. What is the new price?`,
          }
        : {
            uz: `Mahsulot narxi ${P} so'mdan ${p}% ga arzonlashdi. Yangi narx necha so'm?`,
            ru: `Цена товара снизилась с ${P} сум на ${p}%. Какова новая цена?`,
            en: `The price of a product decreased from ${P} soums by ${p}%. What is the new price?`,
          },
      o,
      correct,
    });
  }
  return dedupe(out);
}

/* ================= FIZIKA ================= */

const FIZ_FACTS: Array<{ t: L3; a: L3; d: L3[] }> = [
  {
    t: { uz: "Tezlikning SI birlikdagi asosiy o'lchov birligi qaysi?", ru: "Какова основная единица измерения скорости в СИ?", en: "What is the main SI unit of speed?" },
    a: same("m/s"),
    d: [same("kg"), same("N"), same("J"), same("Pa")],
  },
  {
    t: { uz: "Yorug'likning vakuumdagi tezligi qanchaga teng?", ru: "Чему равна скорость света в вакууме?", en: "What is the speed of light in vacuum?" },
    a: same("300 000 km/s"),
    d: [same("340 m/s"), same("150 000 km/s"), same("30 000 km/s")],
  },
  {
    t: { uz: "Tovushning havodagi tezligi qanchaga teng?", ru: "Чему равна скорость звука в воздухе?", en: "What is the speed of sound in air?" },
    a: same("340 m/s"),
    d: [same("300 000 km/s"), same("34 m/s"), same("3400 m/s")],
  },
  {
    t: { uz: "Suvning zichligi qanchaga teng?", ru: "Чему равна плотность воды?", en: "What is the density of water?" },
    a: same("1000 kg/m³"),
    d: [same("100 kg/m³"), same("500 kg/m³"), same("10 000 kg/m³")],
  },
  {
    t: { uz: "Erkin tushish tezlanishi (g) taxminan qanchaga teng?", ru: "Чему примерно равно ускорение свободного падения (g)?", en: "What is the approximate value of the acceleration of free fall (g)?" },
    a: same("10 N/kg"),
    d: [same("1 N/kg"), same("100 N/kg"), same("0.1 N/kg")],
  },
  {
    t: { uz: "Kuchning o'lchov birligi qaysi?", ru: "Какая единица измерения силы?", en: "What is the unit of force?" },
    a: same("N (nyuton)"),
    d: [same("W (vatt)"), same("Pa (paskal)"), same("J (joul)")],
  },
  {
    t: { uz: "Quvvatning o'lchov birligi qaysi?", ru: "Какая единица измерения мощности?", en: "What is the unit of power?" },
    a: same("W (vatt)"),
    d: [same("N (nyuton)"), same("Pa (paskal)"), same("A (amper)")],
  },
  {
    t: { uz: "Bosimning o'lchov birligi qaysi?", ru: "Какая единица измерения давления?", en: "What is the unit of pressure?" },
    a: same("Pa (paskal)"),
    d: [same("N (nyuton)"), same("W (vatt)"), same("kg")],
  },
  {
    t: { uz: "Ishning (mexanik ish) o'lchov birligi qaysi?", ru: "Какая единица измерения (механической) работы?", en: "What is the unit of (mechanical) work?" },
    a: same("J (joul)"),
    d: [same("N (nyuton)"), same("W (vatt)"), same("V (volt)")],
  },
  {
    t: { uz: "Atomning markazida nima joylashgan?", ru: "Что находится в центре атома?", en: "What is located at the centre of an atom?" },
    a: { uz: "Yadro (proton va neytronlar)", ru: "Ядро (протоны и нейтроны)", en: "The nucleus (protons and neutrons)" },
    d: [
      { uz: "Faqat elektronlar", ru: "Только электроны", en: "Only electrons" },
      { uz: "Faqat fotonlar", ru: "Только фотоны", en: "Only photons" },
      { uz: "Bo'sh joy — atomdan ichida hech narsa yo'q", ru: "Пустота — внутри атома ничего нет", en: "Nothing — the inside of the atom is empty" },
    ],
  },
  {
    t: { uz: "Suv qanday haroratda qaynaydi (normal bosimda)?", ru: "При какой температуре кипит вода (при нормальном давлении)?", en: "At what temperature does water boil (at normal pressure)?" },
    a: same("100 °C"),
    d: [same("0 °C"), same("50 °C"), same("212 °C")],
  },
  {
    t: { uz: "Muz qanday haroratda eriydi (normal bosimda)?", ru: "При какой температуре тает лёд (при нормальном давлении)?", en: "At what temperature does ice melt (at normal pressure)?" },
    a: same("0 °C"),
    d: [same("100 °C"), same("-10 °C"), same("10 °C")],
  },
  {
    t: { uz: "Elektr tok kuchi qanday asbob bilan o'lchanadi?", ru: "Каким прибором измеряется сила электрического тока?", en: "Which instrument measures electric current?" },
    a: { uz: "Ampermetr", ru: "Амперметр", en: "Ammeter" },
    d: [
      { uz: "Termometr", ru: "Термометр", en: "Thermometer" },
      { uz: "Barometr", ru: "Барометр", en: "Barometer" },
      { uz: "Dinamometr", ru: "Динамометр", en: "Dynamometer" },
    ],
  },
  {
    t: { uz: "Quyidagilardan qaysi biri elektr tokni yaxshi o'tkazadi (o'tkazgich)?", ru: "Какой из перечисленных материалов хорошо проводит электрический ток (проводник)?", en: "Which of the following conducts electric current well (a conductor)?" },
    a: { uz: "Mis sim", ru: "Медная проволока", en: "Copper wire" },
    d: [
      { uz: "Kauchuk", ru: "Резина", en: "Rubber" },
      { uz: "Qog'oz", ru: "Бумага", en: "Paper" },
      { uz: "Plastmassa", ru: "Пластик", en: "Plastic" },
    ],
  },
];

function fizCalc(rng: Rng): QGen[] {
  const out: QGen[] = [];
  // v = s/t va o'zgarishlari (oson)
  for (let i = 0; i < 60; i++) {
    const v = rangeInt(rng, 3, 90);
    const t = rangeInt(rng, 2, 9);
    const s = v * t;
    const { o, correct } = numOptions(rng, v, Math.max(3, Math.round(v * 0.2)));
    out.push({
      t: {
        uz: `Avtomobil ${s} km yo'lni ${t} soatda bosib o'tdi. Uning tezligi nechaga teng (km/soat)?`,
        ru: `Автомобиль проехал ${s} км за ${t} ч. Какова его скорость (км/ч)?`,
        en: `A car covered ${s} km in ${t} hours. What is its speed (km/h)?`,
      },
      o,
      correct,
    });
  }
  for (let i = 0; i < 45; i++) {
    const v = rangeInt(rng, 4, 90);
    const t = rangeInt(rng, 2, 9);
    const s = v * t;
    const { o, correct } = numOptions(rng, s, Math.max(4, Math.round(s * 0.18)));
    out.push({
      t: {
        uz: `Velosipedchi ${v} km/soat tezlik bilan ${t} soat yurdi. U qancha yo'l bosib o'tdi (km)?`,
        ru: `Велосипедист ехал ${t} ч со скоростью ${v} км/ч. Какой путь он проехал (км)?`,
        en: `A cyclist rode for ${t} hours at ${v} km/h. What distance did they cover (km)?`,
      },
      o,
      correct,
    });
  }
  // ρ = m/V (o'rtacha)
  for (let i = 0; i < 55; i++) {
    const rho = [800, 900, 1000, 1100][rangeInt(rng, 0, 3)] as number;
    const V = [1, 2, 3, 4][rangeInt(rng, 0, 3)] as number;
    const m = rho * V;
    const { o, correct } = numOptions(rng, rho, Math.max(4, Math.round(rho * 0.15)));
    out.push({
      t: {
        uz: `Jismning hajmi ${V} m³, massasi ${m} kg. Zichligi nechaga teng (kg/m³)?`,
        ru: `Объём тела ${V} м³, масса ${m} кг. Чему равна плотность (кг/м³)?`,
        en: `The volume of a body is ${V} m³ and its mass is ${m} kg. What is its density (kg/m³)?`,
      },
      o,
      correct,
    });
  }
  // P = F/S (o'rtacha)
  for (let i = 0; i < 50; i++) {
    const P = [200, 400, 800, 1200][rangeInt(rng, 0, 3)] as number;
    const S = [0.5, 1, 2, 4][rangeInt(rng, 0, 3)] as number;
    const F = P * S;
    const { o, correct } = numOptions(rng, P, Math.max(5, Math.round(P * 0.2)));
    out.push({
      t: {
        uz: `Jismga ${F} N kuch ta'sir qilib, ${S} m² yuzaga bosim beradi. Bosim nechaga teng (Pa)?`,
        ru: `Сила ${F} Н действует на площадь ${S} м². Чему равно давление (Па)?`,
        en: `A force of ${F} N acts on an area of ${S} m². What is the pressure (Pa)?`,
      },
      o,
      correct,
    });
  }
  // A = F·s va P = A/t (o'rtacha)
  for (let i = 0; i < 55; i++) {
    const F = rangeInt(rng, 5, 60);
    const s = rangeInt(rng, 2, 9);
    const A = F * s;
    const { o, correct } = numOptions(rng, A, Math.max(5, Math.round(A * 0.2)));
    out.push({
      t: {
        uz: `${F} N kuch ta'siridagi jism ${s} m yo'l bosib o'tdi. Qilingan ish necha joul?`,
        ru: `Тело под действием силы ${F} Н прошло ${s} м. Какая работа совершена (Дж)?`,
        en: `A body acted upon by a force of ${F} N moved ${s} m. How much work was done (J)?`,
      },
      o,
      correct,
    });
  }
  for (let i = 0; i < 40; i++) {
    const P = rangeInt(rng, 10, 90) * 10;
    const t = rangeInt(rng, 2, 9);
    const A = P * t;
    const { o, correct } = numOptions(rng, P, Math.max(5, Math.round(P * 0.15)));
    out.push({
      t: {
        uz: `${t} soatda ${A} J ish bajarildi. Quvvat nechaga teng (vatt)?`,
        ru: `За ${t} ч совершена работа ${A} Дж. Чему равна мощность (Вт)?`,
        en: `In ${t} hours, ${A} J of work was done. What is the power (W)?`,
      },
      o,
      correct,
    });
  }
  // Ohm qonuni I = U/R (o'rtacha)
  for (let i = 0; i < 50; i++) {
    const I = rangeInt(rng, 2, 9);
    const R = rangeInt(rng, 2, 50);
    const U = I * R;
    const { o, correct } = numOptions(rng, I, 2);
    out.push({
      t: {
        uz: `Zanjirdagi kuchlanish ${U} V, qarshilik ${R} Om. Tok kuchi nechaga teng (amper)?`,
        ru: `Напряжение в цепи ${U} В, сопротивление ${R} Ом. Чему равна сила тока (А)?`,
        en: `The voltage in a circuit is ${U} V and the resistance is ${R} Ω. What is the current (A)?`,
      },
      o,
      correct,
    });
  }
  // Energijalar (o'rtacha)
  for (let i = 0; i < 50; i++) {
    const m = rangeInt(rng, 1, 20);
    const h = rangeInt(rng, 2, 30);
    const E = m * 10 * h;
    const { o, correct } = numOptions(rng, E, Math.max(5, Math.round(E * 0.18)));
    out.push({
      t: {
        uz: `${m} kg massali jism ${h} m balandlikda turibdi. Potensial energiyasi nechaga teng (g = 10 N/kg, J)?`,
        ru: `Тело массой ${m} кг находится на высоте ${h} м. Чему равна его потенциальная энергия (g = 10 Н/кг, Дж)?`,
        en: `A body of mass ${m} kg is at a height of ${h} m. What is its potential energy (g = 10 N/kg, J)?`,
      },
      o,
      correct,
    });
  }
  for (let i = 0; i < 45; i++) {
    const m = rangeInt(rng, 1, 20);
    const v = 2 * rangeInt(rng, 1, 10);
    const E = (m * v * v) / 2;
    const { o, correct } = numOptions(rng, E, Math.max(5, Math.round(E * 0.2)));
    out.push({
      t: {
        uz: `${m} kg massali, ${v} m/s tezlik bilan harakatlanuvchi jismning kinetik energiyasi nechaga teng (J)?`,
        ru: `Тело массой ${m} кг движется со скоростью ${v} м/с. Чему равна его кинетическая энергия (Дж)?`,
        en: `A body of mass ${m} kg moves at ${v} m/s. What is its kinetic energy (J)?`,
      },
      o,
      correct,
    });
  }
  // Q = cmΔT (o'rtacha/qiyin)
  for (let i = 0; i < 40; i++) {
    const m = [0.5, 1, 2][rangeInt(rng, 0, 2)] as number;
    const dT = rangeInt(rng, 5, 30);
    const Q = 4.2 * m * dT; // kJ (c suv = 4.2 kJ/(kg·K))
    const { o, correct } = numOptions(rng, Q, Math.max(3, Math.round(Q * 0.2)));
    out.push({
      t: {
        uz: `${m} kg suvni ${dT} °C ga qizdirish uchun qancha issiqlik kerak (kJ)?`,
        ru: `Сколько теплоты нужно, чтобы нагреть ${m} кг воды на ${dT} °C (кДж)?`,
        en: `How much heat is needed to warm ${m} kg of water by ${dT} °C (kJ)?`,
      },
      o,
      correct,
    });
  }
  // Qiyin: ketma-ket/parallel qarshilik
  const pairs: Array<[number, number, number]> = [
    [3, 6, 2], [4, 12, 3], [6, 12, 4], [10, 15, 6], [20, 30, 12], [8, 8, 4], [15, 30, 10], [2, 2, 1], [12, 24, 8], [30, 60, 20],
  ];
  for (let i = 0; i < 50; i++) {
    const pr = pairs[i % pairs.length] as [number, number, number];
    const [R1, R2, Rp] = pr;
    const { o, correct } = numOptions(rng, Rp, 2);
    out.push({
      t: {
        uz: `Ikki o'tkazgich (${R1} Om va ${R2} Om) parallel ulangan. Umumiy qarshilik nechaga teng (Om)?`,
        ru: `Два проводника (${R1} Ом и ${R2} Ом) соединены параллельно. Чему равно общее сопротивление (Ом)?`,
        en: `Two resistors (${R1} Ω and ${R2} Ω) are connected in parallel. What is the total resistance (Ω)?`,
      },
      o,
      correct,
    });
  }
  for (let i = 0; i < 40; i++) {
    const R1 = rangeInt(rng, 5, 40);
    const R2 = rangeInt(rng, 5, 40);
    const Rs = R1 + R2;
    const { o, correct } = numOptions(rng, Rs, Math.max(3, Math.round(Rs * 0.15)));
    out.push({
      t: {
        uz: `Ikki o'tkazgich (${R1} Om va ${R2} Om) ketma-ket ulangan. Umumiy qarshilik nechaga teng (Om)?`,
        ru: `Два проводника (${R1} Ом и ${R2} Ом) соединены последовательно. Чему равно общее сопротивление (Ом)?`,
        en: `Two resistors (${R1} Ω and ${R2} Ω) are connected in series. What is the total resistance (Ω)?`,
      },
      o,
      correct,
    });
  }
  // Foydali ish koeffitsienti
  for (let i = 0; i < 40; i++) {
    const eta = [25, 50, 60, 75, 80][rangeInt(rng, 0, 4)] as number;
    const Aj = 100 * rangeInt(rng, 2, 12);
    const Af = (Aj * eta) / 100;
    const { o, correct } = numOptions(rng, eta, 5);
    out.push({
      t: {
        uz: `Dvigatel ${Aj} J jami ish bajardi, shundan ${Af} J foydali ish. Foydali ish koeffitsienti necha %?`,
        ru: `Двигатель совершил полную работу ${Aj} Дж, из них полезная — ${Af} Дж. Чему равен КПД (%)?`,
        en: `An engine did ${Aj} J of total work, of which ${Af} J was useful. What is the efficiency (%)?`,
      },
      o,
      correct,
    });
  }
  // Arximed kuchi va gidrostatik bosim (qiyin)
  for (let i = 0; i < 35; i++) {
    const V = [0.02, 0.05, 0.1, 0.2][rangeInt(rng, 0, 3)] as number;
    const F = 10000 * V;
    const { o, correct } = numOptions(rng, F, Math.max(4, Math.round(F * 0.2)));
    out.push({
      t: {
        uz: `Suvga tushirilgan jismning hajmi ${V} m³. Undagi Arximed kuchi nechaga teng (N)?`,
        ru: `Объём тела, погружённого в воду, ${V} м³. Чему равна действующая на него сила Архимеда (Н)?`,
        en: `A body of volume ${V} m³ is submerged in water. What is the Archimedes force on it (N)?`,
      },
      o,
      correct,
    });
  }
  for (let i = 0; i < 35; i++) {
    const h = [5, 10, 15, 20, 25][rangeInt(rng, 0, 4)] as number;
    const p = 10 * h; // kPa
    const { o, correct } = numOptions(rng, p, Math.max(3, Math.round(p * 0.15)));
    out.push({
      t: {
        uz: `Suv ustunining balandligi ${h} m. Ustunning tubidagi gidrostatik bosim qancha (kPa)?`,
        ru: `Высота столба воды ${h} м. Чему равно гидростатическое давление на дне (кПа)?`,
        en: `The height of a water column is ${h} m. What is the hydrostatic pressure at the bottom (kPa)?`,
      },
      o,
      correct,
    });
  }
  return dedupe(out);
}

function fizFacts(rng: Rng): QGen[] {
  const out: QGen[] = [];
  for (let k = 0; k < 4; k++) {
    for (const f of FIZ_FACTS) {
      const { o, correct } = optionsFor(rng, f.a, shuffle(rng, f.d));
      out.push({ t: f.t, o, correct });
    }
  }
  return dedupe(out);
}

/* ================= KIMYO ================= */

type Elem = { s: string; uz: string; ru: string; en: string; metal: boolean };
const ELEMENTS: Elem[] = [
  { s: "H", uz: "Vodorod", ru: "Водород", en: "Hydrogen", metal: false },
  { s: "O", uz: "Kislorod", ru: "Кислород", en: "Oxygen", metal: false },
  { s: "N", uz: "Azot", ru: "Азот", en: "Nitrogen", metal: false },
  { s: "C", uz: "Uglerod", ru: "Углерод", en: "Carbon", metal: false },
  { s: "S", uz: "Oltingugurt", ru: "Сера", en: "Sulfur", metal: false },
  { s: "Cl", uz: "Xlor", ru: "Хлор", en: "Chlorine", metal: false },
  { s: "P", uz: "Fosfor", ru: "Фосфор", en: "Phosphorus", metal: false },
  { s: "Na", uz: "Natriy", ru: "Натрий", en: "Sodium", metal: true },
  { s: "K", uz: "Kaliy", ru: "Калий", en: "Potassium", metal: true },
  { s: "Ca", uz: "Kalsiy", ru: "Кальций", en: "Calcium", metal: true },
  { s: "Mg", uz: "Magniy", ru: "Магний", en: "Magnesium", metal: true },
  { s: "Al", uz: "Alyuminiy", ru: "Алюминий", en: "Aluminium", metal: true },
  { s: "Fe", uz: "Temir", ru: "Железо", en: "Iron", metal: true },
  { s: "Cu", uz: "Mis", ru: "Медь", en: "Copper", metal: true },
  { s: "Zn", uz: "Rux", ru: "Цинк", en: "Zinc", metal: true },
  { s: "Ag", uz: "Kumush", ru: "Серебро", en: "Silver", metal: true },
  { s: "Au", uz: "Oltin", ru: "Золото", en: "Gold", metal: true },
  { s: "Hg", uz: "Simob", ru: "Ртуть", en: "Mercury", metal: true },
  { s: "Pb", uz: "Qo'rg'oshin", ru: "Свинец", en: "Lead", metal: true },
  { s: "Sn", uz: "Qalay", ru: "Олово", en: "Tin", metal: true },
  { s: "Li", uz: "Litij", ru: "Литий", en: "Lithium", metal: true },
  { s: "Ni", uz: "Nikel", ru: "Никель", en: "Nickel", metal: true },
  { s: "Cr", uz: "Xrom", ru: "Хром", en: "Chromium", metal: true },
  { s: "Mn", uz: "Marganes", ru: "Марганец", en: "Manganese", metal: true },
];

const MASS: Record<string, number> = {
  H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, P: 31, S: 32, Cl: 35.5,
  K: 39, Ca: 40, Fe: 56, Cu: 64, Zn: 65, Ag: 108, I: 127, Ba: 137, Pb: 207,
};

type Comp = { f: string; name: L3; atoms: number; parts: Record<string, number> };
const COMPOUNDS: Comp[] = [
  { f: "H2O", name: { uz: "Suv", ru: "Вода", en: "Water" }, atoms: 3, parts: { H: 2, O: 1 } },
  { f: "CO2", name: { uz: "Karbonat angidrid", ru: "Углекислый газ", en: "Carbon dioxide" }, atoms: 3, parts: { C: 1, O: 2 } },
  { f: "O2", name: { uz: "Kislorod", ru: "Кислород", en: "Oxygen" }, atoms: 2, parts: { O: 2 } },
  { f: "N2", name: { uz: "Azot", ru: "Азот", en: "Nitrogen" }, atoms: 2, parts: { N: 2 } },
  { f: "H2", name: { uz: "Vodorod", ru: "Водород", en: "Hydrogen" }, atoms: 2, parts: { H: 2 } },
  { f: "NaCl", name: { uz: "Osh tuzi", ru: "Поваренная соль", en: "Table salt" }, atoms: 2, parts: { Na: 1, Cl: 1 } },
  { f: "CH4", name: { uz: "Metan", ru: "Метан", en: "Methane" }, atoms: 5, parts: { C: 1, H: 4 } },
  { f: "NH3", name: { uz: "Ammiak", ru: "Аммиак", en: "Ammonia" }, atoms: 4, parts: { N: 1, H: 3 } },
  { f: "HCl", name: { uz: "Xlorid kislota", ru: "Соляная кислота", en: "Hydrochloric acid" }, atoms: 2, parts: { H: 1, Cl: 1 } },
  { f: "H2SO4", name: { uz: "Sulfat kislota", ru: "Серная кислота", en: "Sulfuric acid" }, atoms: 7, parts: { H: 2, S: 1, O: 4 } },
  { f: "HNO3", name: { uz: "Nitrat kislota", ru: "Азотная кислота", en: "Nitric acid" }, atoms: 5, parts: { H: 1, N: 1, O: 3 } },
  { f: "CaCO3", name: { uz: "Kalsiy karbonat", ru: "Карбонат кальция", en: "Calcium carbonate" }, atoms: 5, parts: { Ca: 1, C: 1, O: 3 } },
  { f: "NaOH", name: { uz: "Natriy gidroksid", ru: "Гидроксид натрия", en: "Sodium hydroxide" }, atoms: 3, parts: { Na: 1, O: 1, H: 1 } },
  { f: "CaO", name: { uz: "Kalsiy oksidi", ru: "Оксид кальция", en: "Calcium oxide" }, atoms: 2, parts: { Ca: 1, O: 1 } },
  { f: "MgO", name: { uz: "Magniy oksidi", ru: "Оксид магния", en: "Magnesium oxide" }, atoms: 2, parts: { Mg: 1, O: 1 } },
  { f: "Al2O3", name: { uz: "Alyuminiy oksidi", ru: "Оксид алюминия", en: "Aluminium oxide" }, atoms: 5, parts: { Al: 2, O: 3 } },
  { f: "Fe2O3", name: { uz: "Temir (III) oksidi", ru: "Оксид железа(III)", en: "Iron(III) oxide" }, atoms: 5, parts: { Fe: 2, O: 3 } },
  { f: "CuO", name: { uz: "Mis (II) oksidi", ru: "Оксид меди(II)", en: "Copper(II) oxide" }, atoms: 2, parts: { Cu: 1, O: 1 } },
  { f: "CO", name: { uz: "Uglerod monoksidi", ru: "Угарный газ", en: "Carbon monoxide" }, atoms: 2, parts: { C: 1, O: 1 } },
  { f: "SO2", name: { uz: "Oltingugurt dioksidi", ru: "Диоксид серы", en: "Sulfur dioxide" }, atoms: 3, parts: { S: 1, O: 2 } },
  { f: "SO3", name: { uz: "Oltingugurt trioksidi", ru: "Триоксид серы", en: "Sulfur trioxide" }, atoms: 4, parts: { S: 1, O: 3 } },
  { f: "NO2", name: { uz: "Azot (IV) oksidi", ru: "Диоксид азота", en: "Nitrogen dioxide" }, atoms: 3, parts: { N: 1, O: 2 } },
  { f: "P2O5", name: { uz: "Fosfor (V) oksidi", ru: "Оксид фосфора(V)", en: "Phosphorus(V) oxide" }, atoms: 7, parts: { P: 2, O: 5 } },
  { f: "Na2CO3", name: { uz: "Soda", ru: "Сода", en: "Sodium carbonate" }, atoms: 6, parts: { Na: 2, C: 1, O: 3 } },
  { f: "Ca(OH)2", name: { uz: "Kalsiy gidroksid", ru: "Гидроксид кальция", en: "Calcium hydroxide" }, atoms: 5, parts: { Ca: 1, O: 2, H: 2 } },
  { f: "CuSO4", name: { uz: "Mis kuporosi", ru: "Медный купорос", en: "Copper sulfate" }, atoms: 6, parts: { Cu: 1, S: 1, O: 4 } },
  { f: "K2O", name: { uz: "Kaliy oksidi", ru: "Оксид калия", en: "Potassium oxide" }, atoms: 3, parts: { K: 2, O: 1 } },
  { f: "CaCl2", name: { uz: "Kalsiy xlorid", ru: "Хлорид кальция", en: "Calcium chloride" }, atoms: 3, parts: { Ca: 1, Cl: 2 } },
  { f: "NaNO3", name: { uz: "Natriy nitrat", ru: "Нитрат натрия", en: "Sodium nitrate" }, atoms: 5, parts: { Na: 1, N: 1, O: 3 } },
  { f: "C2H5OH", name: { uz: "Etanol", ru: "Этанол", en: "Ethanol" }, atoms: 9, parts: { C: 2, H: 6, O: 1 } },
  { f: "C6H12O6", name: { uz: "Glukoza", ru: "Глюкоза", en: "Glucose" }, atoms: 24, parts: { C: 6, H: 12, O: 6 } },
];

function molarMass(c: Comp): number {
  let m = 0;
  for (const [el, n] of Object.entries(c.parts)) {
    m += (MASS[el] ?? 0) * n;
  }
  return Math.round(m * 10) / 10;
}

const SYM_UZ = [
  (s: string) => `${s} elementi qanday nomlanadi?`,
  (s: string) => `Kimyoda ${s} belgisi qaysi elementga tegishli (nomi)?`,
  (s: string) => `Periodik jadvalda ${s} belgisi qanday elementni bildiradi?`,
];
const SYM_RU = [
  (s: string) => `Как называется элемент ${s}?`,
  (s: string) => `Какому элементу соответствует символ ${s}?`,
  (s: string) => `Что означает символ ${s} в периодической таблице?`,
];
const SYM_EN = [
  (s: string) => `What is the name of the element ${s}?`,
  (s: string) => `Which element does the symbol ${s} stand for?`,
  (s: string) => `What element does ${s} represent in the periodic table?`,
];
const NAME_UZ = [
  (n: string) => `${n} elementining belgisi qaysi biri?`,
  (n: string) => `${n} kimyoviy elementining qisqacha belgisini toping.`,
  (n: string) => `Periodik jadvalda ${n} qanday belgi bilan yoziladi?`,
];
const NAME_RU = [
  (n: string) => `Какое обозначение у элемента ${n}?`,
  (n: string) => `Найдите краткое обозначение элемента ${n}.`,
  (n: string) => `Как записывается ${n} в периодической таблице?`,
];
const NAME_EN = [
  (n: string) => `What is the symbol of the element ${n}?`,
  (n: string) => `Find the short symbol of the element ${n}.`,
  (n: string) => `How is ${n} written in the periodic table?`,
];

function kimEasy(rng: Rng): QGen[] {
  const out: QGen[] = [];
  // Belgisi → nomi
  for (let k = 0; k < SYM_UZ.length; k++) {
    for (const e of ELEMENTS) {
      const distr = ELEMENTS.filter((x) => x.s !== e.s).map((x) => ({ uz: x.uz, ru: x.ru, en: x.en }));
      const { o, correct } = optionsFor(rng, { uz: e.uz, ru: e.ru, en: e.en }, distr);
      out.push({
        t: { uz: SYM_UZ[k]!(e.s), ru: SYM_RU[k]!(e.s), en: SYM_EN[k]!(e.s) },
        o,
        correct,
      });
    }
  }
  // Nomi → belgisi
  for (let k = 0; k < NAME_UZ.length; k++) {
    for (const e of ELEMENTS) {
      const distr = ELEMENTS.filter((x) => x.s !== e.s).map((x) => same(x.s));
      const { o, correct } = optionsFor(rng, same(e.s), distr);
      out.push({
        t: { uz: NAME_UZ[k]!(e.uz), ru: NAME_RU[k]!(e.ru), en: NAME_EN[k]!(e.en) },
        o,
        correct,
      });
    }
  }
  // Metall yoki nometall
  const MET = { uz: "Metall", ru: "Металл", en: "A metal" };
  const NONMET = { uz: "Nometall", ru: "Неметалл", en: "A nonmetal" };
  const SEMI = { uz: "Yarim o'tkazgich", ru: "Полупроводник", en: "A semiconductor" };
  const GAZ = { uz: "Muxlat gaz", ru: "Инертный газ", en: "A noble gas" };
  const METQ_UZ = [
    (n: string, s: string) => `${n} (${s}) — qanday turdagi element?`,
    (n: string, s: string) => `${s} elementi metallmi yoki nometallmi?`,
    (n: string, s: string) => `${n} ning kimyoviy xususiyati: metall yoki nometall?`,
  ];
  const METQ_RU = [
    (n: string, s: string) => `${n} (${s}) — элемент какого типа?`,
    (n: string, s: string) => `Элемент ${s} — это металл или неметалл?`,
    (n: string, s: string) => `Химическая природа ${n}: металл или неметалл?`,
  ];
  const METQ_EN = [
    (n: string, s: string) => `What type of element is ${n} (${s})?`,
    (n: string, s: string) => `Is the element ${s} a metal or a nonmetal?`,
    (n: string, s: string) => `The chemical nature of ${n}: metal or nonmetal?`,
  ];
  for (let k = 0; k < METQ_UZ.length; k++) {
    for (const e of ELEMENTS) {
      const correct = e.metal ? MET : NONMET;
      const distr = e.metal ? [NONMET, SEMI, GAZ] : [MET, SEMI, GAZ];
      const { o, correct: ci } = optionsFor(rng, correct, distr);
      out.push({
        t: { uz: METQ_UZ[k]!(e.uz, e.s), ru: METQ_RU[k]!(e.ru, e.s), en: METQ_EN[k]!(e.en, e.s) },
        o,
        correct: ci,
      });
    }
  }
  // Tartib raqami (Z)
  const ZNUMS: Record<string, number> = { H: 1, He: 2, Li: 3, C: 6, N: 7, O: 8, F: 9, Na: 11, Mg: 12, Al: 13, Si: 14, P: 15, S: 16, Cl: 17, K: 19, Ca: 20, Fe: 26, Cu: 29, Zn: 30, Ag: 47, Au: 79, Hg: 80 };
  for (let k = 0; k < 4; k++) {
    for (const [s, z] of Object.entries(ZNUMS)) {
      const e = ELEMENTS.find((x) => x.s === s);
      if (!e) continue;
      const { o, correct } = numOptions(rng, z, 3);
      out.push({
        t: {
          uz: k === 0 ? `${s} (${e.uz}) elementining tartib raqami nechaga teng?` : `Periodik jadvalda ${e.uz}ning (${s}) tartib raqami qanday?`,
          ru: k === 0 ? `Чему равен порядковый номер элемента ${s} (${e.ru})?` : `Каков порядковый номер ${e.ru} (${s}) в таблице?`,
          en: k === 0 ? `What is the atomic number of ${s} (${e.en})?` : `What is the atomic number of ${e.en} (${s}) in the table?`,
        },
        o,
        correct,
      });
    }
  }
  // Birinchi harfi bo'yicha
  for (let k = 0; k < 2; k++) {
    for (const e of ELEMENTS) {
      const sameLetter = ELEMENTS.filter((x) => x.s !== e.s && x.s[0] === e.s[0]).map((x) => ({ uz: x.uz, ru: x.ru, en: x.en }));
      const otherLetter = ELEMENTS.filter((x) => x.s[0] !== e.s[0]).map((x) => ({ uz: x.uz, ru: x.ru, en: x.en }));
      const { o, correct } = optionsFor(rng, { uz: e.uz, ru: e.ru, en: e.en }, shuffle(rng, [...sameLetter, ...otherLetter]));
      out.push({
        t: {
          uz: `Belgisi «${e.s}» bilan boshlanadigan element qaysi?`,
          ru: `Какой элемент имеет символ, начинающийся с «${e.s}»?`,
          en: `Which element has a symbol starting with “${e.s}”?`,
        },
        o,
        correct,
      });
    }
  }
  return dedupe(out);
}

function kimMiddle(rng: Rng): QGen[] {
  const out: QGen[] = [];
  // Molyar massa
  const MM_UZ = [
    (f: string, n: string) => `${f} (${n}) molyar massasi nechaga teng (g/mol)?`,
    (f: string, n: string) => `${n}ning (${f}) nisbiy molekulyar massasi qancha?`,
    (f: string, n: string) => `1 mol ${f} (${n}) ning massasi necha gramm?`,
  ];
  const MM_RU = [
    (f: string, n: string) => `Чему равна молярная масса ${f} (${n}) (г/моль)?`,
    (f: string, n: string) => `Какова относительная молекулярная масса ${n} (${f})?`,
    (f: string, n: string) => `Какова масса 1 моль ${f} (${n}) в граммах?`,
  ];
  const MM_EN = [
    (f: string, n: string) => `What is the molar mass of ${f} (${n}) (g/mol)?`,
    (f: string, n: string) => `What is the relative molecular mass of ${n} (${f})?`,
    (f: string, n: string) => `What is the mass of 1 mol of ${f} (${n}) in grams?`,
  ];
  for (let k = 0; k < 3; k++) {
    for (const c of COMPOUNDS) {
      const M = molarMass(c);
      const { o, correct } = numOptions(rng, M, Math.max(2, Math.round(M * 0.2)));
      out.push({
        t: { uz: MM_UZ[k]!(c.f, c.name.uz), ru: MM_RU[k]!(c.f, c.name.ru), en: MM_EN[k]!(c.f, c.name.en) },
        o,
        correct,
      });
    }
  }
  // Atomlar soni
  const ATOM_UZ = [
    (f: string) => `${f} formulada jami nechta atom bor?`,
    (f: string) => `${f} bir molekulasida nechta atom mavjud?`,
    (f: string) => `${f} birikmasining bitta molekulasini tashkil etuvchi atomlar soni?`,
  ];
  const ATOM_RU = [
    (f: string) => `Сколько всего атомов в формуле ${f}?`,
    (f: string) => `Сколько атомов в одной молекуле ${f}?`,
    (f: string) => `Из скольких атомов состоит одна молекула ${f}?`,
  ];
  const ATOM_EN = [
    (f: string) => `How many atoms are there in total in the formula ${f}?`,
    (f: string) => `How many atoms are in one molecule of ${f}?`,
    (f: string) => `How many atoms make up one molecule of ${f}?`,
  ];
  for (let k = 0; k < 3; k++) {
    for (const c of COMPOUNDS) {
      const { o, correct } = numOptions(rng, c.atoms, 2);
      out.push({
        t: { uz: ATOM_UZ[k]!(c.f), ru: ATOM_RU[k]!(c.f), en: ATOM_EN[k]!(c.f) },
        o,
        correct,
      });
    }
  }
  // Oksidni aniqlash
  const oxidQ = ["CO2", "CaO", "Al2O3", "SO2", "Fe2O3", "MgO", "K2O", "CuO", "SO3", "P2O5", "NO2", "CO"];
  for (let k = 0; k < 4; k++) {
    for (const f of oxidQ) {
      const c = COMPOUNDS.find((x) => x.f === f) as Comp;
      const distr = COMPOUNDS.filter((x) => !oxidQ.includes(x.f) || x.f === f)
        .filter((x) => x.f !== f)
        .map((x) => same(x.f));
      const { o, correct } = optionsFor(rng, same(c.f), distr);
      out.push({
        t: {
          uz: "Quyidagilardan qaysi biri oksid?",
          ru: "Какое из перечисленных веществ является оксидом?",
          en: "Which of the following is an oxide?",
        },
        o,
        correct,
      });
    }
  }
  // Sinflash: kislota / tuz / asos
  const ACIDS = new Set(["HCl", "H2SO4", "HNO3"]);
  const SALTS = new Set(["NaCl", "CaCO3", "Na2CO3", "CaCl2", "NaNO3", "CuSO4"]);
  const BASES = new Set(["NaOH", "Ca(OH)2", "KOH"]);
  for (let k = 0; k < 3; k++) {
    for (const c of COMPOUNDS) {
      let cls: { uz: string; ru: string; en: string };
      if (ACIDS.has(c.f)) cls = { uz: "Kislota", ru: "Кислота", en: "An acid" };
      else if (SALTS.has(c.f)) cls = { uz: "Tuz", ru: "Соль", en: "A salt" };
      else if (BASES.has(c.f)) cls = { uz: "Asos (gidroksid)", ru: "Основание (гидроксид)", en: "A base (hydroxide)" };
      else cls = { uz: "Oksid", ru: "Оксид", en: "An oxide" };
      const distr = [
        { uz: "Kislota", ru: "Кислота", en: "An acid" },
        { uz: "Tuz", ru: "Соль", en: "A salt" },
        { uz: "Asos (gidroksid)", ru: "Основание (гидроксид)", en: "A base (hydroxide)" },
        { uz: "Oksid", ru: "Оксид", en: "An oxide" },
      ].filter((x) => x.uz !== cls.uz);
      const { o, correct } = optionsFor(rng, cls, distr);
      out.push({
        t: {
          uz: `${c.f} (${c.name.uz}) — qanday sinfga mansub birikma?`,
          ru: `${c.f} (${c.name.ru}) — к какому классу относится?`,
          en: `${c.f} (${c.name.en}) — to which class does it belong?`,
        },
        o,
        correct,
      });
    }
  }
  // Element atomlari soni birikmada
  for (let k = 0; k < 2; k++) {
    for (const c of COMPOUNDS) {
      for (const el of Object.keys(c.parts)) {
        const n = c.parts[el] as number;
        const { o, correct } = numOptions(rng, n, 2);
        out.push({
          t: {
            uz: k === 0 ? `${c.f} tarkibida nechta ${el} atomi bor?` : `${c.f} ning bitta molekulasidagi ${el} atomlari soni?`,
            ru: k === 0 ? `Сколько атомов ${el} содержится в ${c.f}?` : `Число атомов ${el} в одной молекуле ${c.f}?`,
            en: k === 0 ? `How many ${el} atoms does ${c.f} contain?` : `The number of ${el} atoms in one molecule of ${c.f}?`,
          },
          o,
          correct,
        });
      }
    }
  }
  return dedupe(out);
}

function kimHard(rng: Rng): QGen[] {
  const out: QGen[] = [];
  // Massa ulushi (barcha elementlar + 2 ibora)
  const MF_UZ = [
    (f: string, el: string) => `${f} tarkibidagi ${el} elementining massa ulushi necha %?`,
    (f: string, el: string) => `${f} birikmasida ${el} ning massa ulushini (% da) hisoblang.`,
  ];
  const MF_RU = [
    (f: string, el: string) => `Какова массовая доля элемента ${el} в ${f} (%)?`,
    (f: string, el: string) => `Вычислите массовую долю ${el} в соединении ${f} (%).`,
  ];
  const MF_EN = [
    (f: string, el: string) => `What is the mass fraction of the element ${el} in ${f} (%)?`,
    (f: string, el: string) => `Calculate the mass fraction of ${el} in the compound ${f} (%).`,
  ];
  for (let k = 0; k < MF_UZ.length; k++) {
    for (const c of COMPOUNDS.filter((x) => Object.keys(x.parts).length >= 2)) {
      const M = molarMass(c);
      for (const el of Object.keys(c.parts)) {
        const w = Math.round(((MASS[el] ?? 0) * (c.parts[el] as number) * 1000) / M) / 10;
        const { o, correct } = numOptions(rng, w, Math.max(2, Math.round(w * 0.25)), (n) => String(n));
        out.push({
          t: { uz: MF_UZ[k]!(c.f, el), ru: MF_RU[k]!(c.f, el), en: MF_EN[k]!(c.f, el) },
          o,
          correct,
        });
      }
    }
  }
  // Mol ↔ massa (teskari: mol → massa)
  for (let k = 0; k < 4; k++) {
    for (const c of COMPOUNDS.slice(0, 16)) {
      const M = molarMass(c);
      const n = [1, 2, 3, 0.5][rangeInt(rng, 0, 3)] as number;
      const m = Math.round(M * n * 10) / 10;
      const { o, correct } = numOptions(rng, m, Math.max(2, Math.round(m * 0.2)), (v) => String(v));
      out.push({
        t: {
          uz: k % 2 === 0 ? `${n} mol ${c.f} ning massasi necha gramm?` : `${c.f} (${n} mol) ni massada hisoblang (g).`,
          ru: k % 2 === 0 ? `Чему равна масса ${n} моль ${c.f} (г)?` : `Вычислите массу ${n} моль ${c.f} (г).`,
          en: k % 2 === 0 ? `What is the mass of ${n} mol of ${c.f} (g)?` : `Calculate the mass of ${n} mol of ${c.f} (g).`,
        },
        o,
        correct,
      });
    }
  }
  // Hajm teskari: V → n
  for (let k = 0; k < 2; k++) {
    for (const n of [0.5, 1, 2, 3, 4]) {
      const V = Math.round(22.4 * n * 10) / 10;
      const { o, correct } = numOptions(rng, n, 1.5, (v) => String(v));
      out.push({
        t: {
          uz: `${V} litr gaz (n.sh. da) necha mol?`,
          ru: `Сколько моль газа занимает ${V} л (при н.у.)?`,
          en: `How many moles of gas occupy ${V} litres (at STP)?`,
        },
        o,
        correct,
      });
    }
  }
  // Mol ↔ massa
  for (let k = 0; k < 7; k++) {
    for (const c of COMPOUNDS.slice(0, 16)) {
      const M = molarMass(c);
      const n = [1, 2, 3, 0.5][rangeInt(rng, 0, 3)] as number;
      const m = Math.round(M * n * 10) / 10;
      const { o, correct } = numOptions(rng, n, 1.5, (v) => String(v));
      out.push({
        t: {
          uz: `${m} g ${c.f} qanday modda mol miqdoriga teng?`,
          ru: `Сколько молей составляет ${m} г вещества ${c.f}?`,
          en: `How many moles is ${m} g of ${c.f}?`,
        },
        o,
        correct,
      });
    }
  }
  // Hajm: V = 22.4n
  for (let k = 0; k < 6; k++) {
    for (const n of [0.5, 1, 2, 3, 4]) {
      const V = Math.round(22.4 * n * 10) / 10;
      const { o, correct } = numOptions(rng, V, 3, (v) => String(v));
      out.push({
        t: {
          uz: `${n} mol gaz (n.sh. da) qancha hajm egallaydi (litr)?`,
          ru: `Какой объём (при н.у.) занимает ${n} моль газа (л)?`,
          en: `What volume (at STP) does ${n} mol of gas occupy (litres)?`,
        },
        o,
        correct,
      });
    }
  }
  // Stexiometriya
  const REACTIONS: Array<{ r: string; a: string; b: string; ra: number; rb: number }> = [
    { r: "2H2 + O2 → 2H2O", a: "H2", b: "O2", ra: 2, rb: 1 },
    { r: "2Mg + O2 → 2MgO", a: "Mg", b: "O2", ra: 2, rb: 1 },
    { r: "4Al + 3O2 → 2Al2O3", a: "Al", b: "O2", ra: 4, rb: 3 },
    { r: "CH4 + 2O2 → CO2 + 2H2O", a: "CH4", b: "O2", ra: 1, rb: 2 },
    { r: "2H2O → 2H2 + O2", a: "H2O", b: "O2", ra: 2, rb: 1 },
    { r: "C + O2 → CO2", a: "C", b: "O2", ra: 1, rb: 1 },
    { r: "2CO + O2 → 2CO2", a: "CO", b: "O2", ra: 2, rb: 1 },
    { r: "N2 + 3H2 → 2NH3", a: "N2", b: "H2", ra: 1, rb: 3 },
    { r: "CaCO3 → CaO + CO2", a: "CaCO3", b: "CO2", ra: 1, rb: 1 },
    { r: "Zn + 2HCl → ZnCl2 + H2", a: "Zn", b: "HCl", ra: 1, rb: 2 },
    { r: "2Na + Cl2 → 2NaCl", a: "Na", b: "Cl2", ra: 2, rb: 1 },
  ];
  for (let k = 0; k < 8; k++) {
    for (const re of REACTIONS) {
      const na = [2, 4, 6, 8, 10][rangeInt(rng, 0, 4)] as number;
      const nb = (na * re.rb) / re.ra;
      if (!Number.isInteger(nb)) continue;
      const { o, correct } = numOptions(rng, nb, Math.max(2, Math.round(nb * 0.3)));
      out.push({
        t: {
          uz: `${re.r} reaksiyasi bo'yicha ${na} mol ${re.a} uchun necha mol ${re.b} kerak?`,
          ru: `По реакции ${re.r} сколько моль ${re.b} нужно для ${na} моль ${re.a}?`,
          en: `For the reaction ${re.r}, how many moles of ${re.b} are needed for ${na} mol of ${re.a}?`,
        },
        o,
        correct,
      });
    }
  }
  // Fakts
  const CHEM_FACTS: Array<{ t: L3; a: L3; d: L3[] }> = [
    {
      t: { uz: "Neytral muhitning pH qiymati nechaga teng?", ru: "Чему равно pH нейтральной среды?", en: "What is the pH of a neutral environment?" },
      a: same("7"),
      d: [same("0"), same("14"), same("1")],
    },
    {
      t: { uz: "Kislotalar muhitida lakmus qanday rangga bo'yaladi?", ru: "В кислой среде лакмус какого цвета?", en: "What colour does litmus turn in an acidic environment?" },
      a: { uz: "Qizil", ru: "Красный", en: "Red" },
      d: [
        { uz: "Ko'k", ru: "Синий", en: "Blue" },
        { uz: "Yashil", ru: "Зелёный", en: "Green" },
        { uz: "Sariq", ru: "Жёлтый", en: "Yellow" },
      ],
    },
    {
      t: { uz: "Suvning kimyoviy formulasi qaysi biri?", ru: "Какова химическая формула воды?", en: "What is the chemical formula of water?" },
      a: same("H2O"),
      d: [same("CO2"), same("NaCl"), same("O2")],
    },
    {
      t: { uz: "Periodik jadvalda eng yengil element qaysi?", ru: "Какой элемент самый лёгкий в периодической таблице?", en: "Which is the lightest element in the periodic table?" },
      a: { uz: "Vodorod (H)", ru: "Водород (H)", en: "Hydrogen (H)" },
      d: [
        { uz: "Geliy (He)", ru: "Гелий (He)", en: "Helium (He)" },
        { uz: "Kislorod (O)", ru: "Кислород (O)", en: "Oxygen (O)" },
        { uz: "Uglerod (C)", ru: "Углерод (C)", en: "Carbon (C)" },
      ],
    },
  ];
  for (let k = 0; k < 12; k++) {
    for (const f of CHEM_FACTS) {
      const { o, correct } = optionsFor(rng, f.a, shuffle(rng, f.d));
      out.push({ t: f.t, o, correct });
    }
  }
  return dedupe(out);
}

/* ================= EXPORTS ================= */

export function genMatematika(dif: string): QGen[] {
  if (dif === "easy") return matEasy(rngOf("mat-easy"));
  if (dif === "middle") return matMiddle(rngOf("mat-middle"));
  return matHard(rngOf("mat-hard"));
}

export function genFizika(dif: string): QGen[] {
  const rng = rngOf(`fiz-${dif}`);
  const calc = dedupe(fizCalc(rngOf(`fiz-calc-${dif}`)));
  const facts = fizFacts(rng);
  if (dif === "easy") {
    return dedupe([...facts, ...calc.filter((_, i) => i % 3 !== 1)]);
  }
  if (dif === "middle") {
    return dedupe([...facts, ...calc.filter((_, i) => i % 3 !== 2)]);
  }
  return dedupe([...calc, ...facts]);
}

export function genKimyo(dif: string): QGen[] {
  if (dif === "easy") return kimEasy(rngOf("kim-easy"));
  if (dif === "middle") return kimMiddle(rngOf("kim-middle"));
  return kimHard(rngOf("kim-hard"));
}
