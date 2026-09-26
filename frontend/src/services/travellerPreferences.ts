import type { TravellerPreferences } from '../types/traveller'

interface RawTravellerAnswers {
  interests?: string[]
  travel_style?: string[]
  duration?: string[]
  crowd?: string[]
  region?: string[]
  month?: string[]
}

const durationMap: Record<string, number> = {
  Weekend: 2,
  '3–5 days': 4,
  '1 week': 7,
  '2+ weeks': 14,
}

const monthMap: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
}

export function buildTravellerPreferences(
  answers: RawTravellerAnswers,
): TravellerPreferences {
  const durationValue =
    answers.duration?.[0] ?? null

  const monthValue =
    answers.month?.[0] ?? null

  return {
    interests: answers.interests ?? [],

    travel_styles:
      answers.travel_style ?? [],

    preferred_trip_duration_days:
      durationValue
        ? durationMap[durationValue] ?? null
        : null,

    budget_per_day: null,

    budget_currency: 'INR',

    crowd_preference:
      answers.crowd?.[0] ?? null,

    preferred_regions:
      answers.region ?? [],

    accessibility_needs: [],

    food_preferences: [],

    language_preferences: [],

    travel_month:
      monthValue
        ? monthMap[monthValue] ?? null
        : null,
  }
}