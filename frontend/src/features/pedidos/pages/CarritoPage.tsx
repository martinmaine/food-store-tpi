import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ConfirmDialog, type ConfirmacionConfig } from '../../../shared/components/ConfirmDialog'
import { Donut3D } from '../../../shared/components/Donut3D'
import { Button } from '../../../shared/ui/Button'
import { pluralizar } from '../../../shared/utils/format'
import { useCartStore } from '../../../store/cartStore'
import { CartItemRow } from '../components/CartItemRow'
import { CartSummary } from '../components/CartSummary'

export function CarritoPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const cambiarCantidad = useCartStore((s) => s.cambiarCantidad)
  const quitar = useCartStore((s) => s.quitar)
  const vaciar = useCartStore((s) => s.vaciar)
  const total = useCartStore((s) => s.total())
  const unidades = useCartStore((s) => s.unidades())
  const [confirmacion, setConfirmacion] = useState<ConfirmacionConfig | null>(null)

  const pedirVaciar = () =>
    setConfirmacion({
      titulo: '¿Vaciar el carrito?',
      mensaje: 'Se quitarán todos los productos.',
      textoConfirmar: 'Vaciar',
      onConfirmar: () => {
        vaciar()
        setConfirmacion(null)
      },
    })

  return (
    <main className="page anim-page">
      <div className="flex items-baseline gap-4 mb-8 flex-wrap">
        <h1 className="page-title">Tu carrito</h1>
        <span className="tag-label" style={{ fontSize: 13, color: 'var(--color-texto-suave)' }}>
          {pluralizar(unidades, 'unidad', 'unidades')}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart__visual">
            <Donut3D distancia={7.5} mini />
          </div>
          <div className="flex flex-col gap-4 items-start">
            <h2 style={{ fontSize: 40, letterSpacing: '-0.04em', lineHeight: 1 }}>Todavía no agregaste nada</h2>
            <p className="muted" style={{ fontSize: 17 }}>
              El carrito se guarda en este navegador: si recargás, sigue acá.
            </p>
            <Button onClick={() => navigate('/')}>Explorar el menú</Button>
          </div>
        </div>
      ) : (
        <div className="split">
          <div className="split__main">
            {items.map((item, i) => (
              <CartItemRow
                key={item.producto_id}
                item={item}
                delay={i * 0.05}
                onCantidad={(c) => cambiarCantidad(item.producto_id, c)}
                onQuitar={() => quitar(item.producto_id)}
              />
            ))}
            <button type="button" className="link-btn link-btn--underline self-start py-2" onClick={pedirVaciar}>
              Vaciar carrito
            </button>
          </div>
          <CartSummary unidades={unidades} total={total} onConfirmar={() => navigate('/checkout')} />
        </div>
      )}

      <ConfirmDialog config={confirmacion} onClose={() => setConfirmacion(null)} />
    </main>
  )
}
