import { useEffect, useState } from 'react'
import { useSnippetImport } from '../../features/ingestion/hooks/useSnippetImport'
import { useZipUpload } from '../../features/ingestion/hooks/useZipUpload'
import { useGithubImport } from '../../features/ingestion/hooks/useGithubImport'
import { useTheme } from '../../context/ThemeContext'
import { Button } from '../../shared/components/Button'
import { Select } from '../../shared/components/Select'
import { Input } from '../../shared/components/Input'
import { useNavigate } from 'react-router-dom'


export function LandingScreen() {
  
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [repoUrl, setRepoUrl] = useState('')
  const { submit, isSubmitting, error } = useSnippetImport()
  const { upload, isUploading, error: uploadError } = useZipUpload()
  const { submit: submitGithub, isImporting, error: githubError } = useGithubImport()
  const { theme, toggleTheme } = useTheme()
const [user, setUser] = useState<{ username: string; avatarUrl: string } | null>(null)

useEffect(() => {
  const stored = localStorage.getItem('codeatlas-user')
  if (stored) setUser(JSON.parse(stored))
}, [])

const navigate = useNavigate()

function handleLogout() {
  localStorage.removeItem('codeatlas-user')
  setUser(null)
  navigate('/')
}
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) upload(file)
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-canvas)' }} className="min-h-screen">
      <nav
        style={{ borderColor: 'var(--border-subtle)' }}
        className="sticky top-0 z-20 border-b bg-canvas/80 backdrop-blur-md"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm shadow-sm">
              CA
            </div>
            <span style={{ color: 'var(--text-primary)' }} className="font-semibold text-lg tracking-tight">
              CodeAtlas AI
            </span>
          </div>
          <div className="flex items-center gap-3">
  {user && (
    <div className="flex items-center gap-2">
      {user.avatarUrl && (
        <img src={user.avatarUrl} alt={user.username} className="w-7 h-7 rounded-full" />
      )}
      <span style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium">
        {user.username}
      </span>
      <button
        onClick={handleLogout}
        style={{ color: 'var(--text-tertiary)' }}
        className="text-xs hover:underline"
      >
        Log out
      </button>
    </div>
  )}
  <button
    onClick={toggleTheme}
    style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
    className="w-9 h-9 rounded-full bg-surface border flex items-center justify-center hover:bg-hover transition-colors"
  >
    {theme === 'dark' ? '☀️' : '🌙'}
  </button>
</div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-subtle-bg text-accent text-xs font-medium mb-6">
            ✦ AI-powered code comprehension
          </div>
          <h1
            style={{ color: 'var(--text-primary)' }}
            className="text-5xl font-bold tracking-tight leading-[1.1]"
          >
            Understand any codebase,<br />instantly.
          </h1>
          <p
            style={{ color: 'var(--text-secondary)' }}
            className="text-lg mt-5 max-w-xl mx-auto leading-relaxed"
          >
            Import a project, explore it like your own IDE, and ask AI anything about any line of code.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            style={{ borderColor: 'var(--border-subtle)' }}
            className="bg-surface-raised border rounded-2xl p-6 flex flex-col gap-4 hover:border-accent/40 hover:shadow-lg transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-accent-subtle-bg flex items-center justify-center text-accent text-lg">
              ⎇
            </div>
            <div>
              <h2 style={{ color: 'var(--text-primary)' }} className="font-semibold text-base">
                GitHub Repository
              </h2>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-1 leading-relaxed">
                Paste any public repo URL to import it instantly.
              </p>
            </div>
            <div className="flex-1 flex flex-col justify-end gap-2">
              <Input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="github.com/owner/repo"
              />
              {githubError && <p className="text-danger text-xs">{githubError}</p>}
              <Button
                variant="primary"
                disabled={!repoUrl.trim() || isImporting}
                onClick={() => submitGithub(repoUrl)}
              >
                {isImporting ? 'Importing...' : 'Import Repository'}
              </Button>
            </div>
          </div>

          <div
            style={{ borderColor: 'var(--border-subtle)' }}
            className="bg-surface-raised border rounded-2xl p-6 flex flex-col gap-4 hover:border-accent/40 hover:shadow-lg transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-accent-subtle-bg flex items-center justify-center text-accent text-lg">
              ⬆
            </div>
            <div>
              <h2 style={{ color: 'var(--text-primary)' }} className="font-semibold text-base">
                Upload ZIP
              </h2>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-1 leading-relaxed">
                Drag and drop a project archive to get started.
              </p>
            </div>
            <label
              style={{ borderColor: 'var(--border-default)' }}
              className="flex-1 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer hover:border-accent hover:bg-accent-subtle-bg/30 transition-colors min-h-[92px]"
            >
              <input type="file" accept=".zip" onChange={handleFileChange} className="hidden" />
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium">
                {isUploading ? 'Uploading...' : 'Click to browse files'}
              </p>
            </label>
            {uploadError && <p className="text-danger text-xs">{uploadError}</p>}
          </div>

          <div
            style={{ borderColor: 'var(--border-subtle)' }}
            className="bg-surface-raised border rounded-2xl p-6 flex flex-col gap-4 hover:border-accent/40 hover:shadow-lg transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-accent-subtle-bg flex items-center justify-center text-accent text-lg">
              ⧉
            </div>
            <div>
              <h2 style={{ color: 'var(--text-primary)' }} className="font-semibold text-base">
                Paste Snippet
              </h2>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-1 leading-relaxed">
                Jump straight into the editor with any snippet.
              </p>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              rows={3}
              style={{ color: 'var(--text-primary)', borderColor: 'var(--border-default)' }}
              className="bg-surface border rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
            <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="go">Go</option>
              <option value="ruby">Ruby</option>
              <option value="csharp">C#</option>
              <option value="php">PHP</option>
            </Select>
            {error && <p className="text-danger text-xs">{error}</p>}
            <Button
              variant="primary"
              disabled={!code.trim() || isSubmitting}
              onClick={() => submit(code, language)}
            >
              {isSubmitting ? 'Opening...' : 'Open in Editor'}
            </Button>
          </div>
        </div>
      </section>

      <footer style={{ borderColor: 'var(--border-subtle)' }} className="border-t py-8">
        <p style={{ color: 'var(--text-tertiary)' }} className="text-center text-xs">
          Built with React, Express, PostgreSQL, and Gemini AI.
        </p>
      </footer>
    </div>
  )
}