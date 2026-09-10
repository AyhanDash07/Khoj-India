import type {
  IntelligenceResult,
} from './intelligence.types.js'

/**
 * A single destination recommendation produced by
 * Khoj Intelligence.
 */
export interface Recommendation {
  rank: number

  destination: {
    id: number
    name: string
    slug: string | null
    short_description: string | null
    destination_type: string | null
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

/**
 * Summary of the complete recommendation set.
 */
export interface RecommendationSummary {
  total_destinations_evaluated: number
  recommendations_returned: number

  top_match: {
    destination_id: number
    destination_name: string
    score: number
  } | null
}

/**
 * Response returned by the Smart Discovery endpoint.
 */
export interface RecommendationResponse {
  recommendations: Recommendation[]
  summary: RecommendationSummary
}

/**
 * Optional filters that can later be used by
 * Smart Discovery.
 *
 * These are intentionally kept simple for V1.
 */
export interface RecommendationFilters {
  destination_type?: string
  preferred_region?: string
  max_results?: number
}

/**
 * Complete input required by the recommendation engine.
 */
export interface RecommendationInput {
  user_id: string
  filters?: RecommendationFilters
}