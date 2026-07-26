import { pool } from '../../config/db'

interface FileRow {
  path: string
  type: string
  language: string | null
  size: number | null
}

export async function getFileTree(projectId: string) {
  const result = await pool.query<FileRow>(
    'SELECT path, type, language, size FROM files WHERE project_id = $1 ORDER BY path',
    [projectId]
  )

  return result.rows.map((row) => ({
    path: row.path,
    type: row.type,
    language: row.language,
    size: row.size,
  }))
}