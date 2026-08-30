/**
 * Refactor Pravopis questions toward CERMAT9 (100–105 %).
 * Output: data/questions_refactored_pravopis.json
 */
import { readFileSync, writeFileSync } from "fs";

const INPUT = "data/questions.json";
const OUTPUT = "data/questions_refactored_pravopis.json";

const data = JSON.parse(readFileSync(INPUT, "utf8"));
const pravopis = data.filter((q) => q.category === "Pravopis");
const clone = (q) => structuredClone(q);

function isAbsurdOption(opt) {
  const s = String(opt);
  if (/,,/i.test(s)) return true;
  if (/[a-zá-ž],\./i.test(s)) return true;
  if (/né-[a-zá]/i.test(s)) return true;
  if (/coo\b|ooo/i.test(s)) return true;
  // Explicit broken tokens seen in the bank
  if (/přito m|zatímcoo|za t ím|s novu\b/i.test(s)) return true;
  return false;
}

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

function ensurePeriod(s) {
  const t = String(s).trim();
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

/** workingText = only the source sentence (no instructional tips). */
function sentenceOnly(s) {
  return String(s)
    .replace(
      /\s*(Věta je součástí krátkého záznamu z vyučování\.|Zápis má odpovídat spisovné normě\.|V JPZ rozhoduje jediná náležitá podoba\.|Soustřeď se na pravopis, ne na obsah sdělení\.|Distraktory odpovídají častým chybám\.|Distraktory bývají blízké významem; hledej přesný smysl v JPZ stylu\.)\s*/gi,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
}

function extractBlankWord(text, fill) {
  const m = String(text).match(/([A-Za-zÁ-Žá-ž]*)_([A-Za-zÁ-Žá-ž]*)/);
  if (!m) return String(fill);
  return `${m[1]}${fill}${m[2]}`;
}

function fillBlank(text, fill) {
  return String(text).replace("_", fill);
}

function pickPrimaryWrong(correctFill, fills) {
  const pair = { y: "i", i: "y", ý: "í", í: "ý", é: "í", á: "a", ů: "u", ú: "u" };
  const preferred = pair[correctFill];
  if (preferred && fills.includes(preferred)) return preferred;
  return fills.find((f) => f !== correctFill) || "i";
}

function uniquePush(list, item) {
  if (item != null && item !== "" && !list.includes(item)) list.push(item);
}

/** Generate near-miss sentence variants (never nonsense). */
function nearMisses(correct, limit, avoid = []) {
  const out = [];
  const add = (s) => {
    if (!s || s === correct || avoid.includes(s) || out.includes(s) || isAbsurdOption(s)) return;
    out.push(s);
  };

  const pairs = [
    [/zatímco/gi, "za tímco"],
    [/zatímco/gi, "zatimco"],
    [/přitom/gi, "při tom"],
    [/přitom/gi, "přytom"],
    [/znovu/gi, "znova"],
    [/znovu/gi, "z nova"],
    [/výjimk/gi, "vyjímk"],
    [/výjimk/gi, "vyjimk"],
    [/uprostřed/gi, "u prostřed"],
    [/tudíž/gi, "tudýž"],
    [/jelikož/gi, "jelikoz"],
    [/doopravdy/gi, "do opravdy"],
    [/vcelku/gi, "v celku"],
    [/zdaleka/gi, "z daleka"],
    [/napořád/gi, "na pořád"],
    [/mimochodem/gi, "mimo chodem"],
    [/napoprvé/gi, "na poprvé"],
    [/kdykoli/gi, "kdykoliv"],
    [/cokoli/gi, "cokoliv"],
    [/jakkoli/gi, "jakkoliv"],
    [/naštěstí/gi, "na štěstí"],
    [/stejně/gi, "stejne"],
    [/přece/gi, "prece"],
    [/takže/gi, "tak že"],
    [/abych /gi, "aby jsem "],
    [/naprostý nesmysl/gi, "naprostý ne smysl"],
    [/patrně/gi, "patrne"],
    [/vlastně/gi, "vlastne"],
    [/zřejmě/gi, "zrejme"],
    [/rozhodně/gi, "rozhodne"],
    [/současně/gi, "soucasne"],
    [/tentokrát/gi, "tentokrat"],
    [/pokaždé/gi, "po každě"],
    [/odjakživa/gi, "od jakživa"],
    [/doslova/gi, "do slova"],
    [/nedávno/gi, "nedavno"],
    [/navštívit/gi, "navštivit"],
    [/následující/gi, "nasledující"],
    [/mimořádný/gi, "mimoradny"],
    [/cenný/gi, "cený"],
    [/bezzubý/gi, "bezubý"],
    [/poddaný/gi, "podaný"],
    [/vitamín/gi, "vitamin"],
    [/apartmán/gi, "apartman"],
    [/fotbalový/gi, "fotbalovy"],
    [/galeri/gi, "galéri"],
  ];

  for (const [re, rep] of pairs) {
    if (out.length >= limit) break;
    re.lastIndex = 0;
    if (re.test(correct)) {
      re.lastIndex = 0;
      add(correct.replace(re, rep));
    }
  }

  add(correct.replace(/,/g, ""));
  add(correct.replace(/ý/, "í"));
  add(correct.replace(/í/, "ý"));
  add(correct.replace(/\by/, "i"));
  add(correct.replace(/\s+a\s+/i, " i "));
  add(correct.replace(/\b(na|za|do|od|při|pře)([a-zá-ž]{3,})\b/i, "$1 $2"));

  return out.slice(0, limit);
}

/**
 * Keep good options; replace absurd / missing slots with near-misses; shuffle.
 */
function rebuildOptions(correct, options, correctIndex, seed) {
  const kept = [];
  uniquePush(kept, correct);
  options.forEach((o, i) => {
    if (i === correctIndex) return;
    if (!isAbsurdOption(o)) uniquePush(kept, o);
  });

  const need = Math.max(0, 4 - kept.length);
  const generated = nearMisses(correct, need + 4, kept);
  for (const g of generated) {
    if (kept.length >= 4) break;
    uniquePush(kept, g);
  }

  // Structural comma / agreement fallbacks
  const more = [
    correct.replace(/,\s*/g, " "),
    correct.replace(/\.?$/, "?"),
    correct.replace(/ý/g, "í"),
    correct.replace(/([aáeéiíouúůyý])\1/gi, "$1"),
  ];
  for (const m of more) {
    if (kept.length >= 4) break;
    if (m && m !== correct && !isAbsurdOption(m)) uniquePush(kept, m);
  }

  while (kept.length < 4) {
    const mutated =
      kept.length === 1
        ? correct.replace(/ý/g, "í")
        : kept.length === 2
          ? correct.replace(/í/g, "ý")
          : correct.replace(/\by/g, "i");
    if (mutated && mutated !== correct && !kept.includes(mutated) && !isAbsurdOption(mutated)) {
      uniquePush(kept, mutated);
    } else {
      const alt = correct.replace(/,/g, "");
      if (alt !== correct) uniquePush(kept, alt);
      else uniquePush(kept, correct.replace(/\.$/, "") + "!");
    }
    if (kept.length > 8) break;
  }

  const four = kept.slice(0, 4);
  // Drop weak "* /špatně/" style if we somehow still have them and can replace
  const cleaned = four.map((o) => o);
  const shuffled = shuffleStable(cleaned, seed);
  const idx = shuffled.indexOf(correct);
  return {
    options: shuffled,
    correctAnswerIndex: idx >= 0 ? idx : 0,
  };
}

function isLetterOrGapBlank(q) {
  const opts = q.options || [];
  return /_/.test(q.text || "") && opts.length >= 2;
}

function isWhichSentence(q) {
  return /Která z vět je napsána pravopisně správně/i.test(q.text || "");
}

function isComma(q) {
  return /čárk/i.test(q.text || "");
}

function refactorBlank(q) {
  const out = clone(q);
  const fills = q.options.map(String);
  const correctFill = fills[q.correctAnswerIndex];
  const wrongFill = pickPrimaryWrong(correctFill, fills);
  const correctWord = extractBlankWord(q.text, correctFill);
  const wrongWord = extractBlankWord(q.text, wrongFill);
  const other = fills.filter((f) => f !== correctFill && f !== wrongFill);
  const altWord = extractBlankWord(q.text, other[0] || wrongFill);

  out.workingText = sentenceOnly(ensurePeriod(fillBlank(q.text, wrongFill)));
  out.text = "Co je nutné udělat, aby byl výchozí text pravopisně správný?";

  const correctOpt = `slovo ${wrongWord} opravit na ${correctWord}`;
  const raw = [
    correctOpt,
    `slovo ${wrongWord} opravit na ${altWord}`,
    "Text je pravopisně v pořádku.",
    `slovo ${wrongWord} ponechat a upravit jen interpunkci`,
  ];
  const uniq = [];
  for (const o of raw) uniquePush(uniq, o);
  while (uniq.length < 4) uniquePush(uniq, `slovo ${wrongWord} napsat s měkkým i`);

  const shuffled = shuffleStable(uniq.slice(0, 4), q.id);
  out.options = shuffled;
  out.correctAnswerIndex = shuffled.indexOf(correctOpt);
  out.hint = "Najdi ve výchozím textu chybný tvar a zvol přesnou opravu.";
  out.meta = {
    refactored: true,
    refactorStyle: "cermat-repair-in-context",
    difficultyTarget: "100-105% CERMAT9",
    sourceId: q.id,
  };
  return out;
}

function refactorWhichOrComma(q, style) {
  const out = clone(q);
  const correct = q.options[q.correctAnswerIndex];
  const rebuilt = rebuildOptions(correct, q.options, q.correctAnswerIndex, q.id + style);
  out.options = rebuilt.options;
  out.correctAnswerIndex = rebuilt.correctAnswerIndex;

  if (style === "which") {
    out.text = "Která z vět je napsána pravopisně správně?";
    // Options are the sentences — no meta workingText
    delete out.workingText;
    if (out.hint && /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]{5,}\b/.test(out.hint)) {
      out.hint =
        "Sleduj, zda se spojení píše dohromady/zvlášť a zda sedí délka samohlásky.";
    }
  } else {
    // Keep existing sentence context if any; never add instructional filler
    if (out.workingText) out.workingText = sentenceOnly(out.workingText);
    else delete out.workingText;
  }

  out.meta = {
    refactored: true,
    refactorStyle:
      style === "which"
        ? "which-sentence-plausible-distractors"
        : "comma-plausible-distractors",
    difficultyTarget: "100-105% CERMAT9",
    sourceId: q.id,
  };
  return out;
}

function refactorOther(q) {
  const out = clone(q);
  const correct = q.options[q.correctAnswerIndex];
  const hasAbsurd = q.options.some(isAbsurdOption);

  if (hasAbsurd && typeof correct === "string" && correct.length > 20) {
    const rebuilt = rebuildOptions(correct, q.options, q.correctAnswerIndex, q.id + "-other");
    out.options = rebuilt.options;
    out.correctAnswerIndex = rebuilt.correctAnswerIndex;
  } else if (hasAbsurd) {
    // short options: drop absurd, keep rest, pad from originals non-absurd only
    const kept = q.options.filter((o, i) => i === q.correctAnswerIndex || !isAbsurdOption(o));
    const uniq = [];
    for (const o of kept) uniquePush(uniq, o);
    for (const o of q.options) {
      if (uniq.length >= 4) break;
      uniquePush(uniq, o);
    }
    while (uniq.length < 4) uniquePush(uniq, uniq[uniq.length - 1] + "·");
    const four = uniq.slice(0, 4);
    const shuffled = shuffleStable(four, q.id);
    out.options = shuffled;
    out.correctAnswerIndex = Math.max(0, shuffled.indexOf(correct));
  }

  // Never invent generic instructional workingText — only real sentences belong there
  if (out.workingText) out.workingText = sentenceOnly(out.workingText);
  if (!out.workingText) delete out.workingText;

  out.meta = {
    refactored: true,
    refactorStyle: "other-scrub-distractors",
    difficultyTarget: "100-105% CERMAT9",
    sourceId: q.id,
  };
  return out;
}

function refactorOne(q) {
  if (isLetterOrGapBlank(q)) return refactorBlank(q);
  if (isWhichSentence(q)) return refactorWhichOrComma(q, "which");
  if (isComma(q)) return refactorWhichOrComma(q, "comma");
  return refactorOther(q);
}

function validate(list) {
  const issues = [];
  for (const q of list) {
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      issues.push(`${q.id}: options length ${q.options?.length}`);
      continue;
    }
    if (new Set(q.options.map(String)).size !== 4) issues.push(`${q.id}: duplicate options`);
    if (q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) issues.push(`${q.id}: bad index`);
    const c = q.options[q.correctAnswerIndex];
    if (q.options.filter((o) => o === c).length !== 1) issues.push(`${q.id}: correct not unique`);
    // absurd check only for full-sentence options
    if (q.options.some((o) => String(o).length > 15 && isAbsurdOption(o))) {
      issues.push(`${q.id}: absurd distractor remains`);
    }
  }
  return issues;
}

