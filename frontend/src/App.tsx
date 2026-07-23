import { ResizablePanel } from './shared/components/ResizablePanel'

function App() {
  return (
    <div className="flex h-screen bg-canvas">
      <ResizablePanel defaultWidth={260} minWidth={200} maxWidth={400} side="left">
        <div className="bg-surface h-full p-3 text-primary text-sm">Explorer panel</div>
      </ResizablePanel>
      <div className="flex-1 bg-editor p-3 text-primary text-sm">Editor area</div>
    </div>
  )
}

export default App