import type { Request, Response } from 'express'
import { getDestinationById } from './destination-detail.service.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'

export async function getDestinationDetail(
  req: Request,
  res: Response,
) {
  try {
    const id = req.params.id

    if (typeof id !== 'string') {
      return sendError(
        res,
        'Invalid destination ID.',
        400,
        'INVALID_DESTINATION_ID',
      )
    }

    const destinationId = Number(id)

    if (!Number.isInteger(destinationId) || destinationId <= 0) {
      return sendError(
        res,
        'Invalid destination ID.',
        400,
        'INVALID_DESTINATION_ID',
      )
    }

    const destination = await getDestinationById(destinationId)

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