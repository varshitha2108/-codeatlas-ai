import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadZipProject } from '../../../services/ingestionService'

export function useZipUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function upload(file: File) {
    setIsUploading(true)
    setError(null)

    try {
      const result = await uploadZipProject(file)
      navigate(`/import/progress?projectId=${result.projectId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return { upload, isUploading, error }
}