const beforeById = Object.fromEntries(pravopis.map((q) => [q.id, q]));
const refactored = pravopis.map(refactorOne);
writeFileSync(OUTPUT, JSON.stringify(refactored, null, 2) + "\n");

const issues = validate(refactored);
console.log(`\nRefactored ${refactored.length} → ${OUTPUT}`);
console.log(`Validation issues: ${issues.length}`);
if (issues.length) console.log(issues.slice(0, 25).join("\n"));

const styles = {};
for (const q of refactored) {
  const s = q.meta?.refactorStyle || "?";
  styles[s] = (styles[s] || 0) + 1;
}
console.log("Styles:", styles);

const sampleIds = ["q-0002", "q-0151", "q-0191"];
for (const id of sampleIds) {
  const b = beforeById[id];
  const a = refactored.find((q) => q.id === id);
  console.log("\n" + "=".repeat(72));
  console.log(`SAMPLE ${id}`);
  console.log("-".repeat(72));
  console.log("PŘED:");
  console.log("  Q:", b.text);
  b.options.forEach((o, i) =>
    console.log(`    ${i === b.correctAnswerIndex ? ">" : " "} [${i}] ${o}`)
  );
  console.log("PO:");
  console.log("  Q:", a.text);
  if (a.workingText) console.log("  workingText:", a.workingText);
  a.options.forEach((o, i) =>
    console.log(`    ${i === a.correctAnswerIndex ? ">" : " "} [${i}] ${o}`)
  );
  console.log("  style:", a.meta?.refactorStyle);
}
