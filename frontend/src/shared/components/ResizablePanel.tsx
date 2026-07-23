import { useRef, useState, type ReactNode } from 'react'

interface ResizablePanelProps {
  children: ReactNode
  defaultWidth: number
  minWidth: number
  maxWidth: number
  side: 'left' | 'right'
}

export function ResizablePanel({
  children,
  defaultWidth,
  minWidth,
  maxWidth,
  side,
}: ResizablePanelProps) {
  const [width, setWidth] = useState(defaultWidth)
  const isDragging = useRef(false)

  const startDragging = () => {
    isDragging.current = true

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const newWidth =
        side === 'left' ? e.clientX : window.innerWidth - e.clientX
      const clamped = Math.min(maxWidth, Math.max(minWidth, newWidth))
      setWidth(clamped)
    }

    const handleMouseUp = () => {
      isDragging.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div className="relative flex h-full" style={{ width }}>
      <div className="flex-1 overflow-hidden">{children}</div>
      <div
        onMouseDown={startDragging}
        className={`absolute top-0 bottom-0 w-1 cursor-col-resize hover:bg-accent/50 ${
          side === 'left' ? 'right-0' : 'left-0'
        }`}
      />
    </div>
  )
}