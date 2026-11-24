import { formatPrecio } from '../../../shared/utils/format'
import type { CartItem } from '../../../store/cartStore'

interface CheckoutSummaryProps {
  items: CartItem[]
  total: number
}

export function CheckoutSummary({ items, total }: CheckoutSummaryProps) {
  return (
    <aside className="split__aside summary summary--outline">
      <span className="eyebrow">Tu pedido</span>
      {items.map((item) => (
        <div key={item.producto_id} className="summary__row">
          <span>
            <span className="line__qty">{item.cantidad}×</span> {item.nombre}
          </span>
          <span className="font-semibold">{formatPrecio(item.precio_unitario * item.cantidad)}</span>
        </div>
      ))}
      <div className="summary__divider" />
      <div className="summary__row">
        <span className="font-semibold">Total</span>
        <span className="summary__total">{formatPrecio(total)}</span>
      </div>
    </aside>
  )
}
