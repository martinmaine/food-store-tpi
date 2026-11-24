import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { handleApiError } from '../../../shared/api/handleApiError'
import { ConfirmDialog, type ConfirmacionConfig } from '../../../shared/components/ConfirmDialog'
import { EstadoError } from '../../../shared/components/EstadoError'
import { StatusTabs, type TabOpcion } from '../../../shared/components/StatusTabs'
import { AdminHeader } from '../../../shared/layout/AdminHeader'
import { codigoPedido } from '../../../shared/utils/format'
import { toast } from '../../../store/toastStore'
import { useUsuarios } from '../../usuarios/hooks/useUsuarios'
import { PedidoDetalleModal } from '../components/PedidoDetalleModal'
import { PedidosTable, type FilaPedido } from '../components/PedidosTable'
import { cantidadPorEstado } from '../components/ResumenCards'
import { useCambiarEstadoPedido } from '../hooks/useCambiarEstadoPedido'
import { usePedidos } from '../hooks/usePedidos'
import { useResumenPedidos } from '../hooks/useResumenPedidos'
import type { EstadoPedido } from '../types/pedido'
import { ESTADOS, ETIQUETA_ESTADO } from '../utils/estados'

type Filtro = EstadoPedido | 'TODOS'

function esEstado(valor: string | null): valor is EstadoPedido {
  return valor !== null && (ESTADOS as string[]).includes(valor)
}

export function AdminPedidosPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const parametro = searchParams.get('estado')
  const filtro: Filtro = esEstado(parametro) ? parametro : 'TODOS'

  const [verId, setVerId] = useState<number | null>(null)
  const [confirmacion, setConfirmacion] = useState<ConfirmacionConfig | null>(null)

  // Filtro por estado en el servidor; el panel pide hasta 100 y pagina del lado del cliente.
  const { data, isPending, isError, error, refetch } = usePedidos({
    limit: 100,
    estado: filtro === 'TODOS' ? undefined : filtro,
  })
  const { data: resumen } = useResumenPedidos()
  const { data: usuarios = [] } = useUsuarios()
  const cambiarEstado = useCambiarEstadoPedido()

  const nombrePorId = new Map(usuarios.map((u) => [u.id, u.full_name]))
  const filas: FilaPedido[] = (data?.items ?? []).map((p) => ({
    ...p,
    cliente: nombrePorId.get(p.usuario_id) ?? `Usuario ${p.usuario_id}`,
  }))
  const pedidoVisto = filas.find((p) => p.id === verId) ?? null

  const conteo = resumen ? cantidadPorEstado(resumen) : undefined
  const tabs: TabOpcion<Filtro>[] = [
    {
      valor: 'TODOS',
      etiqueta: 'Todos',
      cantidad: conteo ? Object.values(conteo).reduce((a, b) => a + b, 0) : undefined,
    },
    ...ESTADOS.map((e) => ({ valor: e, etiqueta: ETIQUETA_ESTADO[e], cantidad: conteo?.[e] })),
  ]

  const cambiarFiltro = (valor: Filtro) => setSearchParams(valor === 'TODOS' ? {} : { estado: valor })

  const aplicar = (pedido: FilaPedido, estado: EstadoPedido) =>
    cambiarEstado.mutate(
      { id: pedido.id, estado },
      {
        onSuccess: () =>
          toast.ok(
            estado === 'CANCELADO'
              ? `Pedido ${codigoPedido(pedido.id)} cancelado · stock restituido`
              : `Pedido ${codigoPedido(pedido.id)} → ${ETIQUETA_ESTADO[estado]}`,
          ),
        onError: (e) => toast.error(handleApiError(e)),
        onSettled: () => setConfirmacion(null),
      },
    )

  const pedirCancelacion = (pedido: FilaPedido) =>
    setConfirmacion({
      titulo: '¿Cancelar el pedido?',
      mensaje: `${codigoPedido(pedido.id)} de ${pedido.cliente} pasará a CANCELADO y se restituirá el stock.`,
      textoConfirmar: 'Cancelar pedido',
      onConfirmar: () => aplicar(pedido, 'CANCELADO'),
    })

  return (
    <>
      <AdminHeader titulo="Pedidos" endpoint="/pedidos" />
      <div className="mb-[18px]">
        <StatusTabs opciones={tabs} valor={filtro} onCambiar={cambiarFiltro} />
      </div>

      {isError ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
      ) : (
        <PedidosTable
          pedidos={filas}
          cargando={isPending}
          ocupado={cambiarEstado.isPending}
          onVer={(p) => setVerId(p.id)}
          onAvanzar={aplicar}
          onCancelar={pedirCancelacion}
        />
      )}

      {pedidoVisto && !confirmacion && (
        <PedidoDetalleModal
          pedido={pedidoVisto}
          cliente={pedidoVisto.cliente}
          ocupado={cambiarEstado.isPending}
          onClose={() => setVerId(null)}
          onAvanzar={(siguiente) => aplicar(pedidoVisto, siguiente)}
          onCancelar={() => pedirCancelacion(pedidoVisto)}
        />
      )}

      <ConfirmDialog config={confirmacion} cargando={cambiarEstado.isPending} onClose={() => setConfirmacion(null)} />
    </>
  )
}
