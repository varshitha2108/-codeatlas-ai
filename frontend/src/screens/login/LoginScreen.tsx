import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { Button } from '../../shared/components/Button'
import { Input } from '../../shared/components/Input'

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate('/home')
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-canvas)' }} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      <button
        onClick={toggleTheme}
        style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
        className="absolute top-6 right-6 z-10 w-9 h-9 rounded-full bg-surface border flex items-center justify-center hover:bg-hover transition-colors"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div
        style={{ borderColor: 'var(--border-subtle)' }}
        className="relative bg-surface-raised border rounded-2xl p-8 w-full max-w-sm shadow-xl"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-lg mb-3">
            CA
          </div>
          <h1 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold">
            Welcome to CodeAtlas AI
          </h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-1 text-center">
            Sign in to start exploring codebases with AI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label style={{ color: 'var(--text-secondary)' }} className="text-xs font-medium block mb-1">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full"
              required
            />
          </div>
          <div>
            <label style={{ color: 'var(--text-secondary)' }} className="text-xs font-medium block mb-1">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full"
              required
            />
          </div>
          <Button variant="primary" type="submit" className="mt-2">
            Sign In
          </Button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div style={{ backgroundColor: 'var(--border-subtle)' }} className="h-px flex-1" />
          <span style={{ color: 'var(--text-tertiary)' }} className="text-xs">or</span>
          <div style={{ backgroundColor: 'var(--border-subtle)' }} className="h-px flex-1" />
        </div>

        <div className="flex flex-col gap-2">
  <button
   type="button"
onClick={() => {
  console.log('GitHub button clicked')
  window.location.href = 'http://localhost:3001/v1/auth/github'
}}
 style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
    className="w-full border rounded-md py-2 text-sm font-medium hover:bg-hover transition-colors flex items-center justify-center gap-2"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.02 2.89-.02 3.29 0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
    Continue with GitHub
  </button>
  <button
   type="button"
    onClick={() => navigate('/home')}
    style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
    className="w-full border rounded-md py-2 text-sm font-medium hover:bg-hover transition-colors flex items-center justify-center gap-2"
  >
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.29v3.1A12 12 0 0 0 12 24z"/>
      <path fill="#FBBC05" d="M5.29 14.3a7.2 7.2 0 0 1 0-4.6v-3.1H1.29a12 12 0 0 0 0 10.8z"/>
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.6l4 3.1C6.23 6.87 8.88 4.75 12 4.75z"/>
    </svg>
    Continue with Google
  </button>
</div>

        <p style={{ color: 'var(--text-tertiary)' }} className="text-xs text-center mt-5">
          Don't have an account?{' '}
          <span className="text-accent font-medium cursor-pointer hover:underline" onClick={() => navigate('/home')}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  )
}