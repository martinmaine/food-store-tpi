import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { useState, type CSSProperties } from 'react'

import { DataTable } from '../../../shared/components/DataTable'
import { Button } from '../../../shared/ui/Button'
import { codigoPedido, tintePorCategoria } from '../../../shared/utils/format'
import type { Categoria } from '../types/categoria'

export interface FilaCategoria extends Categoria {
  cantidadProductos: number
}

interface CategoriasTableProps {
  categorias: FilaCategoria[]
  cargando: boolean
  onEditar: (categoria: Categoria) => void
  onBaja: (categoria: Categoria) => void
}

const col = createColumnHelper<FilaCategoria>()

export function CategoriasTable({ categorias, cargando, onEditar, onBaja }: CategoriasTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: false }])

  const columnas = [
    col.accessor('id', {
      header: 'ID',
      cell: (info) => (
        <span className="mono muted font-semibold" style={{ fontSize: 13 }}>
          {codigoPedido(info.getValue())}
        </span>
      ),
    }),
    col.accessor('nombre', {
      header: 'Nombre',
      cell: ({ row }) => (
        <span className="flex items-center gap-2.5 font-semibold">
          <span className="color-dot" style={{ '--tint': tintePorCategoria(row.original.id) } as CSSProperties} />
          {row.original.nombre}
        </span>
      ),
    }),
    col.accessor('descripcion', {
      header: 'Descripción',
      enableSorting: false,
      cell: (info) => <span style={{ color: 'var(--color-texto-medio)' }}>{info.getValue() ?? '—'}</span>,
    }),
    col.accessor('cantidadProductos', {
      header: 'Productos',
      cell: (info) => <span className="mono">{info.getValue()}</span>,
    }),
    col.display({
      id: 'acciones',
      header: 'Acciones',
      meta: { align: 'right' },
      cell: ({ row }) => (
        <>
          <Button size="sm" onClick={() => onEditar(row.original)}>
            Editar
          </Button>
          <Button size="sm" variant="danger-outline" onClick={() => onBaja(row.original)}>
            Baja
          </Button>
        </>
      ),
    }),
  ]

  const table = useReactTable({
    data: categorias,
    columns: columnas,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  })

  return (
    <DataTable
      table={table}
      columnas="80px minmax(160px,1fr) minmax(220px,2fr) 120px 190px"
      anchoMinimo={870}
      cargando={cargando}
      textoVacio="No hay categorías activas."
    />
  )
}
