import {
  ArrowRight,
  Compass,
  MapPin,
  Mic,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'

import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import PageHeader from '../components/layout/PageHeader'
import PageLayout from '../components/layout/PageLayout'

const quickPreferences = [
  'Nature',
  'Culture',
  'Food',
  'Adventure',
  'Slow travel',
]

function PlanPage() {
  const [prompt, setPrompt] = useState('')
  const [preferences, setPreferences] = useState<string[]>([])

  const togglePreference = (preference: string) => {
    setPreferences((current) =>
      current.includes(preference)
        ? current.filter((item) => item !== preference)
        : [...current, preference],
    )
  }

  const canDiscover = prompt.trim().length > 0 || preferences.length > 0

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
              disabled={!canDiscover}
              className="justify-center"
            >
              Ask Khoj
              <ArrowRight size={17} strokeWidth={1.6} />
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
    </PageLayout>
  )
}

export default PlanPage