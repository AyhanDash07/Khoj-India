import type { Request, Response } from 'express'

import {
  getDestinationById,
  getDestinations,
} from './destination.service.js'

import {
  sendSuccess,
  sendError,
} from '../utils/apiResponse.js'

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

export async function getDestination(
  req: Request,
  res: Response,
) {
  const destinationId = Number(req.params.id)

  if (
    !Number.isInteger(destinationId) ||
    destinationId <= 0
  ) {
    return sendError(
      res,
      'Destination ID must be a positive integer.',
      400,
      'INVALID_DESTINATION_ID',
    )
  }

  try {
    const destination =
      await getDestinationById(destinationId)

    if (!destination) {
      return sendError(
        res,
        'Destination not found.',
        404,
        'DESTINATION_NOT_FOUND',
      )
    }

    return sendSuccess(
      res,
      destination,
      'Destination fetched successfully.',
    )
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to fetch destination.'

    return sendError(
      res,
      message,
      500,
      'DESTINATION_FETCH_FAILED',
    )
  }
}