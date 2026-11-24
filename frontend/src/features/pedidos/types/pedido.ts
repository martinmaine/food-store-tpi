export type EstadoPedido = 'PENDIENTE' | 'EN_PREPARACION' | 'ENTREGADO' | 'CANCELADO'
export type FormaPago = 'EFECTIVO' | 'TRANSFERENCIA'

/** Espejo de DetallePedidoRead. */
export interface DetallePedido {
  producto_id: number
  nombre_producto: string
  precio_unitario: number
  cantidad: number
  subtotal: number
}

/** Espejo de PedidoRead. */
export interface Pedido {
  id: number
  usuario_id: number
  estado: EstadoPedido
  forma_pago: FormaPago
  direccion_entrega: string
  notas: string | null
  total: number
  created_at: string
  updated_at: string
  items: DetallePedido[]
}

/** Espejo de ItemPedidoCreate. */
export interface ItemPedidoCreate {
  producto_id: number
  cantidad: number
}

/** Espejo de PedidoCreate. */
export interface PedidoCreate {
  items: ItemPedidoCreate[]
  forma_pago: FormaPago
  direccion_entrega: string
  notas: string | null
}

/** Espejo de PedidosPaginados. */
export interface PedidosPaginados {
  total: number
  items: Pedido[]
}

/** Espejo de ResumenPedidos. */
export interface ResumenPedidos {
  pendientes: number
  en_preparacion: number
  entregados: number
  cancelados: number
  pedidos_hoy: number
  ingresos_entregados: number
}

export interface FiltrosPedidos {
  skip?: number
  limit?: number
  estado?: EstadoPedido
}
