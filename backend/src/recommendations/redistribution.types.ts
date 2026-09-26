import type { Recommendation } from './recommendation.types.js'

export interface RedistributionCandidate {
  recommendation: Recommendation
  pressure_difference: number
  personal_fit_difference: number
  alternative_score: number
}

export interface RedistributionSuggestion {
  original: Recommendation
  alternative: Recommendation
  reason: string
  pressure_reduction: number
  personal_fit_retained: number
}

export interface RedistributionResult {
  suggestions: RedistributionSuggestion[]
}