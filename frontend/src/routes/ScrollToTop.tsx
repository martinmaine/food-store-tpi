import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Lleva el scroll arriba al cambiar de ruta. */
export function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
