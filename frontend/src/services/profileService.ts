import { supabase } from '../lib/supabase.ts'

export interface Profile {
  id: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  bio: string | null
  preferred_language: string | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  user_id: string

  // Discovery preferences
  interests: string[]
  travel_styles: string[]

  // Legacy fields — kept temporarily for backward compatibility
  preferred_trip_duration: string | null
  budget_preference: string | null

  // Traveller Profile V2
  preferred_trip_duration_days: number | null
  budget_per_day: number | null
  budget_currency: string | null

  // Other preferences
  crowd_preference: string | null
  preferred_regions: string[]
  accessibility_needs: string[]
  food_preferences: string[]
  language_preferences: string[]
  travel_month: number | null

  updated_at: string
}

export type UserPreferencesUpdate = Partial<
  Omit<UserPreferences, 'user_id' | 'updated_at'>
>

export async function getProfile(
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      username,
      avatar_url,
      bio,
      preferred_language,
      onboarding_completed,
      created_at,
      updated_at
    `)
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(
      `Failed to fetch profile: ${error.message}`,
    )
  }

  return data
}

export async function updateProfile(
  userId: string,
  updates: Partial<
    Pick<
      Profile,
      | 'full_name'
      | 'username'
      | 'avatar_url'
      | 'bio'
      | 'preferred_language'
      | 'onboarding_completed'
    >
  >,
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select(`
      id,
      full_name,
      username,
      avatar_url,
      bio,
      preferred_language,
      onboarding_completed,
      created_at,
      updated_at
    `)
    .single()

  if (error) {
    throw new Error(
      `Failed to update profile: ${error.message}`,
    )
  }

  return data
}

export async function getUserPreferences(
  userId: string,
): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select(`
      user_id,
      interests,
      travel_styles,
      preferred_trip_duration,
      budget_preference,
      preferred_trip_duration_days,
      budget_per_day,
      budget_currency,
      crowd_preference,
      preferred_regions,
      accessibility_needs,
      food_preferences,
      language_preferences,
      travel_month,
      updated_at
    `)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(
      `Failed to fetch user preferences: ${error.message}`,
    )
  }

  return data
}

export async function updateUserPreferences(
  userId: string,
  updates: UserPreferencesUpdate,
): Promise<UserPreferences> {
  const { data, error } = await supabase
    .from('user_preferences')
    .update(updates)
    .eq('user_id', userId)
    .select(`
      user_id,
      interests,
      travel_styles,
      preferred_trip_duration,
      budget_preference,
      preferred_trip_duration_days,
      budget_per_day,
      budget_currency,
      crowd_preference,
      preferred_regions,
      accessibility_needs,
      food_preferences,
      language_preferences,
      travel_month,
      updated_at
    `)
    .single()

  if (error) {
    throw new Error(
      `Failed to update user preferences: ${error.message}`,
    )
  }

  return data
}