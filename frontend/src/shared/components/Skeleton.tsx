/** Tarjeta "fantasma" que se muestra mientras carga el catálogo. */
export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden>
      <div className="shimmer" style={{ aspectRatio: '4 / 3', borderRadius: 16 }} />
      <div className="shimmer" style={{ height: 20, width: '70%', borderRadius: 8 }} />
      <div className="skeleton-block" style={{ height: 12, width: '90%' }} />
      <div className="flex justify-between items-center">
        <div className="skeleton-block" style={{ height: 22, width: '35%' }} />
        <div className="skeleton-block" style={{ width: 46, height: 46, borderRadius: '50%' }} />
      </div>
    </div>
  )
}

export function SkeletonGrid({ cantidad = 8 }: { cantidad?: number }) {
  return (
    <div className="product-grid" aria-busy="true" aria-label="Cargando productos">
      {Array.from({ length: cantidad }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

/** Filas fantasma para tablas del panel. */
export function SkeletonRows({ filas = 5 }: { filas?: number }) {
  return (
    <div className="flex flex-col gap-3 p-5" aria-busy="true">
      {Array.from({ length: filas }, (_, i) => (
        <div key={i} className="shimmer" style={{ height: 38, borderRadius: 12 }} />
      ))}
    </div>
  )
}
