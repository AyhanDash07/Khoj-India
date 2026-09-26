import {
  AlertCircle,
  ArrowRight,
  Compass,
  MapPin,
  Mic,
  RotateCcw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import RecommendationCard from '../components/intelligence/RecommendationCard'
import PageHeader from '../components/layout/PageHeader'
import PageLayout from '../components/layout/PageLayout'
import { useAuth } from '../hooks/useAuth'
import { getRecommendations } from '../services/recommendationService'
import type { RecommendationData } from '../types/recommendations'

const quickPreferences = [
  'Nature',
  'Culture',
  'Food',
  'Adventure',
  'Slow travel',
]

function PlanPage() {
  const navigate = useNavigate()
  const { user, session } = useAuth()

  const [prompt, setPrompt] = useState('')
  const [preferences, setPreferences] = useState<string[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<RecommendationData | null>(null)

  const togglePreference = (preference: string) => {
    setPreferences((current) =>
      current.includes(preference)
        ? current.filter((item) => item !== preference)
        : [...current, preference],
    )
  }

  const canDiscover = prompt.trim().length > 0 || preferences.length > 0

  async function handleDiscover() {
    if (!user || !session) {
      setError('AUTH_REQUIRED')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const primaryType = preferences[0] || undefined

      const result = await getRecommendations({
        destination_type: primaryType,
        max_results: 6,
      })

      setData(result)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to generate recommendations.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Khoj Intelligence"
        title="Tell Khoj what you are looking for."
        description="You don't need to know where you want to go. Describe the journey you have in mind, and let Khoj help you discover where it could take you."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        {/* Main Khoj Interface */}
        <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-gold-soft)]">
                <Sparkles size={17} strokeWidth={1.5} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Start with a feeling
                </p>

                <h2 className="mt-1 text-xl font-medium">
                  What kind of journey are you imagining?
                </h2>
              </div>
            </div>

            {/* Natural Language Input */}
            <div className="mt-7 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] transition-colors focus-within:border-[var(--color-gold)]/50">
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="For example: I want a peaceful 4-day trip with local food, culture and fewer crowds..."
                rows={6}
                className="w-full resize-none bg-transparent px-5 py-5 text-sm leading-7 text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
                aria-label="Describe your ideal journey"
              />

              <div className="flex items-center justify-between border-t border-[var(--color-border)] px-4 py-3">
                <button
                  type="button"
                  className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
                  aria-label="Voice input"
                  title="Voice input will be available later"
                >
                  <Mic size={15} strokeWidth={1.5} />
                  Voice
                </button>

                <span className="text-[10px] text-[var(--color-text-muted)]">
                  {prompt.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* Quick Preferences */}
          <div className="mt-9">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Or choose a few
                </p>

                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  Quick preferences
                </p>
              </div>

              {preferences.length > 0 && (
                <span className="text-xs text-[var(--color-gold-soft)]">
                  {preferences.length} selected
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {quickPreferences.map((preference) => {
                const selected = preferences.includes(preference)

                return (
                  <button
                    key={preference}
                    type="button"
                    onClick={() => togglePreference(preference)}
                    className={`rounded-full border px-4 py-2.5 text-sm transition-all ${
                      selected
                        ? 'border-[var(--color-gold-soft)] bg-[var(--color-gold)]/10 text-[var(--color-gold-soft)]'
                        : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-gold)]/40 hover:text-[var(--color-text-primary)]'
                    }`}
                    aria-pressed={selected}
                  >
                    {preference}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Discover */}
          <div className="mt-10">
            <Button
              fullWidth
              disabled={!canDiscover || loading}
              onClick={handleDiscover}
              className="justify-center"
            >
              {loading ? (
                <>
                  <Sparkles className="animate-spin" size={17} />
                  Khoj Intelligence Thinking...
                </>
              ) : (
                <>
                  Ask Khoj
                  <ArrowRight size={17} strokeWidth={1.6} />
                </>
              )}
            </Button>

            {!canDiscover && (
              <p className="mt-3 text-center text-xs text-[var(--color-text-muted)]">
                Tell Khoj something about the journey you want.
              </p>
            )}
          </div>
        </div>

        {/* Intelligence Explanation */}
        <aside className="relative overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 md:p-8">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--color-gold)]/5 blur-3xl" />

          <div className="relative">
            <Badge variant="gold">
              <Sparkles size={12} />
              How Khoj thinks
            </Badge>

            <h2 className="mt-7 text-3xl font-medium leading-tight tracking-tight">
              Your words become
              <br />
              your journey.
            </h2>

            <p className="mt-5 text-sm leading-6 text-[var(--color-text-secondary)]">
              Khoj will understand what matters to you instead of simply
              matching keywords to a list of destinations.
            </p>

            <div className="mt-8 space-y-5">
              <div className="border-t border-[var(--color-border)] pt-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Your intent
                </p>

                <p className="mt-2 text-sm leading-6">
                  {prompt.trim()
                    ? 'Understanding your journey...'
                    : 'Waiting for your story'}
                </p>
              </div>

              <div className="border-t border-[var(--color-border)] pt-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Your interests
                </p>

                <p className="mt-2 text-sm leading-6">
                  {preferences.length > 0
                    ? preferences.join(' · ')
                    : 'Nothing selected yet'}
                </p>
              </div>

              <div className="flex items-start gap-4 border-t border-[var(--color-border)] pt-4">
                <Compass
                  size={18}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-[var(--color-gold-soft)]"
                />

                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    What comes next
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                    Khoj will combine your intent with destination context,
                    local experiences, visitor pressure, safety, accessibility
                    and impact.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t border-[var(--color-border)] pt-4">
                <MapPin
                  size={18}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-[var(--color-gold-soft)]"
                />

                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    The result
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                    Not just a destination. A reason to go there.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Auth Required State */}
      {error === 'AUTH_REQUIRED' && (
        <div className="mt-12 rounded-[2rem] border border-[#FF9933]/25 bg-[#FF9933]/5 p-8 text-center">
          <ShieldAlert className="mx-auto text-[#FF9933]" size={36} />

          <h3 className="mt-4 font-serif text-3xl text-[#F8F1E5]">
            Sign in to unlock Khoj Intelligence
          </h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#F8F1E5]/60">
            Personalized destination recommendations, pressure-aware redistribution, and impact scoring require an authenticated traveller profile.
          </p>

          <Button
            className="mx-auto mt-6"
            onClick={() => navigate('/login')}
          >
            Sign in to Khoj
          </Button>
        </div>
      )}

      {/* Error State */}
      {error && error !== 'AUTH_REQUIRED' && (
        <div className="mt-12 rounded-[2rem] border border-red-500/25 bg-red-500/5 p-8 text-center">
          <AlertCircle className="mx-auto text-red-400" size={36} />

          <h3 className="mt-4 font-serif text-2xl text-red-200">
            Recommendation Error
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-red-200/70">
            {error}
          </p>

          <Button
            className="mx-auto mt-6"
            onClick={handleDiscover}
          >
            <RotateCcw size={15} />
            Try again
          </Button>
        </div>
      )}

      {/* Recommendations Results Section */}
      {data && (
        <section className="mt-20 border-t border-[var(--color-border)] pt-16">
          {/* Redistribution Alert */}
          {data.redistribution_suggestions.length > 0 && (
            <div className="mb-10 rounded-2xl border border-[#2E7D32]/30 bg-[#2E7D32]/10 p-5 text-sm leading-6 text-[#7BC47F]">
              <span className="font-semibold text-[#A2E0A5]">
                Khoj Pressure Balancing:
              </span>{' '}
              {data.redistribution_suggestions[0].reason}
            </div>
          )}

          {data.recommendations.length > 0 ? (
            <div>
              <div className="mb-10 flex items-end justify-between border-b border-[var(--color-border)] pb-6">
                <div>
                  <p className="eyebrow-khoj">Personalized Discoveries</p>

                  <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
                    Recommended for You
                  </h2>
                </div>

                <span className="hidden text-xs text-[var(--color-text-muted)] sm:block">
                  {data.summary.total_destinations_evaluated} destinations evaluated
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.recommendations.map((rec) => (
                  <RecommendationCard
                    key={rec.destination.id}
                    recommendation={rec}
                    onSelect={(id) => navigate(`/explore?destination=${id}`)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[var(--color-border)] p-12 text-center">
              <p className="font-serif text-3xl">
                No matching destinations found yet.
              </p>

              <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-text-muted)]">
                We couldn't surface recommendations matching your selected filters. Try clearing filters or choosing a different quick preference.
              </p>

              <Button
                className="mx-auto mt-6"
                onClick={() => {
                  setPreferences([])
                  setData(null)
                  setError(null)
                }}
              >
                Reset preferences
              </Button>
            </div>
          )}
        </section>
      )}
    </PageLayout>
  )
}

export default PlanPage