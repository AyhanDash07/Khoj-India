import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Sparkles,
  ShieldAlert,
} from 'lucide-react'
import {
  motion,
  AnimatePresence,
} from 'framer-motion'

import { useAuth } from '../../hooks/useAuth'
import { buildTravellerPreferences } from '../../services/travellerPreferences'
import { savePreferences as savePreferencesService } from '../../services/preferenceService'

import type { TravellerPreferences } from '../../types/traveller'

interface TravellerIntelligenceProps {
  onComplete?: (
    preferences: TravellerPreferences,
  ) => void
}

interface Question {
  id: string
  eyebrow: string
  title: string
  description: string
  options: string[]
  multiple?: boolean
}

const questions: Question[] = [
  {
    id: 'interests',
    eyebrow: 'Start with what pulls you',
    title: 'What are you drawn to?',
    description:
      'Choose the things that make you want to discover a place.',
    options: [
      'Nature',
      'Culture',
      'Heritage',
      'Food',
      'Adventure',
      'Arts & Crafts',
    ],
    multiple: true,
  },
  {
    id: 'travel_style',
    eyebrow: 'Your way of travelling',
    title: 'How do you like to travel?',
    description:
      'Tell Khoj what kind of journey feels right to you.',
    options: [
      'Slow & immersive',
      'Adventure',
      'Culture first',
      'Food & local life',
      'A little of everything',
    ],
    multiple: true,
  },
  {
    id: 'duration',
    eyebrow: 'Time shapes the journey',
    title: 'How much time do you have?',
    description:
      'Khoj can shape discoveries around the time you actually have.',
    options: [
      'Weekend',
      '3–5 days',
      '1 week',
      '2+ weeks',
    ],
  },
  {
    id: 'crowd',
    eyebrow: 'The feeling of a place',
    title: 'What kind of crowd feels right?',
    description:
      'Some journeys are about famous places. Others are about finding your own.',
    options: [
      'Quiet & hidden',
      'Balanced',
      "I don't mind popular places",
    ],
  },
  {
    id: 'region',
    eyebrow: 'Where will curiosity take you?',
    title: 'Which part of India calls you?',
    description:
      'Choose a region or let Khoj look across India.',
    options: [
      'North India',
      'South India',
      'West India',
      'East India',
      'Central India',
      'Anywhere in India',
    ],
    multiple: true,
  },
  {
    id: 'month',
    eyebrow: 'One final signal',
    title: 'When are you travelling?',
    description:
      'Your travel month helps Khoj understand seasonal conditions.',
    options: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  },
]

