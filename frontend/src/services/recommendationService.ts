import { supabase } from '../lib/supabase'
import api from './api'

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

  intelligence: {
    destination_id: number
    destination_name: string

    score: {
      personal_fit: number
      impact: number | null
      safety: number | null
      pressure: number | null
      accessibility: number | null
      overall: number

      breakdown: {
        interests: number | null
        travel_style: number | null
        budget: number | null
        duration: number | null
        crowd: number | null
        region: number | null
        food: number | null
      }

      confidence: {
        score: number
        level: 'high' | 'moderate' | 'limited'
        available_dimensions: number
        total_dimensions: number
        missing_dimensions: string[]
      }
    }

    reasons: string[]
    cautions: string[]
  }

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

export interface RecommendationResponse {
  recommendations: Recommendation[]
  summary: RecommendationSummary
}

export interface RecommendationFilters {
  destination_type?: string
  preferred_region?: string
  max_results?: number
}

export async function getRecommendations(
  filters?: RecommendationFilters,
): Promise<RecommendationResponse> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error(
      'You must be signed in to use Khoj Intelligence.',
    )
  }

  const params = new URLSearchParams()

  if (filters?.destination_type) {
    params.set(
      'destination_type',
      filters.destination_type,
    )
  }

  if (filters?.preferred_region) {
    params.set(
      'preferred_region',
      filters.preferred_region,
    )
  }

  if (filters?.max_results) {
    params.set(
      'max_results',
      String(filters.max_results),
    )
  }

  const queryString = params.toString()

  const endpoint = queryString
    ? `/recommendations?${queryString}`
    : '/recommendations'

  const response =
    await api.get<{
      success: boolean
      data: RecommendationResponse
    }>(endpoint, {
      token: session.access_token,
    })

  return response.data
}