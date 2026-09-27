export type PartnerType = 'vendor' | 'guide' | 'both'

export type VerificationStatus = 'pending' | 'verified' | 'rejected'

export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export interface PartnerProfile {
  id?: string
  user_id: string
  partner_type: PartnerType
  display_name: string
  description: string | null
  phone: string | null
  city: string | null
  state: string | null
  verification_status: VerificationStatus
  created_at?: string
  updated_at?: string
}

export interface PartnerProfileInput {
  partner_type?: unknown
  display_name?: unknown
  description?: unknown
  phone?: unknown
  city?: unknown
  state?: unknown
}

export interface PartnerApplication {
  id?: string
  user_id: string
  partner_type: PartnerType
  display_name: string
  description: string | null
  phone: string | null
  city: string | null
  state: string | null
  status: ApplicationStatus
  reviewed_by?: string | null
  reviewed_at?: string | null
  rejection_reason?: string | null
  created_at?: string
  updated_at?: string
}

export interface PartnerApplicationInput {
  partner_type?: unknown
  display_name?: unknown
  description?: unknown
  phone?: unknown
  city?: unknown
  state?: unknown
}

export interface ApplicationReviewInput {
  status?: unknown
  rejection_reason?: unknown
}
