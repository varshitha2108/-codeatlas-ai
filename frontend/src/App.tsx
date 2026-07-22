import { Button } from './shared/components/Button'
import { Card } from './shared/components/Card'

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-canvas">
      <Card>
        <p className="text-primary">This is inside a Card.</p>
        <Button variant="primary" className="mt-3">Primary</Button>
      </Card>
    </div>
  )
}

export default App