import { useState, type CSSProperties } from 'react'

import { iniciales, tintePorCategoria } from '../../../shared/utils/format'

interface ProductoThumbProps {
  nombre: string
  categoriaId: number
  imagenUrl?: string | null
  size?: 'sm' | 'md'
}

/** Miniatura de producto: imagen si existe; si no, un "plato" con las iniciales. */
export function ProductoThumb({ nombre, categoriaId, imagenUrl, size = 'md' }: ProductoThumbProps) {
  const [rota, setRota] = useState(false)
  const estilo = { '--tint': tintePorCategoria(categoriaId) } as CSSProperties
  const conImagen = !!imagenUrl && !rota

  return (
    <div className={`thumb ${size === 'sm' ? 'thumb--sm' : ''}`} style={estilo} aria-hidden>
      {conImagen ? (
        <img src={imagenUrl ?? ''} alt="" loading="lazy" onError={() => setRota(true)} />
      ) : size === 'sm' ? (
        iniciales(nombre)
      ) : (
        <span className="thumb__plate">{iniciales(nombre)}</span>
      )}
    </div>
  )
}
