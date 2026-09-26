import api from './api'

export interface DestinationState {
  id: number
  name: string
  code: string
}

export interface Destination {
  id: number
  state_id: number
  name: string
  slug: string
  short_description: string | null
  description: string | null
  destination_type: string | null
  latitude: number | null
  longitude: number | null
  featured: boolean
  verified: boolean
  states: DestinationState | null
  hero_media: DestinationHeroMedia | null
}

export interface DestinationHeroMedia {
  id: number
  destination_id?: number
  media_type: string
  media_url: string
  thumbnail_url: string | null
  alt_text: string | null
  caption: string | null
  media_role: string
  is_featured: boolean
  source_url: string | null
  source_author: string | null
  source_license: string | null
  source_license_url: string | null
}

export interface DestinationStory {
  id: number
  destination_id: number
  origin_story: string | null
  cultural_significance: string | null
  ecological_story: string | null
  what_makes_it_special: string | null
  things_to_know: string | null
  responsible_travel_notes: string | null
  data_source: string | null
  measured_at: string | null
}

export interface DestinationImpact {
  impact_score: number | null
  local_ownership_score: number | null
  community_participation_score: number | null
  local_sourcing_score: number | null
  heritage_preservation_score: number | null
  environmental_practice_score: number | null
  data_source: string | null
  measured_at: string | null
}

export interface DestinationSafety {
  safety_level: string | null
  solo_travel_suitability: string | null
  night_travel_advisory: string | null
  emergency_information: string | null
  data_source: string | null
  updated_at: string | null
}

export interface DestinationPressure {
  pressure_score: number | null
  pressure_level: string | null
  visitor_trend: string | null
  peak_periods: string[]
  data_source: string | null
  measured_at: string | null
}

export interface DestinationAccessibility {
  wheelchair_accessible: boolean | null
  accessible_transport: boolean | null
  accessible_accommodation: boolean | null
  accessible_restrooms: boolean | null
  accessibility_notes: string | null
  data_source: string | null
  updated_at: string | null
}

export interface DestinationSeasonality {
  month: number
  suitability_score: number | null
  season_label: string | null
  weather_notes: string | null
  accessibility_notes: string | null
  crowd_notes: string | null
  data_source: string | null
  measured_at: string | null
}

export interface DestinationExperience {
  id: number
  title: string
  slug: string
  short_description: string | null
  description: string | null
  category_id: number | null
  duration_minutes: number | null
  price_from: number | null
  max_group_size: number | null
  impact_score: number | null
  verified: boolean
  active: boolean
}

export interface DestinationIntelligence {
  impact: DestinationImpact | null
  safety: DestinationSafety | null
  pressure: DestinationPressure | null
  accessibility: DestinationAccessibility | null
  seasonality: DestinationSeasonality[]
}

export interface DestinationDetail {
  destination: Destination
  hero_media: DestinationHeroMedia | null
  story: DestinationStory | null
  intelligence: DestinationIntelligence
  experiences: DestinationExperience[]
}

export interface DestinationDetailResponse {
  success: boolean
  data: DestinationDetail
  message?: string
}

export async function getDestinations(): Promise<
  Destination[]
> {
  const response =
    await api.get<{
      success: boolean
      data: Destination[]
      message?: string
    }>('/destinations')

  if (!response.success) {
    throw new Error(
      response.message ??
        'Failed to fetch destinations.',
    )
  }

  return response.data
}

export async function getDestinationById(
  destinationId: number,
): Promise<DestinationDetail> {
  if (
    !Number.isInteger(destinationId) ||
    destinationId <= 0
  ) {
    throw new Error('Invalid destination ID.')
  }

  const response =
    await api.get<DestinationDetailResponse>(
      `/destinations/${destinationId}`,
    )

  if (!response.success) {
    throw new Error(
      response.message ??
        'Failed to fetch destination.',
    )
  }

  return response.data
}