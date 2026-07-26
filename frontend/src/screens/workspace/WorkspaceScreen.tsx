import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { getFileTree, getFileContent } from '../../services/projectService'
import { useTheme } from '../../context/ThemeContext'

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

  useEffect(() => {
    if (!projectId) return

    getFileTree(projectId).then((result) => {
      setFiles(result.tree)
      const firstFile = result.tree.find((f) => f.type === 'file')
      if (firstFile) setActiveFile(firstFile.path)
    })
  }, [projectId])

  useEffect(() => {
    if (!projectId || !activeFile) return

    getFileContent(projectId, activeFile).then((file) => {
      setContent(file.content)
      setLanguage(file.language || 'plaintext')
    })
  }, [projectId, activeFile])

  return (
    <div className="flex h-screen bg-canvas">
      <div className="w-60 bg-surface border-r border-subtle p-3">
        <h2 className="text-secondary text-xs font-medium mb-2 uppercase">Explorer</h2>
        {files.map((file) => (
          <button
            key={file.path}
            onClick={() => setActiveFile(file.path)}
            className={`block w-full text-left px-2 py-1 rounded text-sm ${
              activeFile === file.path ? 'bg-selected text-primary' : 'text-secondary hover:bg-hover'
            }`}
          >
            {file.path}
          </button>
        ))}
      </div>

      <div className="flex-1">
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