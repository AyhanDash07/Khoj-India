import { supabase } from '../lib/supabase'
import api from './api'
import type { TravellerPreferences } from '../types/traveller'

export interface PreferencesApiResponse {
  success: boolean
  data: TravellerPreferences
  message?: string
}

/**
 * Fetch the authenticated traveller's saved preferences from GET /api/preferences.
 * Returns null if the user is unauthenticated or if preferences are not found.
 */
export async function getPreferences(): Promise<TravellerPreferences | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) {
    return null
  }

  try {
    const response = await api.get<PreferencesApiResponse>('/preferences', {
      token: session.access_token,
    })

    if (!response.success || !response.data) {
      return null
    }

    return response.data
  } catch (error) {
    console.warn('[KHOJ] Could not fetch saved traveller preferences:', error)
    return null
  }
}

/**
 * Save or update the authenticated traveller's preferences via POST /api/preferences.
 */
export async function savePreferences(
  preferences: TravellerPreferences,
): Promise<TravellerPreferences> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) {
    throw new Error('You must be signed in to save your travel preferences.')
  }

  const response = await api.post<PreferencesApiResponse>(
    '/preferences',
    preferences,
    {
      token: session.access_token,
    },
  )

  if (!response.success || !response.data) {
    throw new Error(
      response.message ?? 'Failed to save your travel preferences.',
    )
  }

  return response.data
}
