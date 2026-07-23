import express from 'express'

const app = express()
const PORT = 3001

app.get('/v1/health', (req, res) => {
  res.json({ data: { status: 'ok' } })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})