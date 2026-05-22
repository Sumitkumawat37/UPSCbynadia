-- ============================================================
-- UPSC PLATFORM ADVANCED FEATURES SCHEMA
-- ============================================================

-- 1. PYQ (PREVIOUS YEAR QUESTIONS) MODULE
CREATE TABLE IF NOT EXISTS public.pyq_questions (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  subject       TEXT        NOT NULL,   -- e.g. Polity, History, Economy
  topic         TEXT        NOT NULL,   -- e.g. Fundamental Rights
  year          INTEGER     NOT NULL,   -- e.g. 2024, 2023
  question      TEXT        NOT NULL,
  options       JSONB       NOT NULL,   -- Array of strings: ["Option A", "Option B", "Option C", "Option D"]
  correct_index INTEGER     NOT NULL,   -- 0 to 3
  explanation   TEXT        DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pyq_attempts (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  pyq_id        UUID        REFERENCES public.pyq_questions(id) ON DELETE CASCADE,
  selected_index INTEGER    NOT NULL,   -- Index of the chosen option (-1 for skipped)
  is_correct    BOOLEAN     NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pyq_bookmarks (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  pyq_id        UUID        REFERENCES public.pyq_questions(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pyq_id)
);

-- 2. NOTES & BOOKMARK SYSTEM
CREATE TABLE IF NOT EXISTS public.notes (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  lecture_id    UUID        REFERENCES public.lectures(id) ON DELETE CASCADE,
  content       TEXT        NOT NULL,
  timestamp_seconds INTEGER DEFAULT 0,  -- For video timestamp notes (0 if general)
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lecture_bookmarks (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  lecture_id    UUID        REFERENCES public.lectures(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lecture_id)
);

CREATE TABLE IF NOT EXISTS public.quiz_bookmarks (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  quiz_question_id UUID     REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quiz_question_id)
);

-- 3. CURRENT AFFAIRS MODULE
CREATE TABLE IF NOT EXISTS public.current_affairs (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT        NOT NULL,
  content       TEXT        NOT NULL,   -- Rich Text/Markdown content
  category      TEXT        NOT NULL,   -- Polity, Economy, Environment, Science & Tech, International Relations
  compilation_month TEXT,              -- e.g. "May 2026" for monthly compilations (null if daily only)
  mcqs          JSONB       DEFAULT '[]'::jsonb, -- Daily practice questions specific to this post
  published_at  TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.current_affair_bookmarks (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  article_id    UUID        REFERENCES public.current_affairs(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- 4. MAINS ANSWER WRITING MODULE
CREATE TABLE IF NOT EXISTS public.mains_questions (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT        NOT NULL,
  question      TEXT        NOT NULL,
  subject       TEXT        NOT NULL,
  word_limit    INTEGER     DEFAULT 250,
  max_marks     INTEGER     DEFAULT 15,
  deadline      TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mains_submissions (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id   UUID        REFERENCES public.mains_questions(id) ON DELETE CASCADE,
  user_id       UUID        REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  answer_text   TEXT,
  file_url      TEXT,       -- PDF/Image upload link
  word_count    INTEGER     DEFAULT 0,
  status        TEXT        NOT NULL DEFAULT 'pending', -- pending | reviewed
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mains_reviews (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID        REFERENCES public.mains_submissions(id) ON DELETE CASCADE,
  teacher_id    UUID        REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  marks_obtained INTEGER    NOT NULL,
  remarks       TEXT        DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PUSH & IN-APP NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title         TEXT        NOT NULL,
  message       TEXT        NOT NULL,
  category      TEXT        NOT NULL,   -- quiz_result | new_lecture | live_class | doubt_reply | announcement
  link          TEXT,       -- Navigation link e.g. "/quizzes/results"
  is_read       BOOLEAN     NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STUDY PLANNER
CREATE TABLE IF NOT EXISTS public.study_plans (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  target_date   DATE        NOT NULL,
  focus_area    TEXT,       -- e.g. "Polity Laxmikanth Chapter 5"
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.study_tasks (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id       UUID        REFERENCES public.study_plans(id) ON DELETE CASCADE,
  task_name     TEXT        NOT NULL,
  is_completed  BOOLEAN     NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COURSE EXPERIENCE & LECTURE COMPLETION TRACKING
CREATE TABLE IF NOT EXISTS public.lecture_progress (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  lecture_id    UUID        REFERENCES public.lectures(id) ON DELETE CASCADE,
  completed     BOOLEAN     NOT NULL DEFAULT false,
  watched_seconds INTEGER   NOT NULL DEFAULT 0,
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lecture_id)
);

-- ============================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_pyq_questions_filter ON public.pyq_questions(subject, topic, year);
CREATE INDEX IF NOT EXISTS idx_pyq_attempts_user ON public.pyq_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_lecture ON public.notes(user_id, lecture_id);
CREATE INDEX IF NOT EXISTS idx_current_affairs_category ON public.current_affairs(category, published_at);
CREATE INDEX IF NOT EXISTS idx_mains_submissions_user ON public.mains_submissions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_study_plans_date ON public.study_plans(user_id, target_date);
CREATE INDEX IF NOT EXISTS idx_lecture_progress_user ON public.lecture_progress(user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.pyq_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyq_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyq_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecture_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.current_affairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.current_affair_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mains_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mains_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mains_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecture_progress ENABLE ROW LEVEL SECURITY;

-- 1. Read Policies for Students (Authenticated)
CREATE POLICY "Allow authenticated read pyq_questions" ON public.pyq_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read current_affairs" ON public.current_affairs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read mains_questions" ON public.mains_questions FOR SELECT TO authenticated USING (true);

-- 2. User-specific data policies (Read/Write/Delete owned data)
CREATE POLICY "Users can manage own pyq_attempts" ON public.pyq_attempts FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own pyq_bookmarks" ON public.pyq_bookmarks FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own notes" ON public.notes FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own lecture_bookmarks" ON public.lecture_bookmarks FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own quiz_bookmarks" ON public.quiz_bookmarks FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own current_affair_bookmarks" ON public.current_affair_bookmarks FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own mains_submissions" ON public.mains_submissions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own mains_reviews" ON public.mains_reviews FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.mains_submissions s 
    WHERE s.id = submission_id AND s.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own study_plans" ON public.study_plans FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own study_tasks" ON public.study_tasks FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.study_plans p 
    WHERE p.id = plan_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own lecture_progress" ON public.lecture_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. Teacher/Admin full access policies
CREATE POLICY "Admins full management pyq_questions" ON public.pyq_questions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role IN ('admin', 'super_admin')));

CREATE POLICY "Admins full management current_affairs" ON public.current_affairs FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role IN ('admin', 'super_admin')));

CREATE POLICY "Admins full management mains_questions" ON public.mains_questions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role IN ('admin', 'super_admin')));

CREATE POLICY "Admins view all mains_submissions" ON public.mains_submissions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role IN ('admin', 'super_admin')));

CREATE POLICY "Admins full management mains_reviews" ON public.mains_reviews FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role IN ('admin', 'super_admin')));
