import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSnippetProject } from '../../../services/ingestionService'

export function useSnippetImport() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function submit(code: string, language: string) {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await createSnippetProject(code, language)
      navigate(`/workspace/${result.projectId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submit, isSubmitting, error }
}