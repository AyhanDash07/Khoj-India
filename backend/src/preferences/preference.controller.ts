import type { Request, Response } from 'express'

import {
  getTravellerPreferences,
  saveTravellerPreferences,
} from './preference.service.js'

export async function getPreferences(
  req: Request,
  res: Response,
) {
  try {
    const user = res.locals.user

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        error: {
          code: 'AUTH_REQUIRED',
        },
      })
    }

    const preferences =
      await getTravellerPreferences(
        user.id,
      )

    if (!preferences) {
      return res.status(404).json({
        success: false,
        message:
          'Traveller preferences not found.',
        error: {
          code: 'PREFERENCES_NOT_FOUND',
        },
      })
    }

    return res.status(200).json({
      success: true,
      data: preferences,
    })
  } catch (error) {
    console.error(
      'Failed to fetch traveller preferences:',
      error,
    )

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to fetch traveller preferences.',
      error: {
        code: 'PREFERENCES_FETCH_FAILED',
      },
    })
  }
}

export async function savePreferences(
  req: Request,
  res: Response,
) {
  try {
    const user = res.locals.user

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        error: {
          code: 'AUTH_REQUIRED',
        },
      })
    }

    const preferences =
      await saveTravellerPreferences(
        user.id,
        req.body ?? {},
      )

    return res.status(200).json({
      success: true,
      message:
        'Traveller preferences saved successfully.',
      data: preferences,
    })
  } catch (error) {
    console.error(
      'Failed to save traveller preferences:',
      error,
    )

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to save traveller preferences.',
      error: {
        code: 'PREFERENCES_SAVE_FAILED',
      },
    })
  }
}