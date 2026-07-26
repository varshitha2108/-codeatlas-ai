import { pool } from '../../config/db'
import { AppError } from '../../errors/AppError'

export async function getProjectStatus(projectId: string) {
  const result = await pool.query(
    `SELECT status, stage, error_code, file_count FROM projects WHERE id = $1`,
    [projectId]
  )

  if (result.rows.length === 0) {
    throw new AppError('PROJECT_NOT_FOUND', 404, 'Project not found')
  }

  const row = result.rows[0]
  return {
    projectId,
    status: row.status,
    stage: row.stage,
    error: row.error_code,
    filesTotal: row.file_count,
  }
}