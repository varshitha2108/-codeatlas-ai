import rateLimit, { ipKeyGenerator } from 'express-rate-limit'

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.sessionId || ipKeyGenerator(req.ip || 'unknown'),
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many AI requests. Please wait a moment and try again.',
      field: null,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: (req) => req.sessionId || ipKeyGenerator(req.ip || 'unknown'),
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests. Please slow down.',
      field: null,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
})