import { Router } from 'express'
import { requireAuth } from './auth.middleware.js'
import { sendSuccess } from '../utils/apiResponse.js'

const router = Router()

router.get('/me', requireAuth, (_req, res) => {
  const user = res.locals.user
  const role = res.locals.role ?? 'tourist'

  return sendSuccess(
    res,
    {
      id: user.id,
      email: user.email ?? null,
      role,
    },
    'Authenticated user fetched successfully.',
  )
})

export default router