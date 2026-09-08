import { Compass } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 text-center md:py-20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-gold-soft)]">
        <Compass size={20} strokeWidth={1.5} />
      </div>

      <h3 className="mt-6 text-2xl font-medium tracking-tight">
        {title}
      </h3>

      <p className="mt-3 max-w-lg text-sm leading-6 text-[var(--color-text-secondary)]">
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  )
}

export default EmptyState