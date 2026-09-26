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
  seasonality: number | null
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
  confidence: IntelligenceConfidence
}

export interface IntelligenceResult {
  destination_id: number
  destination_name: string
  score: IntelligenceScore
  reasons: string[]
  cautions: string[]
}

export type MatchLabel =
  | 'Exceptional match'
  | 'Excellent match'
  | 'Strong match'
  | 'Good match'
  | 'Fair match'
  | 'Low match'

export type ConfidenceLabel =
  | 'High confidence'
  | 'Moderate confidence'
  | 'Limited confidence'

export interface Recommendation {
  rank: number
  destination: RecommendationDestination
  intelligence: IntelligenceResult
  match_label: MatchLabel
  confidence_label: ConfidenceLabel
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

export interface RecommendationSummary {
  total_destinations_evaluated: number
  recommendations_returned: number
  top_match: {
    destination_id: number
    destination_name: string
    score: number
  } | null
}

export interface RecommendationData {
  recommendations: Recommendation[]
  redistribution_suggestions: RedistributionSuggestion[]
  summary: RecommendationSummary
}

export interface RecommendationResponse {
  success: boolean
  data: RecommendationData
}