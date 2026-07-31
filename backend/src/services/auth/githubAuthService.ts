import { env } from '../../config/env'
import { pool } from '../../config/db'
import { nanoid } from 'nanoid'

export function getGithubAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: 'http://localhost:3001/v1/auth/github/callback',
    scope: 'read:user',
  })
  return `https://github.com/login/oauth/authorize?${params.toString()}`
}

export async function handleGithubCallback(code: string) {
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  })
  const tokenData = await tokenResponse.json()

  if (!tokenData.access_token) {
    throw new Error('Failed to get GitHub access token')
  }

  const userResponse = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })
  const githubUser = await userResponse.json()

  const existing = await pool.query('SELECT id FROM users WHERE github_id = $1', [
    String(githubUser.id),
  ])

  let userId: string

  if (existing.rows.length > 0) {
    userId = existing.rows[0].id
    await pool.query(
      'UPDATE users SET username = $1, avatar_url = $2 WHERE id = $3',
      [githubUser.login, githubUser.avatar_url, userId]
    )
  } else {
    userId = `user_${nanoid(10)}`
    await pool.query(
      'INSERT INTO users (id, github_id, username, avatar_url) VALUES ($1, $2, $3, $4)',
      [userId, String(githubUser.id), githubUser.login, githubUser.avatar_url]
    )
  }

  return { userId, username: githubUser.login, avatarUrl: githubUser.avatar_url }
}