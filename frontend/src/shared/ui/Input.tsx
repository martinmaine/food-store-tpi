import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface FieldProps {
  label: ReactNode
  hint?: ReactNode
  error?: string
  className?: string
  children: ReactNode
}

/** Envuelve un control con su etiqueta, ayuda opcional y mensaje de error. */
export function Field({ label, hint, error, className = '', children }: FieldProps) {
  return (
    <label className={`field ${className}`}>
      <span className="field__label">
        {label}
        {hint && <span className="field__hint">{hint}</span>}
      </span>
      {children}
      {error && <span className="field__error">{error}</span>}
    </label>
  )
}

type Variante = 'default' | 'crema' | 'compact' | 'pill'

function clasesDeInput(variante: Variante, invalido: boolean, extra: string): string {
  return ['input', variante !== 'default' ? `input--${variante}` : '', invalido ? 'input--invalid' : '', extra]
    .filter(Boolean)
    .join(' ')
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variante?: Variante
  invalido?: boolean
}

export function Input({ variante = 'default', invalido = false, className = '', ...rest }: InputProps) {
  return <input className={clasesDeInput(variante, invalido, className)} {...rest} />
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variante?: Variante
  invalido?: boolean
}

export function TextArea({ variante = 'default', invalido = false, className = '', ...rest }: TextAreaProps) {
  return <textarea className={clasesDeInput(variante, invalido, className)} {...rest} />
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variante?: Variante
  invalido?: boolean
}

export function Select({ variante = 'default', invalido = false, className = '', ...rest }: SelectProps) {
  return <select className={clasesDeInput(variante, invalido, className)} {...rest} />
}
