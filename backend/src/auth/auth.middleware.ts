import type { NextFunction, Request, Response } from 'express'
import { supabaseAdmin } from '../config/supabase.js'

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorization = req.headers.authorization

    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        error: {
          code: 'AUTH_REQUIRED',
        },
      })
    }

    const token = authorization.substring(7).trim()

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        error: {
          code: 'AUTH_REQUIRED',
        },
      })
    }

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token.',
        error: {
          code: 'INVALID_TOKEN',
        },
      })
    }

    res.locals.user = user

    return next()
  } catch (error) {
    console.error('Authentication error:', error)

    return res.status(500).json({
      success: false,
      message: 'Authentication service error.',
      error: {
        code: 'AUTH_SERVICE_ERROR',
      },
    })
  }
}