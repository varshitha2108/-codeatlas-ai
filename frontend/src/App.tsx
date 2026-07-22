import { Button } from './shared/components/Button'
import { ProgressBar } from './shared/components/ProgressBar'
import { KeyboardShortcut } from './shared/components/KeyboardShortcut'
import { useToast } from './shared/components/Toast'

function App() {
  const { showToast } = useToast()

  return (
    <div className="flex h-screen items-center justify-center bg-canvas flex-col gap-6">
      <div className="w-64">
        <ProgressBar progress={62} />
      </div>
      <KeyboardShortcut keys={['⌘', 'K']} />
      <Button variant="primary" onClick={() => showToast('Saved successfully', 'success')}>
        Show Toast
      </Button>
    </div>
  )
}

export default App