import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import * as api from '../api/categorias'
import type { CategoriaInput } from '../types/categoria'

export const categoriasKeys = {
  all: ['categorias'] as const,
}

export function useCategorias() {
  return useQuery({
    queryKey: categoriasKeys.all,
    queryFn: api.listarCategorias,
    staleTime: 60_000,
  })
}

/** Al cambiar una categoría se invalidan también los productos (muestran su categoría). */
function useInvalidarCatalogo() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: categoriasKeys.all })
    void queryClient.invalidateQueries({ queryKey: ['productos'] })
  }
}

export function useCrearCategoria() {
  const invalidar = useInvalidarCatalogo()
  return useMutation({
    mutationFn: (payload: CategoriaInput) => api.crearCategoria(payload),
    onSuccess: invalidar,
  })
}

export function useActualizarCategoria() {
  const invalidar = useInvalidarCatalogo()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CategoriaInput> }) =>
      api.actualizarCategoria(id, payload),
    onSuccess: invalidar,
  })
}

export function useEliminarCategoria() {
  const invalidar = useInvalidarCatalogo()
  return useMutation({
    mutationFn: (id: number) => api.eliminarCategoria(id),
    onSuccess: invalidar,
  })
}
