import { Router } from 'express'
import { requireAuth, requireRole } from '../auth/auth.middleware.js'
import {
  listApplicationsForAdmin,
  reviewApplicationByAdmin,
} from './admin.controller.js'

const router = Router()

/**
 * Admin Application Review Endpoints
 *
 * GET   /api/admin/partner-applications     — List applications (admin only)
 * PATCH /api/admin/partner-applications/:id — Approve/Reject application (admin only)
 */
router.get(
  '/partner-applications',
  requireAuth,
  requireRole('admin'),
  listApplicationsForAdmin,
)

router.patch(
  '/partner-applications/:id',
  requireAuth,
  requireRole('admin'),
  reviewApplicationByAdmin,
)

export default router
