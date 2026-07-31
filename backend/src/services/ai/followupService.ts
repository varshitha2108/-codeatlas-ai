import { pool } from '../../config/db'
import { geminiProvider } from './geminiProvider'
import { AppError } from '../../errors/AppError'

export async function runFollowup(
  cardId: string,
  question: string,
  onToken: (token: string) => void
) {
  const cardResult = await pool.query(
    'SELECT prompt, response FROM ai_sessions WHERE id = $1',
    [cardId]
  )

  if (cardResult.rows.length === 0) {
    throw new AppError('CARD_NOT_FOUND', 404, 'AI card not found')
  }

  const originalPrompt = cardResult.rows[0].prompt
  const originalResponse = cardResult.rows[0].response

  const priorFollowups = await pool.query(
    'SELECT question, answer_markdown FROM ai_followups WHERE ai_session_id = $1 ORDER BY created_at',
    [cardId]
  )

  let conversationHistory = `Original context:\n${originalPrompt}\n\nOriginal answer:\n${JSON.stringify(originalResponse)}\n\n`
  for (const row of priorFollowups.rows) {
    conversationHistory += `Follow-up question: ${row.question}\nAnswer: ${row.answer_markdown}\n\n`
  }

  const systemPrompt = `You are a helpful coding assistant continuing a conversation about a specific piece of code. Respond conversationally in markdown, taking the prior context into account.`
  const userPrompt = `${conversationHistory}New follow-up question: ${question}`

  const result = await geminiProvider.streamCompletion(
    { systemPrompt, userPrompt, maxOutputTokens: 500, temperature: 0.5 },
    onToken
  )

  await pool.query(
    `INSERT INTO ai_followups (ai_session_id, question, answer_markdown, status)
     VALUES ($1, $2, $3, 'done')`,
    [cardId, question, result.text]
  )

  return { markdown: result.text }
}