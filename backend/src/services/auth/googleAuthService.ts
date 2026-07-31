import { env } from '../../config/env'
import { pool } from '../../config/db'
import { nanoid } from 'nanoid'

export function getGoogleAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: 'http://localhost:3001/v1/auth/google/callback',
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export async function handleGoogleCallback(code: string) {
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: 'http://localhost:3001/v1/auth/google/callback',
      grant_type: 'authorization_code',
    }),
  })
  const tokenData = await tokenResponse.json()

  if (!tokenData.access_token) {
    throw new Error('Failed to get Google access token')
  }

  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })
  const googleUser = await userResponse.json()

  const existing = await pool.query('SELECT id FROM users WHERE google_id = $1', [
    googleUser.id,
  ])

  let userId: string

  if (existing.rows.length > 0) {
    userId = existing.rows[0].id
    await pool.query(
      'UPDATE users SET username = $1, avatar_url = $2 WHERE id = $3',
      [googleUser.name, googleUser.picture, userId]
    )
  } else {
    userId = `user_${nanoid(10)}`
    await pool.query(
      'INSERT INTO users (id, google_id, username, avatar_url) VALUES ($1, $2, $3, $4)',
      [userId, googleUser.id, googleUser.name, googleUser.picture]
    )
  }

  return { userId, username: googleUser.name, avatarUrl: googleUser.picture }
}