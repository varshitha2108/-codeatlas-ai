import type { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'

export function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  const headerSessionId = req.header('X-Session-Id')
  const sessionId = headerSessionId || uuidv4()

  req.sessionId = sessionId
  res.setHeader('X-Session-Id', sessionId)

  next()
}