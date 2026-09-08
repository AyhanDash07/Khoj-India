import type { ErrorRequestHandler } from 'express'

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  console.error(error)

  const message =
    error instanceof Error
      ? error.message
      : 'Internal server error.'

  res.status(500).json({
    success: false,
    message,
  })
}