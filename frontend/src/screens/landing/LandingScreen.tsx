import { useState } from 'react'
import { useSnippetImport } from '../../features/ingestion/hooks/useSnippetImport'
import { useZipUpload } from '../../features/ingestion/hooks/useZipUpload'
import { useGithubImport } from '../../features/ingestion/hooks/useGithubImport'
import { useTheme } from '../../context/ThemeContext'
import { Button } from '../../shared/components/Button'
import { Select } from '../../shared/components/Select'
import { Input } from '../../shared/components/Input'

export function LandingScreen() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [repoUrl, setRepoUrl] = useState('')
  const { submit, isSubmitting, error } = useSnippetImport()
  const { upload, isUploading, error: uploadError } = useZipUpload()
  const { submit: submitGithub, isImporting, error: githubError } = useGithubImport()
  const { theme, toggleTheme } = useTheme()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) upload(file)
  }

  return (
    <div className="min-h-screen bg-canvas relative">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 px-3 py-1.5 rounded-md bg-surface border border-default text-secondary text-sm hover:bg-hover"
      >
        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </button>

      <div className="flex h-screen items-center justify-center gap-8 flex-wrap px-8">
        <div className="w-full max-w-sm flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-primary">Import a GitHub repo</h1>
          <Input
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
          />
          {githubError && <p className="text-danger text-sm">{githubError}</p>}
          <Button
            variant="primary"
            disabled={!repoUrl.trim() || isImporting}
            onClick={() => submitGithub(repoUrl)}
          >
            {isImporting ? 'Importing...' : 'Import Repo'}
          </Button>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-primary">Upload a ZIP project</h1>
          <label className="border-2 border-dashed border-default rounded-lg p-8 text-center cursor-pointer hover:border-accent transition-colors">
            <input type="file" accept=".zip" onChange={handleFileChange} className="hidden" />
            <p className="text-secondary text-sm">
              {isUploading ? 'Uploading...' : 'Click to choose a ZIP file'}
            </p>
          </label>
          {uploadError && <p className="text-danger text-sm">{uploadError}</p>}
        </div>

        <div className="w-full max-w-lg flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-primary">Paste a code snippet</h1>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            rows={10}
            className="bg-surface border border-default rounded-md p-3 text-sm text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent"
          />

          <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
          </Select>

          {error && <p className="text-danger text-sm">{error}</p>}

          <Button
            variant="primary"
            disabled={!code.trim() || isSubmitting}
            onClick={() => submit(code, language)}
          >
            {isSubmitting ? 'Opening...' : 'Open in Editor'}
          </Button>
        </div>
      </div>
    </div>
  )
}