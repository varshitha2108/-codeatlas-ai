import express from 'express'
import { env } from './config/env'
import { AppError } from './errors/AppError'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.get('/v1/health', (req, res) => {
  res.json({ data: { status: 'ok' } })
})

app.get('/v1/test-error', (req, res) => {
  throw new AppError('TEST_ERROR', 400, 'This is a test error')
})

app.use(errorHandler)

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`)
})