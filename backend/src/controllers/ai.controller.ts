import type { Request, Response } from 'express'
import { runAIAction } from '../services/ai/aiActionService'
import { setupSSE, sendSSEEvent } from '../utils/sse'
import { nanoid } from 'nanoid'

export async function runAction(req: Request, res: Response) {
  const { projectId, filePath, selectedRange, actionType, question } = req.body

  setupSSE(res)

  const cardId = `card_${nanoid(10)}`
  sendSSEEvent(res, 'meta', { cardId, actionType, filePath, selectedRange })

  try {
    const result = await runAIAction(
      { projectId, filePath, selectedRange, actionType, question },
      (token) => {
        sendSSEEvent(res, 'chunk', { token })
      }
    )

    sendSSEEvent(res, 'done', { cardId: result.cardId, finalResponse: result.response })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong'
    sendSSEEvent(res, 'error', { code: 'AI_PROVIDER_ERROR', message, cardId })
  }

  res.end()
}