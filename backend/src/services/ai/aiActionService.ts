import { pool } from '../../config/db'
import { nanoid } from 'nanoid'
import { getFileContent } from '../files/fileReaderService'
import { buildExplainPrompt } from './promptTemplates/explain.prompt'
import { buildExplainBeginnerPrompt } from './promptTemplates/explainBeginner.prompt'
import { buildFindBugsPrompt } from './promptTemplates/findBugs.prompt'
import { buildOptimizePrompt } from './promptTemplates/optimize.prompt'
import { buildGenerateCommentsPrompt } from './promptTemplates/generateComments.prompt'
import { buildGenerateTestsPrompt } from './promptTemplates/generateTests.prompt'
import { buildAskAiPrompt } from './promptTemplates/askAi.prompt'
import { parseResponse, type ActionType } from './responseParser'
import { geminiProvider } from './geminiProvider'
import { AppError } from '../../errors/AppError'

interface RunActionParams {
  projectId: string
  filePath: string
  selectedRange: { startLine: number; endLine: number }
  actionType: ActionType
  question?: string
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

const temperatureByAction: Record<ActionType, number> = {
  explain: 0.3,
  explain_beginner: 0.4,
  find_bugs: 0.2,
  optimize: 0.2,
  generate_comments: 0.2,
  generate_tests: 0.3,
  ask_ai: 0.5,
}

export async function runAIAction(
  params: RunActionParams,
  onToken: (token: string) => void
) {
  const { projectId, filePath, selectedRange, actionType, question } = params

  const file = await getFileContent(projectId, filePath)
  if (!file.content) {
    throw new AppError('FILE_NOT_FOUND', 404, 'File content not available')
  }

  const code = getLines(file.content, selectedRange.startLine, selectedRange.endLine)
  const surroundingCode = getSurroundingLines(file.content, selectedRange.startLine, selectedRange.endLine)

  if (!code.trim()) {
    throw new AppError('INVALID_RANGE', 422, 'Selected range is empty')
  }

  const language = file.language || 'plaintext'
  const context = { code, surroundingCode, language, filePath }

  let prompt: { systemPrompt: string; userPrompt: string }

  switch (actionType) {
    case 'explain':
      prompt = buildExplainPrompt(context)
      break
    case 'explain_beginner':
      prompt = buildExplainBeginnerPrompt(context)
      break
    case 'find_bugs':
      prompt = buildFindBugsPrompt(context)
      break
    case 'optimize':
      prompt = buildOptimizePrompt(context)
      break
    case 'generate_comments':
      prompt = buildGenerateCommentsPrompt(context)
      break
    case 'generate_tests':
      prompt = buildGenerateTestsPrompt(context)
      break
    case 'ask_ai':
      if (!question) {
        throw new AppError('MISSING_QUESTION', 400, 'A question is required for Ask AI')
      }
      prompt = buildAskAiPrompt({ ...context, question })
      break
    default:
      throw new AppError('INVALID_ACTION_TYPE', 400, `Unknown action type: ${actionType}`)
  }

  const cardId = `card_${nanoid(10)}`

  const result = await geminiProvider.streamCompletion(
    {
      systemPrompt: prompt.systemPrompt,
      userPrompt: prompt.userPrompt,
      maxOutputTokens: actionType === 'generate_tests' ? 800 : 500,
      temperature: temperatureByAction[actionType],
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