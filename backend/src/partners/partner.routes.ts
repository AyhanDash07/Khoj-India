import { Router } from 'express'
import { requireAuth, requireRole } from '../auth/auth.middleware.js'
import { getProfile, updateProfile } from './partner.controller.js'

const router = Router()

/**
 * Local Partner Profile Endpoints
 *
 * GET /api/partner/profile — Accessible by local_partner
 * PUT /api/partner/profile — Accessible by local_partner
 */
router.get(
  '/profile',
  requireAuth,
  requireRole('local_partner'),
  getProfile,
)

router.put(
  '/profile',
  requireAuth,
  requireRole('local_partner'),
  updateProfile,
)

export default router
