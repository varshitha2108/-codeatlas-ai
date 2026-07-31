import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import { getFileTree, getFileContent } from '../../services/projectService'
import { useTheme } from '../../context/ThemeContext'
import { runAIAction, sendFollowup } from '../../services/aiService'
import { Card } from '../../shared/components/Card'
import { Badge } from '../../shared/components/Badge'
import { EmptyState } from '../../shared/components/EmptyState'
import { Skeleton } from '../../shared/components/Skeleton'
import { Input } from '../../shared/components/Input'
import { Button } from '../../shared/components/Button'

interface FileNode {
  path: string
  type: string
  language: string | null
}

interface FollowupTurn {
  question: string
  answer: string
  status: 'streaming' | 'done'
}

interface AICard {
  id: string
  actionType: string
  filePath: string
  range: { startLine: number; endLine: number }
  content: string
  status: 'streaming' | 'done' | 'error'
  followups: FollowupTurn[]
  followupInput: string
  isFollowupOpen: boolean
}

const ACTIONS = [
  { type: 'explain', label: '✦ Explain' },
  { type: 'explain_beginner', label: '🌱 Beginner' },
  { type: 'find_bugs', label: '🐞 Bugs' },
  { type: 'optimize', label: '⚡ Optimize' },
  { type: 'generate_comments', label: '📝 Comments' },
  { type: 'generate_tests', label: '🧪 Tests' },
  { type: 'ask_ai', label: '💬 Ask AI' },
]

const actionBadgeVariant: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  explain: 'info',
  explain_beginner: 'info',
  find_bugs: 'warning',
  optimize: 'success',
  generate_comments: 'default',
  generate_tests: 'default',
  ask_ai: 'info',
}

