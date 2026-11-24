import { Donut3D } from '../../../shared/components/Donut3D'
import { useCountUp } from '../../../shared/hooks/useCountUp'
import { BadgeEstado } from '../../../shared/ui/BadgeEstado'
import { formatPrecio } from '../../../shared/utils/format'
import type { EstadoPedido, ResumenPedidos } from '../types/pedido'

interface TarjetaIngresosProps {
  ingresos: number
  entregados: number
}

export function TarjetaIngresos({ ingresos, entregados }: TarjetaIngresosProps) {
  const valor = useCountUp(ingresos)
  return (
    <div className="stat-hero">
      <div className="stat-hero__visual">
        <Donut3D distancia={9} mini oscuro />
      </div>
      <span className="eyebrow">Ingresos de pedidos entregados</span>
      <div className="pointer-events-none">
        <span className="stat-hero__value">{formatPrecio(Math.round(valor))}</span>
        <span className="stat-hero__caption">Suma del total de {entregados} pedidos entregados</span>
      </div>
    </div>
  )
}

export function TarjetaHoy({ cantidad }: { cantidad: number }) {
  const valor = useCountUp(cantidad)
  return (
    <div className="stat-today">
      <div className="flex flex-col gap-2">
        <span className="eyebrow">Pedidos de hoy</span>
        <span style={{ fontSize: 15 }}>Creados desde las 00:00</span>
      </div>
      <span className="stat-today__value">{Math.round(valor)}</span>
    </div>
  )
}

interface TarjetaEstadoProps {
  estado: EstadoPedido
  cantidad: number
  onClick: () => void
}

export function TarjetaEstado({ estado, cantidad, onClick }: TarjetaEstadoProps) {
  const valor = useCountUp(cantidad)
  return (
    <button type="button" className="stat-card" onClick={onClick}>
      <span className="stat-card__top">
        <BadgeEstado estado={estado} sinPunto />
        <span style={{ fontSize: 18 }}>↗</span>
      </span>
      <span className="stat-card__value">{Math.round(valor)}</span>
    </button>
  )
}

/** Cantidad por estado a partir del resumen del backend. */
export function cantidadPorEstado(resumen: ResumenPedidos): Record<EstadoPedido, number> {
  return {
    PENDIENTE: resumen.pendientes,
    EN_PREPARACION: resumen.en_preparacion,
    ENTREGADO: resumen.entregados,
    CANCELADO: resumen.cancelados,
  }
}
