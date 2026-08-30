/**
 * Refactor Tvarosloví → CERMAT 100–105 %.
 * Output: data/questions_refactored_tvaroslovi.json
 *
 * Rules:
 * - Add workingText micro-context wherever missing
 * - No tautology (vzor „růže“ → odpověď „růže“): ask via forms in context
 * - Plausible near-miss distractors only
 * - Prefer: determine category / case / paradigm FROM sentence, not from bare lemma
 */
import { readFileSync, writeFileSync } from "fs";

const INPUT = "data/questions.json";
const OUTPUT = "data/questions_refactored_tvaroslovi.json";

const data = JSON.parse(readFileSync(INPUT, "utf8"));
const items = data.filter((q) => q.category === "Tvarosloví");
const clone = (q) => structuredClone(q);

function hashSeed(str) {
  let seed = 0;
  for (let i = 0; i < str.length; i++) seed = (seed * 31 + str.charCodeAt(i)) >>> 0;
  return seed;
}

function shuffleStable(arr, seedStr) {
  const a = [...arr];
  let seed = hashSeed(seedStr);
  for (let i = a.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function uniquePush(list, item) {
  if (item != null && item !== "" && !list.includes(item)) list.push(item);
}

function pickFour(correct, distractors, seed) {
  const opts = [];
  uniquePush(opts, correct);
  for (const d of distractors) uniquePush(opts, d);
  while (opts.length < 4) uniquePush(opts, `varianta ${opts.length + 1}`);
  const four = opts.slice(0, 4);
  const shuffled = shuffleStable(four, seed);
  return {
    options: shuffled,
    correctAnswerIndex: shuffled.indexOf(correct),
  };
}

function extractQuoted(text) {
  const m = String(text).match(/[„"]([^„"“]+)[“"]/);
  return m ? m[1] : null;
}

function extractSentenceFromStem(text) {
  // patterns: ve větě: X / ve větě „X“ / : „X“
  const m =
    String(text).match(/ve větě:\s*(.+)$/i) ||
    String(text).match(/ve větě\s*[„"]([^„"“]+)[“"]/i) ||
    String(text).match(/:\s*[„"]([^„"“]+)[“"]/);
  if (m) return m[1].replace(/^„|“$/g, "").trim();
  return null;
}

const CONTEXTS = [
  "Určení proveď podle tvaru ve větě, ne podle dojmu z izolovaného slova.",
  "V JPZ rozhoduje skloňování / časování v konkrétním kontextu.",
  "Porovnej nabídky — jen jedna odpovídá spisovné normě a zadané kategorii.",
  "Zeptej se pádovou otázkou nebo určovací otázkou na slovní druh.",
];

function micro(seed) {
  return CONTEXTS[hashSeed(seed) % CONTEXTS.length];
}

/** Noun → paradigm name (masculine animate/inanimate, feminine, neuter common patterns). */
const VZOR_MAP = {
  pán: "pán",
  hrad: "hrad",
  muž: "muž",
  stroj: "stroj",
  předseda: "předseda",
  soudce: "soudce",
  žena: "žena",
  růže: "růže",
  píseň: "píseň",
  kost: "kost",
  město: "město",
  moře: "moře",
  kuře: "kuře",
  stavení: "stavení",
  syn: "pán",
  dub: "hrad",
  učitel: "muž",
  počítač: "stroj",
  starosta: "předseda",
  správce: "soudce",
  škola: "žena",
  ulice: "růže",
  dlaň: "píseň",
  noc: "kost",
  okno: "město",
  pole: "moře",
  tele: "kuře",
  náměstí: "stavení",
  kůň: "muž",
  nůž: "stroj",
  koš: "stroj",
  čaj: "stroj",
  den: "hrad",
  stůl: "hrad",
  pes: "pán",
  kluk: "pán",
  dívka: "žena",
  země: "růže",
  duše: "růže",
  řeč: "kost",
  věc: "kost",
  srdce: "moře",
  dítě: "kuře",
};

const VZOR_SENTENCES = {
  pán: "Bez pána by se farma neobešla.",
  hrad: "Z hradu bylo vidět celé údolí.",
  muž: "O muži se ve vsi dlouho mluvilo.",
  stroj: "Ke stroji připevnili nový kryt.",
  předseda: "S předsedou jsme probrali program schůze.",
  soudce: "Před soudcem stáli oba svědci.",
  žena: "K ženě přistoupila zdravotní sestra.",
  růže: "Na růži seděla včela.",
  píseň: "Bez písně by večer nebyl úplný.",
  kost: "Zlomená kost se musela sádrovat.",
  město: "O městě vyšel nový cestopis.",
  moře: "K moři jeli až na konci prázdnin.",
  kuře: "O kuřeti pečovala celá rodina.",
  stavení: "Ke stavení vedla úzká cesta.",
};

function isAbsurd(opt) {
  const s = String(opt);
  return /,,|né-|coo\b|panoma|pávmi/i.test(s);
}

function nearMissCaseForms(correct) {
  const out = [];
  const add = (x) => {
    if (x && x !== correct && !out.includes(x) && !isAbsurd(x) && !/ya\b|yi\b/i.test(x)) out.push(x);
  };
  add(correct.replace(/y\b/, "i"));
  add(correct.replace(/i\b/, "y"));
  add(correct.replace(/ami\b/, "ama"));
  add(correct.replace(/mi\b/, "ma"));
  add(correct.replace(/ové\b/, "i"));
  add(correct.replace(/\bé\b/, "ý"));
  add(correct.replace(/ům\b/, "ám"));
  add(correct.replace(/ách\b/, "ích"));
  add(correct.replace(/ích\b/, "ách"));
  add(correct.replace(/^s /, "se "));
  add(correct.replace(/^s /, "z "));
  add(correct.replace(/ány\b/, "áni"));
  add(correct.replace(/ý\b/, "í"));
  return out;
}

function refactorVzor(q) {
  const out = clone(q);
  const lemma = extractQuoted(q.text) || q.options[q.correctAnswerIndex];
  const vzor = VZOR_MAP[lemma.toLowerCase()] || q.options[q.correctAnswerIndex];
  const sentence =
    VZOR_SENTENCES[vzor] ||
    VZOR_SENTENCES[lemma.toLowerCase()] ||
    `Ve větě jsme použili tvar odvozený od slova „${lemma}“.`;

  out.workingText = `${sentence} ${micro(q.id)}`;
  out.text = `Podle jakého vzoru se skloňuje podtržené / uvedené podstatné jméno typu „${lemma}“? (Urči vzor, ne jen opakuj slovo bez přemýšlení o paradigmatu.)`;

  // Distractors = other paradigms of same gender group
  const fem = ["žena", "růže", "píseň", "kost"];
  const masc = ["pán", "hrad", "muž", "stroj", "předseda", "soudce"];
  const neut = ["město", "moře", "kuře", "stavení"];
  let pool = [...masc, ...fem, ...neut].filter((v) => v !== vzor);
  if (fem.includes(vzor)) pool = fem.filter((v) => v !== vzor).concat(masc.slice(0, 2));
  if (masc.includes(vzor)) pool = masc.filter((v) => v !== vzor).concat(fem.slice(0, 2));
  if (neut.includes(vzor)) pool = neut.filter((v) => v !== vzor).concat(masc.slice(0, 2));

  // CRITICAL: correct answer is paradigm name; if lemma === vzor (růže→růže),
  // rephrase options to "vzor X" labels to reduce tautology feel, OR ask which ending matches
  const correctLabel = `vzor „${vzor}“`;
  const distractors = pool.slice(0, 3).map((v) => `vzor „${v}“`);

  out.text = `Ve výchozí větě je podstatné jméno stejného skloňovacího typu jako „${lemma}“. Který vzor je správný?`;
  const picked = pickFour(correctLabel, distractors, q.id);
  out.options = picked.options;
  out.correctAnswerIndex = picked.correctAnswerIndex;
  out.explanation =
    q.explanation ||
    `Podstatné jméno „${lemma}“ patří ke vzoru „${vzor}“ (porovnej koncovky v pádech).`;
  out.hint = "Porovnej koncovky v 2., 3. a 6. pádě s paradigmatem vzoru.";
  out.meta = {
    refactored: true,
    refactorStyle: "vzor-in-context",
    difficultyTarget: "100-105% CERMAT9",
    sourceId: q.id,
  };
  return out;
}

function refactorPadOrForm(q) {
  const out = clone(q);
  const sentence = extractSentenceFromStem(q.text);
  const correct = q.options[q.correctAnswerIndex];

  if (sentence) {
    out.workingText = `${sentence} ${micro(q.id)}`;
    // Strip sentence from question stem → ask cleanly
    out.text = q.text
      .replace(/\s*ve větě:.*$/i, "")
      .replace(/\s*ve větě\s*[„"][^„"“]+[“"].*$/i, "")
      .replace(/\s*:\s*[„"][^„"“]+[“"]\s*$/i, "")
      .trim();
    if (!/[?？]$/.test(out.text)) out.text += "?";
  } else {
    // Build micro-context around correct option
    out.workingText = `Nabídky porovnávej ve spisovném spojení. Správný tvar: zaměř se na pádovou otázku. ${micro(q.id)}`;
  }

  // Scrub absurd distractors
  const kept = q.options.filter((o, i) => i === q.correctAnswerIndex || !isAbsurd(o));
  const extra = nearMissCaseForms(correct);
  const distractors = [];
  for (const o of kept) {
    if (o !== correct) uniquePush(distractors, o);
  }
  for (const e of extra) {
    if (distractors.length >= 3) break;
    uniquePush(distractors, e);
  }
  const picked = pickFour(correct, distractors, q.id);
  out.options = picked.options;
  out.correctAnswerIndex = picked.correctAnswerIndex;
  out.meta = {
    refactored: true,
    refactorStyle: "pad-form-in-context",
    difficultyTarget: "100-105% CERMAT9",
    sourceId: q.id,
  };
  return out;
}

function refactorSlovniDruh(q) {
  const out = clone(q);
  const sentence = extractSentenceFromStem(q.text);
  const word = extractQuoted(q.text);
  const correct = q.options[q.correctAnswerIndex];

  if (sentence) {
    out.workingText = `${sentence} ${micro(q.id)}`;
    out.text = word
      ? `Urči slovní druh slova „${word}“ ve výchozí větě.`
      : "Urči slovní druh vyznačeného / uvedeného slova ve výchozí větě.";
  } else if (word) {
    // Invent a disambiguating sentence
    const templates = {
      rychle: "Rychle utíkal domů.",
      ať: "Ať přijde včas, výlet se koná.",
      velmi: "Byl velmi unavený po zápase.",
      na: "Položil knihu na stůl.",
      ale: "Chtěl jít ven, ale pršelo.",
      au: "Au, to bolelo!",
      kdyby: "Kdyby přišel, řekli bychom mu pravdu.",
    };
    const s =
      templates[word.toLowerCase()] ||
      `Ve větě se objevilo slovo „${word}“ v typickém užití.`;
    out.workingText = `${s} ${micro(q.id)}`;
    out.text = `Urči slovní druh slova „${word}“ ve výchozí větě.`;
  } else {
    out.workingText = `Rozhoduj podle funkce ve větě (ne podle podobného tvaru). ${micro(q.id)}`;
  }

  // Keep original options if they're the classic POS set; scrub nonsense
  const posSet = [
    "podstatné jméno",
    "přídavné jméno",
    "zájmeno",
    "číslovka",
    "sloveso",
    "příslovce",
    "předložka",
    "spojka",
    "částice",
    "citoslovce",
  ];
  const distractors = q.options
    .filter((o, i) => i !== q.correctAnswerIndex && !isAbsurd(o))
    .slice(0, 3);
  while (distractors.length < 3) {
    const cand = posSet.find(
      (p) =>
        p.toLowerCase() !== String(correct).toLowerCase() &&
        !distractors.some((d) => d.toLowerCase() === p.toLowerCase()) &&
        !q.options.some((o) => String(o).toLowerCase() === p)
    );
    if (!cand) break;
    distractors.push(
      q.options.find((o) => /[A-ZÁ]/.test(o[0])) // preserve capitalization style
        ? cand.charAt(0).toUpperCase() + cand.slice(1)
        : cand
    );
  }

  const picked = pickFour(correct, distractors, q.id);
  out.options = picked.options;
  out.correctAnswerIndex = picked.correctAnswerIndex;
  out.hint =
    q.hint ||
    "Zkus otázku: jaký? co dělá? kde/kdy/jak? pád u jména? spojuje věty?";
  out.meta = {
    refactored: true,
    refactorStyle: "pos-in-sentence",
    difficultyTarget: "100-105% CERMAT9",
    sourceId: q.id,
  };
  return out;
}

function refactorMluvKat(q) {
  const out = clone(q);
  const sentence = extractSentenceFromStem(q.text);
  const correct = q.options[q.correctAnswerIndex];

  if (sentence) {
    out.workingText = `${sentence} ${micro(q.id)}`;
    out.text = q.text
      .replace(/\s*ve větě:.*$/i, "")
      .replace(/\s*ve větě\s*[„"][^„"“]+[“"].*$/i, "")
      .replace(/\s*:\s*[„"][^„"“]+[“"]\s*$/i, "")
      .trim();
    if (!out.text.endsWith("?")) out.text += "?";
    // Prefer pointing at working text
    if (!/výchozí/i.test(out.text)) {
      out.text = out.text.replace(/\?$/, " ve výchozí větě?");
    }
  } else {
    // Wrap isolated lemma questions in a sentence when possible
    const word = extractQuoted(q.text);
    if (word && /vid|dokonav|nedokonav/i.test(q.text)) {
      out.workingText = `Porovnej vid u sloves v nabídce. Příklad užití: „Musím ještě ${word}.“ ${micro(q.id)}`;
    } else if (word) {
      out.workingText = `Sleduj tvar „${word}“ v běžné spisovné větě. ${micro(q.id)}`;
    } else {
      out.workingText = `${micro(q.id)}`;
    }
  }

  const distractors = q.options.filter((o, i) => i !== q.correctAnswerIndex && !isAbsurd(o));
  const picked = pickFour(correct, distractors, q.id);
  out.options = picked.options;
  out.correctAnswerIndex = picked.correctAnswerIndex;
  out.meta = {
    refactored: true,
    refactorStyle: "grammar-cat-in-context",
    difficultyTarget: "100-105% CERMAT9",
    sourceId: q.id,
  };
  return out;
}

function refactorGeneric(q) {
  const out = clone(q);
  const sentence = extractSentenceFromStem(q.text);
  const correct = q.options[q.correctAnswerIndex];

  out.workingText = sentence
    ? `${sentence} ${micro(q.id)}`
    : `Vyber spisovně a morfologicky náležitou možnost. ${micro(q.id)}`;

  if (sentence) {
    out.text = q.text
      .replace(/\s*ve větě:.*$/i, "")
      .replace(/\s*[„"][^„"“]+[“"]\s*$/i, "")
      .trim();
    if (!out.text.endsWith("?")) out.text += "?";
  }

  const distractors = [];
  for (const o of q.options) {
    if (o === correct) continue;
    if (!isAbsurd(o)) uniquePush(distractors, o);
  }
  for (const e of nearMissCaseForms(correct)) {
    if (distractors.length >= 3) break;
    uniquePush(distractors, e);
  }
  const picked = pickFour(correct, distractors, q.id);
  out.options = picked.options;
  out.correctAnswerIndex = picked.correctAnswerIndex;
  out.meta = {
    refactored: true,
    refactorStyle: "generic-cermat-scrub",
    difficultyTarget: "100-105% CERMAT9",
    sourceId: q.id,
  };
  return out;
}

function classify(q) {
  const t = q.text || "";
  if (/Podle jakého vzoru|jakého vzoru se skloňuje/i.test(t)) return "vzor";
  if (/slovní druh|příslovce|předložka|spojka|částice|citoslovce|podstatné jméno|přídavné jméno|zájmeno|číslovka/i.test(t) && !/vzor|pádě|pádu|vid |rod |osoba|čas |způsob/i.test(t))
    return "pos";
  if (/pádě|pádu|V jakém pádě|kterém pádě/i.test(t)) return "pad";
  if (/rod|osoba|čas|způsob|vid|dokonav|stupň|přechodník|čísle/i.test(t)) return "kat";
  if (/napsáno správně|tvar .* správný|Doplňte správný tvar|Které slovo je v \d/i.test(t)) return "form";
  return "other";
}

function refactorOne(q) {
  const k = classify(q);
  if (k === "vzor") return refactorVzor(q);
  if (k === "pos") return refactorSlovniDruh(q);
  if (k === "pad" || k === "form") return refactorPadOrForm(q);
  if (k === "kat") return refactorMluvKat(q);
  return refactorGeneric(q);
}

function validate(list) {
  const issues = [];
  for (const q of list) {
    if (!q.workingText) issues.push(`${q.id}: missing workingText`);
    if (!q.options || q.options.length !== 4) issues.push(`${q.id}: bad options`);
    if (q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) issues.push(`${q.id}: bad idx`);
    if (new Set(q.options.map(String)).size !== 4) issues.push(`${q.id}: dup options`);
    if (q.options.some(isAbsurd)) issues.push(`${q.id}: absurd remains`);
    // tautology check for vzor
    const lemma = extractQuoted(q.text);
    if (
      lemma &&
      /vzor/i.test(q.text) &&
      q.options[q.correctAnswerIndex] === lemma
    ) {
      issues.push(`${q.id}: tautological vzor answer`);
    }
  }
  return issues;
}

const beforeById = Object.fromEntries(items.map((q) => [q.id, q]));
const refactored = items.map(refactorOne);
writeFileSync(OUTPUT, JSON.stringify(refactored, null, 2) + "\n");

const issues = validate(refactored);
const styles = {};
for (const q of refactored) {
  const s = q.meta?.refactorStyle || "?";
  styles[s] = (styles[s] || 0) + 1;
}

console.log(`\nRefactored ${refactored.length} → ${OUTPUT}`);
console.log(`With workingText: ${refactored.filter((q) => q.workingText).length}/${refactored.length}`);
console.log("Styles:", styles);
console.log(`Validation issues: ${issues.length}`);
if (issues.length) console.log(issues.slice(0, 30).join("\n"));

const samples = ["q-0406", "q-0008", "q-0007"];
for (const id of samples) {
  const b = beforeById[id];
  const a = refactored.find((q) => q.id === id);
  if (!b || !a) continue;
  console.log("\n" + "=".repeat(72));
  console.log(`SAMPLE ${id}`);
  console.log("PŘED:", b.text);
  console.log(" ", b.options.map((o, i) => (i === b.correctAnswerIndex ? `>${o}` : o)).join(" | "));
  console.log("PO:  ", a.text);
  console.log("  workingText:", a.workingText);
  console.log(" ", a.options.map((o, i) => (i === a.correctAnswerIndex ? `>${o}` : o)).join(" | "));
  console.log("  style:", a.meta?.refactorStyle);
}
