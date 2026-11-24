import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'

import { DataTable } from '../../../shared/components/DataTable'
import { BadgeEstado } from '../../../shared/ui/BadgeEstado'
import { codigoPedido, formatFechaHora, formatPrecio } from '../../../shared/utils/format'
import type { EstadoPedido, Pedido } from '../types/pedido'
import { ETIQUETA_PAGO, unidadesDePedido } from '../utils/estados'
import { PedidoAcciones } from './PedidoAcciones'

/** Fila de la tabla: el pedido más el nombre del cliente resuelto. */
export interface FilaPedido extends Pedido {
  cliente: string
}

interface PedidosTableProps {
  pedidos: FilaPedido[]
  cargando: boolean
  ocupado: boolean
  onVer: (pedido: FilaPedido) => void
  onAvanzar: (pedido: FilaPedido, siguiente: EstadoPedido) => void
  onCancelar: (pedido: FilaPedido) => void
}

const col = createColumnHelper<FilaPedido>()

export function PedidosTable({ pedidos, cargando, ocupado, onVer, onAvanzar, onCancelar }: PedidosTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }])

  const columnas = [
    col.accessor('id', {
      header: 'Pedido',
      cell: (info) => <span className="mono font-semibold" style={{ fontSize: 13 }}>{codigoPedido(info.getValue())}</span>,
    }),
    col.accessor('cliente', { header: 'Cliente', cell: (info) => <span className="font-semibold">{info.getValue()}</span> }),
    col.accessor('created_at', {
      header: 'Fecha',
      cell: (info) => <span className="muted">{formatFechaHora(info.getValue())}</span>,
    }),
    col.accessor((p) => unidadesDePedido(p.items), {
      id: 'unidades',
      header: 'Uds.',
      cell: (info) => <span className="mono">{info.getValue()}</span>,
    }),
    col.accessor('forma_pago', { header: 'Pago', enableSorting: false, cell: (info) => ETIQUETA_PAGO[info.getValue()] }),
    col.accessor('total', {
      header: 'Total',
      cell: (info) => <span className="font-bold">{formatPrecio(info.getValue())}</span>,
    }),
    col.accessor('estado', { header: 'Estado', cell: (info) => <BadgeEstado estado={info.getValue()} size="sm" /> }),
    col.display({
      id: 'acciones',
      header: 'Acciones',
      meta: { align: 'right' },
      cell: ({ row }) => (
        <PedidoAcciones
          estado={row.original.estado}
          deshabilitado={ocupado}
          onAvanzar={(siguiente) => onAvanzar(row.original, siguiente)}
          onCancelar={() => onCancelar(row.original)}
        />
      ),
    }),
  ]

  const table = useReactTable({
    data: pedidos,
    columns: columnas,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
    autoResetPageIndex: true,
  })

  return (
    <DataTable
      table={table}
      columnas="80px minmax(120px,1fr) 120px 50px 110px 100px 140px 210px"
      anchoMinimo={1060}
      cargando={cargando}
      textoVacio="No hay pedidos para este filtro."
      onFilaClick={onVer}
    />
  )
}
