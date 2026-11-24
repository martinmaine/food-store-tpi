import { BadgeEstado } from '../../../shared/ui/BadgeEstado'
import { Button } from '../../../shared/ui/Button'
import { codigoPedido, formatFechaHora, formatPrecio, pluralizar } from '../../../shared/utils/format'
import type { Pedido } from '../types/pedido'
import { unidadesDePedido } from '../utils/estados'
import { PedidoInfo, PedidoLineas } from './PedidoDetalle'
import { PedidoProgreso } from './PedidoProgreso'

interface PedidoCardProps {
  pedido: Pedido
  abierto: boolean
  destacado: boolean
  delay: number
  onToggle: () => void
  onCancelar: () => void
}

/** Pedido del cliente en formato acordeón: cabecera con estado y total; detalle al abrir. */
export function PedidoCard({ pedido, abierto, destacado, delay, onToggle, onCancelar }: PedidoCardProps) {
  const unidades = unidadesDePedido(pedido.items)
  return (
    <div className={`order-card ${destacado ? 'order-card--highlight' : ''}`} style={{ animationDelay: `${delay}s` }}>
      <button type="button" className="order-card__head" aria-expanded={abierto} onClick={onToggle}>
        <span className="order-card__code">{codigoPedido(pedido.id)}</span>
        <span className="order-card__meta">
          {formatFechaHora(pedido.created_at)} · {pluralizar(unidades, 'producto', 'productos')}
        </span>
        <BadgeEstado estado={pedido.estado} />
        <span className="order-card__total">{formatPrecio(pedido.total)}</span>
        <span className={`order-card__chevron ${abierto ? 'order-card__chevron--open' : ''}`} aria-hidden>
          ↓
        </span>
      </button>

      {abierto && (
        <div className="order-card__body">
          {pedido.estado === 'CANCELADO' ? (
            <div className="alert alert--muted">Pedido cancelado. El stock de cada producto fue restituido.</div>
          ) : (
            <PedidoProgreso estado={pedido.estado} />
          )}
          <PedidoLineas pedido={pedido} />
          <PedidoInfo pedido={pedido} />
          {/* El cliente solo puede cancelar en PENDIENTE (RN-04). */}
          {pedido.estado === 'PENDIENTE' && (
            <Button variant="danger-outline" className="self-start" onClick={onCancelar}>
              Cancelar pedido
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
