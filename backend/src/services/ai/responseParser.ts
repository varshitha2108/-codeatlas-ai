export type ActionType =
  | 'explain'
  | 'explain_beginner'
  | 'find_bugs'
  | 'optimize'
  | 'generate_comments'
  | 'generate_tests'
  | 'ask_ai'

export function parseResponse(actionType: ActionType, rawText: string) {
  switch (actionType) {
    case 'explain':
    case 'explain_beginner':
    case 'ask_ai':
      return { actionType, markdown: rawText }
    default:
      throw new Error(`No parser implemented yet for action type: ${actionType}`)
  }
}