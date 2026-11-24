import { flexRender, type RowData, type Table } from '@tanstack/react-table'
import type { CSSProperties } from 'react'

import { Paginacion } from './Paginacion'
import { SkeletonRows } from './Skeleton'

declare module '@tanstack/react-table' {
  // Metadatos propios de cada columna (alineación del encabezado y la celda).
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'left' | 'right'
    /** Solo para mantener los genéricos en uso. */
    _tipos?: [TData, TValue]
  }
}

interface DataTableProps<T> {
  table: Table<T>
  /** grid-template-columns de las filas. */
  columnas: string
  anchoMinimo?: number
  cargando?: boolean
  textoVacio?: string
  onFilaClick?: (fila: T) => void
  claseFila?: (fila: T) => string
}

/**
 * Renderiza una tabla de TanStack Table con el diseño del panel (filas en CSS grid),
 * encabezados ordenables y paginación del lado del cliente.
 */
export function DataTable<T>({
  table,
  columnas,
  anchoMinimo = 900,
  cargando = false,
  textoVacio = 'No hay registros para mostrar.',
  onFilaClick,
  claseFila,
}: DataTableProps<T>) {
  const estiloTabla = { '--cols': columnas, '--table-min': `${anchoMinimo}px` } as CSSProperties
  const filas = table.getRowModel().rows
  const { pageIndex, pageSize } = table.getState().pagination
  const total = table.getPrePaginationRowModel().rows.length
  const desde = total === 0 ? 0 : pageIndex * pageSize + 1
  const hasta = Math.min(total, (pageIndex + 1) * pageSize)

  return (
    <>
      <div className="table-card">
        <div className="data-table" style={estiloTabla} role="table">
          {table.getHeaderGroups().map((grupo) => (
            <div key={grupo.id} className="data-table__row data-table__row--head" role="row">
              {grupo.headers.map((header) => {
                const ordenable = header.column.getCanSort()
                const orden = header.column.getIsSorted()
                const derecha = header.column.columnDef.meta?.align === 'right'
                return (
                  <button
                    key={header.id}
                    type="button"
                    role="columnheader"
                    className={[
                      'data-table__th',
                      ordenable ? 'data-table__th--sortable' : '',
                      derecha ? 'data-table__th--right' : '',
                    ].join(' ')}
                    onClick={ordenable ? header.column.getToggleSortingHandler() : undefined}
                    tabIndex={ordenable ? 0 : -1}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {orden === 'asc' ? ' ↑' : orden === 'desc' ? ' ↓' : ''}
                  </button>
                )
              })}
            </div>
          ))}

          {cargando ? (
            <SkeletonRows />
          ) : filas.length === 0 ? (
            <div className="data-table__empty">{textoVacio}</div>
          ) : (
            filas.map((fila) => (
              <div
                key={fila.id}
                role="row"
                className={[
                  'data-table__row',
                  onFilaClick ? 'data-table__row--clickable' : '',
                  claseFila ? claseFila(fila.original) : '',
                ].join(' ')}
                onClick={onFilaClick ? () => onFilaClick(fila.original) : undefined}
              >
                {fila.getVisibleCells().map((celda) => (
                  <div
                    key={celda.id}
                    role="cell"
                    className={celda.column.columnDef.meta?.align === 'right' ? 'data-table__cell--right' : ''}
                  >
                    {flexRender(celda.column.columnDef.cell, celda.getContext())}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      <Paginacion
        compacta
        pagina={pageIndex}
        totalPaginas={table.getPageCount()}
        onCambiar={(p) => table.setPageIndex(p)}
        etiqueta={`${desde}–${hasta} de ${total}`}
      />
    </>
  )
}