export default function TravellerIntelligence({
  onComplete,
}: TravellerIntelligenceProps) {
  const navigate = useNavigate()
  const { user, session } = useAuth()

  const [currentStep, setCurrentStep] = useState(0)

  const [answers, setAnswers] = useState<
    Record<string, string[]>
  >({})

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] =
    useState<string | null>(null)

  const question = questions[currentStep]

  const selected =
    answers[question.id] ?? []

  const progress =
    ((currentStep + 1) / questions.length) * 100

  function toggleOption(option: string) {
    setAnswers((previous) => {
      const current =
        previous[question.id] ?? []

      if (question.multiple) {
        return {
          ...previous,
          [question.id]: current.includes(option)
            ? current.filter(
                (item) => item !== option,
              )
            : [...current, option],
        }
      }

      return {
        ...previous,
        [question.id]: [option],
      }
    })
  }

  function goBack() {
    if (currentStep === 0) return

    setCurrentStep(
      (step) => step - 1,
    )
  }

  async function handleSavePreferences() {
    if (!user || !session) {
      setSaveError('You must be signed in to save your travel preferences.')
      return
    }

    setSaving(true)
    setSaveError(null)

    try {
      const preferences =
        buildTravellerPreferences(
          answers,
        )

      const savedData = await savePreferencesService(preferences)

      onComplete?.(savedData)
      navigate('/explore')
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Failed to save your travel preferences.',
      )
    } finally {
      setSaving(false)
    }
  }

  function goNext() {
    if (currentStep < questions.length - 1) {
      setCurrentStep(
        (step) => step + 1,
      )
      return
    }

    void handleSavePreferences()
  }

  const canContinue =
    selected.length > 0 && !saving

  // Unauthenticated user state
  if (!user || !session) {
    return (
      <main className="min-h-screen bg-[#090D0B] text-[#F8F1E5]">
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#FF9933]/30 bg-[#FF9933]/10 text-[#FF9933]">
            <ShieldAlert size={26} />
          </div>

          <h1 className="mt-6 font-serif text-4xl sm:text-5xl">
            Sign in to start onboarding
          </h1>

          <p className="mt-4 max-w-md text-sm leading-7 text-[#F8F1E5]/60">
            Building your personalized traveller profile requires an authenticated account.
          </p>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#FF9933] bg-[#FF9933] px-7 py-3.5 text-sm font-medium text-[#090D0B] transition hover:bg-[#F5A623]"
          >
            Sign in to Khoj
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#090D0B] text-[#F8F1E5]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 lg:px-10">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center border border-[#FF9933]/30">
              <Compass
                size={17}
                className="text-[#FF9933]"
              />
            </div>

            <div>
              <p className="text-xs font-semibold tracking-[0.2em]">
                KHOJ INDIA
              </p>

              <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-[#F8F1E5]/30">
                Intelligence Onboarding
              </p>
            </div>
          </div>

          <span className="text-xs text-[#F8F1E5]/35">
            {currentStep + 1} / {questions.length}
          </span>
        </header>

        {/* Progress */}
        <div className="mt-8 h-px bg-[#F8F1E5]/8">
          <motion.div
            className="h-px bg-[#FF9933]"
            initial={false}
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </div>

        {/* Question */}
        <div className="flex flex-1 items-center justify-center py-16">
          <AnimatePresence mode="wait">
            <motion.section
              key={question.id}
              initial={{
                opacity: 0,
                x: 24,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -24,
              }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full max-w-4xl"
            >
              <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">

                {/* Editorial heading */}
                <div>
                  <div className="flex items-center gap-2 text-[#FF9933]">
                    <Sparkles size={15} />

                    <p className="text-xs uppercase tracking-[0.24em]">
                      {question.eyebrow}
                    </p>
                  </div>

                  <h1 className="mt-6 max-w-md font-serif text-5xl leading-[0.98] tracking-tight sm:text-6xl">
                    {question.title}
                  </h1>

                  <p className="mt-6 max-w-sm text-sm leading-7 text-[#F8F1E5]/50">
                    {question.description}
                  </p>
                </div>

                {/* Options */}
                <div className="self-center">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {question.options.map(
                      (option) => {
                        const isSelected =
                          selected.includes(
                            option,
                          )

                        return (
                          <motion.button
                            key={option}
                            type="button"
                            onClick={() =>
                              toggleOption(
                                option,
                              )
                            }
                            whileHover={{
                              y: -2,
                            }}
                            whileTap={{
                              scale: 0.985,
                            }}
                            disabled={saving}
                            className={`group flex min-h-16 items-center justify-between border px-5 py-4 text-left transition ${
                              isSelected
                                ? 'border-[#FF9933]/70 bg-[#FF9933]/8 text-[#F8F1E5]'
                                : 'border-[#F8F1E5]/10 bg-[#0D120F] text-[#F8F1E5]/65 hover:border-[#F8F1E5]/25 hover:text-[#F8F1E5]'
                            } ${
                              saving
                                ? 'cursor-not-allowed opacity-60'
                                : ''
                            }`}
                          >
                            <span className="text-sm">
                              {option}
                            </span>

                            <span
                              className={`flex h-5 w-5 items-center justify-center border text-xs transition ${
                                isSelected
                                  ? 'border-[#FF9933] bg-[#FF9933] text-[#090D0B]'
                                  : 'border-[#F8F1E5]/15 text-transparent group-hover:border-[#F8F1E5]/30'
                              }`}
                            >
                              ✓
                            </span>
                          </motion.button>
                        )
                      },
                    )}
                  </div>
                </div>
              </div>
            </motion.section>
          </AnimatePresence>
        </div>

        {/* Save error */}
        {saveError && (
          <div className="mb-6 border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-200/80">
            {saveError}
          </div>
        )}

        {/* Footer navigation */}
        <footer className="flex items-center justify-between border-t border-[#F8F1E5]/8 pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={
              currentStep === 0 || saving
            }
            className="inline-flex items-center gap-2 text-sm text-[#F8F1E5]/45 transition hover:text-[#F8F1E5] disabled:pointer-events-none disabled:opacity-20"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={!canContinue}
            className="inline-flex items-center gap-3 border border-[#FF9933]/50 bg-[#FF9933] px-6 py-3 text-sm font-medium text-[#090D0B] transition hover:bg-[#F5A623] disabled:pointer-events-none disabled:opacity-30"
          >
            {saving
              ? 'Saving your journey...'
              : currentStep ===
                  questions.length - 1
                ? 'Discover my India'
                : 'Continue'}

            <ArrowRight size={16} />
          </button>
        </footer>
      </div>
    </main>
  )
}