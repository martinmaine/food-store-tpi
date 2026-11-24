import { NavLink, useNavigate } from 'react-router-dom'

import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { toast } from '../../store/toastStore'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'
import { CART_BUTTON_ID } from '../utils/flyToCart'

const claseNavLink = ({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? 'nav-link--active' : ''}`

/** Barra superior: marca, navegación, carrito y sesión (nombre, rol y "Cerrar sesión"). */
export function Navbar() {
  const usuario = useAuthStore((s) => s.usuario)
  const logout = useAuthStore((s) => s.logout)
  const unidades = useCartStore((s) => s.items.reduce((acc, i) => acc + i.cantidad, 0))
  const navigate = useNavigate()

  const cerrarSesion = async () => {
    await logout()
    toast.ok('Sesión cerrada')
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Logo />
        <nav className="navbar__links" aria-label="Principal">
          <NavLink to="/" end className={claseNavLink}>
            Menú
          </NavLink>
          {usuario && (
            <NavLink to="/mis-pedidos" className={claseNavLink}>
              Mis pedidos
            </NavLink>
          )}
          {/* El acceso al panel solo se muestra al admin (la protección real está en el backend). */}
          {usuario?.role === 'admin' && (
            <NavLink to="/admin/resumen" className={claseNavLink}>
              Panel admin
            </NavLink>
          )}
        </nav>
        <div className="flex-1" />
        <button id={CART_BUTTON_ID} type="button" className="cart-button" onClick={() => navigate('/carrito')}>
          Carrito
          <span className="cart-button__count">{unidades}</span>
        </button>
        {usuario ? (
          <div className="user-chip">
            <Avatar nombre={usuario.full_name} />
            <div className="user-chip__info">
              <span className="user-chip__name">{usuario.full_name}</span>
              <span className="user-chip__role">{usuario.role}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={cerrarSesion}>
              Cerrar sesión
            </Button>
          </div>
        ) : (
          <Button onClick={() => navigate('/login')}>Ingresar</Button>
        )}
      </div>
    </header>
  )
}
