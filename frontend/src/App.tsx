import { useEffect } from 'react'

import { AppRouter } from './routes/AppRouter'
import { Toaster } from './shared/ui/Toaster'
import { useAuthStore } from './store/authStore'

export function App() {
  const checkSession = useAuthStore((s) => s.checkSession)

  // Única llamada en useEffect: confirmar la sesión con /auth/me al montar.
  useEffect(() => {
    void checkSession()
  }, [checkSession])

  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  )
}
