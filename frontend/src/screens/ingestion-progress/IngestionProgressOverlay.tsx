import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getProjectStatus } from '../../services/ingestionService'
import { ProgressBar } from '../../shared/components/ProgressBar'

const stageOrder = ['fetching', 'parsing', 'indexing', 'ready']

export function IngestionProgressOverlay() {
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('projectId')
  const navigate = useNavigate()

  const [stage, setStage] = useState('fetching')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId) return

    const interval = setInterval(async () => {
      try {
        const result = await getProjectStatus(projectId)

        if (result.status === 'ready') {
          clearInterval(interval)
          navigate(`/workspace/${projectId}`)
        } else if (result.status === 'failed') {
          clearInterval(interval)
          setError(result.error || 'Ingestion failed')
        } else if (result.stage) {
          setStage(result.stage)
        }
      } catch (err) {
        clearInterval(interval)
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    }, 500)

    return () => clearInterval(interval)
  }, [projectId, navigate])

  const stageIndex = stageOrder.indexOf(stage)
  const progress = ((stageIndex + 1) / stageOrder.length) * 100

  return (
    <div className="flex h-screen items-center justify-center bg-canvas">
      <div className="w-80 flex flex-col gap-3">
        <h1 className="text-primary text-lg font-semibold text-center">
          {error ? 'Import failed' : 'Importing project...'}
        </h1>

        {!error && (
          <>
            <ProgressBar progress={progress} />
            <p className="text-secondary text-sm text-center capitalize">{stage}...</p>
          </>
        )}

        {error && <p className="text-danger text-sm text-center">{error}</p>}
      </div>
    </div>
  )
}