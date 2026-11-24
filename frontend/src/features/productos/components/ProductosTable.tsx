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
import { Toggle } from '../../../shared/ui/Toggle'
import { formatPrecio } from '../../../shared/utils/format'
import type { Producto } from '../types/producto'
import { ProductoThumb } from './ProductoThumb'

interface ProductosTableProps {
  productos: Producto[]
  cargando: boolean
  onToggleDisponible: (producto: Producto) => void
  onStock: (producto: Producto) => void
  onEditar: (producto: Producto) => void
  onBaja: (producto: Producto) => void
}

const col = createColumnHelper<Producto>()

function colorStock(stock: number): string {
  if (stock === 0) return 'var(--color-rojo)'
  if (stock <= 5) return 'var(--color-terracota)'
  return 'var(--color-oliva)'
}

export function ProductosTable({ productos, cargando, onToggleDisponible, onStock, onEditar, onBaja }: ProductosTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columnas = [
    col.accessor('nombre', {
      header: 'Producto',
      cell: ({ row }) => (
        <span className="cell-product">
          <ProductoThumb
            size="sm"
            nombre={row.original.nombre}
            categoriaId={row.original.categoria_id}
            imagenUrl={row.original.imagen_url}
          />
          <span className="cell-product__text">
            <span className="font-semibold">{row.original.nombre}</span>
            <span className="cell-product__desc">{row.original.descripcion}</span>
          </span>
        </span>
      ),
    }),
    col.accessor((p) => p.categoria.nombre, { id: 'categoria', header: 'Categoría' }),
    col.accessor('precio_base', {
      header: 'Precio',
      cell: (info) => <span className="font-semibold">{formatPrecio(info.getValue())}</span>,
    }),
    col.accessor('stock', {
      header: 'Stock',
      cell: (info) => {
        const stock = info.getValue()
        return (
          <span className="stock-meter" style={{ '--stock-color': colorStock(stock) } as CSSProperties}>
            <span className="stock-meter__value">{stock} u.</span>
            <span className="stock-meter__track">
              <span className="stock-meter__fill" style={{ width: `${Math.min(100, stock * 3)}%` }} />
            </span>
          </span>
        )
      },
    }),
    col.accessor('disponible', {
      header: 'Disponible',
      sortingFn: 'basic',
      cell: ({ row }) => (
        <Toggle
          size="sm"
          checked={row.original.disponible}
          onChange={() => onToggleDisponible(row.original)}
          label={row.original.disponible ? 'Sí' : 'No'}
        />
      ),
    }),
    col.display({
      id: 'acciones',
      header: 'Acciones',
      meta: { align: 'right' },
      cell: ({ row }) => (
        <>
          <Button size="sm" variant="soft" onClick={() => onStock(row.original)}>
            Stock
          </Button>
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
    data: productos,
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
      columnas="minmax(220px,2fr) 130px 100px 130px 110px 230px"
      anchoMinimo={1040}
      cargando={cargando}
      textoVacio="No hay productos para mostrar."
    />
  )
}
