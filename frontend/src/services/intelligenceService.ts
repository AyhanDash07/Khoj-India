import { supabase } from '../lib/supabase'
import api from './api'

export interface PersonalFitBreakdown {
  interests: number | null
  travel_style: number | null
  budget: number | null
  duration: number | null
  crowd: number | null
  region: number | null
  food: number | null
}

export interface IntelligenceConfidence {
  score: number
  level: 'high' | 'moderate' | 'limited'
  available_dimensions: number
  total_dimensions: number
  missing_dimensions: string[]
}

export interface IntelligenceScore {
  personal_fit: number
  impact: number | null
  safety: number | null
  pressure: number | null
  accessibility: number | null
  overall: number
  breakdown: PersonalFitBreakdown
  confidence: IntelligenceConfidence
}

export interface IntelligenceResult {
  destination_id: number
  destination_name: string
  score: IntelligenceScore
  reasons: string[]
  cautions: string[]
}

interface IntelligenceApiResponse {
  success: boolean
  data: IntelligenceResult
  message?: string
}

export async function getDestinationIntelligence(
  destinationId: number,
): Promise<IntelligenceResult> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) {
    throw new Error('Please sign in to use Khoj Intelligence.')
  }

  const response = await api.get<IntelligenceApiResponse>(
    `/intelligence/destinations/${destinationId}`,
    {
      token: session.access_token,
    },
  )

  if (!response.success || !response.data) {
    throw new Error(
      response.message ?? 'Failed to calculate Khoj Intelligence score.',
    )
  }

  return response.data
}