-- ============================================================
-- EMAIL CENTER SCHEMA
-- ============================================================

-- Email logs: every sent email is recorded here
CREATE TABLE IF NOT EXISTS public.email_logs (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id    UUID        REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  recipient_ids TEXT[]      NOT NULL DEFAULT '{}',
  recipient_emails TEXT[]   NOT NULL DEFAULT '{}',
  category      TEXT        NOT NULL,   -- assignment | quiz_notification | quiz_result | live_class | general
  subject       TEXT        NOT NULL,
  body          TEXT        NOT NULL,
  status        TEXT        NOT NULL DEFAULT 'sent',  -- sent | failed | pending
  error_msg     TEXT,
  sent_at       TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Email drafts: incomplete/saved compositions
CREATE TABLE IF NOT EXISTS public.email_drafts (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id    UUID        REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  recipient_ids TEXT[]      DEFAULT '{}',
  category      TEXT        DEFAULT 'general',
  subject       TEXT        DEFAULT '',
  body          TEXT        DEFAULT '',
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled emails: to be sent at a future time
CREATE TABLE IF NOT EXISTS public.scheduled_emails (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id    UUID        REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  recipient_ids TEXT[]      NOT NULL DEFAULT '{}',
  recipient_emails TEXT[]   NOT NULL DEFAULT '{}',
  category      TEXT        NOT NULL DEFAULT 'general',
  subject       TEXT        NOT NULL,
  body          TEXT        NOT NULL,
  scheduled_at  TIMESTAMPTZ NOT NULL,
  status        TEXT        NOT NULL DEFAULT 'pending',  -- pending | sent | cancelled
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_email_logs_teacher   ON public.email_logs(teacher_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at   ON public.email_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_drafts_teacher ON public.email_drafts(teacher_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_teacher    ON public.scheduled_emails(teacher_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_status     ON public.scheduled_emails(status, scheduled_at);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.email_logs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_drafts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_emails ENABLE ROW LEVEL SECURITY;

-- email_logs: teachers own their logs; service role bypasses
CREATE POLICY "teachers_manage_own_logs"
  ON public.email_logs FOR ALL
  USING  (teacher_id = (SELECT user_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1))
  WITH CHECK (teacher_id = (SELECT user_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1));

CREATE POLICY "service_role_all_logs"
  ON public.email_logs FOR ALL
  TO service_role USING (true) WITH CHECK (true);

-- email_drafts
CREATE POLICY "teachers_manage_own_drafts"
  ON public.email_drafts FOR ALL
  USING  (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "service_role_all_drafts"
  ON public.email_drafts FOR ALL
  TO service_role USING (true) WITH CHECK (true);

-- scheduled_emails
CREATE POLICY "teachers_manage_own_scheduled"
  ON public.scheduled_emails FOR ALL
  USING  (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "service_role_all_scheduled"
  ON public.scheduled_emails FOR ALL
  TO service_role USING (true) WITH CHECK (true);
