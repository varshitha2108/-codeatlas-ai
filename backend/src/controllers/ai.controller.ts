import type { Request, Response } from 'express'
import { runAIAction } from '../services/ai/aiActionService'
import { setupSSE, sendSSEEvent } from '../utils/sse'
import { nanoid } from 'nanoid'
import { runFollowup } from '../services/ai/followupService'

export async function sendFollowup(req: Request, res: Response) {
  const cardId = req.params.cardId as string
  const { question } = req.body

  setupSSE(res)

  try {
    const result = await runFollowup(cardId, question, (token) => {
      sendSSEEvent(res, 'chunk', { token })
    })
    sendSSEEvent(res, 'done', { finalResponse: { markdown: result.markdown } })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong'
    sendSSEEvent(res, 'error', { code: 'AI_PROVIDER_ERROR', message })
  }

  res.end()
}

export async function runAction(req: Request, res: Response) {
  const { projectId, filePath, selectedRange, actionType, question } = req.body

  setupSSE(res)

  const cardId = `card_${nanoid(10)}`
  sendSSEEvent(res, 'meta', { cardId, actionType, filePath, selectedRange })

  try {
    const result = await runAIAction(
      { cardId, projectId, filePath, selectedRange, actionType, question },
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