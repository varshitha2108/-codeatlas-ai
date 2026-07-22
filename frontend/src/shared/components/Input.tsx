import type { InputHTMLAttributes } from 'react'

export function Input({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`
        bg-surface border border-default rounded-md px-3 py-2 text-sm text-primary
        placeholder:text-tertiary
        focus:outline-none focus:ring-2 focus:ring-accent
        ${className}
      `}
      {...rest}
    />
  )
}