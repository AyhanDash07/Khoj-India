import { Router } from 'express'
import { requireAuth } from '../auth/auth.middleware.js'
import { getDestinationIntelligenceScore } from './intelligence.controller.js'

const router = Router()

router.get(
  '/destinations/:id',
  requireAuth,
  getDestinationIntelligenceScore,
)

export default router