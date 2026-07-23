export class AppError extends Error {
  public readonly code: string
  public readonly httpStatus: number
  public readonly field?: string

  constructor(code: string, httpStatus: number, message: string, field?: string) {
    super(message)
    this.code = code
    this.httpStatus = httpStatus
    this.field = field

    Object.setPrototypeOf(this, AppError.prototype)
  }
}