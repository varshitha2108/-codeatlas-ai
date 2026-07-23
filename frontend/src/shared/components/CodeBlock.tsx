import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { IconButton } from './IconButton'

interface CodeBlockProps {
  code: string
  language: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="relative rounded-md border border-subtle overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-surface text-xs text-secondary font-mono">
        <span>{language}</span>
        <IconButton
          icon={<span>{copied ? '✓' : '⧉'}</span>}
          label="Copy code"
          onClick={handleCopy}
        />
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0, fontSize: '13.5px', padding: '12px' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}