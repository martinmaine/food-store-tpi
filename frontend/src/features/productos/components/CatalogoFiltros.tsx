import { Input } from '../../../shared/ui/Input'
import { Toggle } from '../../../shared/ui/Toggle'
import type { Categoria } from '../../categorias/types/categoria'

interface CatalogoFiltrosProps {
  busqueda: string
  onBusqueda: (valor: string) => void
  categorias: Categoria[]
  categoriaId: number | undefined
  onCategoria: (id: number | undefined) => void
  soloDisponibles: boolean
  onSoloDisponibles: (valor: boolean) => void
}

/** Barra de filtros pegajosa: búsqueda, categorías y "solo disponibles". */
export function CatalogoFiltros({
  busqueda,
  onBusqueda,
  categorias,
  categoriaId,
  onCategoria,
  soloDisponibles,
  onSoloDisponibles,
}: CatalogoFiltrosProps) {
  return (
    <div className="filters">
      <div className="search">
        <Input
          variante="pill"
          type="search"
          placeholder="Buscar por nombre…"
          aria-label="Buscar producto por nombre"
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
        />
      </div>
      <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Filtrar por categoría">
        <button
          type="button"
          className={`pill ${categoriaId === undefined ? 'pill--active' : ''}`}
          onClick={() => onCategoria(undefined)}
        >
          Todas
        </button>
        {categorias.map((c) => (
          <button
            type="button"
            key={c.id}
            className={`pill ${categoriaId === c.id ? 'pill--active' : ''}`}
            onClick={() => onCategoria(c.id)}
          >
            {c.nombre}
          </button>
        ))}
      </div>
      <Toggle className="ml-auto" checked={soloDisponibles} onChange={onSoloDisponibles} label="Solo disponibles" />
    </div>
  )
}
