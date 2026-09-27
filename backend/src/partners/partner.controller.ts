import type { Request, Response } from 'express'
import {
  getPartnerProfile,
  upsertPartnerProfile,
} from './partner.service.js'

export async function getProfile(req: Request, res: Response) {
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

    const profile = await getPartnerProfile(user.id)

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Local Partner profile not found.',
        error: {
          code: 'PARTNER_PROFILE_NOT_FOUND',
        },
      })
    }

    return res.status(200).json({
      success: true,
      data: profile,
    })
  } catch (error) {
    console.error('Failed to fetch partner profile:', error)

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to fetch partner profile.',
      error: {
        code: 'PARTNER_PROFILE_FETCH_FAILED',
      },
    })
  }
}

export async function updateProfile(req: Request, res: Response) {
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

    const profile = await upsertPartnerProfile(user.id, req.body ?? {})

    return res.status(200).json({
      success: true,
      message: 'Local Partner profile updated successfully.',
      data: profile,
    })
  } catch (error) {
    console.error('Failed to update partner profile:', error)

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to update partner profile.',
      error: {
        code: 'PARTNER_PROFILE_UPDATE_FAILED',
      },
    })
  }
}
