import type { ReactNode } from 'react'

import { Donut3D } from '../../../shared/components/Donut3D'
import { Logo } from '../../../shared/ui/Logo'

interface AuthShellProps {
  titular: string
  children: ReactNode
}

/** Pantalla partida: panel oscuro con la dona 3D a la izquierda y el formulario a la derecha. */
export function AuthShell({ titular, children }: AuthShellProps) {
  return (
    <div className="auth">
      <div className="auth__aside">
        <Donut3D distancia={12} x={0.6} y={0.5} oscuro />
        <Logo inverso />
        <div className="pointer-events-none">
          <h2 className="auth__headline">{titular}</h2>
          <p className="eyebrow">Sesión segura · cookie HttpOnly</p>
        </div>
      </div>
      <div className="auth__main">{children}</div>
    </div>
  )
}
