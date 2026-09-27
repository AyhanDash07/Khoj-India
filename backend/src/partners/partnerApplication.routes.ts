import { Router } from 'express'
import { requireAuth, requireRole } from '../auth/auth.middleware.js'
import {
  getMyApplication,
  submitApplication,
} from './partnerApplication.controller.js'

const router = Router()

/**
 * Tourist Partner Application Endpoints
 *
 * POST /api/partner-applications    — Submit application (tourist only)
 * GET  /api/partner-applications/me — Get user's application status
 */
router.post(
  '/',
  requireAuth,
  requireRole('tourist'),
  submitApplication,
)

router.get(
  '/me',
  requireAuth,
  getMyApplication,
)

export default router
