import type { MouseEvent } from 'react'

import { Button } from '../../../shared/ui/Button'
import type { EstadoPedido } from '../types/pedido'
import { ETIQUETA_AVANZAR, SIGUIENTE_ESTADO } from '../utils/estados'

interface PedidoAccionesProps {
  estado: EstadoPedido
  onAvanzar: (siguiente: EstadoPedido) => void
  onCancelar: () => void
  deshabilitado?: boolean
  grande?: boolean
}

/** Botones del admin según la máquina de estados: avanzar y cancelar (si no es terminal). */
export function PedidoAcciones({ estado, onAvanzar, onCancelar, deshabilitado, grande = false }: PedidoAccionesProps) {
  const siguiente = SIGUIENTE_ESTADO[estado]
  if (!siguiente) return <span className="tag-label">TERMINAL</span>

  const parar = (accion: () => void) => (e: MouseEvent) => {
    e.stopPropagation()
    accion()
  }

  return (
    <>
      <Button
        size={grande ? 'md' : 'sm'}
        variant="primary-to-accent"
        disabled={deshabilitado}
        onClick={parar(() => onAvanzar(siguiente))}
      >
        {ETIQUETA_AVANZAR[estado]}
      </Button>
      <Button size={grande ? 'md' : 'sm'} variant="danger-outline" disabled={deshabilitado} onClick={parar(onCancelar)}>
        {grande ? 'Cancelar pedido' : 'Cancelar'}
      </Button>
    </>
  )
}
