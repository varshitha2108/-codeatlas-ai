export type ActionType =
  | 'explain'
  | 'explain_beginner'
  | 'find_bugs'
  | 'optimize'
  | 'generate_comments'
  | 'generate_tests'
  | 'ask_ai'

interface BugItem {
  severity: string
  description: string
}

function extractJsonArray(text: string): any[] {
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) return []
  try {
    return JSON.parse(match[0])
  } catch {
    return []
  }
}

function extractCodeBlock(text: string): string {
  const match = text.match(/```[\w]*\n([\s\S]*?)```/)
  return match ? match[1].trim() : text.trim()
}

export function parseResponse(actionType: ActionType, rawText: string) {
  switch (actionType) {
    case 'explain':
    case 'explain_beginner':
    case 'ask_ai':
      return { actionType, markdown: rawText }

    case 'find_bugs': {
      const bugs = extractJsonArray(rawText) as BugItem[]
      return { actionType, bugs }
    }

    case 'optimize': {
      const code = extractCodeBlock(rawText)
      const rationale = rawText.replace(/```[\w]*\n[\s\S]*?```/, '').trim()
      return { actionType, code, rationale }
    }

    case 'generate_comments':
    case 'generate_tests': {
      const code = extractCodeBlock(rawText)
      return { actionType, code }
    }

    default:
      throw new Error(`No parser implemented for action type: ${actionType}`)
  }
}