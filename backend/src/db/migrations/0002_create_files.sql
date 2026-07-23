CREATE TABLE files (
  id bigserial PRIMARY KEY,
  project_id text NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  path text NOT NULL,
  type text NOT NULL CHECK (type IN ('file', 'folder')),
  language text,
  size integer,
  storage_key text,
  content text,
  UNIQUE (project_id, path)
);

CREATE INDEX idx_files_project_id ON files (project_id);