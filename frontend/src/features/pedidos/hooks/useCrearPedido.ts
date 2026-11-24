import { useMutation, useQueryClient } from '@tanstack/react-query'

import * as api from '../api/pedidos'
import type { PedidoCreate } from '../types/pedido'
import { pedidosKeys } from './usePedidos'

export function useCrearPedido() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: PedidoCreate) => api.crearPedido(payload),
    onSuccess: () => {
      // El pedido descontó stock: se refrescan pedidos y catálogo.
      void queryClient.invalidateQueries({ queryKey: pedidosKeys.all })
      void queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })
}
