import { StreamingText } from './shared/components/StreamingText'

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-canvas p-8">
      <div className="w-96">
        <StreamingText fullText="This function resolves the current dispatcher and returns its state, re-rendering the component whenever the value changes." />
      </div>
    </div>
  )
}

export default App