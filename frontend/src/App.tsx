import { Button } from './shared/components/Button'
import { Card } from './shared/components/Card'
import { Tooltip } from './shared/components/Tooltip'
import { Skeleton } from './shared/components/Skeleton'
import { EmptyState } from './shared/components/EmptyState'

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-canvas gap-6">
      <Card className="w-64">
        <Tooltip label="This is a tooltip">
          <Button variant="secondary">Hover me</Button>
        </Tooltip>
      </Card>

      <Card className="w-64 flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </Card>

      <Card className="w-64">
        <EmptyState
          title="No files yet"
          description="Upload a project to get started"
          action={<Button variant="primary" size="sm">Upload</Button>}
        />
      </Card>
    </div>
  )
}

export default App