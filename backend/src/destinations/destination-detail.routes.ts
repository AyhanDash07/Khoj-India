import { Router } from 'express'
import { getDestinationDetail } from './destination-detail.controller.js'
import { validate } from '../middleware/validate.js'
import { destinationIdParamsSchema } from '../validation/common.schemas.js'

const router = Router()

router.get(
  '/:id',
  validate(destinationIdParamsSchema),
  getDestinationDetail,
)

export default router