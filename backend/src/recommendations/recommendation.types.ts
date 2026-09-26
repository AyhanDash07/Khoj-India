import type { IntelligenceResult } from './intelligence.types.js'

export interface RecommendationDestination {
  id: number
  name: string
  slug: string | null

  short_description: string | null
  description: string | null

  destination_type: string | null

  state_name: string | null

  latitude: number | null
  longitude: number | null

  image_url: string | null
  image_alt: string | null
  image_caption: string | null

  featured: boolean
  verified: boolean
}

export interface Recommendation {
  rank: number

  destination: {
  id: number
  name: string
  slug: string | null
  short_description: string | null
  description: string | null
  destination_type: string | null
  state_name: string | null
  latitude: number | null
  longitude: number | null

  image_url: string | null
  image_alt: string | null
  image_caption: string | null

  featured: boolean
  verified: boolean
}

  intelligence: IntelligenceResult

  match_label:
    | 'Exceptional match'
    | 'Excellent match'
    | 'Strong match'
    | 'Good match'
    | 'Fair match'
    | 'Low match'

  confidence_label:
    | 'High confidence'
    | 'Moderate confidence'
    | 'Limited confidence'
}

export interface RecommendationSummary {
  total_destinations_evaluated: number
  recommendations_returned: number

  top_match: {
    destination_id: number
    destination_name: string
    score: number
  } | null
}

export interface RedistributionSuggestion {
  source_destination_id: number
  source_destination_name: string
  alternative_destination_id: number
  alternative_destination_name: string
  source_pressure_score: number
  alternative_pressure_score: number
  personal_fit_score: number
  reason: string
}

export interface RecommendationResponse {
  recommendations: Recommendation[]
  redistribution_suggestions: RedistributionSuggestion[]
  summary: RecommendationSummary
}

export interface RecommendationFilters {
  destination_type?: string
  preferred_region?: string
  max_results?: number
}

export interface RecommendationInput {
  user_id: string
  travel_month?: number | null
  filters?: RecommendationFilters
}