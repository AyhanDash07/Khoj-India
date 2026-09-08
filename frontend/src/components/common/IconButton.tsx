import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  label: string
  size?: 'sm' | 'md'
}

function IconButton({
  children,
  label,
  size = 'md',
  className = '',
  type = 'button',
  ...props
}: IconButtonProps) {
  const sizeClass =
    size === 'sm'
      ? 'h-9 w-9'
      : 'h-10 w-10'

  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex ${sizeClass} items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-gold-soft)] hover:text-[var(--color-text-primary)] ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default IconButton