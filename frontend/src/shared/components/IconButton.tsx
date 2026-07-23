import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
}

export function IconButton({ icon, label, className = '', ...rest }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={`
        inline-flex items-center justify-center
        w-8 h-8 rounded-md text-secondary
        hover:bg-hover hover:text-primary
        transition-colors duration-100
        disabled:opacity-50 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
        ${className}
      `}
      {...rest}
    >
      {icon}
    </button>
  )
}