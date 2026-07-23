CREATE TABLE projects (
  id text PRIMARY KEY,
  session_id uuid NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('zip', 'github', 'snippet')),
  status text NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'failed')),
  stage text CHECK (stage IN ('fetching', 'parsing', 'indexing', 'ready')),
  error_code text,
  repo_url text,
  branch text,
  file_count integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

CREATE INDEX idx_projects_session_id ON projects (session_id);
CREATE INDEX idx_projects_expires_at ON projects (expires_at);