import { formatPrecio, pluralizar } from '../../../shared/utils/format'

interface CartSummaryProps {
  unidades: number
  total: number
  onConfirmar: () => void
}

/** Resumen oscuro del carrito con el total y el botón para ir al checkout. */
export function CartSummary({ unidades, total, onConfirmar }: CartSummaryProps) {
  return (
    <aside className="split__aside summary summary--dark">
      <span className="eyebrow">Resumen</span>
      <div className="summary__row" style={{ fontSize: 16 }}>
        <span style={{ opacity: 0.8 }}>Productos</span>
        <span>{pluralizar(unidades, 'unidad', 'unidades')}</span>
      </div>
      <div className="summary__divider" />
      <div className="summary__row">
        <span style={{ fontSize: 18 }}>Total</span>
        <span className="summary__total">{formatPrecio(total)}</span>
      </div>
      <button type="button" className="btn btn--accent btn--block" onClick={onConfirmar}>
        Confirmar pedido →
      </button>
      <span className="summary__note">Al confirmar, el precio de cada producto queda fijo en tu pedido.</span>
    </aside>
  )
}
