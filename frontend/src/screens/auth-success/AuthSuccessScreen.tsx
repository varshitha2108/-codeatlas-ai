import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export function AuthSuccessScreen() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const userId = searchParams.get('userId')
    const username = searchParams.get('username')
    const avatarUrl = searchParams.get('avatarUrl')

    if (userId && username) {
      localStorage.setItem('codeatlas-user', JSON.stringify({ userId, username, avatarUrl }))
    }

    navigate('/home')
  }, [searchParams, navigate])

  return (
    <div style={{ backgroundColor: 'var(--bg-canvas)' }} className="min-h-screen flex items-center justify-center">
      <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Signing you in...</p>
    </div>
  )
}