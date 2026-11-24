import { Outlet } from 'react-router-dom'

import { Navbar } from './Navbar'

/** Reúne la Navbar y el contenido de la ruta de la tienda. */
export function MainLayout() {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      <Outlet />
    </div>
  )
}
