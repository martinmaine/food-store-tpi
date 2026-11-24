import { useMutation, useQueryClient } from '@tanstack/react-query'

import * as api from '../api/pedidos'
import type { EstadoPedido } from '../types/pedido'
import { pedidosKeys } from './usePedidos'

/** Admin: avanza o cancela un pedido según la máquina de estados. */
export function useCambiarEstadoPedido() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoPedido }) => api.cambiarEstadoPedido(id, estado),
    onSuccess: (_pedido, { estado }) => {
      void queryClient.invalidateQueries({ queryKey: pedidosKeys.all })
      // Al cancelar se restituye stock.
      if (estado === 'CANCELADO') void queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })
}
