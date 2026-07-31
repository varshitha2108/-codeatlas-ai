import 'dotenv/config'

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const env = {
  PORT: requireEnv('PORT'),
  DATABASE_URL: requireEnv('DATABASE_URL'),
  GEMINI_API_KEY: requireEnv('GEMINI_API_KEY'),
  GITHUB_CLIENT_ID: requireEnv('GITHUB_CLIENT_ID'),
  GITHUB_CLIENT_SECRET: requireEnv('GITHUB_CLIENT_SECRET'),
}