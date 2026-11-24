import type { ReactNode } from 'react'

interface EstadoVacioProps {
  titulo: string
  texto?: string
  /** Número o símbolo grande decorativo (ej. "0"). */
  grande?: string
  accion?: ReactNode
  compacto?: boolean
}

export function EstadoVacio({ titulo, texto, grande, accion, compacto = false }: EstadoVacioProps) {
  return (
    <div className={`empty-state ${compacto ? 'empty-state--compact' : ''}`}>
      {grande && <span className="empty-state__big">{grande}</span>}
      <h3 className="empty-state__title">{titulo}</h3>
      {texto && <p className="empty-state__text">{texto}</p>}
      {accion}
    </div>
  )
}
