import { CodeBlock } from './shared/components/CodeBlock'

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-canvas p-8">
      <div className="w-96">
        <CodeBlock
          language="typescript"
          code={`function add(a: number, b: number): number {\n  return a + b;\n}`}
        />
      </div>
    </div>
  )
}

export default App