import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import * as api from '../api/productos'
import type { FiltrosProductos, ProductoInput, ProductoStockUpdate } from '../types/producto'

export const productosKeys = {
  all: ['productos'] as const,
  list: (filtros: FiltrosProductos) => ['productos', filtros] as const,
}

/** Listado paginado en el servidor. keepPreviousData evita parpadeos al cambiar de página. */
export function useProductos(filtros: FiltrosProductos) {
  return useQuery({
    queryKey: productosKeys.list(filtros),
    queryFn: () => api.listarProductos(filtros),
    placeholderData: keepPreviousData,
  })
}

function useInvalidarProductos() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: productosKeys.all })
}

export function useCrearProducto() {
  const invalidar = useInvalidarProductos()
  return useMutation({
    mutationFn: (payload: ProductoInput) => api.crearProducto(payload),
    onSuccess: invalidar,
  })
}

export function useActualizarProducto() {
  const invalidar = useInvalidarProductos()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<ProductoInput> }) =>
      api.actualizarProducto(id, payload),
    onSuccess: invalidar,
  })
}

export function useActualizarStock() {
  const invalidar = useInvalidarProductos()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<ProductoStockUpdate> }) =>
      api.actualizarStock(id, payload),
    onSuccess: invalidar,
  })
}

export function useEliminarProducto() {
  const invalidar = useInvalidarProductos()
  return useMutation({
    mutationFn: (id: number) => api.eliminarProducto(id),
    onSuccess: invalidar,
  })
}
