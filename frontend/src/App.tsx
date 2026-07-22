import { Button } from './shared/components/Button'

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-canvas gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="primary" disabled>Disabled</Button>
    </div>
  )
}

export default App