import type { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  req.requestId = uuidv4()
  const startTime = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - startTime
    console.log(
      JSON.stringify({
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        sessionId: req.sessionId,
        status: res.statusCode,
        durationMs: duration,
      })
    )
  })

  next()
}