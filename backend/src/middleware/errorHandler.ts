import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppError'

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    res.status(err.httpStatus).json({
      error: {
        code: err.code,
        message: err.message,
        field: err.field ?? null,
      },
    })
    return
  }

  console.error('Unexpected error:', err)
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong. Please try again.',
      field: null,
    },
  })
}