import type { ReactNode } from 'react'

interface ToggleProps {
  checked: boolean
  onChange: (value: boolean) => void
  label?: ReactNode
  size?: 'sm' | 'md'
  disabled?: boolean
  className?: string
}

/** Interruptor accesible (role="switch"). */
export function Toggle({ checked, onChange, label, size = 'md', disabled, className = '' }: ToggleProps) {
  const clases = ['toggle', checked ? 'toggle--on' : '', size === 'sm' ? 'toggle--sm' : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={clases}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onChange(!checked)
      }}
    >
      <span className="toggle__track">
        <span className="toggle__thumb" />
      </span>
      {label}
    </button>
  )
}
