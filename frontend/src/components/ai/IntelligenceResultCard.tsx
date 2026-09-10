import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Accessibility,
  CheckCircle2,
  Compass,
  Heart,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import type { IntelligenceResult } from '../../services/intelligenceService'
import IntelligenceExplanation from './IntelligenceExplanation'

interface IntelligenceResultCardProps {
  result: IntelligenceResult
}

interface ScoreItemProps {
  label: string
  value: number | null
  icon: ReactNode
  description: string
  delay: number
}

interface ConfidenceData {
  score: number
  level: 'high' | 'moderate' | 'limited'
  available_dimensions: number
  total_dimensions: number
  missing_dimensions: string[]
}

function clampScore(value: number): number {
  return Math.min(Math.max(value, 0), 100)
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent match'
  if (score >= 65) return 'Strong match'
  if (score >= 50) return 'Good match'
  if (score >= 35) return 'Moderate match'
  return 'Low match'
}

function getConfidenceLabel(level: ConfidenceData['level']): string {
  if (level === 'high') return 'High confidence'
  if (level === 'moderate') return 'Moderate confidence'
  return 'Limited confidence'
}

function getConfidenceDescription(
  level: ConfidenceData['level'],
): string {
  if (level === 'high') {
    return 'Most destination intelligence signals are available.'
  }

  if (level === 'moderate') {
    return 'Some destination intelligence signals are currently unavailable.'
  }

  return 'Several destination intelligence signals are currently unavailable.'
}

function buildFallbackConfidence(score: IntelligenceResult['score']): ConfidenceData {
  const dimensions = [
    {
      name: 'Impact',
      value: score.impact,
    },
    {
      name: 'Safety',
      value: score.safety,
    },
    {
      name: 'Crowd balance',
      value: score.pressure,
    },
    {
      name: 'Accessibility',
      value: score.accessibility,
    },
  ]

  const availableDimensions = dimensions.filter(
    (dimension) => dimension.value !== null,
  ).length

  const totalDimensions = dimensions.length
  const availabilityRatio =
    totalDimensions === 0
      ? 0
      : availableDimensions / totalDimensions

  let level: ConfidenceData['level']

  if (availabilityRatio >= 0.75) {
    level = 'high'
  } else if (availabilityRatio >= 0.5) {
    level = 'moderate'
  } else {
    level = 'limited'
  }

  const missingDimensions = dimensions
    .filter((dimension) => dimension.value === null)
    .map((dimension) => dimension.name)

  return {
    score: Math.round(availabilityRatio * 100),
    level,
    available_dimensions: availableDimensions,
    total_dimensions: totalDimensions,
    missing_dimensions: missingDimensions,
  }
}

function getConfidenceData(
  score: IntelligenceResult['score'],
): ConfidenceData {
  if ('confidence' in score && score.confidence) {
    const confidence = score.confidence as ConfidenceData

    return {
      score: clampScore(confidence.score),
      level: confidence.level,
      available_dimensions: confidence.available_dimensions,
      total_dimensions: confidence.total_dimensions,
      missing_dimensions: confidence.missing_dimensions ?? [],
    }
  }

  return buildFallbackConfidence(score)
}

