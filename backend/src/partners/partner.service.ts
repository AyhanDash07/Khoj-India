import { supabaseAdmin } from '../config/supabase.js'
import type {
  PartnerProfile,
  PartnerProfileInput,
  PartnerType,
  VerificationStatus,
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

function normalizeVerificationStatus(value: unknown): VerificationStatus {
  if (value === 'verified') return 'verified'
  if (value === 'rejected') return 'rejected'
  return 'pending'
}

export function sanitizePartnerProfileInput(
  input: PartnerProfileInput,
): Omit<PartnerProfile, 'id' | 'user_id' | 'verification_status' | 'created_at' | 'updated_at'> {
  return {
    partner_type: normalizePartnerType(input.partner_type),
    display_name: normalizeNullableString(input.display_name) ?? 'Local Partner',
    description: normalizeNullableString(input.description),
    phone: normalizeNullableString(input.phone),
    city: normalizeNullableString(input.city),
    state: normalizeNullableString(input.state),
  }
}

export async function getPartnerProfile(
  userId: string,
): Promise<PartnerProfile | null> {
  const { data, error } = await supabaseAdmin
    .from('partner_profiles')
    .select(`
      id,
      user_id,
      partner_type,
      display_name,
      description,
      phone,
      city,
      state,
      verification_status,
      created_at,
      updated_at
    `)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch partner profile: ${error.message}`)
  }

  if (!data) {
    return null
  }

  return {
    id: data.id,
    user_id: data.user_id,
    partner_type: normalizePartnerType(data.partner_type),
    display_name: data.display_name ?? 'Local Partner',
    description: data.description ?? null,
    phone: data.phone ?? null,
    city: data.city ?? null,
    state: data.state ?? null,
    verification_status: normalizeVerificationStatus(data.verification_status),
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}

export async function upsertPartnerProfile(
  userId: string,
  input: PartnerProfileInput,
): Promise<PartnerProfile> {
  const sanitized = sanitizePartnerProfileInput(input)

  const { data, error } = await supabaseAdmin
    .from('partner_profiles')
    .upsert(
      {
        user_id: userId,
        ...sanitized,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id',
      },
    )
    .select(`
      id,
      user_id,
      partner_type,
      display_name,
      description,
      phone,
      city,
      state,
      verification_status,
      created_at,
      updated_at
    `)
    .single()

  if (error) {
    throw new Error(`Failed to save partner profile: ${error.message}`)
  }

  return {
    id: data.id,
    user_id: data.user_id,
    partner_type: normalizePartnerType(data.partner_type),
    display_name: data.display_name ?? 'Local Partner',
    description: data.description ?? null,
    phone: data.phone ?? null,
    city: data.city ?? null,
    state: data.state ?? null,
    verification_status: normalizeVerificationStatus(data.verification_status),
    created_at: data.created_at,
    updated_at: data.updated_at,
  }
}
