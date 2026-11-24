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
import { Avatar } from '../../../shared/ui/Avatar'
import { Button } from '../../../shared/ui/Button'
import { formatFecha } from '../../../shared/utils/format'
import type { Usuario } from '../types/usuario'

interface UsuariosTableProps {
  usuarios: Usuario[]
  idSesion: number | undefined
  cargando: boolean
  ocupado: boolean
  onActivar: (usuario: Usuario) => void
  onDesactivar: (usuario: Usuario) => void
}

const col = createColumnHelper<Usuario>()

export function UsuariosTable({ usuarios, idSesion, cargando, ocupado, onActivar, onDesactivar }: UsuariosTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columnas = [
    col.accessor('username', {
      header: 'Usuario',
      cell: ({ row }) => (
        <span className="flex items-center gap-2.5">
          <Avatar nombre={row.original.full_name} size="sm" apagado={row.original.role !== 'admin'} />
          <span className="mono font-semibold" style={{ fontSize: 13 }}>
            {row.original.username}
          </span>
        </span>
      ),
    }),
    col.accessor('full_name', { header: 'Nombre', cell: (info) => <span className="font-semibold">{info.getValue()}</span> }),
    col.accessor('email', { header: 'Email', cell: (info) => <span style={{ color: 'var(--color-texto-medio)' }}>{info.getValue()}</span> }),
    col.accessor('role', {
      header: 'Rol',
      cell: (info) => (
        <span className={`role-badge ${info.getValue() === 'admin' ? 'role-badge--admin' : ''}`}>{info.getValue()}</span>
      ),
    }),
    col.accessor('disabled', {
      header: 'Estado',
      cell: (info) => (
        <span className={`status-dot ${info.getValue() ? 'status-dot--off' : ''}`}>
          {info.getValue() ? 'Inactivo' : 'Activo'}
        </span>
      ),
    }),
    col.accessor('created_at', {
      header: 'Alta',
      cell: (info) => <span className="muted" style={{ fontSize: 13.5 }}>{formatFecha(info.getValue())}</span>,
    }),
    col.display({
      id: 'accion',
      header: 'Acción',
      meta: { align: 'right' },
      cell: ({ row }) => {
        const u = row.original
        // El admin no puede desactivarse a sí mismo: no se muestra el botón en su fila.
        if (u.id === idSesion) return <span className="tag-label">VOS</span>
        return u.disabled ? (
          <Button size="sm" variant="primary-to-accent" disabled={ocupado} onClick={() => onActivar(u)}>
            Activar
          </Button>
        ) : (
          <Button size="sm" variant="danger-outline" disabled={ocupado} onClick={() => onDesactivar(u)}>
            Desactivar
          </Button>
        )
      },
    }),
  ]

  const table = useReactTable({
    data: usuarios,
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
      columnas="minmax(140px,1fr) minmax(130px,1fr) minmax(180px,1.3fr) 90px 100px 110px 120px"
      anchoMinimo={990}
      cargando={cargando}
      textoVacio="No hay usuarios."
      claseFila={(u) => (u.disabled ? 'data-table__row--muted' : '')}
    />
  )
}
