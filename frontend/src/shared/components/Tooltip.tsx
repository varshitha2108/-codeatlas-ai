import { useState, type ReactNode } from 'react'

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  const [visible, setVisible] = useState(false)

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-sm bg-surface-raised border border-subtle text-xs text-primary whitespace-nowrap z-50">
          {label}
        </span>
      )}
    </span>
  )
}