import type { EstadoPedido } from '../../features/pedidos/types/pedido'
import { ETIQUETA_ESTADO } from '../../features/pedidos/utils/estados'

interface BadgeEstadoProps {
  estado: EstadoPedido
  size?: 'sm' | 'md'
  sinPunto?: boolean
}

/** Colorea los cuatro estados del pedido (colores definidos en style.css). */
export function BadgeEstado({ estado, size = 'md', sinPunto = false }: BadgeEstadoProps) {
  const clases = ['badge-estado', size === 'sm' ? 'badge-estado--sm' : '', sinPunto ? 'badge-estado--plain' : '']
    .filter(Boolean)
    .join(' ')
  return (
    <span className={clases} data-estado={estado}>
      {ETIQUETA_ESTADO[estado]}
    </span>
  )
}
