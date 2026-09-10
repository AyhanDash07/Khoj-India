export interface TravellerPreferences {
  interests: string[]
  travel_styles: string[]
  preferred_trip_duration_days: number | null
  budget_per_day: number | null
  budget_currency: string | null
  crowd_preference: string | null
  preferred_regions: string[]
  accessibility_needs: string[]
  food_preferences: string[]
  language_preferences: string[]
}

export interface DestinationProfile {
  id: number
  name: string
  slug: string
  short_description: string | null
  description: string | null
  destination_type: string | null
  latitude: number | null
  longitude: number | null
  featured: boolean
  verified: boolean

state_name: string | null
  tags: {
    interests: string[]
    travel_styles: string[]
    regions: string[]
    food: string[]
  }
}

export interface DestinationIntelligence {
  pressure: {
    score: number | null
    level: string | null
    visitor_trend: string | null
  }

  impact: {
    score: number | null
    local_ownership_score: number | null
    community_participation_score: number | null
    local_sourcing_score: number | null
    heritage_preservation_score: number | null
    environmental_practice_score: number | null
  }

  safety: {
    level: string | null
    solo_travel_suitability: string | null
    night_travel_advisory: string | null
    emergency_information: string | null
  }

  accessibility: {
    wheelchair_accessible: boolean | null
    accessible_transport: boolean | null
    accessible_accommodation: boolean | null
    accessible_restrooms: boolean | null
    accessibility_notes: string | null
  }
}

export interface DestinationExperience {
  id: number
  name: string
  description: string | null
  category: string | null
  price: number | null
  duration_hours: number | null
  verified: boolean
}

export interface IntelligenceInput {
  traveller: TravellerPreferences
  destination: DestinationProfile
  intelligence: DestinationIntelligence
  experiences: DestinationExperience[]
}

export type MatchStatus =
  | 'matched'
  | 'partial'
  | 'mismatched'
  | 'unknown'

export interface MatchResult {
  score: number | null
  status: MatchStatus
  reason?: string
}

export interface PersonalFitBreakdown {
  interests: number | null
  travel_style: number | null
  budget: number | null
  duration: number | null
  crowd: number | null
  region: number | null
  food: number | null
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

export interface IntelligenceConfidence {
  score: number
  level: 'high' | 'moderate' | 'limited'
  available_dimensions: number
  total_dimensions: number
  missing_dimensions: string[]
}