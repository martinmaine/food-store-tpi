import type { EstadoPedido } from '../types/pedido'

const PASOS = ['Recibido', 'En preparación', 'Entregado'] as const
const ORDEN: EstadoPedido[] = ['PENDIENTE', 'EN_PREPARACION', 'ENTREGADO']

/** Barra de progreso de 3 pasos (no se muestra para pedidos cancelados). */
export function PedidoProgreso({ estado }: { estado: EstadoPedido }) {
  const actual = ORDEN.indexOf(estado)
  return (
    <div className="progress" aria-label={`Progreso: ${PASOS[actual] ?? ''}`}>
      {PASOS.map((paso, i) => {
        const clases = [
          'progress__step',
          i < actual ? 'progress__step--done' : '',
          i === actual ? 'progress__step--current' : '',
          i === actual && i === PASOS.length - 1 ? 'progress__step--final' : '',
        ].join(' ')
        return (
          <div key={paso} className={clases}>
            <div className="progress__bar" />
            <span>{paso}</span>
          </div>
        )
      })}
    </div>
  )
}
