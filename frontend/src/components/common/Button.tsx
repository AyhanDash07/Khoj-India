import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  fullWidth?: boolean
}

function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const variantClass = {
    primary: 'btn-khoj-primary',
    secondary: 'btn-khoj-secondary',
    ghost:
      'border border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
  }[variant]

  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      className={`btn-khoj ${variantClass} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button