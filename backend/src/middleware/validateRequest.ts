import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'
import { AppError } from '../errors/AppError'

export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const firstIssue = result.error.issues[0]
      throw new AppError(
        'VALIDATION_ERROR',
        400,
        firstIssue.message,
        firstIssue.path.join('.')
      )
    }

    req.body = result.data
    next()
  }
}