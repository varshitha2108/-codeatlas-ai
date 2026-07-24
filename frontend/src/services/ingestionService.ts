import { apiPost } from './apiClient'

interface SnippetResponse {
  projectId: string
  status: string
  sourceType: string
}

export function createSnippetProject(code: string, language: string) {
  return apiPost<SnippetResponse>('/projects/snippet', { code, language })
}