function AnimatedNumber({
  value,
  duration = 1600,
}: {
  value: number
  duration?: number
}) {
  const shouldReduceMotion = useReducedMotion()
  const safeValue = clampScore(value)

  const [displayValue, setDisplayValue] = useState(
    shouldReduceMotion ? Math.round(safeValue) : 0,
  )

  useEffect(() => {
    if (shouldReduceMotion) {
      return
    }

    const startTime = performance.now()
    const startValue = 0
    let animationFrame = 0

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      const nextValue =
        startValue + (safeValue - startValue) * easedProgress

      setDisplayValue(Math.round(nextValue))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [duration, safeValue, shouldReduceMotion])

  const animatedValue = shouldReduceMotion
    ? Math.round(safeValue)
    : displayValue

  return <>{animatedValue}</>
}

function ScoreItem({
  label,
  value,
  icon,
  description,
  delay,
}: ScoreItemProps) {
  const shouldReduceMotion = useReducedMotion()

  const isUnavailable = value === null
  const safeValue = value === null ? 0 : clampScore(value)

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: 0, y: 30, scale: 0.97 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.55,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group rounded-2xl border p-4 transition-colors duration-300 ${
        isUnavailable
          ? 'border-white/[0.06] bg-white/[0.015]'
          : 'border-white/[0.08] bg-white/[0.025] hover:border-[var(--color-gold)]/20 hover:bg-white/[0.04]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <motion.span
            initial={
              shouldReduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.6 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : 0.45,
              delay: shouldReduceMotion ? 0 : delay + 0.15,
            }}
            className={
              isUnavailable
                ? 'text-[var(--color-text-muted)]'
                : 'text-[var(--color-gold-soft)]'
            }
          >
            {icon}
          </motion.span>

          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {label}
            </p>

            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
              {isUnavailable
                ? 'Not enough data to assess this dimension'
                : description}
            </p>
          </div>
        </div>

        <span
          className={`text-lg font-semibold ${
            isUnavailable
              ? 'text-[var(--color-text-muted)]'
              : 'text-[var(--color-text-primary)]'
          }`}
        >
          {isUnavailable ? (
            'N/A'
          ) : (
            <AnimatedNumber
              value={safeValue}
              duration={1600}
            />
          )}
        </span>
      </div>

      <div
        className={`mt-4 h-1.5 overflow-hidden rounded-full ${
          isUnavailable
            ? 'bg-white/[0.04]'
            : 'bg-white/[0.08]'
        }`}
      >
        {!isUnavailable && (
          <motion.div
            initial={{
              width: shouldReduceMotion ? `${safeValue}%` : '0%',
            }}
            animate={{ width: `${safeValue}%` }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : 1.7,
              delay: shouldReduceMotion ? 0 : delay + 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative h-full rounded-full bg-[var(--color-gold)]"
          >
            {!shouldReduceMotion && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.7, 0] }}
                transition={{
                  duration: 1.4,
                  delay: delay + 0.9,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-white/40"
              />
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function ConfidencePanel({
  confidence,
  delay,
}: {
  confidence: ConfidenceData
  delay: number
}) {
  const shouldReduceMotion = useReducedMotion()

  const missingCount = confidence.missing_dimensions.length

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 18 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.55,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.018] p-5 md:p-6"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/[0.07] text-[var(--color-gold-soft)]">
            <CheckCircle2 size={17} strokeWidth={1.7} />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">
              Intelligence confidence
            </p>

            <p className="mt-1 text-sm font-medium text-[var(--color-text-primary)]">
              {getConfidenceLabel(confidence.level)}
            </p>

            <p className="mt-1 max-w-xl text-xs leading-5 text-[var(--color-text-muted)]">
              {getConfidenceDescription(confidence.level)}
            </p>
          </div>
        </div>

        <div className="shrink-0 md:text-right">
          <p className="text-xl font-semibold text-[var(--color-gold-soft)]">
            <AnimatedNumber
              value={confidence.score}
              duration={1800}
            />
            <span className="ml-1 text-xs font-normal text-[var(--color-text-muted)]">
              / 100
            </span>
          </p>

          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {confidence.available_dimensions} of{' '}
            {confidence.total_dimensions} signals available
          </p>
        </div>
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{
            width: shouldReduceMotion
              ? `${confidence.score}%`
              : '0%',
          }}
          animate={{
            width: `${confidence.score}%`,
          }}
          transition={{
            duration: shouldReduceMotion ? 0.01 : 1.8,
            delay: shouldReduceMotion ? 0 : delay + 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="h-full rounded-full bg-[var(--color-gold)]"
        />
      </div>

      {missingCount > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--color-text-muted)]">
          <span>Unavailable:</span>

          {confidence.missing_dimensions.map(
            (dimension, index) => (
              <span key={dimension}>
                {dimension}
                {index < missingCount - 1 ? ',' : ''}
              </span>
            ),
          )}
        </div>
      )}
    </motion.div>
  )
}

export default function IntelligenceResultCard({
  result,
}: IntelligenceResultCardProps) {
  const shouldReduceMotion = useReducedMotion()

  const {
    score,
    destination_name,
    reasons,
    cautions,
  } = result

  const overallScore = clampScore(score.overall)

  const confidence = getConfidenceData(score)

  return (
    <motion.article
      initial={
        shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: 0, y: 40, scale: 0.98 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[var(--color-surface)]"
    >
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/[0.08] px-6 py-7 md:px-8 md:py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0.01 : 1.2,
            delay: shouldReduceMotion ? 0 : 0.15,
            ease: 'easeOut',
          }}
          className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[var(--color-gold)]/[0.07] blur-3xl"
        />

        <div className="relative">
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: -20 }
            }
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : 0.5,
              delay: shouldReduceMotion ? 0 : 0.15,
            }}
            className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-gold-soft)]"
          >
            <Sparkles size={14} strokeWidth={1.7} />
            Khoj Intelligence
          </motion.div>

          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 20 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.55,
                delay: shouldReduceMotion ? 0 : 0.25,
              }}
            >
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Your discovery match
              </p>

              <h2 className="mt-2 font-serif text-3xl text-[var(--color-text-primary)] md:text-4xl">
                {destination_name}
              </h2>
            </motion.div>

            {/* Overall score */}
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: 30 }
              }
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.65,
                delay: shouldReduceMotion ? 0 : 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-center gap-4"
            >
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        boxShadow: [
                          '0 0 0 rgba(200,155,82,0)',
                          '0 0 30px rgba(200,155,82,0.14)',
                          '0 0 0 rgba(200,155,82,0)',
                        ],
                      }
                }
                transition={{
                  duration: 2.4,
                  delay: 1.2,
                  repeat: 1,
                  ease: 'easeInOut',
                }}
                className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/[0.07]"
              >
                <svg
                  className="absolute inset-0 -rotate-90"
                  width="96"
                  height="96"
                  viewBox="0 0 96 96"
                  aria-hidden="true"
                >
                  <circle
                    cx="48"
                    cy="48"
                    r="39"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="5"
                  />

                  <motion.circle
                    cx="48"
                    cy="48"
                    r="39"
                    fill="none"
                    stroke="var(--color-gold)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 39}
                    initial={{
                      strokeDashoffset: shouldReduceMotion
                        ? 2 *
                          Math.PI *
                          39 *
                          (1 - overallScore / 100)
                        : 2 * Math.PI * 39,
                    }}
                    animate={{
                      strokeDashoffset:
                        2 *
                        Math.PI *
                        39 *
                        (1 - overallScore / 100),
                    }}
                    transition={{
                      duration: shouldReduceMotion ? 0.01 : 3,
                      delay: shouldReduceMotion ? 0 : 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </svg>

                <div className="relative text-center">
                  <span className="block text-2xl font-semibold leading-none text-[var(--color-gold-soft)]">
                    <AnimatedNumber
                      value={overallScore}
                      duration={2600}
                    />
                  </span>

                  <span className="mt-1 block text-[9px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    / 100
                  </span>
                </div>
              </motion.div>

              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {getScoreLabel(overallScore)}
                </p>

                <p className="mt-1 max-w-[180px] text-xs leading-5 text-[var(--color-text-muted)]">
                  Based on your preferences and destination intelligence.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Intelligence dimensions */}
      <div className="px-6 py-6 md:px-8 md:py-8">
        <div className="grid gap-3 md:grid-cols-2">
          <ScoreItem
            label="Personal fit"
            value={score.personal_fit}
            icon={<Compass size={17} />}
            description="How well it matches your preferences"
            delay={0.65}
          />

          <ScoreItem
            label="Positive impact"
            value={score.impact}
            icon={<Heart size={17} />}
            description="Potential benefit to local communities"
            delay={0.85}
          />

          <ScoreItem
            label="Safety"
            value={score.safety}
            icon={<ShieldCheck size={17} />}
            description="Destination safety signals"
            delay={1.05}
          />

          <ScoreItem
            label="Crowd balance"
            value={score.pressure}
            icon={<Users size={17} />}
            description="Lower tourist pressure scores higher"
            delay={1.25}
          />

          <ScoreItem
            label="Accessibility"
            value={score.accessibility}
            icon={<Accessibility size={17} />}
            description="Match with your accessibility needs"
            delay={1.45}
          />
        </div>

        {/* Intelligence confidence */}
        <ConfidencePanel
          confidence={confidence}
          delay={1.65}
        />

        {/* Explanation */}
        <IntelligenceExplanation
          reasons={reasons}
          cautions={cautions}
        />
      </div>
    </motion.article>
  )
}