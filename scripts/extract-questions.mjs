/**
 * One-shot helper: if QuizPrototype.jsx still has an inline questionsData
 * array, extract it to data/questions.json and replace with an import.
 *
 * Safe to re-run after extraction — validates the JSON bank instead.
 */
import { readFileSync, writeFileSync, mkdirSync, statSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const quizPath = resolve(root, "QuizPrototype.jsx");
const outPath = resolve(root, "data", "questions.json");

function validateQuestionsFile() {
  if (!existsSync(outPath)) {
    throw new Error("Missing data/questions.json");
  }
  const questions = JSON.parse(readFileSync(outPath, "utf8"));
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("data/questions.json is empty or invalid");
  }
  const required = ["category", "text", "options", "correctAnswerIndex", "explanation", "hint"];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    for (const key of required) {
      if (!(key in q)) throw new Error(`Question ${i} missing key: ${key}`);
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`Question ${i} must have exactly 4 options`);
    }
    if (q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) {
      throw new Error(`Question ${i} has invalid correctAnswerIndex`);
    }
  }
  console.log(`OK: data/questions.json has ${questions.length} questions (${statSync(outPath).size} bytes)`);
  return questions.length;
}

const src = readFileSync(quizPath, "utf8");
const arrayStartMarker = "const questionsData = [";
const realStart = src.indexOf(arrayStartMarker);

if (realStart < 0) {
  console.log("Inline questionsData already extracted — validating JSON bank…");
  validateQuestionsFile();
  if (!src.includes("./data/questions.json")) {
    throw new Error("QuizPrototype.jsx is missing import of ./data/questions.json");
  }
  process.exit(0);
}

const arrayStart = src.indexOf("[", realStart);
const endMarker = "];\nconst LETTERS";
const end = src.indexOf(endMarker, arrayStart);
if (end < 0) throw new Error("questionsData end not found");

const arrayLiteral = src.slice(arrayStart, end + 1);
const questions = Function(`return (${arrayLiteral})`)();

mkdirSync(resolve(root, "data"), { recursive: true });
writeFileSync(outPath, JSON.stringify(questions, null, 2), "utf8");
console.log(`Extracted ${questions.length} questions -> data/questions.json (${statSync(outPath).size} bytes)`);

const commentBlock =
  "// ---------------------------------------------------------------------------\n" +
  "// Data (shape mirrors questions.json / Question struct)\n" +
  "// ---------------------------------------------------------------------------\n";

let next = src;
const blockStart = next.indexOf(commentBlock);
const removeFrom = blockStart >= 0 ? blockStart : realStart;
const removeTo = end + 2;
next = next.slice(0, removeFrom) + next.slice(removeTo);

if (!next.includes("./data/questions.json")) {
  next = next.replace(
    'import { supabase } from "./lib/supabase/client";\n',
    'import { supabase } from "./lib/supabase/client";\nimport questionsData from "./data/questions.json";\n'
  );
}

if (/const questionsData\s*=\s*\[/.test(next)) {
  throw new Error("Inline questionsData still present after rewrite");
}
if (!next.includes("./data/questions.json")) {
  throw new Error("JSON import missing after rewrite");
}
if (!next.includes("const LETTERS")) {
  throw new Error("const LETTERS missing — rewrite cut too much");
}

writeFileSync(quizPath, next, "utf8");
console.log(`Rewrote QuizPrototype.jsx (${statSync(quizPath).size} bytes, ~${next.split("\n").length} lines)`);
validateQuestionsFile();
