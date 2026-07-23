import { useEffect, useState } from 'react'

interface StreamingTextProps {
  fullText: string
  speed?: number
}

export function StreamingText({ fullText, speed = 20 }: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    setDisplayedText('')
    let index = 0
    const interval = setInterval(() => {
      index++
      setDisplayedText(fullText.slice(0, index))
      if (index >= fullText.length) {
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [fullText, speed])

  const isComplete = displayedText.length === fullText.length

  return (
    <span className="text-primary text-sm">
      {displayedText}
      {!isComplete && <span className="inline-block w-1.5 h-3.5 bg-accent ml-0.5 animate-pulse" />}
    </span>
  )
}
