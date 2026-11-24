import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import * as api from '../api/usuarios'

export const usuariosKeys = {
  all: ['usuarios'] as const,
}

export function useUsuarios(enabled = true) {
  return useQuery({
    queryKey: usuariosKeys.all,
    queryFn: api.listarUsuarios,
    enabled,
  })
}

export function useActivarUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.activarUsuario(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usuariosKeys.all }),
  })
}

export function useDesactivarUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.desactivarUsuario(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usuariosKeys.all }),
  })
}
