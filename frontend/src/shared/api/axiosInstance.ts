import axios, { AxiosError } from 'axios'

/** Cliente HTTP único. La cookie HttpOnly viaja sola gracias a withCredentials. */
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',
  withCredentials: true,
})

const CUENTA_DESACTIVADA = 'Cuenta de usuario desactivada'
const RUTAS_SIN_LIMPIEZA = ['/auth/token', '/auth/me']

/**
 * Registra el interceptor de respuesta. Se llama una vez desde main.tsx con la
 * acción que limpia la sesión (evita una dependencia circular con authStore).
 * - 401 fuera de /auth/token y /auth/me  → la sesión venció: se limpia el authStore.
 * - 400 «Cuenta de usuario desactivada» → se limpia el authStore.
 * ProtectedRoute se encarga de llevar a /login al quedar sin usuario.
 */
export function setupInterceptors(onSesionInvalida: () => void): void {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (error instanceof AxiosError && error.response) {
        const { status, data } = error.response
        const url = error.config?.url ?? ''
        const detail = (data as { detail?: unknown } | undefined)?.detail
        const esRutaAuth = RUTAS_SIN_LIMPIEZA.some((ruta) => url.endsWith(ruta))

        if ((status === 401 && !esRutaAuth) || (status === 400 && detail === CUENTA_DESACTIVADA)) {
          onSesionInvalida()
        }
      }
      return Promise.reject(error)
    },
  )
}
