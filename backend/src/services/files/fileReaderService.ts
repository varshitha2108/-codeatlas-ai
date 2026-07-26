import { pool } from '../../config/db'
import { AppError } from '../../errors/AppError'

export async function getFileContent(projectId: string, path: string) {
  const result = await pool.query(
    'SELECT content, language FROM files WHERE project_id = $1 AND path = $2',
    [projectId, path]
  )

  if (result.rows.length === 0) {
    throw new AppError('FILE_NOT_FOUND', 404, `File not found: ${path}`)
  }

  return {
    path,
    content: result.rows[0].content,
    language: result.rows[0].language,
  }
}