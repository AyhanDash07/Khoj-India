import { supabase } from '../lib/supabase'
import api from './api'

import type {
  RecommendationData,
  RecommendationResponse,
} from '../types/recommendations.ts'

export interface RecommendationFilters {
  destination_type?: string
  preferred_region?: string
  max_results?: number
}

export async function getRecommendations(
  filters: RecommendationFilters = {},
): Promise<RecommendationData> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error(
      'You must be signed in to use Khoj Intelligence.',
    )
  }

  const params = new URLSearchParams()

  if (filters.destination_type) {
    params.set(
      'destination_type',
      filters.destination_type,
    )
  }

  if (filters.preferred_region) {
    params.set(
      'preferred_region',
      filters.preferred_region,
    )
  }

  if (filters.max_results !== undefined) {
    params.set(
      'max_results',
      String(filters.max_results),
    )
  }

  const queryString = params.toString()

  const endpoint = queryString
    ? `/recommendations?${queryString}`
    : '/recommendations'

  const response = await api.get<RecommendationResponse>(
    endpoint,
    {
      token: session.access_token,
    },
  )

  if (!response.success) {
    throw new Error(
      'Khoj Intelligence could not generate recommendations.',
    )
  }

  return response.data
}