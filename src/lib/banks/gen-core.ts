/**
 * Savollar generatori — yadro yordamchilari.
 * Har bir test uchun deterministik RNG (ayni key masal — ayni natija),
 * L3 = uch tildagi matn (uz/ru/en), QGen = to'liq savol (tarjima bilan).
 */

export type L3 = { uz: string; ru: string; en: string };
export type QGen = { t: L3; o: L3[]; correct: number; audio?: string };

export const BANK_TARGET = 300;

export type Rng = () => number;

/** FNV-1a hash — stringdan barqaror seed */
export function seedOf(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — deterministik taqsimot */
export function rngOf(key: string): Rng {
  let a = seedOf(key);
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rng: Rng, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)] as T;
}

export function shuffle<T>(rng: Rng, arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = a[i] as T;
    a[i] = a[j] as T;
    a[j] = tmp;
  }
  return a;
}

/** Barcha tillarda bir xil matn (raqamlar, yillar, bir xil atamalar) */
export function same(s: string): L3 {
  return { uz: s, ru: s, en: s };
}

/**
 * Variantlar: to'g'ri javob + 3 xil distraktor (matni takrorlanmaydigan),
 * aralashtirilgan. Distraktorlar uz matni bo'yicha farqlanadi.
 */
export function optionsFor(
  rng: Rng,
  correct: L3,
  distractors: L3[]
): { o: L3[]; correct: number } {
  // Har uch tilda ham to'g'ri javobdan farq qiladigan va o'zaro takrorlanmaydigan
  // distraktorlarni tanlaymiz (EN/RU variantlarda dublikat chiqmasligi uchun).
  const seen = new Set<string>([correct.uz, correct.ru, correct.en]);
  const pool: L3[] = [];
  for (const d of shuffle(rng, distractors)) {
    if (pool.length >= 3) break;
    const key = `${d.uz}|${d.ru}|${d.en}`;
    if (seen.has(d.uz) || seen.has(d.ru) || seen.has(d.en)) continue;
    seen.add(d.uz);
    seen.add(d.ru);
    seen.add(d.en);
    seen.add(key);
    pool.push(d);
  }
  const all = shuffle(rng, [correct, ...pool]);
  return { o: all, correct: all.findIndex((x) => x.uz === correct.uz) };
}

/** Raqamli variantlar: to'g'ri javob va yaqin (ammo xil) sonlar */
export function numOptions(
  rng: Rng,
  correct: number,
  spread: number,
  fmt: (n: number) => string = String
): { o: L3[]; correct: number } {
  const used = new Set<number>([correct]);
  const distr: number[] = [];
  let guard = 0;
  while (distr.length < 3 && guard++ < 400) {
    const grow = guard > 200 ? Math.ceil(guard / 100) : 1;
    const delta = (rng() < 0.5 ? -1 : 1) * (Math.ceil(rng() * Math.max(1, spread)) * grow);
    const v = correct + delta;
    if (Number.isFinite(v) && !used.has(v)) {
      used.add(v);
      distr.push(v);
    }
  }
  const all = shuffle(rng, [correct, ...distr]);
  const o = all.map((n) => same(fmt(n)));
  return { o, correct: all.findIndex((n) => n === correct) };
}

/** Javoblar soni to'liq 4 ta bo'lishini kafolatlash (aqlli to'ldiruvchi) */
export function ensureFour(
  rng: Rng,
  built: { o: L3[]; correct: number },
  filler: L3[]
): { o: L3[]; correct: number } {
  let { o, correct } = built;
  for (const f of filler) {
    if (o.length >= 4) break;
    if (!o.some((x) => x.uz === f.uz)) {
      o = [...o, f];
    }
  }
  // yangi qo'shilganlar bilan indeks qayta hisoblanadi
  const idx = o.findIndex((x) => x.uz === built.o[correct]?.uz);
  const sh = shuffle(rng, o);
  return { o: sh, correct: sh.findIndex((x) => x.uz === o[idx]?.uz) };
}

/** Uz matni bo'yicha takrorlarni olib tashlash (audio bilan birga yoki audio siz) */
export function dedupe(qs: QGen[], withAudio = false): QGen[] {
  const seen = new Set<string>();
  const out: QGen[] = [];
  for (const q of qs) {
    const correctVal = q.o[q.correct]?.uz ?? "";
    const key = `${q.t.uz}|${correctVal}${withAudio ? `|${q.audio ?? ""}` : ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}

export function rangeInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}
