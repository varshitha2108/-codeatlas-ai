import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { importGithubRepo } from '../../../services/ingestionService'

export function useGithubImport() {
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function submit(repoUrl: string) {
    setIsImporting(true)
    setError(null)

    try {
      const result = await importGithubRepo(repoUrl)
      navigate(`/import/progress?projectId=${result.projectId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setIsImporting(false)
    }
  }

  return { submit, isImporting, error }
}