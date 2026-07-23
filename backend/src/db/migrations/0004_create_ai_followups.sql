CREATE TABLE ai_followups (
  id bigserial PRIMARY KEY,
  ai_session_id text NOT NULL REFERENCES ai_sessions(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer_markdown text,
  status text NOT NULL DEFAULT 'streaming' CHECK (status IN ('streaming', 'done', 'error')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_followups_session_created ON ai_followups (ai_session_id, created_at);