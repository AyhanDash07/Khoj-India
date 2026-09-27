import { supabaseAdmin } from '../config/supabase.js'
import type {
  ApplicationReviewInput,
  ApplicationStatus,
  PartnerApplication,
  PartnerApplicationInput,
  PartnerType,
} from './partner.types.js'

function normalizeNullableString(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) {
    return null
  }
  return value.trim()
}

function normalizePartnerType(value: unknown): PartnerType {
  if (value === 'guide') return 'guide'
  if (value === 'both') return 'both'
  return 'vendor'
}

function normalizeApplicationStatus(value: unknown): ApplicationStatus {
  if (value === 'approved') return 'approved'
  if (value === 'rejected') return 'rejected'
  return 'pending'
}

export function sanitizePartnerApplicationInput(
  input: PartnerApplicationInput,
): Omit<
  PartnerApplication,
  | 'id'
  | 'user_id'
  | 'status'
  | 'reviewed_by'
  | 'reviewed_at'
  | 'rejection_reason'
  | 'created_at'
  | 'updated_at'
> {
  return {
    partner_type: normalizePartnerType(input.partner_type),
    display_name: normalizeNullableString(input.display_name) ?? 'Partner Applicant',
    description: normalizeNullableString(input.description),
    phone: normalizeNullableString(input.phone),
    city: normalizeNullableString(input.city),
    state: normalizeNullableString(input.state),
  }
}

/**
 * Submit a new Local Partner application.
 * Rejects submission if an active 'pending' application already exists for the user.
 */
