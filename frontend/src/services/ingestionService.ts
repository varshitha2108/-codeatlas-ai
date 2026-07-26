import { apiPost, apiGet, apiPostFormData } from './apiClient'
interface SnippetResponse {
  projectId: string
  status: string
  sourceType: string
}

interface UploadResponse {
  projectId: string
  status: string
  sourceType: string
}

interface StatusResponse {
  projectId: string
  status: string
  stage: string | null
  error: string | null
  filesTotal: number | null
}

export function createSnippetProject(code: string, language: string) {
  return apiPost<SnippetResponse>('/projects/snippet', { code, language })
}

export function uploadZipProject(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  return apiPostFormData<UploadResponse>('/projects/upload', formData)
}

export function getProjectStatus(projectId: string) {
  return apiGet<StatusResponse>(`/projects/${projectId}/status`)
}