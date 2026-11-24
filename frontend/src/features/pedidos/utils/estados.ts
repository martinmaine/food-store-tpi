import type { EstadoPedido, FormaPago } from '../types/pedido'

export const ESTADOS: EstadoPedido[] = ['PENDIENTE', 'EN_PREPARACION', 'ENTREGADO', 'CANCELADO']

export const ETIQUETA_ESTADO: Record<EstadoPedido, string> = {
  PENDIENTE: 'Pendiente',
  EN_PREPARACION: 'En preparación',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

/** Próximo estado al "avanzar" (la máquina de estados real vive en el backend). */
export const SIGUIENTE_ESTADO: Partial<Record<EstadoPedido, EstadoPedido>> = {
  PENDIENTE: 'EN_PREPARACION',
  EN_PREPARACION: 'ENTREGADO',
}

export const ETIQUETA_AVANZAR: Partial<Record<EstadoPedido, string>> = {
  PENDIENTE: 'A preparación →',
  EN_PREPARACION: 'Marcar entregado →',
}

export function esTerminal(estado: EstadoPedido): boolean {
  return SIGUIENTE_ESTADO[estado] === undefined
}

export const ETIQUETA_PAGO: Record<FormaPago, string> = {
  EFECTIVO: 'Efectivo',
  TRANSFERENCIA: 'Transferencia',
}

export function unidadesDePedido(items: { cantidad: number }[]): number {
  return items.reduce((acc, item) => acc + item.cantidad, 0)
}
