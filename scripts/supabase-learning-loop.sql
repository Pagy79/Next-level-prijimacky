-- =============================================================================
-- Learning loop — spusť v Supabase Dashboard → SQL Editor
-- Tabulky attempts + attempt_answers (RLS: jen vlastní řádky)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('practice', 'full', 'mistakes')),
  category TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  max_score INTEGER NOT NULL,
  question_count INTEGER NOT NULL,
  answered_count INTEGER NOT NULL DEFAULT 0,
  percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
  time_expired BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS attempts_user_created_idx
  ON public.attempts (user_id, created_at DESC);

ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own attempts" ON public.attempts;
CREATE POLICY "Users can read own attempts"
  ON public.attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own attempts" ON public.attempts;
CREATE POLICY "Users can insert own attempts"
  ON public.attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.attempt_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.attempts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  category TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  selected_index INTEGER,
  hint_used BOOLEAN NOT NULL DEFAULT false,
  points_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS attempt_answers_user_question_idx
  ON public.attempt_answers (user_id, question_id, created_at DESC);

CREATE INDEX IF NOT EXISTS attempt_answers_user_category_idx
  ON public.attempt_answers (user_id, category);

ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own answers" ON public.attempt_answers;
CREATE POLICY "Users can read own answers"
  ON public.attempt_answers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own answers" ON public.attempt_answers;
CREATE POLICY "Users can insert own answers"
  ON public.attempt_answers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
