import type { Request, Response } from 'express'
import {
  listPartnerApplications,
  reviewPartnerApplication,
} from '../partners/partnerApplication.service.js'
import type { ApplicationStatus } from '../partners/partner.types.js'

export async function listApplicationsForAdmin(req: Request, res: Response) {
  try {
    const statusQuery = req.query.status as string | undefined
    let statusFilter: ApplicationStatus | undefined = undefined

    if (
      statusQuery === 'pending' ||
      statusQuery === 'approved' ||
      statusQuery === 'rejected'
    ) {
      statusFilter = statusQuery
    }

    const applications = await listPartnerApplications(statusFilter)

    return res.status(200).json({
      success: true,
      data: applications,
    })
  } catch (error) {
    console.error('Failed to list partner applications for admin:', error)

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to list partner applications.',
      error: {
        code: 'ADMIN_APPLICATIONS_LIST_FAILED',
      },
    })
  }
}

export async function reviewApplicationByAdmin(req: Request, res: Response) {
  try {
    const adminUser = res.locals.user

    if (!adminUser?.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        error: {
          code: 'AUTH_REQUIRED',
        },
      })
    }

    const rawId = req.params.id
    const applicationId = Array.isArray(rawId) ? rawId[0] : rawId

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required.',
        error: {
          code: 'APPLICATION_ID_REQUIRED',
        },
      })
    }

    const updatedApplication = await reviewPartnerApplication(
      applicationId,
      adminUser.id,
      req.body ?? {},
    )

    return res.status(200).json({
      success: true,
      message: `Partner application ${updatedApplication.status} successfully.`,
      data: updatedApplication,
    })
  } catch (error) {
    console.error('Failed to review partner application by admin:', error)

    const code = (error as { code?: string })?.code

    if (code === 'NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Partner application not found.',
        error: {
          code: 'NOT_FOUND',
        },
      })
    }

    if (code === 'INVALID_STATE') {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Application has already been reviewed.',
        error: {
          code: 'INVALID_STATE',
        },
      })
    }

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to review partner application.',
      error: {
        code: 'APPLICATION_REVIEW_FAILED',
      },
    })
  }
}
