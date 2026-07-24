import { useState } from 'react'
import { useSnippetImport } from '../../features/ingestion/hooks/useSnippetImport'
import { Button } from '../../shared/components/Button'
import { Select } from '../../shared/components/Select'

export function LandingScreen() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const { submit, isSubmitting, error } = useSnippetImport()

  return (
    <div className="flex h-screen items-center justify-center bg-canvas">
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
  )
}