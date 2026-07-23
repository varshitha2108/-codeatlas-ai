import type { SelectHTMLAttributes, ReactNode } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode
}

export function Select({ className = '', children, ...rest }: SelectProps) {
  return (
    <select
      className={`
        bg-surface border border-default rounded-md px-3 py-2 text-sm text-primary
        focus:outline-none focus:ring-2 focus:ring-accent
        ${className}
      `}
      {...rest}
    >
      {children}
    </select>
  )
}