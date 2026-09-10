import { motion, useReducedMotion } from 'framer-motion'
import { AlertTriangle, Sparkles } from 'lucide-react'

interface IntelligenceExplanationProps {
  reasons: string[]
  cautions: string[]
}

export default function IntelligenceExplanation({
  reasons,
  cautions,
}: IntelligenceExplanationProps) {
  const shouldReduceMotion = useReducedMotion()

  if (reasons.length === 0 && cautions.length === 0) {
    return null
  }

  return (
    <div className="mt-8 space-y-8">
      {/* Why Khoj recommends it */}
      {reasons.length > 0 && (
        <motion.section
          initial={
            shouldReduceMotion
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 18 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.01 : 0.65,
            delay: shouldReduceMotion ? 0 : 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Sparkles
              size={16}
              strokeWidth={1.7}
              className="text-[var(--color-gold-soft)]"
            />

            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Why Khoj recommends it
            </h3>
          </div>

          <div className="space-y-2.5">
            {reasons.map((reason, index) => (
              <motion.div
                key={`${reason}-${index}`}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: -12 }
                }
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0.01 : 0.5,
                  delay: shouldReduceMotion
                    ? 0
                    : 0.25 + index * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3.5 transition-colors duration-300 hover:border-[var(--color-gold)]/20 hover:bg-white/[0.04]"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold)]" />

                <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                  {reason}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Things to consider */}
      {cautions.length > 0 && (
        <motion.section
          initial={
            shouldReduceMotion
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 18 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.01 : 0.65,
            delay: shouldReduceMotion ? 0 : 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle
              size={16}
              strokeWidth={1.7}
              className="text-[var(--color-gold-soft)]"
            />

            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Things to consider
            </h3>
          </div>

          <div className="space-y-2.5">
            {cautions.map((caution, index) => (
              <motion.div
                key={`${caution}-${index}`}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: -12 }
                }
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0.01 : 0.5,
                  delay: shouldReduceMotion
                    ? 0
                    : 0.5 + index * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3.5 transition-colors duration-300 hover:border-[var(--color-gold)]/15 hover:bg-white/[0.035]"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold-soft)]" />

                <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                  {caution}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  )
}