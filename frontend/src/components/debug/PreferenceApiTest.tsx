import { useState } from 'react'

import { supabase } from '../../lib/supabase.ts'
import api from '../../services/api.ts'

interface PreferenceResponse {
  success: boolean
  message?: string
  data?: unknown
  error?: {
    code: string
  }
}

export default function PreferenceApiTest() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] =
    useState<PreferenceResponse | null>(null)
  const [error, setError] =
    useState<string | null>(null)

  async function testPreferences() {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error(
          'No active Supabase session. Please log in first.',
        )
      }

      const response =
        await api.get<PreferenceResponse>(
          '/preferences',
          {
            token: session.access_token,
          },
        )

      setResult(response)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Preference API test failed.',
      )
    } finally {
      setLoading(false)
    }
  }

  async function testSavePreferences() {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error(
          'No active Supabase session. Please log in first.',
        )
      }

      const response =
        await api.post<PreferenceResponse>(
          '/preferences',
          {
            interests: [
              'Nature',
              'Heritage',
            ],

            travel_styles: [
              'Slow & immersive',
            ],

            preferred_trip_duration_days: 4,

            budget_per_day: null,

            budget_currency: 'INR',

            crowd_preference:
              'Quiet & hidden',

            preferred_regions: [
              'West India',
            ],

            accessibility_needs: [],

            food_preferences: [],

            language_preferences: [
              'English',
            ],

            travel_month: 9,
          },
          {
            token: session.access_token,
          },
        )

      setResult(response)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Preference save test failed.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#090D0B] px-6 py-12 text-[#F8F1E5]">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.2em] text-[#FF9933]">
          Development Test
        </p>

        <h1 className="mt-3 font-serif text-4xl">
          Traveller Preference API
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#F8F1E5]/50">
          Testing authenticated preference retrieval
          and persistence through the KHOJ backend.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={testPreferences}
            disabled={loading}
            className="border border-[#F8F1E5]/15 bg-[#0D120F] px-5 py-3 text-sm transition hover:border-[#F8F1E5]/30 disabled:opacity-40"
          >
            {loading
              ? 'Testing...'
              : 'Get Preferences'}
          </button>

          <button
            type="button"
            onClick={testSavePreferences}
            disabled={loading}
            className="bg-[#FF9933] px-5 py-3 text-sm font-medium text-[#090D0B] transition hover:bg-[#F5A623] disabled:opacity-40"
          >
            {loading
              ? 'Saving...'
              : 'Save Test Preferences'}
          </button>
        </div>

        {error && (
          <div className="mt-8 border border-red-500/20 bg-red-500/5 p-5">
            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {result && (
          <pre className="mt-8 overflow-x-auto border border-[#F8F1E5]/10 bg-[#0D120F] p-5 text-xs leading-6 text-[#F8F1E5]/70">
            {JSON.stringify(
              result,
              null,
              2,
            )}
          </pre>
        )}
      </div>
    </main>
  )
}