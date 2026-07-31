import express from 'express'
import cors from 'cors'
import { env } from './config/env'
import { pool } from './config/db'
import { errorHandler } from './middleware/errorHandler'
import { sessionMiddleware } from './middleware/sessionMiddleware'
import { requestLogger } from './middleware/requestLogger'
import { aiRateLimiter, generalRateLimiter } from './middleware/rateLimiter'
import { projectsRouter } from './routes/projects.routes'
import { filesRouter } from './routes/files.routes'
import { aiRouter } from './routes/ai.routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(sessionMiddleware)

app.get('/v1/health', async (req, res) => {
  await pool.query('SELECT 1')
  res.json({ data: { status: 'ok' } })
})

app.use('/v1/projects', generalRateLimiter, projectsRouter)
app.use('/v1/projects/:projectId/files', generalRateLimiter, filesRouter)
app.use('/v1/ai', aiRateLimiter, aiRouter)

app.use(errorHandler)

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`)
})