import { useQuery } from '@tanstack/react-query'

import * as api from '../api/pedidos'
import { pedidosKeys } from './usePedidos'

export function useResumenPedidos(enabled = true) {
  return useQuery({
    queryKey: pedidosKeys.resumen,
    queryFn: api.obtenerResumen,
    enabled,
  })
}
