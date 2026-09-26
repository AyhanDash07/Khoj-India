import {
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import type { Recommendation } from '../../types/recommendations'

interface RecommendationCardProps {
  recommendation: Recommendation
  onSelect?: (destinationId: number) => void
}

function getScoreStyle(score: number): string {
  if (score >= 90) {
    return 'border-[#2E7D32]/30 bg-[#2E7D32]/10 text-[#7BC47F]'
  }

  if (score >= 70) {
    return 'border-[#FF9933]/35 bg-[#FF9933]/10 text-[#FFB866]'
  }

  if (score >= 50) {
    return 'border-[#283593]/30 bg-[#283593]/10 text-[#AAB2FF]'
  }

  return 'border-[#F8F1E5]/15 bg-[#F8F1E5]/5 text-[#F8F1E5]/70'
}

function getDimensionValue(value: number | null): string {
  return value === null ? '—' : `${Math.round(value)}`
}

export default function RecommendationCard({
  recommendation,
  onSelect,
}: RecommendationCardProps) {
  const {
    destination,
    intelligence,
    match_label,
    confidence_label,
  } = recommendation

  const { score, reasons, cautions } = intelligence

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[#F8F1E5]/10 bg-[#101512]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition-all duration-500 hover:-translate-y-1 hover:border-[#F8F1E5]/20 hover:bg-[#121915] hover:shadow-[0_32px_90px_rgba(0,0,0,0.32)]">
      {/* Top */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F8F1E5]/30">
            Match #{recommendation.rank}
          </span>

          <h3 className="mt-2 truncate font-['DM_Serif_Display'] text-3xl leading-tight text-[#F8F1E5]">
            {destination.name}
          </h3>

          {destination.destination_type && (
            <p className="mt-1 text-xs capitalize text-[#F8F1E5]/35">
              {destination.destination_type}
            </p>
          )}
        </div>

        {/* Score */}
        <div
          className={`flex h-[68px] w-[68px] shrink-0 flex-col items-center justify-center rounded-full border ${getScoreStyle(
            score.overall,
          )}`}
        >
          <span className="text-xl font-semibold leading-none">
            {Math.round(score.overall)}
          </span>

          <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.18em] opacity-60">
            match
          </span>
        </div>
      </div>

      {/* Match label */}
      <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#FF9933]/15 bg-[#FF9933]/5 px-3 py-1.5 text-[10px] font-semibold text-[#FFB866]">
        <Sparkles size={12} />
        {match_label}
      </div>

      {/* Description */}
      {destination.short_description && (
        <p className="mt-5 line-clamp-3 text-xs leading-6 text-[#F8F1E5]/45">
          {destination.short_description}
        </p>
      )}

      {/* Signals */}
      <div className="mt-6 rounded-2xl border border-[#F8F1E5]/8 bg-[#F8F1E5]/[0.025] p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#F8F1E5]/30">
            Khoj signals
          </span>

          <span className="text-[9px] text-[#F8F1E5]/20">
            / 100
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-4">
          <Signal
            label="Personal fit"
            value={score.personal_fit}
          />

          <Signal
            label="Impact"
            value={score.impact}
          />

          <Signal
            label="Safety"
            value={score.safety}
          />

          <Signal
            label="Pressure"
            value={score.pressure}
          />

          <Signal
            label="Accessibility"
            value={score.accessibility}
          />

          <Signal
            label="Interests"
            value={score.breakdown.interests}
          />
        </div>
      </div>

      {/* Confidence */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#2E7D32]/15 bg-[#2E7D32]/5 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2E7D32]/10 text-[#7BC47F]">
          <ShieldCheck size={17} />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-[#F8F1E5]/70">
            {confidence_label}
          </p>

          <p className="mt-0.5 text-[9px] text-[#F8F1E5]/30">
            {score.confidence.available_dimensions} of{' '}
            {score.confidence.total_dimensions} signals available
          </p>
        </div>

        <span className="ml-auto text-sm font-semibold text-[#7BC47F]">
          {Math.round(score.confidence.score)}%
        </span>
      </div>

      {/* Reasons */}
      {reasons.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#F8F1E5]/30">
            Why Khoj recommends it
          </p>

          <div className="space-y-2.5">
            {reasons.slice(0, 3).map((reason, index) => (
              <div
                key={`${reason}-${index}`}
                className="flex items-start gap-2 text-xs leading-5 text-[#F8F1E5]/50"
              >
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-[#7BC47F]"
                  size={14}
                />

                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Caution */}
      {cautions.length > 0 && (
        <div className="mt-5 rounded-xl border border-[#FF9933]/10 bg-[#FF9933]/5 px-3 py-2.5">
          <p className="text-[10px] leading-5 text-[#F8F1E5]/45">
            <span className="font-semibold text-[#FFB866]">
              Keep in mind:
            </span>{' '}
            {cautions[0]}
          </p>
        </div>
      )}

      {/* CTA */}
      <button
        type="button"
        onClick={() => onSelect?.(destination.id)}
        className="mt-7 flex w-full items-center justify-between rounded-full border border-[#F8F1E5]/10 bg-[#F8F1E5]/8 px-5 py-3.5 text-xs font-semibold text-[#F8F1E5] transition-all duration-300 hover:border-[#FF9933]/30 hover:bg-[#FF9933] hover:text-[#090D0B]"
      >
        <span>Explore destination</span>

        <ArrowUpRight
          size={16}
          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </button>
    </article>
  )
}

interface SignalProps {
  label: string
  value: number | null
}

function Signal({ label, value }: SignalProps) {
  const percentage =
    value === null
      ? 0
      : Math.max(0, Math.min(100, value))

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-[#F8F1E5]/35">
          {label}
        </span>

        <span className="text-[10px] font-semibold text-[#F8F1E5]/65">
          {getDimensionValue(value)}
        </span>
      </div>

      <div className="mt-1.5 h-[2px] overflow-hidden rounded-full bg-[#F8F1E5]/8">
        <div
          className="h-full rounded-full bg-[#FF9933]/70 transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  )
}