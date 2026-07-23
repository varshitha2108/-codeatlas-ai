import express from 'express'
import { env } from './config/env'
import { pool } from './config/db'
import { errorHandler } from './middleware/errorHandler'
import { sessionMiddleware } from './middleware/sessionMiddleware'
import { requestLogger } from './middleware/requestLogger'

const app = express()

app.use(requestLogger)
app.use(sessionMiddleware)

app.get('/v1/health', async (req, res) => {
  await pool.query('SELECT 1')
  res.json({ data: { status: 'ok' } })
})

app.use(errorHandler)

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`)
})