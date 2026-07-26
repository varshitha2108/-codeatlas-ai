import { pool } from '../../config/db'
import { AppError } from '../../errors/AppError'
import { getObject } from '../../storage/objectStorageClient'

export async function getFileContent(projectId: string, path: string) {
  const result = await pool.query(
    'SELECT content, language, storage_key FROM files WHERE project_id = $1 AND path = $2',
    [projectId, path]
  )

  if (result.rows.length === 0) {
    throw new AppError('FILE_NOT_FOUND', 404, `File not found: ${path}`)
  }

  const row = result.rows[0]

  let content: string
  if (row.content !== null) {
    content = row.content
  } else if (row.storage_key) {
    const buffer = await getObject(row.storage_key)
    content = buffer.toString('utf-8')
  } else {
    throw new AppError('FILE_NOT_FOUND', 404, `No content available for: ${path}`)
  }

  return {
    path,
    content,
    language: row.language,
  }
}