import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { getFileTree, getFileContent } from '../../services/projectService'
import { useTheme } from '../../context/ThemeContext'
import { runAIAction } from '../../services/aiService'

interface FileNode {
  path: string
  type: string
  language: string | null
}

interface AICard {
  id: string
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

  const [selection, setSelection] = useState<{ startLine: number; endLine: number } | null>(null)
  const [toolbarPos, setToolbarPos] = useState<{ x: number; y: number } | null>(null)
  const [cards, setCards] = useState<AICard[]>([])
  const editorRef = useRef<any>(null)

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
        setToolbarPos({ x: rect.left + coords.left, y: rect.top + coords.top - 40 })
      }
    })
  }

  function handleExplain() {
    if (!projectId || !activeFile || !selection) return
    setToolbarPos(null)

    const cardId = `temp_${Date.now()}`
    setCards((prev) => [{ id: cardId, content: '', status: 'streaming' }, ...prev])

    let realCardId = cardId

    runAIAction(
      { projectId, filePath: activeFile, selectedRange: selection, actionType: 'explain' },
      (metaCardId) => {
        realCardId = metaCardId
        setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, id: metaCardId } : c)))
      },
      (token) => {
        setCards((prev) =>
          prev.map((c) => (c.id === realCardId ? { ...c, content: c.content + token } : c))
        )
      },
      () => {
        setCards((prev) => prev.map((c) => (c.id === realCardId ? { ...c, status: 'done' } : c)))
      },
      (message) => {
        setCards((prev) =>
          prev.map((c) => (c.id === realCardId ? { ...c, content: message, status: 'error' } : c))
        )
      }
    )
  }

  return (
    <div className="flex h-screen bg-canvas">
      <div className="w-56 bg-surface border-r border-subtle p-3 flex flex-col gap-1">
        <h2 className="text-secondary text-xs font-medium mb-2 uppercase">Explorer</h2>
        {files.map((file) => (
          <button
            key={file.path}
            onClick={() => setActiveFile(file.path)}
            className={`text-left px-2 py-1.5 rounded-md text-sm font-mono ${
              activeFile === file.path ? 'bg-selected text-primary' : 'text-secondary hover:bg-hover'
            }`}
          >
            {file.path}
          </button>
        ))}
      </div>

      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={language}
          value={content}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{ readOnly: true, minimap: { enabled: true } }}
          onMount={handleEditorMount}
        />

        {toolbarPos && (
          <button
            onClick={handleExplain}
            style={{ position: 'fixed', left: toolbarPos.x, top: toolbarPos.y, zIndex: 50 }}
            className="px-3 py-1.5 rounded-md bg-accent text-white text-sm font-medium shadow-lg hover:bg-accent-hover"
          >
            ✦ Explain
          </button>
        )}
      </div>

      <div className="w-96 bg-surface border-l border-subtle p-3 overflow-y-auto flex flex-col gap-3">
        <h2 className="text-secondary text-xs font-medium uppercase">AI Panel</h2>
        {cards.length === 0 && (
          <p className="text-secondary text-sm">Highlight code and click Explain to get started.</p>
        )}
        {cards.map((card) => (
          <div key={card.id} className="bg-surface-raised border border-subtle rounded-lg p-3">
            <p className="text-primary text-sm whitespace-pre-wrap">
              {card.content}
              {card.status === 'streaming' && <span className="animate-pulse">▍</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}