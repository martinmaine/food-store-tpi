import { useRef, useState } from 'react'

import { handleApiError } from '../../../shared/api/handleApiError'
import { EstadoError } from '../../../shared/components/EstadoError'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { Paginacion } from '../../../shared/components/Paginacion'
import { SkeletonGrid } from '../../../shared/components/Skeleton'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import { Footer } from '../../../shared/layout/Footer'
import { Button } from '../../../shared/ui/Button'
import { flyToCart } from '../../../shared/utils/flyToCart'
import { pluralizar } from '../../../shared/utils/format'
import { useCartStore } from '../../../store/cartStore'
import { toast } from '../../../store/toastStore'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import { CatalogoFiltros } from '../components/CatalogoFiltros'
import { CatalogoHero } from '../components/CatalogoHero'
import { ProductoCard } from '../components/ProductoCard'
import { useProductos } from '../hooks/useProductos'
import type { Producto } from '../types/producto'

const POR_PAGINA = 8

export function CatalogoPage() {
  const menuRef = useRef<HTMLElement>(null)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined)
  const [soloDisponibles, setSoloDisponibles] = useState(false)
  const [pagina, setPagina] = useState(0)
  const busquedaDebounced = useDebounce(busqueda.trim(), 300)

  const { data: categorias = [] } = useCategorias()
  // Paginación en el servidor: skip = página × limit.
  const { data, isFetching, isError, error, refetch } = useProductos({
    skip: pagina * POR_PAGINA,
    limit: POR_PAGINA,
    search: busquedaDebounced || undefined,
    categoria_id: categoriaId,
    disponible: soloDisponibles ? true : undefined,
  })

  const itemsCarrito = useCartStore((s) => s.items)
  const agregar = useCartStore((s) => s.agregar)

  const total = data?.total ?? 0
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA))

  const irAlMenu = () => {
    const top = (menuRef.current?.offsetTop ?? 0) - 70
    window.scrollTo({ top, behavior: 'smooth' })
  }

  // Cualquier cambio de filtro vuelve a la primera página.
  const conReinicio =
    <T,>(setter: (v: T) => void) =>
    (valor: T) => {
      setter(valor)
      setPagina(0)
    }

  const limpiarFiltros = () => {
    setBusqueda('')
    setCategoriaId(undefined)
    setSoloDisponibles(false)
    setPagina(0)
  }

  const agregarAlCarrito = (producto: Producto, boton: HTMLButtonElement) => {
    const resultado = agregar({
      producto_id: producto.id,
      nombre: producto.nombre,
      precio_unitario: producto.precio_base,
      stock: producto.stock,
      categoria_id: producto.categoria_id,
      imagen_url: producto.imagen_url,
    })
    if (resultado === 'sin-stock') {
      toast.error(`No hay más stock de ${producto.nombre}`)
      return
    }
    flyToCart(boton)
    toast.ok(`${producto.nombre} al carrito`)
  }

  return (
    <main className="anim-page">
      <CatalogoHero onVerMenu={irAlMenu} />

      <section ref={menuRef} className="contenedor" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <div className="flex items-end justify-between gap-5 flex-wrap mb-[22px]">
          <h2 className="section-title">El menú</h2>
          <span className="tag-label" style={{ fontSize: 13, color: 'var(--color-texto-suave)' }}>
            {pluralizar(total, 'producto', 'productos')} · página {pagina + 1} de {totalPaginas}
          </span>
        </div>

        <CatalogoFiltros
          busqueda={busqueda}
          onBusqueda={conReinicio(setBusqueda)}
          categorias={categorias}
          categoriaId={categoriaId}
          onCategoria={conReinicio(setCategoriaId)}
          soloDisponibles={soloDisponibles}
          onSoloDisponibles={conReinicio(setSoloDisponibles)}
        />

        {isError ? (
          <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
        ) : !data ? (
          <SkeletonGrid cantidad={POR_PAGINA} />
        ) : data.items.length === 0 ? (
          <EstadoVacio
            grande="0"
            titulo="No encontramos nada con esos filtros"
            texto="Probá con otra palabra o mirá todas las categorías."
            accion={<Button onClick={limpiarFiltros}>Limpiar filtros</Button>}
          />
        ) : (
          <div className="product-grid" style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity .2s' }}>
            {data.items.map((p, i) => (
              <ProductoCard
                key={p.id}
                producto={p}
                delay={i * 0.05}
                enCarrito={itemsCarrito.find((it) => it.producto_id === p.id)?.cantidad ?? 0}
                onAgregar={agregarAlCarrito}
              />
            ))}
          </div>
        )}

        <Paginacion
          pagina={pagina}
          totalPaginas={totalPaginas}
          onCambiar={(p) => {
            setPagina(p)
            irAlMenu()
          }}
        />
      </section>

      <Footer />
    </main>
  )
}