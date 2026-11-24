import { QueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

/** Instancia única de TanStack Query. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // No reintenta errores del cliente (4xx): no van a cambiar solos.
      retry: (failureCount, error) => {
        if (error instanceof AxiosError && error.response && error.response.status < 500) return false
        return failureCount < 2
      },
    },
  },
})
