import { nanoid } from 'nanoid'
import { pool } from '../../config/db'
import type { SnippetInput } from '../../schemas/snippetSchema'

const languageExtensions: Record<string, string> = {
  javascript: 'js',
  typescript: 'ts',
  python: 'py',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  go: 'go',
  ruby: 'rb',
  csharp: 'cs',
  php: 'php',
}

export async function createSnippetProject(input: SnippetInput, sessionId: string) {
  const projectId = `proj_${nanoid(10)}`
  const fileName = input.fileName || `snippet.${languageExtensions[input.language]}`
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000)

  await pool.query(
    `INSERT INTO projects (id, session_id, source_type, status, file_count, created_at, expires_at)
     VALUES ($1, $2, 'snippet', 'ready', 1, now(), $3)`,
    [projectId, sessionId, expiresAt]
  )

  await pool.query(
    `INSERT INTO files (project_id, path, type, language, size, content)
     VALUES ($1, $2, 'file', $3, $4, $5)`,
    [projectId, fileName, input.language, input.code.length, input.code]
  )

  return { projectId }
}