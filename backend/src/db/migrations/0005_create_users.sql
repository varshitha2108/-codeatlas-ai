CREATE TABLE users (
  id text PRIMARY KEY,
  github_id text UNIQUE NOT NULL,
  username text NOT NULL,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);