import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { getFileTree, getFileContent } from '../../services/projectService'
import { useTheme } from '../../context/ThemeContext'
import { Skeleton } from '../../shared/components/Skeleton'
import { EmptyState } from '../../shared/components/EmptyState'

interface FileNode {
  path: string
  type: string
  language: string | null
}

export function WorkspaceScreen() {
  const { projectId } = useParams<{ projectId: string }>()
  const { theme } = useTheme()

  const [files, setFiles] = useState<FileNode[]>([])
  const [activeFile, setActiveFile] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [language, setLanguage] = useState('plaintext')
  const [isLoadingTree, setIsLoadingTree] = useState(true)
  const [isLoadingContent, setIsLoadingContent] = useState(true)

  useEffect(() => {
    if (!projectId) return

    setIsLoadingTree(true)
    getFileTree(projectId).then((result) => {
      setFiles(result.tree)
      const firstFile = result.tree.find((f) => f.type === 'file')
      if (firstFile) setActiveFile(firstFile.path)
      setIsLoadingTree(false)
    })
  }, [projectId])

  useEffect(() => {
    if (!projectId || !activeFile) return

    setIsLoadingContent(true)
    getFileContent(projectId, activeFile).then((file) => {
      setContent(file.content)
      setLanguage(file.language || 'plaintext')
      setIsLoadingContent(false)
    })
  }, [projectId, activeFile])

  return (
    <div className="flex h-screen bg-canvas">
      <div className="w-60 bg-surface border-r border-subtle p-3 flex flex-col gap-1">
        <h2 className="text-secondary text-xs font-medium mb-2 uppercase tracking-wide">
          Explorer
        </h2>

        {isLoadingTree && (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        )}

        {!isLoadingTree && files.length === 0 && (
          <EmptyState title="No files" description="This project has no files yet." />
        )}

        {!isLoadingTree &&
          files.map((file) => (
            <button
              key={file.path}
              onClick={() => setActiveFile(file.path)}
              className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md text-sm font-mono transition-colors ${
                activeFile === file.path
                  ? 'bg-selected text-primary'
                  : 'text-secondary hover:bg-hover hover:text-primary'
              }`}
            >
              {file.path}
            </button>
          ))}
      </div>

      <div className="flex-1 relative">
        {isLoadingContent && (
          <div className="absolute inset-0 flex items-center justify-center bg-editor">
            <Skeleton className="h-4 w-64" />
          </div>
        )}
        <Editor
          height="100%"
          language={language}
          value={content}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{ readOnly: true, minimap: { enabled: true } }}
        />
      </div>
    </div>
  )
}