function renderCardBody(card: AICard) {
  if (card.status === 'error') {
    return <p className="text-danger text-sm">{card.content}</p>
  }

  if (card.actionType === 'find_bugs') {
    try {
      const parsed = JSON.parse(card.content.match(/\[[\s\S]*\]/)?.[0] || '[]')
      if (Array.isArray(parsed) && parsed.length > 0) {
        return (
          <div className="flex flex-col gap-2">
            {parsed.map((bug: any, i: number) => (
              <div key={i} className="flex gap-2 items-start">
                <Badge
                  variant={bug.severity === 'high' ? 'danger' : bug.severity === 'medium' ? 'warning' : 'default'}
                >
                  {bug.severity}
                </Badge>
                <p className="text-primary text-sm">{bug.description}</p>
              </div>
            ))}
          </div>
        )
      }
      if (Array.isArray(parsed) && parsed.length === 0 && card.status === 'done') {
        return <p className="text-success text-sm">No issues found.</p>
      }
    } catch {
      // still streaming raw JSON
    }
  }

  if (card.actionType === 'optimize' || card.actionType === 'generate_comments' || card.actionType === 'generate_tests') {
    return (
      <pre className="bg-editor rounded-md p-3 text-xs font-mono text-primary overflow-x-auto whitespace-pre-wrap">
        {card.content}
      </pre>
    )
  }

  return (
    <div className="text-primary text-sm prose prose-sm max-w-none">
      <ReactMarkdown>{card.content}</ReactMarkdown>
    </div>
  )
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
  const [askQuestion, setAskQuestion] = useState('')
  const [showAskInput, setShowAskInput] = useState(false)
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
        setShowAskInput(false)
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

  function runAction(actionType: string, question?: string) {
    if (!projectId || !activeFile || !selection) return
    setToolbarPos(null)
    setShowAskInput(false)
    setAskQuestion('')

    const tempId = `temp_${Date.now()}`
    setCards((prev) => [
      {
        id: tempId,
        actionType,
        filePath: activeFile,
        range: selection,
        content: '',
        status: 'streaming',
        followups: [],
        followupInput: '',
        isFollowupOpen: false,
      },
      ...prev,
    ])

    let realId = tempId

    runAIAction(
      { projectId, filePath: activeFile, selectedRange: selection, actionType, question },
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

  function handleActionClick(actionType: string) {
    if (actionType === 'ask_ai') {
      setShowAskInput(true)
      return
    }
    runAction(actionType)
  }

  function toggleFollowup(cardId: string) {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFollowupOpen: !c.isFollowupOpen } : c))
    )
  }

  function updateFollowupInput(cardId: string, value: string) {
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, followupInput: value } : c)))
  }

  function submitFollowup(cardId: string) {
    const card = cards.find((c) => c.id === cardId)
    if (!card || !card.followupInput.trim()) return

    const question = card.followupInput
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? {
              ...c,
              followupInput: '',
              followups: [...c.followups, { question, answer: '', status: 'streaming' }],
            }
          : c
      )
    )

    sendFollowup(
      cardId,
      question,
      (token) => {
        setCards((prev) =>
          prev.map((c) => {
            if (c.id !== cardId) return c
            const updated = [...c.followups]
            const last = updated[updated.length - 1]
            updated[updated.length - 1] = { ...last, answer: last.answer + token }
            return { ...c, followups: updated }
          })
        )
      },
      () => {
        setCards((prev) =>
          prev.map((c) => {
            if (c.id !== cardId) return c
            const updated = [...c.followups]
            updated[updated.length - 1] = { ...updated[updated.length - 1], status: 'done' }
            return { ...c, followups: updated }
          })
        )
      },
      (message) => {
        setCards((prev) =>
          prev.map((c) => {
            if (c.id !== cardId) return c
            const updated = [...c.followups]
            updated[updated.length - 1] = { ...updated[updated.length - 1], answer: message, status: 'done' }
            return { ...c, followups: updated }
          })
        )
      }
    )
  }

  return (
    <div className="flex flex-col h-screen bg-canvas">
      <div className="h-12 flex items-center px-4 border-b border-subtle bg-surface gap-3 shrink-0">
<Link to="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity">          <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center text-white font-bold text-xs">
            CA
          </div>
          <span className="text-primary font-semibold text-sm">CodeAtlas AI</span>
        </Link>
        <span className="text-tertiary text-xs">/</span>
        <span className="text-secondary text-xs font-mono truncate max-w-xs">{projectId}</span>
      </div>
      

      <div className="flex flex-1 overflow-hidden">
<div className="w-60 bg-surface border-r border-subtle p-3.5 flex flex-col gap-1">          <h2 className="text-secondary text-xs font-medium mb-2 uppercase tracking-wide">
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

          {toolbarPos && !showAskInput && (
            <div
  style={{ position: 'fixed', left: toolbarPos.x, top: toolbarPos.y, zIndex: 50 }}
  className="flex gap-0.5 bg-surface-raised border border-subtle rounded-lg shadow-xl p-1.5 flex-wrap max-w-md backdrop-blur-sm"
>
              {ACTIONS.map((action) => (
                <button
                  key={action.type}
                  onClick={() => handleActionClick(action.type)}
                  className="px-2.5 py-1.5 rounded text-xs font-medium text-primary hover:bg-accent-subtle-bg hover:text-accent transition-colors whitespace-nowrap"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {toolbarPos && showAskInput && (
            <div
              style={{ position: 'fixed', left: toolbarPos.x, top: toolbarPos.y, zIndex: 50 }}
              className="flex gap-1 bg-surface-raised border border-subtle rounded-md shadow-lg p-2 w-72"
            >
              <Input
                value={askQuestion}
                onChange={(e) => setAskQuestion(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && askQuestion.trim()) runAction('ask_ai', askQuestion)
                  if (e.key === 'Escape') setShowAskInput(false)
                }}
              />
              <Button
                variant="primary"
                size="sm"
                disabled={!askQuestion.trim()}
                onClick={() => runAction('ask_ai', askQuestion)}
              >
                Go
              </Button>
            </div>
          )}
        </div>

<div className="w-96 bg-surface border-l border-subtle p-4 overflow-y-auto flex flex-col gap-4">          <h2 className="text-secondary text-xs font-medium uppercase tracking-wide">AI Panel</h2>

          {cards.length === 0 && (
            <EmptyState
              title="Highlight code to get started"
              description="Select any code in the editor and choose an action to get AI-powered insight."
            />
          )}

          {cards.map((card) => (
           <Card key={card.id} className="flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow border-subtle/60">
              <div className="flex items-center justify-between pb-2 border-b border-subtle/60">
  <Badge variant={actionBadgeVariant[card.actionType] || 'default'}>
    {card.actionType.replace('_', ' ')}
  </Badge>
  <span className="text-tertiary text-[11px] font-mono truncate max-w-[180px]">
    {card.filePath}:{card.range.startLine}-{card.range.endLine}
  </span>
</div>

              {renderCardBody(card)}

              {card.status === 'streaming' && (
                <span className="inline-block w-1.5 h-3.5 bg-accent animate-pulse" />
              )}

              {card.status === 'done' && (
                <>
                  {card.followups.map((turn, i) => (
                    <div key={i} className="border-t border-subtle pt-2 mt-1 flex flex-col gap-1">
                      <p className="text-secondary text-xs font-medium">You asked: {turn.question}</p>
                      <div className="text-primary text-sm prose prose-sm max-w-none">
                        <ReactMarkdown>{turn.answer}</ReactMarkdown>
                        {turn.status === 'streaming' && (
                          <span className="inline-block w-1.5 h-3.5 bg-accent animate-pulse" />
                        )}
                      </div>
                    </div>
                  ))}

                  {!card.isFollowupOpen ? (
                    <button
                      onClick={() => toggleFollowup(card.id)}
                      className="text-accent text-xs font-medium text-left hover:underline mt-1"
                    >
                      + Ask a follow-up
                    </button>
                  ) : (
                    <div className="flex gap-1 mt-1">
                      <Input
                        value={card.followupInput}
                        onChange={(e) => updateFollowupInput(card.id, e.target.value)}
                        placeholder="Ask a follow-up..."
                        className="flex-1 text-xs"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') submitFollowup(card.id)
                        }}
                      />
                      <Button variant="secondary" size="sm" onClick={() => submitFollowup(card.id)}>
                        Send
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}