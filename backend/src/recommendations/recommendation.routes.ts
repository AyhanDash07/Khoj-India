import { Router } from 'express'

import { requireAuth } from '../auth/auth.middleware.js'

import {
  getRecommendations,
} from './recommendation.controller.js'

const router = Router()

/**
 * Smart Discovery
 *
 * GET /api/recommendations
 */
router.get(
  '/',
  requireAuth,
  getRecommendations,
)

export default router