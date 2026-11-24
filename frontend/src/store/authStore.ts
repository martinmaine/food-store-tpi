import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import * as authApi from '../features/auth/api/auth'
import type { Usuario } from '../features/usuarios/types/usuario'
import { queryClient } from '../shared/api/queryClient'

interface AuthState {
  /** Datos públicos del usuario. El token NUNCA se guarda: vive en la cookie HttpOnly. */
  usuario: Usuario | null
  /** true mientras checkSession confirma la sesión con el backend. */
  cargando: boolean
  login: (username: string, password: string) => Promise<Usuario>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  /** Limpia la sesión local (lo usa el interceptor de Axios). */
  limpiar: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,

      login: async (username, password) => {
        await authApi.login(username, password)
        const usuario = await authApi.getMe()
        queryClient.clear()
        set({ usuario })
        return usuario
      },

      logout: async () => {
        try {
          await authApi.logout()
        } finally {
          queryClient.clear()
          set({ usuario: null })
        }
      },

      checkSession: async () => {
        set({ cargando: true })
        try {
          const usuario = await authApi.getMe()
          set({ usuario })
        } catch {
          set({ usuario: null })
        } finally {
          set({ cargando: false })
        }
      },

      limpiar: () => {
        queryClient.clear()
        set({ usuario: null })
      },
    }),
    {
      name: 'foodstore-auth',
      storage: createJSONStorage(() => localStorage),
      // Solo se persiste el usuario (nombre, email, rol). Nunca el token.
      partialize: (state) => ({ usuario: state.usuario }),
    },
  ),
)
