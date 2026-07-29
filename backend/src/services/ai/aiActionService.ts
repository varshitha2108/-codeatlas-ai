import { pool } from '../../config/db'
import { nanoid } from 'nanoid'
import { getFileContent } from '../files/fileReaderService'
import { buildExplainPrompt } from './promptTemplates/explain.prompt'
import { parseResponse, type ActionType } from './responseParser'
import { geminiProvider } from './geminiProvider'
import { AppError } from '../../errors/AppError'

interface RunActionParams {
  projectId: string
  filePath: string
  selectedRange: { startLine: number; endLine: number }
  actionType: ActionType
}

function getLines(content: string, startLine: number, endLine: number): string {
  const lines = content.split('\n')
  return lines.slice(startLine - 1, endLine).join('\n')
}

function getSurroundingLines(content: string, startLine: number, endLine: number): string {
  const lines = content.split('\n')
  const contextStart = Math.max(0, startLine - 1 - 20)
  const contextEnd = Math.min(lines.length, endLine + 20)
  return lines.slice(contextStart, contextEnd).join('\n')
}

export async function runAIAction(
  params: RunActionParams,
  onToken: (token: string) => void
) {
  const { projectId, filePath, selectedRange, actionType } = params

  const file = await getFileContent(projectId, filePath)
  if (!file.content) {
    throw new AppError('FILE_NOT_FOUND', 404, 'File content not available')
  }

  const code = getLines(file.content, selectedRange.startLine, selectedRange.endLine)
  const surroundingCode = getSurroundingLines(file.content, selectedRange.startLine, selectedRange.endLine)

  if (!code.trim()) {
    throw new AppError('INVALID_RANGE', 422, 'Selected range is empty')
  }

  let prompt: { systemPrompt: string; userPrompt: string }

  if (actionType === 'explain') {
    prompt = buildExplainPrompt({
      code,
      surroundingCode,
      language: file.language || 'plaintext',
      filePath,
    })
  } else {
    throw new AppError('INVALID_ACTION_TYPE', 400, `Action type not yet supported: ${actionType}`)
  }

  const cardId = `card_${nanoid(10)}`

  const result = await geminiProvider.streamCompletion(
    {
      systemPrompt: prompt.systemPrompt,
      userPrompt: prompt.userPrompt,
      maxOutputTokens: 500,
      temperature: 0.3,
    },
    onToken
  )

  const parsed = parseResponse(actionType, result.text)

  await pool.query(
    `INSERT INTO ai_sessions (id, project_id, file_path, action_type, selected_range, prompt, response, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'done')`,
    [
      cardId,
      projectId,
      filePath,
      actionType,
      JSON.stringify(selectedRange),
      prompt.userPrompt,
      JSON.stringify(parsed),
    ]
  )

  return { cardId, response: parsed }
}