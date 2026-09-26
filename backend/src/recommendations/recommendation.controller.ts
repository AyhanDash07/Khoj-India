import type { Request, Response } from 'express'

import {
  getSmartRecommendations,
} from './recommendation.service.js'

/**
 * GET /api/recommendations
 *
 * Returns personalized destination recommendations
 * for the currently authenticated traveller.
 */
export async function getRecommendations(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const user = res.locals.user

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
      return
    }

    const destinationType =
      typeof req.query.destination_type === 'string'
        ? req.query.destination_type
        : undefined

    const preferredRegion =
      typeof req.query.preferred_region === 'string'
        ? req.query.preferred_region
        : undefined

    const maxResultsRaw =
      typeof req.query.max_results === 'string'
        ? Number(req.query.max_results)
        : undefined

    if (
      maxResultsRaw !== undefined &&
      (!Number.isInteger(maxResultsRaw) ||
        maxResultsRaw <= 0)
    ) {
      res.status(400).json({
        success: false,
        message:
          'max_results must be a positive integer.',
      })
      return
    }

    const result = await getSmartRecommendations(
      user.id,
      {
        ...(destinationType
          ? {
              destination_type: destinationType,
            }
          : {}),

        ...(preferredRegion
          ? {
              preferred_region: preferredRegion,
            }
          : {}),

        ...(maxResultsRaw !== undefined
          ? {
              max_results: maxResultsRaw,
            }
          : {}),
      },
    )

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error(
      '[KHOJ ERROR] Smart Discovery:',
      error,
    )

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to generate recommendations.',
    })
  }
}