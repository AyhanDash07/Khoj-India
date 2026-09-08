import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'gold' | 'success' | 'warning'
}

function Badge({
  children,
  variant = 'default',
}: BadgeProps) {
  const variantClass = {
    default:
      'border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]',

    gold:
      'border-[var(--color-gold)]/20 bg-[var(--color-gold)]/10 text-[var(--color-gold-soft)]',

    success:
      'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',

    warning:
      'border-amber-400/20 bg-amber-400/10 text-amber-300',
  }[variant]

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] ${variantClass}`}
    >
      {children}
    </span>
  )
}

export default Badge