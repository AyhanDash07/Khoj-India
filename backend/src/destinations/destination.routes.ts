import { Router } from 'express'

import {
  getDestination,
  listDestinations,
} from './destination.controller.js'

const router = Router()

router.get('/', listDestinations)

router.get('/:id', getDestination)

export default router