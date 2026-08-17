import { supabase } from "./supabase/client";

const LOCAL_ATTEMPTS_KEY = "nlp_attempts_v1";
const LOCAL_ANSWERS_KEY = "nlp_answers_v1";

function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("localStorage write failed:", e);
  }
}

/**
 * Persist a finished attempt + per-question answers.
 * Tries Supabase first; always mirrors to localStorage as fallback.
 */
export async function saveAttempt({
  userId,
  mode,
  category,
  score,
  maxScore,
  questionCount,
  answeredCount,
  percentage,
  timeExpired,
  answers,
}) {
  const attemptId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const attemptRow = {
    id: attemptId,
    user_id: userId || null,
    mode,
    category: category || null,
    score,
    max_score: maxScore,
    question_count: questionCount,
    answered_count: answeredCount,
    percentage,
    time_expired: !!timeExpired,
    created_at: new Date().toISOString(),
  };

  const answerRows = (answers || []).map((a) => ({
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `ans-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    attempt_id: attemptId,
    user_id: userId || null,
    question_id: a.questionId,
    category: a.category,
    is_correct: !!a.isCorrect,
    selected_index: a.selectedIndex ?? null,
    hint_used: !!a.hintUsed,
    points_earned: a.pointsEarned ?? 0,
    created_at: new Date().toISOString(),
  }));

  // Local mirror (works even before SQL is applied / offline)
  const localAttempts = readLocal(LOCAL_ATTEMPTS_KEY, []);
  localAttempts.unshift(attemptRow);
  writeLocal(LOCAL_ATTEMPTS_KEY, localAttempts.slice(0, 200));

  const localAnswers = readLocal(LOCAL_ANSWERS_KEY, []);
  writeLocal(LOCAL_ANSWERS_KEY, [...answerRows, ...localAnswers].slice(0, 5000));

  if (!userId) {
    return { attemptId, source: "local" };
  }

  const { error: attemptError } = await supabase.from("attempts").insert({
    id: attemptId,
    user_id: userId,
    mode,
    category: category || null,
    score,
    max_score: maxScore,
    question_count: questionCount,
    answered_count: answeredCount,
    percentage,
    time_expired: !!timeExpired,
  });

  if (attemptError) {
    console.warn("Uložení attempt do Supabase selhalo:", attemptError.message);
    return { attemptId, source: "local", error: attemptError.message };
  }

  if (answerRows.length > 0) {
    const { error: answersError } = await supabase.from("attempt_answers").insert(
      answerRows.map(({ id, attempt_id, user_id, question_id, category, is_correct, selected_index, hint_used, points_earned }) => ({
        id,
        attempt_id,
        user_id,
        question_id,
        category,
        is_correct,
        selected_index,
        hint_used,
        points_earned,
      }))
    );
    if (answersError) {
      console.warn("Uložení answers do Supabase selhalo:", answersError.message);
      return { attemptId, source: "partial", error: answersError.message };
    }
  }

  return { attemptId, source: "supabase" };
}

/** Aggregate success rate per category across all attempts/answers. */
function computeCategoryStatsFromAnswers(answers) {
  const byCat = {};
  for (const a of answers) {
    if (!a?.category) continue;
    if (!byCat[a.category]) byCat[a.category] = { correct: 0, total: 0 };
    byCat[a.category].total += 1;
    if (a.is_correct) byCat[a.category].correct += 1;
  }
  const stats = {};
  for (const [category, { correct, total }] of Object.entries(byCat)) {
    stats[category] = {
      category,
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  }
  return stats;
}

/** Single weakest category (lowest %). Ties: more answers first. */
function pickWeakestArea(categoryStats) {
  const list = Object.values(categoryStats).sort(
    (a, b) => a.percentage - b.percentage || b.total - a.total
  );
  return list[0] || null;
}

function latestOutcomeByQuestion(answers) {
  // answers expected newest-first or we sort
  const sorted = [...answers].sort(
    (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
  );
  const map = new Map();
  for (const a of sorted) {
    if (!a.question_id || map.has(a.question_id)) continue;
    map.set(a.question_id, a);
  }
  return map;
}

/**
 * Load learning stats for dashboard + mistakes mode.
 */
export async function loadProgress(userId) {
  let answers = [];
  let attempts = [];
  let source = "local";

  if (userId) {
    const { data: remoteAnswers, error: ansErr } = await supabase
      .from("attempt_answers")
      .select("question_id, category, is_correct, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3000);

    const { data: remoteAttempts, error: attErr } = await supabase
      .from("attempts")
      .select("id, mode, category, score, max_score, percentage, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (!ansErr && remoteAnswers) {
      answers = remoteAnswers;
      source = "supabase";
    }
    if (!attErr && remoteAttempts) {
      attempts = remoteAttempts;
      if (source !== "supabase") source = "partial";
    }
    if (ansErr) console.warn("Načtení answers ze Supabase:", ansErr.message);
    if (attErr) console.warn("Načtení attempts ze Supabase:", attErr.message);
  }

  if (answers.length === 0) {
    answers = readLocal(LOCAL_ANSWERS_KEY, []).filter(
      (a) => !userId || !a.user_id || a.user_id === userId
    );
  }
  if (attempts.length === 0) {
    attempts = readLocal(LOCAL_ATTEMPTS_KEY, []).filter(
      (a) => !userId || !a.user_id || a.user_id === userId
    );
  }

  const categoryStats = computeCategoryStatsFromAnswers(answers);
  const weakestArea = pickWeakestArea(categoryStats);
  const latest = latestOutcomeByQuestion(answers);
  const mistakeQuestionIds = [...latest.entries()]
    .filter(([, a]) => !a.is_correct)
    .map(([id]) => id);

  return {
    categoryStats,
    weakestArea,
    /** @deprecated use weakestArea — kept as [weakest] for older callers */
    weakAreas: weakestArea ? [weakestArea] : [],
    mistakeQuestionIds,
    recentAttempts: attempts.slice(0, 10),
    totalAnswers: answers.length,
    hasPractice: answers.length > 0,
    source,
  };
}
