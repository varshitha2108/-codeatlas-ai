import { getSessionId } from './sessionId'

const BASE_URL = 'http://localhost:3001/v1'

interface RunActionParams {
  projectId: string
  filePath: string
  selectedRange: { startLine: number; endLine: number }
  actionType: string
  question?: string
}

export async function runAIAction(
  params: RunActionParams,
  onMeta: (cardId: string) => void,
  onChunk: (token: string) => void,
  onDone: (finalResponse: any) => void,
  onError: (message: string) => void
) {
  const response = await fetch(`${BASE_URL}/ai/actions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Session-Id': getSessionId() },
    body: JSON.stringify(params),
  })

  if (!response.body) {
    onError('No response body')
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const events = buffer.split('\n\n')
    buffer = events.pop() || ''

    for (const eventBlock of events) {
      const lines = eventBlock.split('\n')
      const eventLine = lines.find((l) => l.startsWith('event: '))
      const dataLine = lines.find((l) => l.startsWith('data: '))
      if (!eventLine || !dataLine) continue

      const eventType = eventLine.replace('event: ', '')
      const data = JSON.parse(dataLine.replace('data: ', ''))

      if (eventType === 'meta') onMeta(data.cardId)
      else if (eventType === 'chunk') onChunk(data.token)
      else if (eventType === 'done') onDone(data.finalResponse)
      else if (eventType === 'error') onError(data.message)
    }
  }
}

export async function sendFollowup(
  cardId: string,
  question: string,
  onChunk: (token: string) => void,
  onDone: (finalResponse: any) => void,
  onError: (message: string) => void
) {
  const response = await fetch(`${BASE_URL}/ai/actions/${cardId}/followup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Session-Id': getSessionId() },
    body: JSON.stringify({ question }),
  })

  if (!response.body) {
    onError('No response body')
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const events = buffer.split('\n\n')
    buffer = events.pop() || ''

    for (const eventBlock of events) {
      const lines = eventBlock.split('\n')
      const eventLine = lines.find((l) => l.startsWith('event: '))
      const dataLine = lines.find((l) => l.startsWith('data: '))
      if (!eventLine || !dataLine) continue

      const eventType = eventLine.replace('event: ', '')
      const data = JSON.parse(dataLine.replace('data: ', ''))

      if (eventType === 'chunk') onChunk(data.token)
      else if (eventType === 'done') onDone(data.finalResponse)
      else if (eventType === 'error') onError(data.message)
    }
  }
}