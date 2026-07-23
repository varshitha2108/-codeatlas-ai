import express from 'express'
import { env } from './config/env'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.get('/v1/health', (req, res) => {
  res.json({ data: { status: 'ok' } })
})

app.use(errorHandler)

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`)
})