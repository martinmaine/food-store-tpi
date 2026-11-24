import { Link, useNavigate } from 'react-router-dom'

import { useAuthStore } from '../../../store/authStore'
import { toast } from '../../../store/toastStore'
import type { UsuarioCreate } from '../../usuarios/types/usuario'
import { AuthShell } from '../components/AuthShell'
import { RegisterForm } from '../components/RegisterForm'

export function RegisterPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  // Tras registrarse, se inicia sesión automáticamente con las mismas credenciales.
  const alRegistrar = async (datos: UsuarioCreate) => {
    await login(datos.username, datos.password)
    toast.ok('Cuenta creada. ¡Bienvenida/o!')
    navigate('/', { replace: true })
  }

  return (
    <AuthShell titular="Sumate a la mesa.">
      <div className="auth-form" style={{ gap: 18 }}>
        <Link to="/" className="link-btn" style={{ textDecoration: 'none' }}>
          ← Volver al menú
        </Link>
        <h1 className="auth-form__title">Crear cuenta</h1>
        <RegisterForm onExito={alRegistrar} />
      </div>
    </AuthShell>
  )
}
