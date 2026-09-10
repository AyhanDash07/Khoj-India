import type { Request, Response } from 'express'
import { sendError, sendSuccess } from '../utils/apiResponse.js'
import { requireAuth } from '../auth/auth.middleware.js'
import {
  getDestinationExperiences,
  getDestinationForIntelligence,
  getDestinationIntelligence,
  getTravellerPreferences,
} from './intelligence.service.js'
import { calculateIntelligenceScore } from './intelligence.scoring.js'
import type { IntelligenceInput } from './intelligence.types.js'

export async function getDestinationIntelligenceScore(
  req: Request,
  res: Response,
) {
  try {
    const destinationId = Number(req.params.id)

    if (
      !Number.isInteger(destinationId) ||
      destinationId <= 0
    ) {
      return sendError(
        res,
        'Invalid destination ID.',
        400,
        'INVALID_DESTINATION_ID',
      )
    }

    const user = res.locals.user

    if (!user?.id) {
      return sendError(
        res,
        'Authenticated traveller not found.',
        401,
        'AUTH_REQUIRED',
      )
    }

    const [
      traveller,
      destination,
      intelligence,
      experiences,
    ] = await Promise.all([
      getTravellerPreferences(user.id),
      getDestinationForIntelligence(destinationId),
      getDestinationIntelligence(destinationId),
      getDestinationExperiences(destinationId),
    ])

    const input: IntelligenceInput = {
      traveller,
      destination,
      intelligence,
      experiences,
    }

    const result = calculateIntelligenceScore(input)

    return sendSuccess(
      res,
      result,
      'Khoj Intelligence score calculated successfully.',
    )
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to calculate Khoj Intelligence score.'

    return sendError(
      res,
      message,
      500,
      'INTELLIGENCE_SCORE_FAILED',
    )
  }
}