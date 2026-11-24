import { formatPrecio } from '../../../shared/utils/format'
import type { Pedido } from '../types/pedido'
import { ETIQUETA_PAGO } from '../utils/estados'

/** Líneas del pedido (copia inmutable de nombre y precio) y, opcionalmente, el total. */
export function PedidoLineas({ pedido, conTotal = false }: { pedido: Pedido; conTotal?: boolean }) {
  return (
    <div className="lines">
      {pedido.items.map((linea) => (
        <div key={linea.producto_id} className="line">
          <span>
            <span className="line__qty">{linea.cantidad}×</span> {linea.nombre_producto}
          </span>
          <span className="line__unit">{formatPrecio(linea.precio_unitario)}</span>
          <span className="line__subtotal">{formatPrecio(linea.subtotal)}</span>
        </div>
      ))}
      {conTotal && (
        <div className="lines__total">
          <span>Total</span>
          <span>{formatPrecio(pedido.total)}</span>
        </div>
      )}
    </div>
  )
}

/** Datos de entrega, pago y notas. */
export function PedidoInfo({ pedido }: { pedido: Pedido }) {
  const datos = [
    { etiqueta: 'Entrega', valor: pedido.direccion_entrega },
    { etiqueta: 'Pago', valor: ETIQUETA_PAGO[pedido.forma_pago] },
    { etiqueta: 'Notas', valor: pedido.notas || '—' },
  ]
  return (
    <div className="info-grid">
      {datos.map((d) => (
        <div key={d.etiqueta} className="info-grid__item">
          <span className="info-grid__label">{d.etiqueta}</span>
          <span>{d.valor}</span>
        </div>
      ))}
    </div>
  )
}
