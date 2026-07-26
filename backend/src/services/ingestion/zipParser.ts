import unzipper from 'unzipper'
import { putObject } from '../../storage/objectStorageClient'
import { AppError } from '../../errors/AppError'
import {
  MAX_FILE_COUNT,
  MAX_UNCOMPRESSED_SIZE_BYTES,
  MAX_DIRECTORY_DEPTH,
} from '../../config/constants'

interface ExtractedFile {
  path: string
  size: number
  storageKey: string
}

export async function extractZip(projectId: string, zipBuffer: Buffer): Promise<ExtractedFile[]> {
  const files: ExtractedFile[] = []
  let fileCount = 0
  let totalUncompressedSize = 0

  const directory = await unzipper.Open.buffer(zipBuffer)

  for (const entry of directory.files) {
    const entryPath = entry.path
    const type = entry.type // 'File' or 'Directory'

    if (type === 'Directory') {
      continue
    }

    const depth = entryPath.split('/').length
    if (depth > MAX_DIRECTORY_DEPTH) {
      throw new AppError('TOO_MANY_FILES', 422, 'Project directory structure is too deeply nested')
    }

    fileCount++
    if (fileCount > MAX_FILE_COUNT) {
      throw new AppError('TOO_MANY_FILES', 422, `Project exceeds the maximum of ${MAX_FILE_COUNT} files`)
    }

    if (entry.uncompressedSize > MAX_UNCOMPRESSED_SIZE_BYTES) {
      throw new AppError('EXTRACTED_SIZE_TOO_LARGE', 422, 'A single file in this project is too large')
    }

    totalUncompressedSize += entry.uncompressedSize
    if (totalUncompressedSize > MAX_UNCOMPRESSED_SIZE_BYTES) {
      throw new AppError('EXTRACTED_SIZE_TOO_LARGE', 422, 'Project is too large after extraction')
    }

    const content = await entry.buffer()
    const storageKey = `files/${projectId}/${entryPath}`
    await putObject(storageKey, content)

    files.push({ path: entryPath, size: content.length, storageKey })
  }

  return files
}