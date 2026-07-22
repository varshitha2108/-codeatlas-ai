import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={`
        bg-surface-raised border border-subtle rounded-lg p-4
        ${className}
      `}
      {...rest}
    >
      {children}
    </div>
  )
}