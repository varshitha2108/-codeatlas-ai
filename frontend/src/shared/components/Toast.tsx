import { createContext, useContext, useState, type ReactNode } from 'react'

interface ToastItem {
  id: number
  message: string
  variant: 'success' | 'danger' | 'info'
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastItem['variant']) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const variantClasses: Record<ToastItem['variant'], string> = {
  success: 'border-success text-success',
  danger: 'border-danger text-danger',
  info: 'border-info text-info',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = (message: string, variant: ToastItem['variant'] = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`bg-surface-raised border rounded-md px-4 py-2 text-sm shadow-lg ${variantClasses[toast.variant]}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}