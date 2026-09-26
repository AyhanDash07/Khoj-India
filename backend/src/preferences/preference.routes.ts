import { Router } from 'express'

import { requireAuth } from '../auth/auth.middleware.js'

import {
  getPreferences,
  savePreferences,
} from './preference.controller.js'

const router = Router()

router.get(
  '/',
  requireAuth,
  getPreferences,
)

router.post(
  '/',
  requireAuth,
  savePreferences,
)

export default router