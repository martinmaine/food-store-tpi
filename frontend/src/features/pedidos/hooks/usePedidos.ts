import { keepPreviousData, useQuery } from '@tanstack/react-query'

import * as api from '../api/pedidos'
import type { FiltrosPedidos } from '../types/pedido'

export const pedidosKeys = {
  all: ['pedidos'] as const,
  list: (filtros: FiltrosPedidos) => ['pedidos', 'lista', filtros] as const,
  resumen: ['pedidos', 'resumen'] as const,
}

/** Pedidos propios (user) o todos (admin): el backend decide según la sesión. */
export function usePedidos(filtros: FiltrosPedidos) {
  return useQuery({
    queryKey: pedidosKeys.list(filtros),
    queryFn: () => api.listarPedidos(filtros),
    placeholderData: keepPreviousData,
  })
}
