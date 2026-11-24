import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant =
  | 'primary'
  | 'accent'
  | 'outline'
  | 'outline-soft'
  | 'ghost'
  | 'soft'
  | 'danger'
  | 'danger-outline'
  | 'primary-to-accent'

type ButtonSize = 'sm' | 'md' | 'lg' | 'block'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  type = 'button',
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const clases = ['btn', `btn--${variant}`, size !== 'md' ? `btn--${size}` : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <button type={type} className={clases} disabled={disabled || loading} {...rest}>
      {loading && <span className="spinner" aria-hidden />}
      {children}
    </button>
  )
}
