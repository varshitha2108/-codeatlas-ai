import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 gap-2">
      {icon && <div className="text-tertiary mb-1">{icon}</div>}
      <p className="text-primary font-medium">{title}</p>
      {description && <p className="text-secondary text-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}