declare namespace Express {
  export interface Request {
    sessionId: string
    requestId: string
  }
}