export async function submitPartnerApplication(
  userId: string,
  input: PartnerApplicationInput,
): Promise<PartnerApplication> {
  // Check for an existing pending application
  const existing = await getUserPartnerApplication(userId)
  if (existing && existing.status === 'pending') {
    const error = new Error(
      'You already have an active partner application pending review.',
    )
    ;(error as { code?: string }).code = 'APPLICATION_CONFLICT'
    throw error
  }

  const sanitized = sanitizePartnerApplicationInput(input)

  const { data, error } = await supabaseAdmin
    .from('partner_applications')
    .insert({
      user_id: userId,
      ...sanitized,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select(`
      id,
      user_id,
      partner_type,
      display_name,
      description,
      phone,
      city,
      state,
      status,
      reviewed_by,
      reviewed_at,
      rejection_reason,
      created_at,
      updated_at
    `)
    .single()

  if (error) {
    throw new Error(`Failed to submit partner application: ${error.message}`)
  }

  return {
    id: data.id,
    user_id: data.user_id,
    partner_type: normalizePartnerType(data.partner_type),
    display_name: data.display_name,
    description: data.description ?? null,
    phone: data.phone ?? null,
    city: data.city ?? null,
    state: data.state ?? null,
    status: normalizeApplicationStatus(data.status),
    reviewed_by: data.reviewed_by ?? null,
    reviewed_at: data.reviewed_at ?? null,
    rejection_reason: data.rejection_reason ?? null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

/**
 * Fetch the authenticated user's most recent partner application.
 */
export async function getUserPartnerApplication(
  userId: string,
): Promise<PartnerApplication | null> {
  const { data, error } = await supabaseAdmin
    .from('partner_applications')
    .select(`
      id,
      user_id,
      partner_type,
      display_name,
      description,
      phone,
      city,
      state,
      status,
      reviewed_by,
      reviewed_at,
      rejection_reason,
      created_at,
      updated_at
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch user partner application: ${error.message}`)
  }

  if (!data) {
    return null
  }

  return {
    id: data.id,
    user_id: data.user_id,
    partner_type: normalizePartnerType(data.partner_type),
    display_name: data.display_name,
    description: data.description ?? null,
    phone: data.phone ?? null,
    city: data.city ?? null,
    state: data.state ?? null,
    status: normalizeApplicationStatus(data.status),
    reviewed_by: data.reviewed_by ?? null,
    reviewed_at: data.reviewed_at ?? null,
    rejection_reason: data.rejection_reason ?? null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

/**
 * List partner applications for Admin review.
 */
export async function listPartnerApplications(
  statusFilter?: ApplicationStatus,
): Promise<PartnerApplication[]> {
  let query = supabaseAdmin
    .from('partner_applications')
    .select(`
      id,
      user_id,
      partner_type,
      display_name,
      description,
      phone,
      city,
      state,
      status,
      reviewed_by,
      reviewed_at,
      rejection_reason,
      created_at,
      updated_at
    `)
    .order('created_at', { ascending: false })

  if (statusFilter) {
    query = query.eq('status', statusFilter)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to list partner applications: ${error.message}`)
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    user_id: row.user_id,
    partner_type: normalizePartnerType(row.partner_type),
    display_name: row.display_name,
    description: row.description ?? null,
    phone: row.phone ?? null,
    city: row.city ?? null,
    state: row.state ?? null,
    status: normalizeApplicationStatus(row.status),
    reviewed_by: row.reviewed_by ?? null,
    reviewed_at: row.reviewed_at ?? null,
    rejection_reason: row.rejection_reason ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }))
}

/**
 * Admin review endpoint logic.
 * Approves or rejects a partner application.
 * On approval:
 *  1. Preserves existing app_metadata and merges role: 'local_partner' via supabaseAdmin.auth.admin.updateUserById.
 *  2. Updates partner_applications record status to 'approved'.
 *  3. Upserts initial record in partner_profiles table (with onConflict: 'user_id' for idempotency).
 */
export async function reviewPartnerApplication(
  applicationId: string,
  adminUserId: string,
  reviewInput: ApplicationReviewInput,
): Promise<PartnerApplication> {
  const targetStatus = normalizeNullableString(reviewInput.status)
  if (targetStatus !== 'approved' && targetStatus !== 'rejected') {
    throw new Error('Review status must be either "approved" or "rejected".')
  }

  const rejectionReason = normalizeNullableString(reviewInput.rejection_reason)

  // Fetch application record
  const { data: application, error: fetchError } = await supabaseAdmin
    .from('partner_applications')
    .select('*')
    .eq('id', applicationId)
    .single()

  if (fetchError || !application) {
    const error = new Error('Partner application not found.')
    ;(error as { code?: string }).code = 'NOT_FOUND'
    throw error
  }

  if (application.status !== 'pending') {
    const error = new Error(
      `Application has already been reviewed (current status: ${application.status}).`,
    )
    ;(error as { code?: string }).code = 'INVALID_STATE'
    throw error
  }

  const applicantUserId = application.user_id

  if (targetStatus === 'approved') {
    // 1. Fetch existing user account to preserve unrelated app_metadata fields
    const { data: userData, error: getUserError } =
      await supabaseAdmin.auth.admin.getUserById(applicantUserId)

    if (getUserError || !userData?.user) {
      throw new Error(
        `Failed to fetch applicant user account: ${getUserError?.message || 'User not found'}`,
      )
    }

    const existingAppMetadata = userData.user.app_metadata ?? {}

    // Server-controlled role promotion preserving existing app_metadata
    const { error: roleError } =
      await supabaseAdmin.auth.admin.updateUserById(applicantUserId, {
        app_metadata: {
          ...existingAppMetadata,
          role: 'local_partner',
        },
      })

    if (roleError) {
      throw new Error(
        `Failed to promote user role to local_partner: ${roleError.message}`,
      )
    }

    // 2. Mark application approved
    const { data: updatedApp, error: updateError } = await supabaseAdmin
      .from('partner_applications')
      .update({
        status: 'approved',
        reviewed_by: adminUserId,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
      .select('*')
      .single()

    if (updateError) {
      throw new Error(
        `Role promoted to local_partner, but failed to update application status record: ${updateError.message}`,
      )
    }

    // 3. Upsert base partner profile (Admin approval is treated as initial partner verification)
    await supabaseAdmin.from('partner_profiles').upsert(
      {
        user_id: applicantUserId,
        partner_type: application.partner_type ?? 'vendor',
        display_name: application.display_name ?? 'Local Partner',
        description: application.description ?? null,
        phone: application.phone ?? null,
        city: application.city ?? null,
        state: application.state ?? null,
        verification_status: 'verified',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )

    return {
      id: updatedApp.id,
      user_id: updatedApp.user_id,
      partner_type: normalizePartnerType(updatedApp.partner_type),
      display_name: updatedApp.display_name,
      description: updatedApp.description ?? null,
      phone: updatedApp.phone ?? null,
      city: updatedApp.city ?? null,
      state: updatedApp.state ?? null,
      status: 'approved',
      reviewed_by: updatedApp.reviewed_by ?? adminUserId,
      reviewed_at: updatedApp.reviewed_at ?? null,
      rejection_reason: null,
      created_at: updatedApp.created_at,
      updated_at: updatedApp.updated_at,
    }
  }

  // Rejection path
  const { data: updatedApp, error: updateError } = await supabaseAdmin
    .from('partner_applications')
    .update({
      status: 'rejected',
      reviewed_by: adminUserId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: rejectionReason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', applicationId)
    .select('*')
    .single()

  if (updateError) {
    throw new Error(
      `Failed to update partner application status to rejected: ${updateError.message}`,
    )
  }

  return {
    id: updatedApp.id,
    user_id: updatedApp.user_id,
    partner_type: normalizePartnerType(updatedApp.partner_type),
    display_name: updatedApp.display_name,
    description: updatedApp.description ?? null,
    phone: updatedApp.phone ?? null,
    city: updatedApp.city ?? null,
    state: updatedApp.state ?? null,
    status: 'rejected',
    reviewed_by: updatedApp.reviewed_by ?? adminUserId,
    reviewed_at: updatedApp.reviewed_at ?? null,
    rejection_reason: updatedApp.rejection_reason ?? null,
    created_at: updatedApp.created_at,
    updated_at: updatedApp.updated_at,
  }
}
