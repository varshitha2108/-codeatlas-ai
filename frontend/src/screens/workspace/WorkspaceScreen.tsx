import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import { getFileTree, getFileContent } from '../../services/projectService'
import { useTheme } from '../../context/ThemeContext'
import { runAIAction } from '../../services/aiService'
import { Card } from '../../shared/components/Card'
import { Badge } from '../../shared/components/Badge'
import { EmptyState } from '../../shared/components/EmptyState'
import { Skeleton } from '../../shared/components/Skeleton'

interface FileNode {
  path: string
  type: string
  language: string | null
}

interface AICard {
  id: string
  filePath: string
  range: { startLine: number; endLine: number }
  content: string
  status: 'streaming' | 'done' | 'error'
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

  const [selection, setSelection] = useState<{ startLine: number; endLine: number } | null>(null)
  const [toolbarPos, setToolbarPos] = useState<{ x: number; y: number } | null>(null)
  const [cards, setCards] = useState<AICard[]>([])
  const editorRef = useRef<any>(null)

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

  function handleEditorMount(editor: any) {
    editorRef.current = editor
    editor.onDidChangeCursorSelection((e: any) => {
      const sel = e.selection
      if (sel.startLineNumber === sel.endLineNumber && sel.startColumn === sel.endColumn) {
        setToolbarPos(null)
        setSelection(null)
        return
      }
      setSelection({ startLine: sel.startLineNumber, endLine: sel.endLineNumber })
      const domNode = editor.getDomNode()
      const coords = editor.getScrolledVisiblePosition({
        lineNumber: sel.startLineNumber,
        column: sel.startColumn,
      })
      if (domNode && coords) {
        const rect = domNode.getBoundingClientRect()
        setToolbarPos({ x: rect.left + coords.left, y: rect.top + coords.top - 44 })
      }
    })
  }

  function handleExplain() {
    if (!projectId || !activeFile || !selection) return
    setToolbarPos(null)

    const tempId = `temp_${Date.now()}`
    setCards((prev) => [
      { id: tempId, filePath: activeFile, range: selection, content: '', status: 'streaming' },
      ...prev,
    ])

    let realId = tempId

    runAIAction(
      { projectId, filePath: activeFile, selectedRange: selection, actionType: 'explain' },
      (metaCardId) => {
        realId = metaCardId
        setCards((prev) => prev.map((c) => (c.id === tempId ? { ...c, id: metaCardId } : c)))
      },
      (token) => {
        setCards((prev) =>
          prev.map((c) => (c.id === realId ? { ...c, content: c.content + token } : c))
        )
      },
      () => {
        setCards((prev) => prev.map((c) => (c.id === realId ? { ...c, status: 'done' } : c)))
      },
      (message) => {
        setCards((prev) =>
          prev.map((c) => (c.id === realId ? { ...c, content: message, status: 'error' } : c))
        )
      }
    )
  }

  return (
    <div className="flex h-screen bg-canvas">
      <div className="w-56 bg-surface border-r border-subtle p-3 flex flex-col gap-1">
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
          <EmptyState title="No files" description="This project has no files." />
        )}
        {!isLoadingTree &&
          files.map((file) => (
            <button
              key={file.path}
              onClick={() => setActiveFile(file.path)}
              className={`text-left px-2 py-1.5 rounded-md text-sm font-mono transition-colors truncate ${
                activeFile === file.path
                  ? 'bg-selected text-primary'
                  : 'text-secondary hover:bg-hover hover:text-primary'
              }`}
              title={file.path}
            >
              {file.path}
            </button>
          ))}
      </div>

      <div className="flex-1 relative">
        {isLoadingContent && (
          <div className="absolute inset-0 flex items-center justify-center bg-editor z-10">
            <Skeleton className="h-4 w-64" />
          </div>
        )}
        <Editor
          height="100%"
          language={language}
          value={content}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{ readOnly: true, minimap: { enabled: true }, fontSize: 13.5 }}
          onMount={handleEditorMount}
        />

        {toolbarPos && (
          <div
            style={{ position: 'fixed', left: toolbarPos.x, top: toolbarPos.y, zIndex: 50 }}
            className="flex gap-1 bg-surface-raised border border-subtle rounded-md shadow-lg p-1 animate-in fade-in"
          >
            <button
              onClick={handleExplain}
              className="px-3 py-1.5 rounded text-sm font-medium text-primary hover:bg-accent-subtle-bg hover:text-accent transition-colors"
            >
              ✦ Explain
            </button>
          </div>
        )}
      </div>

      <div className="w-96 bg-surface border-l border-subtle p-3 overflow-y-auto flex flex-col gap-3">
        <h2 className="text-secondary text-xs font-medium uppercase tracking-wide">AI Panel</h2>

        {cards.length === 0 && (
          <EmptyState
            title="Highlight code to get started"
            description="Select any code in the editor and click Explain to get an AI-powered explanation."
          />
        )}

        {cards.map((card) => (
          <Card key={card.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Badge variant="info">Explain</Badge>
              <span className="text-tertiary text-xs font-mono">
                {card.filePath}:{card.range.startLine}-{card.range.endLine}
              </span>
            </div>

            {card.status === 'error' ? (
              <p className="text-danger text-sm">{card.content}</p>
            ) : (
              <div className="text-primary text-sm prose-sm">
                <ReactMarkdown>{card.content}</ReactMarkdown>
                {card.status === 'streaming' && (
                  <span className="inline-block w-1.5 h-3.5 bg-accent ml-0.5 animate-pulse" />
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}