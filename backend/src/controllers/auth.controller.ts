import type { Request, Response } from 'express'
import { getGithubAuthUrl, handleGithubCallback } from '../services/auth/githubAuthService'

export function redirectToGithub(req: Request, res: Response) {
  res.redirect(getGithubAuthUrl())
}

export async function githubCallback(req: Request, res: Response) {
  const code = req.query.code as string

  try {
    const result = await handleGithubCallback(code)
    const params = new URLSearchParams({
      userId: result.userId,
      username: result.username,
      avatarUrl: result.avatarUrl || '',
    })
    res.redirect(`http://localhost:5173/auth/success?${params.toString()}`)
  } catch (err) {
    console.error('GitHub OAuth callback failed:', err)
    res.redirect('http://localhost:5173/?error=github_auth_failed')
  }
}