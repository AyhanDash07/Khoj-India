import type { Request, Response, NextFunction } from 'express'
import type { ZodType } from 'zod'

export function validate(schema: ZodType) {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    })

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid request data.',
        error: {
          code: 'VALIDATION_ERROR',
          details: result.error.issues,
        },
      })
      return
    }

    next()
  }
}