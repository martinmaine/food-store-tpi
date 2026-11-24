import type { HTMLAttributes } from 'react'

/** Contenedor con fondo crema claro, borde suave y esquinas redondeadas. */
export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`form-card ${className}`} {...rest} />
}
