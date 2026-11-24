import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'

import { useResumenPedidos } from '../../features/pedidos/hooks/useResumenPedidos'
import { useAuthStore } from '../../store/authStore'
import { toast } from '../../store/toastStore'
import { Avatar } from '../ui/Avatar'
import { Logo } from '../ui/Logo'

const SECCIONES = [
  { to: '/admin/resumen', etiqueta: 'Resumen' },
  { to: '/admin/pedidos', etiqueta: 'Pedidos' },
  { to: '/admin/productos', etiqueta: 'Productos' },
  { to: '/admin/categorias', etiqueta: 'Categorías' },
  { to: '/admin/usuarios', etiqueta: 'Usuarios' },
] as const

/** Panel de administración: barra lateral + contenido de la sección. */
export function AdminLayout() {
  const usuario = useAuthStore((s) => s.usuario)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const { data: resumen } = useResumenPedidos()
  const pendientes = resumen?.pendientes ?? 0

  const cerrarSesion = async () => {
    await logout()
    toast.ok('Sesión cerrada')
    navigate('/login')
  }

  return (
    <div className="admin">
      <aside className="sidebar">
        <Logo inverso subtitulo="PANEL ADMIN" />
        <nav className="sidebar__nav" aria-label="Administración">
          {SECCIONES.map((s, i) => (
            <NavLink
              key={s.to}
              to={s.to}
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
            >
              <span>
                <span className="sidebar__num">0{i + 1}</span>
                {s.etiqueta}
              </span>
              {s.to === '/admin/pedidos' && pendientes > 0 && <span className="sidebar__badge">{pendientes}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__footer">
          {usuario && (
            <div className="sidebar__user">
              <Avatar nombre={usuario.full_name} />
              <span className="user-chip__info">
                <span className="user-chip__name">{usuario.full_name}</span>
                <span className="user-chip__role">{usuario.role}</span>
              </span>
            </div>
          )}
          <Link to="/" className="sidebar__action">
            ↗ Ir a la tienda
          </Link>
          <button type="button" className="sidebar__action" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
