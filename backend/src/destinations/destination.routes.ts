import { Router } from 'express'

import { listDestinations } from './destination.controller.js'

const router = Router()

router.get('/', listDestinations)

export default router