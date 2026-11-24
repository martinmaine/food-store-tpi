import { AxiosError } from 'axios'

interface ErrorDeValidacion {
  msg: string
  loc?: (string | number)[]
}

/** Convierte el `detail` que devuelve la API en un mensaje legible para la pantalla. */
export function handleApiError(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (error instanceof AxiosError) {
    if (!error.response) return 'No se pudo conectar con el servidor'
    const detail = (error.response.data as { detail?: unknown } | undefined)?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) {
      return (detail as ErrorDeValidacion[])
        .map((e) => {
          const campo = e.loc?.[e.loc.length - 1]
          return campo ? `${String(campo)}: ${e.msg}` : e.msg
        })
        .join(' · ')
    }
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}
