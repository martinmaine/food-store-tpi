export interface TabOpcion<T extends string> {
  valor: T
  etiqueta: string
  cantidad?: number
}

interface StatusTabsProps<T extends string> {
  opciones: TabOpcion<T>[]
  valor: T
  onCambiar: (valor: T) => void
}

/** Pestañas tipo "pill" con contador, usadas para filtrar por estado. */
export function StatusTabs<T extends string>({ opciones, valor, onCambiar }: StatusTabsProps<T>) {
  return (
    <div className="tabs" role="tablist">
      {opciones.map((op) => (
        <button
          key={op.valor}
          type="button"
          role="tab"
          aria-selected={op.valor === valor}
          className={`tab ${op.valor === valor ? 'tab--active' : ''}`}
          onClick={() => onCambiar(op.valor)}
        >
          {op.etiqueta}
          {op.cantidad !== undefined && <span className="tab__count">{op.cantidad}</span>}
        </button>
      ))}
    </div>
  )
}
