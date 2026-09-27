import type { NextFunction, Request, Response } from 'express'
import { supabaseAdmin } from '../config/supabase.js'
import { resolveUserRole, type UserRole } from './auth.types.js'

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
    res.locals.role = resolveUserRole(user)

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

/**
 * Authorization middleware enforcing role-based access control (RBAC).
 * Expects requireAuth to have executed prior, establishing res.locals.user and res.locals.role.
 *
 * @param allowedRoles One or more UserRole values permitted to access the route.
 * @returns Express middleware function.
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (_req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        error: {
          code: 'AUTH_REQUIRED',
        },
      })
    }

    const userRole = res.locals.role as UserRole | undefined

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden: Insufficient permissions for this resource.',
        error: {
          code: 'FORBIDDEN',
          requiredRoles: allowedRoles,
        },
      })
    }

    return next()
  }
}