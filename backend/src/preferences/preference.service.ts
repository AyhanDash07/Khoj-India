import { supabaseAdmin } from '../config/supabase.js'

import type { TravellerPreferences } from './preference.types.js'

export interface TravellerPreferencesInput {
  interests?: unknown
  travel_styles?: unknown

  preferred_trip_duration_days?: unknown

  budget_per_day?: unknown
  budget_currency?: unknown

  crowd_preference?: unknown

  preferred_regions?: unknown

  accessibility_needs?: unknown

  food_preferences?: unknown

  language_preferences?: unknown

  travel_month?: unknown
}

function normalizeStringArray(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter(
      (item): item is string =>
        typeof item === 'string',
    )
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeNullableString(
  value: unknown,
): string | null {
  if (
    typeof value !== 'string' ||
    !value.trim()
  ) {
    return null
  }

  return value.trim()
}

function normalizeNullableInteger(
  value: unknown,
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null
  }

  const numberValue = Number(value)

  if (!Number.isInteger(numberValue)) {
    return null
  }

  return numberValue
}

function normalizeNullableNumber(
  value: unknown,
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null
  }

  const numberValue = Number(value)

  if (!Number.isFinite(numberValue)) {
    return null
  }

  return numberValue
}

function validateTravellerPreferences(
  preferences: TravellerPreferences,
): void {
  if (
    preferences.preferred_trip_duration_days !== null &&
    preferences.preferred_trip_duration_days <= 0
  ) {
    throw new Error(
      'Trip duration must be greater than zero.',
    )
  }

  if (
    preferences.budget_per_day !== null &&
    preferences.budget_per_day < 0
  ) {
    throw new Error(
      'Budget per day cannot be negative.',
    )
  }

  if (
    preferences.travel_month !== null &&
    (
      preferences.travel_month < 1 ||
      preferences.travel_month > 12
    )
  ) {
    throw new Error(
      'Travel month must be between 1 and 12.',
    )
  }
}

export function normalizeTravellerPreferences(
  input: TravellerPreferencesInput,
): TravellerPreferences {
  const preferences: TravellerPreferences = {
    interests:
      normalizeStringArray(
        input.interests,
      ),

    travel_styles:
      normalizeStringArray(
        input.travel_styles,
      ),

    preferred_trip_duration_days:
      normalizeNullableInteger(
        input.preferred_trip_duration_days,
      ),

    budget_per_day:
      normalizeNullableNumber(
        input.budget_per_day,
      ),

    budget_currency:
      normalizeNullableString(
        input.budget_currency,
      ) ?? 'INR',

    crowd_preference:
      normalizeNullableString(
        input.crowd_preference,
      ),

    preferred_regions:
      normalizeStringArray(
        input.preferred_regions,
      ),

    accessibility_needs:
      normalizeStringArray(
        input.accessibility_needs,
      ),

    food_preferences:
      normalizeStringArray(
        input.food_preferences,
      ),

    language_preferences:
      normalizeStringArray(
        input.language_preferences,
      ),

    travel_month:
      normalizeNullableInteger(
        input.travel_month,
      ),
  }

  validateTravellerPreferences(
    preferences,
  )

  return preferences
}

export async function getTravellerPreferences(
  userId: string,
): Promise<TravellerPreferences | null> {
  const {
    data,
    error,
  } = await supabaseAdmin
    .from('user_preferences')
    .select(`
      interests,
      travel_styles,
      preferred_trip_duration_days,
      budget_per_day,
      budget_currency,
      crowd_preference,
      preferred_regions,
      accessibility_needs,
      food_preferences,
      language_preferences,
      travel_month
    `)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(
      `Failed to fetch traveller preferences: ${error.message}`,
    )
  }

  if (!data) {
    return null
  }

  return normalizeTravellerPreferences(
    data,
  )
}

export async function saveTravellerPreferences(
  userId: string,
  input: TravellerPreferencesInput,
): Promise<TravellerPreferences> {
  const preferences =
    normalizeTravellerPreferences(
      input,
    )

  const {
    data,
    error,
  } = await supabaseAdmin
    .from('user_preferences')
    .update({
      interests:
        preferences.interests,

      travel_styles:
        preferences.travel_styles,

      preferred_trip_duration_days:
        preferences.preferred_trip_duration_days,

      budget_per_day:
        preferences.budget_per_day,

      budget_currency:
        preferences.budget_currency,

      crowd_preference:
        preferences.crowd_preference,

      preferred_regions:
        preferences.preferred_regions,

      accessibility_needs:
        preferences.accessibility_needs,

      food_preferences:
        preferences.food_preferences,

      language_preferences:
        preferences.language_preferences,

      travel_month:
        preferences.travel_month,

      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select(`
      interests,
      travel_styles,
      preferred_trip_duration_days,
      budget_per_day,
      budget_currency,
      crowd_preference,
      preferred_regions,
      accessibility_needs,
      food_preferences,
      language_preferences,
      travel_month
    `)
    .maybeSingle()

  if (error) {
    throw new Error(
      `Failed to save traveller preferences: ${error.message}`,
    )
  }

  if (!data) {
    throw new Error(
      'Traveller preferences could not be saved because the preference profile does not exist.',
    )
  }

  return normalizeTravellerPreferences(
    data,
  )
}