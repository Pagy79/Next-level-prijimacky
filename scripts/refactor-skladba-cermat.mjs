/**
 * Refactor Skladba → CERMAT 100–105 %.
 * Output: data/questions_refactored_skladba.json
 *
 * - workingText = výchozí věta / souvětí (nebo krátký návod, když jsou věty v nabídkách)
 * - otázka míří na člen / typ souvětí v kontextu, bez spoileru
 * - tipy jsou vždy vázané na typ úlohy (ne náhodné)
 * - plausibilní near-miss distraktory
 */
import { readFileSync, writeFileSync } from "fs";

const INPUT = "data/questions.json";
const OUTPUT = "data/questions_refactored_skladba.json";

const data = JSON.parse(readFileSync(INPUT, "utf8"));
const items = data.filter((q) => q.category === "Skladba");
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
  while (opts.length < 4) uniquePush(opts, `jiná možnost ${opts.length}`);
  const four = opts.slice(0, 4);
  const shuffled = shuffleStable(four, seed);
  return {
    options: shuffled,
    correctAnswerIndex: shuffled.indexOf(correct),
  };
}

function scrub(q) {
  const correct = q.options[q.correctAnswerIndex];
  const distractors = q.options.filter((_, i) => i !== q.correctAnswerIndex);
  return { correct, distractors };
}

function meta(q, style) {
  return {
    refactored: true,
    refactorStyle: style,
    difficultyTarget: "100-105% CERMAT9",
    sourceId: q.id,
  };
}

