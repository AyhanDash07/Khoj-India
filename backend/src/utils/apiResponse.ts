import type { Response } from 'express'

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
) {
  return res.status(200).json({
    success: true,
    data,
    ...(message ? { message } : {}),
  })
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  code?: string,
) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(code
      ? {
          error: {
            code,
          },
        }
      : {}),
  })
}