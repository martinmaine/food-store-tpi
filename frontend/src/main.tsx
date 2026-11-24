import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import './index.css'
import { setupInterceptors } from './shared/api/axiosInstance'
import { queryClient } from './shared/api/queryClient'
import { useAuthStore } from './store/authStore'

// Ante sesión vencida o cuenta desactivada, el interceptor limpia el authStore.
setupInterceptors(() => useAuthStore.getState().limpiar())

const root = document.getElementById('root')
if (!root) throw new Error('No se encontró el elemento #root')

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
