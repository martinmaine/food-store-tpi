import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { handleApiError } from '../../../shared/api/handleApiError'
import { ConfirmDialog, type ConfirmacionConfig } from '../../../shared/components/ConfirmDialog'
import { EstadoError } from '../../../shared/components/EstadoError'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { SkeletonRows } from '../../../shared/components/Skeleton'
import { StatusTabs, type TabOpcion } from '../../../shared/components/StatusTabs'
import { Button } from '../../../shared/ui/Button'
import { codigoPedido } from '../../../shared/utils/format'
import { toast } from '../../../store/toastStore'
import { PedidoCard } from '../components/PedidoCard'
import { useCancelarPedido } from '../hooks/useCancelarPedido'
import { usePedidos } from '../hooks/usePedidos'
import type { EstadoPedido, Pedido } from '../types/pedido'
import { ESTADOS, ETIQUETA_ESTADO } from '../utils/estados'

type Filtro = EstadoPedido | 'TODOS'

interface EstadoNavegacion {
  nuevoPedidoId?: number
}

export function MisPedidosPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const nuevoPedidoId = (location.state as EstadoNavegacion | null)?.nuevoPedidoId
  const [filtro, setFiltro] = useState<Filtro>('TODOS')
  const [abierto, setAbierto] = useState<number | null>(nuevoPedidoId ?? null)
  const [confirmacion, setConfirmacion] = useState<ConfirmacionConfig | null>(null)

  // El backend devuelve solo los pedidos del usuario de la sesión.
  const { data, isPending, isError, error, refetch } = usePedidos({ limit: 100 })
  const cancelar = useCancelarPedido()

  const pedidos = data?.items ?? []
  const visibles = filtro === 'TODOS' ? pedidos : pedidos.filter((p) => p.estado === filtro)
  const tabs: TabOpcion<Filtro>[] = [
    { valor: 'TODOS', etiqueta: 'Todos', cantidad: pedidos.length },
    ...ESTADOS.map((e) => ({
      valor: e,
      etiqueta: ETIQUETA_ESTADO[e],
      cantidad: pedidos.filter((p) => p.estado === e).length,
    })),
  ]

  const pedirCancelacion = (pedido: Pedido) =>
    setConfirmacion({
      titulo: '¿Cancelar el pedido?',
      mensaje: `El pedido ${codigoPedido(pedido.id)} pasará a CANCELADO y el stock de sus productos se restituye. No se puede deshacer.`,
      textoConfirmar: 'Sí, cancelar',
      onConfirmar: () =>
        cancelar.mutate(pedido.id, {
          onSuccess: () => toast.ok(`Pedido ${codigoPedido(pedido.id)} cancelado · stock restituido`),
          onError: (e) => toast.error(handleApiError(e)),
          onSettled: () => setConfirmacion(null),
        }),
    })

  return (
    <main className="page page--narrow anim-page">
      <h1 className="page-title" style={{ marginBottom: 24 }}>
        Mis pedidos
      </h1>
      <div className="mb-6">
        <StatusTabs opciones={tabs} valor={filtro} onCambiar={setFiltro} />
      </div>

      {isError ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
      ) : isPending ? (
        <SkeletonRows filas={4} />
      ) : visibles.length === 0 ? (
        <EstadoVacio
          compacto
          titulo="No hay pedidos para mostrar"
          accion={<Button onClick={() => navigate('/')}>Hacer un pedido</Button>}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {visibles.map((pedido, i) => (
            <PedidoCard
              key={pedido.id}
              pedido={pedido}
              delay={i * 0.05}
              abierto={abierto === pedido.id}
              destacado={nuevoPedidoId === pedido.id}
              onToggle={() => setAbierto(abierto === pedido.id ? null : pedido.id)}
              onCancelar={() => pedirCancelacion(pedido)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog config={confirmacion} cargando={cancelar.isPending} onClose={() => setConfirmacion(null)} />
    </main>
  )
}
