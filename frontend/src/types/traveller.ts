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
  travel_month: number | null
}