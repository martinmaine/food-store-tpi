import { formatPrecio } from '../../../shared/utils/format'
import type { CartItem } from '../../../store/cartStore'
import { ProductoThumb } from '../../productos/components/ProductoThumb'

interface CartItemRowProps {
  item: CartItem
  delay: number
  onCantidad: (cantidad: number) => void
  onQuitar: () => void
}

export function CartItemRow({ item, delay, onCantidad, onQuitar }: CartItemRowProps) {
  const enElMaximo = item.cantidad >= item.stock
  return (
    <div className="cart-item" style={{ animationDelay: `${delay}s` }}>
      <ProductoThumb nombre={item.nombre} categoriaId={item.categoria_id} imagenUrl={item.imagen_url} />
      <div className="cart-item__info">
        <span className="cart-item__name">{item.nombre}</span>
        <span className="cart-item__meta">
          {formatPrecio(item.precio_unitario)} c/u · stock {item.stock}
        </span>
      </div>
      <div className="qty" role="group" aria-label={`Cantidad de ${item.nombre}`}>
        <button type="button" className="qty__btn" aria-label="Restar uno" onClick={() => onCantidad(item.cantidad - 1)}>
          −
        </button>
        <span className="qty__value">{item.cantidad}</span>
        <button
          type="button"
          className="qty__btn"
          aria-label="Sumar uno"
          disabled={enElMaximo}
          title={enElMaximo ? `Stock máximo: ${item.stock}` : undefined}
          onClick={() => onCantidad(item.cantidad + 1)}
        >
          +
        </button>
      </div>
      <span className="cart-item__subtotal">{formatPrecio(item.precio_unitario * item.cantidad)}</span>
      <button type="button" className="btn btn--ghost btn--sm" onClick={onQuitar}>
        Quitar
      </button>
    </div>
  )
}
