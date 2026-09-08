import type { Request, Response } from 'express'
import { getDestinations } from './destination.service.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'

export async function listDestinations(
  _req: Request,
  res: Response,
) {
  try {
    const destinations = await getDestinations()

    return sendSuccess(
      res,
      destinations,
      'Destinations fetched successfully.',
    )
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to fetch destinations.'

    return sendError(
      res,
      message,
      500,
      'DESTINATIONS_FETCH_FAILED',
    )
  }
}