import { Link, useLocation, useNavigate } from 'react-router-dom'

import { toast } from '../../../store/toastStore'
import { AuthShell } from '../components/AuthShell'
import { LoginForm } from '../components/LoginForm'
import type { Usuario } from '../../usuarios/types/usuario'

interface EstadoRedireccion {
  from?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const desde = (location.state as EstadoRedireccion | null)?.from

  const alIngresar = (usuario: Usuario) => {
    toast.ok(`Hola, ${usuario.full_name.split(' ')[0] ?? usuario.username}`)
    const destino = desde ?? (usuario.role === 'admin' ? '/admin/resumen' : '/')
    navigate(destino, { replace: true })
  }

  return (
    <AuthShell titular="Volvé a pedir lo de siempre.">
      <div className="auth-form">
        <Link to="/" className="link-btn" style={{ textDecoration: 'none' }}>
          ← Volver al menú
        </Link>
        <h1 className="auth-form__title">Iniciar sesión</h1>
        {desde && <div className="alert alert--warning">Necesitás iniciar sesión para continuar.</div>}
        <LoginForm onExito={alIngresar} />
      </div>
    </AuthShell>
  )
}
