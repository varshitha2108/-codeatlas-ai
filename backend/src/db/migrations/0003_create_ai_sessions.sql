CREATE TABLE ai_sessions (
  id text PRIMARY KEY,
  project_id text NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  action_type text NOT NULL CHECK (action_type IN (
    'explain', 'explain_beginner', 'find_bugs', 'optimize',
    'generate_comments', 'generate_tests', 'ask_ai'
  )),
  question text,
  selected_range jsonb NOT NULL,
  prompt text NOT NULL,
  response jsonb,
  status text NOT NULL DEFAULT 'streaming' CHECK (status IN ('streaming', 'done', 'error')),
  error_code text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_sessions_project_id ON ai_sessions (project_id);
CREATE INDEX idx_ai_sessions_project_created ON ai_sessions (project_id, created_at);