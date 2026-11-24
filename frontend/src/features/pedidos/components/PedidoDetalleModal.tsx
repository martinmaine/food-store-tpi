import { BadgeEstado } from '../../../shared/ui/BadgeEstado'
import { Modal } from '../../../shared/ui/Modal'
import { codigoPedido, formatFechaHora } from '../../../shared/utils/format'
import type { EstadoPedido, Pedido } from '../types/pedido'
import { PedidoAcciones } from './PedidoAcciones'
import { PedidoInfo, PedidoLineas } from './PedidoDetalle'

interface PedidoDetalleModalProps {
  pedido: Pedido
  cliente: string
  onClose: () => void
  onAvanzar: (siguiente: EstadoPedido) => void
  onCancelar: () => void
  ocupado: boolean
}

export function PedidoDetalleModal({ pedido, cliente, onClose, onAvanzar, onCancelar, ocupado }: PedidoDetalleModalProps) {
  return (
    <Modal titulo={`Pedido ${codigoPedido(pedido.id)}`} onClose={onClose} ancho="wide">
      <div className="flex gap-2.5 items-center flex-wrap">
        <BadgeEstado estado={pedido.estado} sinPunto />
        <span className="tag-label" style={{ fontSize: 12, color: 'var(--color-texto-suave)' }}>
          {formatFechaHora(pedido.created_at)} · {cliente}
        </span>
      </div>
      <PedidoLineas pedido={pedido} conTotal />
      <PedidoInfo pedido={pedido} />
      <div className="flex gap-2 flex-wrap">
        <PedidoAcciones estado={pedido.estado} onAvanzar={onAvanzar} onCancelar={onCancelar} deshabilitado={ocupado} grande />
      </div>
    </Modal>
  )
}
