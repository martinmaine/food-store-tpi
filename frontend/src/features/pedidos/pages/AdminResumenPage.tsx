import { useNavigate } from 'react-router-dom'

import { handleApiError } from '../../../shared/api/handleApiError'
import { EstadoError } from '../../../shared/components/EstadoError'
import { SkeletonRows } from '../../../shared/components/Skeleton'
import { AdminHeader } from '../../../shared/layout/AdminHeader'
import { cantidadPorEstado, TarjetaEstado, TarjetaHoy, TarjetaIngresos } from '../components/ResumenCards'
import { useResumenPedidos } from '../hooks/useResumenPedidos'
import { ESTADOS } from '../utils/estados'

export function AdminResumenPage() {
  const navigate = useNavigate()
  const { data: resumen, isPending, isError, error, refetch } = useResumenPedidos()

  return (
    <>
      <AdminHeader titulo="Resumen" endpoint="/pedidos/resumen" />
      {isError ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
      ) : isPending ? (
        <SkeletonRows filas={4} />
      ) : (
        <div className="stats-grid anim-page">
          <TarjetaIngresos ingresos={resumen.ingresos_entregados} entregados={resumen.entregados} />
          <TarjetaHoy cantidad={resumen.pedidos_hoy} />
          {ESTADOS.map((estado) => (
            <TarjetaEstado
              key={estado}
              estado={estado}
              cantidad={cantidadPorEstado(resumen)[estado]}
              onClick={() => navigate(`/admin/pedidos?estado=${estado}`)}
            />
          ))}
        </div>
      )}
    </>
  )
}