function cleanSentence(s) {
  return String(s)
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Prefer full quoted sentences; skip short metalinguistic quotes. */
function extractQuotedSentence(text) {
  const t = String(text);
  const all = [...t.matchAll(/[„"]([^„"“]+)[“"]/g)].map((m) => cleanSentence(m[1]));
  const good = all.filter((s) => {
    if (s.length < 8) return false;
    if (/^(jaký|který|čí|kde|kdy|jak|proč)\??$/i.test(s)) return false;
    if (/^lidé$/i.test(s)) return false;
    // Prefer multi-word or ends with sentence punct / has verb-ish length
    return s.split(/\s+/).length >= 2;
  });
  if (good.length) {
    // longest is usually the example sentence
    return good.sort((a, b) => b.length - a.length)[0];
  }
  return null;
}

function extractSentence(text) {
  const t = String(text);
  const patterns = [
    /ve větě:\s*[„"](.+?)[“"]/i,
    /v souvětí:\s*[„"](.+?)[“"]/i,
    /obsahuje souvětí:\s*[„"](.+?)[“"]/i,
    /ukázka[^„"]*[„"](.+?)[“"]/i,
    /zvýrazněn\??\s*[„"](.+?)[“"]/i,
    /je věta\s*[„"](.+?)[“"]/i,
    /je:\s*[„"](.+?)[“"]/i,
    /mluvčího je:\s*[„"](.+?)[“"]/i,
    /spojení\s*[„"](.+?)[“"]/i,
    /:\s*[„"]([^„"“]+)[“"]/,
  ];
  for (const re of patterns) {
    const m = t.match(re);
    if (m) {
      const s = cleanSentence(m[1]);
      if (s.length >= 6) return s;
    }
  }
  // bare after "ve větě:" without quotes
  const bare = t.match(/ve větě:\s*(.+)$/i);
  if (bare) {
    const s = cleanSentence(bare[1].replace(/^[„"]|[“"]$/g, ""));
    if (s.length >= 6 && !/^[A-D]\)/.test(s)) return s;
  }
  return extractQuotedSentence(t);
}

function stripSentenceFromStem(text) {
  return String(text)
    .replace(/\s*ve větě:\s*[„"][^„"“]*[“"]\s*/gi, " ")
    .replace(/\s*v souvětí:\s*[„"][^„"“]*[“"]\s*/gi, " ")
    .replace(/\s*obsahuje souvětí:\s*[„"][^„"“]*[“"]\s*/gi, " ")
    .replace(/\s*ve větě:\s*[^.?!]+[.?!]?\s*$/i, " ")
    .replace(/\s*zvýrazněn\??\s*[„"][^„"“]*[“"]\s*/gi, " ")
    .replace(/\s*je věta\s*[„"][^„"“]*[“"]\s*/gi, " ")
    .replace(/\s*je:\s*[„"][^„"“]*[“"]\s*/gi, " ")
    .replace(/\s*mluvčího je:\s*[„"][^„"“]*[“"]\s*/gi, " ")
    .replace(/\s*[„"][^„"“]{8,}[“"]\s*/g, " ")
    .replace(/\s*:\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function ensureQuestion(text) {
  let t = text
    .trim()
    .replace(/:+$/, "")
    .replace(/[?？]+$/, "")
    .trim();
  if (!t) return "Co platí pro výchozí větu / souvětí?";
  // Drop trailing orphan punctuation from stripped quotes
  t = t.replace(/[„"“]+\s*$/, "").trim();
  return `${t}?`;
}

function pointAtWorking(text, noun = "větě / souvětí") {
  let t = ensureQuestion(text);
  if (/výchozí/i.test(t)) return t;
  return t.replace(/\?$/, ` ve výchozí ${noun}?`);
}

const TIP = {
  zaklad: "Nejdřív najdi přísudek (určitý slovesný tvar), pak se ptej kdo/co?",
  podmet: "Podmět zjišťuješ otázkou kdo? co? k přísudku.",
  prisudek: "Přísudek = určité sloveso; u spony i jmenná část.",
  predmet: "Předmět rozvíjí sloveso a odpovídá na pádové otázky (kromě 1. pádu).",
  privlastek: "Přívlastek shodný se shoduje s podstatným jménem; neshodný často 2. pád / předložkové spojení.",
  prislov: "U příslovečného určení se ptej: kde/kam? kdy? jak? proč?",
  doplnek: "Doplněk se ptá jaký? jak? a zároveň se vztahuje k podmětu/předmětu i k přísudku.",
  souveti: "Spočítej určité slovesné tvary. Souvětí = 2+. U podřadného hledej že/když/protože/aby/který…",
  carka: "Čárka mezi větami v souvětí; pozor na vsuvku, oslovení a přívlastek.",
  hola: "Holá = jen základ (podmět+přísudek). Rozvitá má další větné členy.",
  other: "Urči jev podle skladby výchozího spojení — ne podle dojmu z izolovaných slov.",
};

function classify(q) {
  const t = (q.text || "").toLowerCase();
  if (/základní skladební dvojic/i.test(t)) return "zaklad";
  if (/podmět/i.test(t)) return "podmet";
  if (/přísudek/i.test(t)) return "prisudek";
  if (/předmět/i.test(t) && !/předmětná/i.test(t)) return "predmet";
  if (/přívlastek/i.test(t)) return "privlastek";
  if (/doplněk/i.test(t)) return "doplnek";
  if (/příslovečn/i.test(t)) return "prislov";
  if (/souvět|vedlejší|řídící|souřadn|podřadn|větou hlavn|větou jednoduch/i.test(t))
    return "souveti";
  if (/čárk/i.test(t)) return "carka";
  if (/holá|rozvit/i.test(t)) return "hola";
  if (/větný člen|zvýrazněn/i.test(t)) return "other";
  return "other";
}

function applyOptions(out, q) {
  const { correct, distractors } = scrub(q);
  const picked = pickFour(correct, distractors, q.id);
  out.options = picked.options;
  out.correctAnswerIndex = picked.correctAnswerIndex;
  return out;
}

function looksLikeSentenceOpts(options) {
  return options.every((o) => String(o).split(/\s+/).length >= 3);
}

function withSentence(out, q, kind, style, questionOverride) {
  const sentence = extractSentence(q.text);
  const tip = TIP[kind] || TIP.other;

  if (sentence) {
    out.workingText = `${sentence}\n${tip}`;
    out.text = questionOverride
      ? ensureQuestion(questionOverride)
      : pointAtWorking(stripSentenceFromStem(q.text) || "Co platí");
  } else if (looksLikeSentenceOpts(q.options)) {
    out.workingText = `Porovnej nabídky jako celek.\n${tip}`;
    out.text = ensureQuestion(questionOverride || q.text);
  } else {
    out.workingText = tip;
    out.text = ensureQuestion(questionOverride || q.text);
  }
  out.meta = meta(q, style);
  return applyOptions(out, q);
}

function refactorZaklad(q) {
  return withSentence(clone(q), q, "zaklad", "zakladni-dvojice", "Určete základní skladební dvojici");
}

function refactorPodmet(q) {
  const out = clone(q);
  const sentence = extractSentence(q.text);
  if (sentence) {
    out.workingText = `${sentence}\n${TIP.podmet}`;
    out.text = "Kdo nebo co je podmětem ve výchozí větě?";
  } else if (/všeobecný|nevyjádřený/i.test(q.text)) {
    out.workingText = `Sleduj, zda je podmět vyjádřený, nevyjádřený, nebo všeobecný („lidé/někdo“).\n${TIP.podmet}`;
    out.text = ensureQuestion(q.text);
  } else if (looksLikeSentenceOpts(q.options)) {
    out.workingText = `Porovnej nabídky.\n${TIP.podmet}`;
    out.text = ensureQuestion(q.text);
  } else {
    out.workingText = TIP.podmet;
    out.text = ensureQuestion(q.text);
  }
  out.meta = meta(q, "podmet-in-context");
  return applyOptions(out, q);
}

function refactorPrisudek(q) {
  return withSentence(
    clone(q),
    q,
    "prisudek",
    "prisudek-in-context",
    "Určete přísudek ve výchozí větě (včetně jmenné části u spony)"
  );
}

function refactorPredmet(q) {
  return withSentence(clone(q), q, "predmet", "predmet-in-context", "Určete předmět");
}

function refactorPrivlastek(q) {
  const out = clone(q);
  const sentence = extractSentence(q.text);
  if (sentence) {
    out.workingText = `${sentence}\n${TIP.privlastek}`;
    out.text = ensureQuestion(stripSentenceFromStem(q.text) || "Určete typ přívlastku ve výchozím spojení");
  } else if (/\(A\).*\/.*\(B\)/i.test(q.text)) {
    // inline A/B/C/D in stem — keep as tip+question, options already short
    out.workingText = TIP.privlastek;
    out.text = ensureQuestion(
      q.text.replace(/\s*\(A\).*$/i, "").trim() || "Ve které možnosti je přívlastek neshodný?"
    );
  } else {
    out.workingText = TIP.privlastek;
    out.text = ensureQuestion(q.text);
  }
  out.meta = meta(q, "privlastek-contrast");
  return applyOptions(out, q);
}

function refactorPrislov(q) {
  const out = clone(q);
  const sentence = extractSentence(q.text);
  if (sentence) {
    out.workingText = `${sentence}\n${TIP.prislov}`;
    out.text = "Jaký druh příslovečného určení je ve výchozí větě (sledovaný úsek)?";
  } else {
    out.workingText = TIP.prislov;
    out.text = ensureQuestion(q.text);
  }
  out.meta = meta(q, "prislov-urceni-in-context");
  return applyOptions(out, q);
}

function refactorDoplnek(q) {
  return withSentence(clone(q), q, "doplnek", "doplnek-in-context", "Určete doplněk");
}

function refactorSouveti(q) {
  const out = clone(q);
  const sentence = extractSentence(q.text);
  if (sentence) {
    out.workingText = `${sentence}\n${TIP.souveti}`;
    let stem = stripSentenceFromStem(q.text);
    // Normalize common stems
    if (/jednoduchou.*souvětím|souvětím.*jednoduch/i.test(q.text)) {
      out.text = "Je výchozí ukázka větou jednoduchou, nebo souvětím?";
    } else if (/kolik vět hlavních/i.test(q.text)) {
      out.text = "Kolik vět hlavních obsahuje výchozí souvětí?";
    } else if (/kolik vět/i.test(q.text)) {
      out.text = "Kolik vět obsahuje výchozí souvětí?";
    } else {
      out.text = pointAtWorking(stem || "Co platí", "souvětí");
    }
  } else if (looksLikeSentenceOpts(q.options)) {
    out.workingText = `Porovnej nabídky jako celek.\n${TIP.souveti}`;
    out.text = ensureQuestion(q.text);
  } else {
    out.workingText = TIP.souveti;
    out.text = ensureQuestion(q.text);
  }
  out.meta = meta(q, "souveti-in-context");
  return applyOptions(out, q);
}

function refactorCarka(q) {
  const out = clone(q);
  const sentence = extractSentence(q.text);
  out.workingText = sentence ? `${sentence}\n${TIP.carka}` : TIP.carka;
  out.text = ensureQuestion(sentence ? stripSentenceFromStem(q.text) || q.text : q.text);
  const { correct, distractors } = scrub(q);
  const cleaned = distractors.filter((d) => !/,\s*,/.test(d));
  const picked = pickFour(correct, cleaned.length ? cleaned : distractors, q.id);
  out.options = picked.options;
  out.correctAnswerIndex = picked.correctAnswerIndex;
  out.meta = meta(q, "carka-souveti");
  return out;
}

function refactorHola(q) {
  return withSentence(clone(q), q, "hola", "hola-rozvita", "Je výchozí věta holá, nebo rozvitá?");
}

function refactorOther(q) {
  const out = clone(q);
  const sentence = extractSentence(q.text);
  const tip = TIP.other;

  // větný člen zvýrazněn
  if (/větný člen|zvýrazněn/i.test(q.text) && sentence) {
    out.workingText = `${sentence}\n${tip}`;
    out.text = "Který větný člen je ve výchozí větě zvýrazněn?";
    out.meta = meta(q, "clen-in-context");
    return applyOptions(out, q);
  }

  // postoj mluvčího
  if (/postoje mluvčího/i.test(q.text) && sentence) {
    out.workingText = `${sentence}\nRozliš oznamovací / tázací / rozkazovací / přací.`;
    out.text = "Jaký druh věty podle postoje mluvčího je výchozí věta?";
    out.meta = meta(q, "postoj-mluvciho");
    return applyOptions(out, q);
  }

  // jednočlenná / dvojčlenná
  if (/jednočlenn|dvojčlenn/i.test(q.text) && sentence) {
    out.workingText = `${sentence}\nJednočlenná nemá podmět (ani domyslitelný); dvojčlenná má podmět+přísudek.`;
    out.text = "Je výchozí věta jednočlenná, nebo dvojčlenná?";
    out.meta = meta(q, "clennost");
    return applyOptions(out, q);
  }

  // přímá / nepřímá řeč
  if (/přímou řeč|nepřímá řeč|přímá řeč/i.test(q.text)) {
    out.workingText =
      "Přímá řeč cituje doslova (uvozovky); nepřímá převypráví (že/aby…, bez uvozovek).";
    out.text = ensureQuestion(q.text);
    out.meta = meta(q, "prim-neprim-rec");
    return applyOptions(out, q);
  }

  return withSentence(out, q, "other", "skladba-generic-cermat");
}

function refactorOne(q) {
  const k = classify(q);
  if (k === "zaklad") return refactorZaklad(q);
  if (k === "podmet") return refactorPodmet(q);
  if (k === "prisudek") return refactorPrisudek(q);
  if (k === "predmet") return refactorPredmet(q);
  if (k === "privlastek") return refactorPrivlastek(q);
  if (k === "prislov") return refactorPrislov(q);
  if (k === "doplnek") return refactorDoplnek(q);
  if (k === "souveti") return refactorSouveti(q);
  if (k === "carka") return refactorCarka(q);
  if (k === "hola") return refactorHola(q);
  return refactorOther(q);
}

function validate(list) {
  const issues = [];
  for (const q of list) {
    if (!q.workingText) issues.push(`${q.id}: no workingText`);
    if (!q.options || q.options.length !== 4) issues.push(`${q.id}: options`);
    if (q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) issues.push(`${q.id}: idx`);
    if (new Set(q.options.map(String)).size !== 4) issues.push(`${q.id}: dup`);
    if (/\?\?/.test(q.text)) issues.push(`${q.id}: double ?`);
    if (/[„"]/.test(q.text) && extractSentence(q.text)) {
      // stem still has extractable sentence → incomplete strip (warn only if quote looks long)
      const qte = extractQuotedSentence(q.text);
      if (qte && qte.split(/\s+/).length >= 4) issues.push(`${q.id}: stem still has sentence quote`);
    }
  }
  return issues;
}

const beforeById = Object.fromEntries(items.map((q) => [q.id, q]));
const refactored = items.map(refactorOne);
writeFileSync(OUTPUT, JSON.stringify(refactored, null, 2) + "\n");

const issues = validate(refactored);
const styles = {};
const kinds = {};
for (const q of items) kinds[classify(q)] = (kinds[classify(q)] || 0) + 1;
for (const q of refactored) {
  const s = q.meta?.refactorStyle || "?";
  styles[s] = (styles[s] || 0) + 1;
}

const withRealSentence = refactored.filter((q) => {
  const first = String(q.workingText).split("\n")[0];
  return first.split(/\s+/).length >= 4 && /[a-zá-ž]/i.test(first);
}).length;

console.log(`\nRefactored ${refactored.length} → ${OUTPUT}`);
console.log(`workingText: ${refactored.filter((q) => q.workingText).length}/${refactored.length}`);
console.log(`workingText with sentence-like first line: ${withRealSentence}/${refactored.length}`);
console.log("Input kinds:", kinds);
console.log("Styles:", styles);
console.log(`Validation issues: ${issues.length}`);
if (issues.length) console.log(issues.slice(0, 40).join("\n"));

for (const id of ["q-0005", "q-0006", "q-0308", "q-0313", "q-0322", "q-0402"]) {
  const b = beforeById[id];
  const a = refactored.find((q) => q.id === id);
  if (!b || !a) continue;
  console.log("\n" + "=".repeat(72));
  console.log(`SAMPLE ${id}`);
  console.log("PŘED:", b.text);
  console.log(" ", b.options.map((o, i) => (i === b.correctAnswerIndex ? `>${o}` : o)).join(" | "));
  console.log("PO:  ", a.text);
  console.log("  WT:", a.workingText);
  console.log(" ", a.options.map((o, i) => (i === a.correctAnswerIndex ? `>${o}` : o)).join(" | "));
  console.log("  style:", a.meta?.refactorStyle);
}
