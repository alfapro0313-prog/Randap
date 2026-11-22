/**
 * VERY HARD (C2) savollar generatori.
 *   genVeryHard1() — leksika, idiomalar, frazeologik fe'llar (veryhard-vocab.ts)
 *   genVeryHard2() — grammatika: inversiya, subjunctive, shart gaplari va h.k.
 *     (veryhard-grammar-a.ts + veryhard-grammar-b.ts)
 * Distraktorlar deterministik (rngOf) tanlanadi — har safar bir xil natija.
 * To'g'ri javob har xil indeksga aralashtiriladi (optionsFor).
 */
import { optionsFor, rngOf, same, shuffle, type L3, type QGen } from "./gen-core";
import { VERY_HARD_VOCAB, type VTerm } from "./veryhard-vocab";
import { VERY_HARD_GRAMMAR_A, type GItem } from "./veryhard-grammar-a";
import { VERY_HARD_GRAMMAR_B } from "./veryhard-grammar-b";

const TEMPLATES_W: Array<(t: string) => string> = [
  (t) => `'${t}' most nearly means ___`,
  (t) => `Choose the closest meaning of '${t}': ___`,
  (t) => `'${t}' is best described as ___`,
];

const TEMPLATES_I: Array<(t: string) => string> = [
  (t) => `The expression '${t}' means ___`,
  (t) => `Choose the meaning of the idiom '${t}': ___`,
  (t) => `What does the idiom '${t}' mean? It means ___`,
];

const TEMPLATES_P: Array<(t: string) => string> = [
  (t) => `The phrasal verb 'to ${t}' means ___`,
  (t) => `Choose the meaning of 'to ${t}': ___`,
  (t) => `'To ${t}' means ___`,
];

/** Bir turdagi boshqa elementlardan 3 ta farqli ta'rif tanlash */
function pickDistractors(
  rng: () => number,
  pool: VTerm[],
  selfIdx: number
): L3[] {
  const others = pool
    .map((v, i) => ({ v, i }))
    .filter(({ i }) => i !== selfIdx);
  const shuffled = shuffle(rng, others);
  const out: L3[] = [];
  const seen = new Set<string>([pool[selfIdx]!.def]);
  for (const { v } of shuffled) {
    if (out.length >= 3) break;
    if (seen.has(v.def)) continue;
    seen.add(v.def);
    out.push(same(v.def));
  }
  return out;
}

/** VERY HARD 1 — leksika banki */
export function genVeryHard1(): QGen[] {
  const byKind: Record<string, VTerm[]> = { w: [], i: [], p: [] };
  for (const v of VERY_HARD_VOCAB) byKind[v.kind]!.push(v);

  const out: QGen[] = [];
  for (const kind of ["w", "i", "p"] as const) {
    const pool = byKind[kind];
    const templates =
      kind === "w" ? TEMPLATES_W : kind === "i" ? TEMPLATES_I : TEMPLATES_P;
    pool.forEach((v, idx) => {
      const rng = rngOf(`vhard1:${kind}:${v.term}`);
      const correct = same(v.def);
      const distractors = pickDistractors(rng, pool, idx);
      const { o, correct: ci } = optionsFor(rng, correct, distractors);
      const tpl = templates[idx % templates.length]!;
      out.push({ t: same(tpl(v.term)), o, correct: ci });
    });
  }
  return out;
}

/** VERY HARD 2 — grammatika banki */
export function genVeryHard2(): QGen[] {
  const items: GItem[] = [...VERY_HARD_GRAMMAR_A, ...VERY_HARD_GRAMMAR_B];
  return items.map((item, idx) => {
    const rng = rngOf(`vhard2:${idx}:${item.ok}`);
    const correct = same(item.ok);
    const distractors = item.d.map(same);
    const { o, correct: ci } = optionsFor(rng, correct, distractors);
    return { t: same(item.s), o, correct: ci };
  });
}
