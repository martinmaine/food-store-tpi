import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import type { Rol } from '../features/usuarios/types/usuario'
import { PageLoader } from '../shared/components/PageLoader'
import { useAuthStore } from '../store/authStore'

interface ProtectedRouteProps {
  children: ReactNode
  /** Roles permitidos. Si se omite, alcanza con tener sesión. */
  roles?: Rol[]
}

/**
 * Sin sesión → /login (recordando a dónde quería ir).
 * Sin el rol → /unauthorized.
 * Mientras checkSession confirma la sesión, muestra un indicador.
 * Ocultar pantallas no reemplaza la protección real, que está en el backend (require_role).
 */
export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const usuario = useAuthStore((s) => s.usuario)
  const cargando = useAuthStore((s) => s.cargando)
  const location = useLocation()

  if (cargando) return <PageLoader />
  if (!usuario) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (roles && !roles.includes(usuario.role)) return <Navigate to="/unauthorized" replace />
  return <>{children}</>
}
