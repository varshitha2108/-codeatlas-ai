import { apiGet } from './apiClient'

interface FileTreeNode {
  path: string
  type: string
  language: string | null
  size: number | null
}

interface FileContent {
  path: string
  content: string
  language: string | null
}

export function getFileTree(projectId: string) {
  return apiGet<{ projectId: string; tree: FileTreeNode[] }>(`/projects/${projectId}/files`)
}

export function getFileContent(projectId: string, path: string) {
  return apiGet<FileContent>(`/projects/${projectId}/files/content?path=${encodeURIComponent(path)}`)
}