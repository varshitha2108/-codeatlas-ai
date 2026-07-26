import { pool } from '../../config/db'
import { extractZip } from './zipParser'
import { AppError } from '../../errors/AppError'

const languageByExtension: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
}

function detectLanguage(path: string): string | null {
  const ext = path.split('.').pop()?.toLowerCase()
  return ext ? languageByExtension[ext] || null : null
}

export async function runZipIngestion(projectId: string, zipBuffer: Buffer) {
  try {
    await pool.query(
      `UPDATE projects SET stage = 'parsing' WHERE id = $1`,
      [projectId]
    )

    const extractedFiles = await extractZip(projectId, zipBuffer)

    for (const file of extractedFiles) {
      const language = detectLanguage(file.path)
      await pool.query(
        `INSERT INTO files (project_id, path, type, language, size, storage_key)
         VALUES ($1, $2, 'file', $3, $4, $5)`,
        [projectId, file.path, language, file.size, file.storageKey]
      )
    }

    await pool.query(
      `UPDATE projects SET status = 'ready', stage = 'ready', file_count = $2 WHERE id = $1`,
      [projectId, extractedFiles.length]
    )
  } catch (err) {
    const errorCode = err instanceof AppError ? err.code : 'INTERNAL_ERROR'
    await pool.query(
      `UPDATE projects SET status = 'failed', error_code = $2 WHERE id = $1`,
      [projectId, errorCode]
    )
  }
}