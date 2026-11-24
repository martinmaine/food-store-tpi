interface PaginacionProps {
  /** Página actual, base 0. */
  pagina: number
  totalPaginas: number
  onCambiar: (pagina: number) => void
  /** Variante compacta para tablas del panel, con etiqueta "1–8 de 20". */
  compacta?: boolean
  etiqueta?: string
}

export function Paginacion({ pagina, totalPaginas, onCambiar, compacta = false, etiqueta }: PaginacionProps) {
  if (totalPaginas <= 1) return null
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i)

  const controles = (
    <div className="flex items-center gap-1.5 flex-wrap">
      <button
        type="button"
        className="pager__btn"
        disabled={pagina === 0}
        onClick={() => onCambiar(pagina - 1)}
      >
        {compacta ? '←' : '← Anterior'}
      </button>
      {paginas.map((i) => (
        <button
          type="button"
          key={i}
          className={`pager__page ${i === pagina ? 'pager__page--active' : ''}`}
          aria-current={i === pagina ? 'page' : undefined}
          onClick={() => onCambiar(i)}
        >
          {i + 1}
        </button>
      ))}
      <button
        type="button"
        className="pager__btn"
        disabled={pagina >= totalPaginas - 1}
        onClick={() => onCambiar(pagina + 1)}
      >
        {compacta ? '→' : 'Siguiente →'}
      </button>
    </div>
  )

  return (
    <nav className={`pager ${compacta ? 'pager--sm' : ''}`} aria-label="Paginación">
      {compacta && <span className="tag-label">{etiqueta}</span>}
      {controles}
    </nav>
  )
}
