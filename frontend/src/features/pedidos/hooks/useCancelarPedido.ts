import { useMutation, useQueryClient } from '@tanstack/react-query'

import * as api from '../api/pedidos'
import { pedidosKeys } from './usePedidos'

/** Cliente dueño: cancela su pedido en PENDIENTE (el backend restituye el stock). */
export function useCancelarPedido() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.cancelarPedido(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: pedidosKeys.all })
      void queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })
}
