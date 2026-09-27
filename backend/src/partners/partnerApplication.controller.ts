import type { Request, Response } from 'express'
import {
  getUserPartnerApplication,
  submitPartnerApplication,
} from './partnerApplication.service.js'

export async function submitApplication(req: Request, res: Response) {
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

    const application = await submitPartnerApplication(user.id, req.body ?? {})

    return res.status(201).json({
      success: true,
      message: 'Partner application submitted successfully and is pending review.',
      data: application,
    })
  } catch (error) {
    console.error('Failed to submit partner application:', error)

    const code = (error as { code?: string })?.code

    if (code === 'APPLICATION_CONFLICT') {
      return res.status(409).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'You already have an active partner application pending review.',
        error: {
          code: 'APPLICATION_CONFLICT',
        },
      })
    }

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to submit partner application.',
      error: {
        code: 'APPLICATION_SUBMIT_FAILED',
      },
    })
  }
}

export async function getMyApplication(req: Request, res: Response) {
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

    const application = await getUserPartnerApplication(user.id)

    return res.status(200).json({
      success: true,
      data: application,
    })
  } catch (error) {
    console.error('Failed to fetch user partner application:', error)

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to fetch partner application.',
      error: {
        code: 'APPLICATION_FETCH_FAILED',
      },
    })
  }
}
