import { LoaderCircle } from 'lucide-react'

interface LoadingStateProps {
  message?: string
}

function LoadingState({
  message = 'Khoj is discovering...',
}: LoadingStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 text-center"
      role="status"
      aria-live="polite"
    >
      <LoaderCircle
        size={24}
        strokeWidth={1.5}
        className="animate-spin text-[var(--color-gold-soft)]"
      />

      <p className="mt-5 text-sm font-medium text-[var(--color-text-primary)]">
        {message}
      </p>

      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
        Finding something worth discovering.
      </p>
    </div>
  )
}

export default LoadingState