import type { ReactNode } from 'react'

interface AdminHeaderProps {
  titulo: string
  /** Endpoint que alimenta la pantalla (se muestra como referencia técnica). */
  endpoint: string
  accion?: ReactNode
}

export function AdminHeader({ titulo, endpoint, accion }: AdminHeaderProps) {
  return (
    <div className="admin-header">
      <div className="admin-header__text">
        <span className="admin-path">GET /api/v1{endpoint}</span>
        <h1 className="admin-title">{titulo}</h1>
      </div>
      {accion}
    </div>
  )
}
