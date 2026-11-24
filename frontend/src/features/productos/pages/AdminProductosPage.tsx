import { useState } from 'react'

import { handleApiError } from '../../../shared/api/handleApiError'
import { ConfirmDialog, type ConfirmacionConfig } from '../../../shared/components/ConfirmDialog'
import { EstadoError } from '../../../shared/components/EstadoError'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import { AdminHeader } from '../../../shared/layout/AdminHeader'
import { Button } from '../../../shared/ui/Button'
import { Input, Select } from '../../../shared/ui/Input'
import { toast } from '../../../store/toastStore'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import { ProductoFormModal } from '../components/ProductoFormModal'
import { ProductosTable } from '../components/ProductosTable'
import { StockModal } from '../components/StockModal'
import {
  useActualizarProducto,
  useActualizarStock,
  useCrearProducto,
  useEliminarProducto,
  useProductos,
} from '../hooks/useProductos'
import type { Producto, ProductoInput, ProductoStockUpdate } from '../types/producto'

type ModalAbierto = { tipo: 'form'; producto: Producto | null } | { tipo: 'stock'; producto: Producto } | null

export function AdminProductosPage() {
  const [busqueda, setBusqueda] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [modal, setModal] = useState<ModalAbierto>(null)
  const [confirmacion, setConfirmacion] = useState<ConfirmacionConfig | null>(null)
  const busquedaDebounced = useDebounce(busqueda.trim(), 300)

  // El panel pide limit=100 y pagina del lado del cliente con TanStack Table.
  const { data, isPending, isError, error, refetch } = useProductos({
    limit: 100,
    search: busquedaDebounced || undefined,
    categoria_id: categoriaId ? Number(categoriaId) : undefined,
  })
  const { data: categorias = [] } = useCategorias()

  const crear = useCrearProducto()
  const actualizar = useActualizarProducto()
  const actualizarStock = useActualizarStock()
  const eliminar = useEliminarProducto()

  const cerrarModal = () => {
    setModal(null)
    crear.reset()
    actualizar.reset()
    actualizarStock.reset()
  }

  const guardarProducto = (datos: ProductoInput) => {
    if (modal?.tipo !== 'form') return
    const opciones = {
      onSuccess: () => {
        toast.ok(modal.producto ? 'Producto actualizado' : 'Producto creado')
        cerrarModal()
      },
    }
    if (modal.producto) actualizar.mutate({ id: modal.producto.id, payload: datos }, opciones)
    else crear.mutate(datos, opciones)
  }

  const guardarStock = (datos: ProductoStockUpdate) => {
    if (modal?.tipo !== 'stock') return
    actualizarStock.mutate(
      { id: modal.producto.id, payload: datos },
      {
        onSuccess: () => {
          toast.ok('Stock actualizado')
          cerrarModal()
        },
      },
    )
  }

  const toggleDisponible = (p: Producto) =>
    actualizarStock.mutate(
      { id: p.id, payload: { disponible: !p.disponible } },
      {
        onSuccess: () => toast.ok(`${p.nombre}: ${p.disponible ? 'no disponible' : 'disponible'}`),
        onError: (e) => toast.error(handleApiError(e)),
      },
    )

  const pedirBaja = (p: Producto) =>
    setConfirmacion({
      titulo: '¿Dar de baja el producto?',
      mensaje: `${p.nombre} deja de mostrarse en el catálogo (baja lógica: activo = false). Los pedidos existentes conservan su copia.`,
      textoConfirmar: 'Dar de baja',
      onConfirmar: () =>
        eliminar.mutate(p.id, {
          onSuccess: () => toast.ok(`${p.nombre} dado de baja`),
          onError: (e) => toast.error(handleApiError(e)),
          onSettled: () => setConfirmacion(null),
        }),
    })

  const errorForm = crear.error ?? actualizar.error

  return (
    <>
      <AdminHeader
        titulo="Productos"
        endpoint="/productos?limit=100"
        accion={
          <Button variant="accent" onClick={() => setModal({ tipo: 'form', producto: null })}>
            + Nuevo producto
          </Button>
        }
      />

      <div className="toolbar">
        <Input
          variante="pill"
          type="search"
          placeholder="Buscar producto…"
          aria-label="Buscar producto"
          className="max-w-[340px]"
          style={{ flex: '1 1 240px' }}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <Select
          variante="pill"
          className="input--auto"
          aria-label="Filtrar por categoría"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </Select>
      </div>

      {isError ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
      ) : (
        <ProductosTable
          productos={data?.items ?? []}
          cargando={isPending}
          onToggleDisponible={toggleDisponible}
          onStock={(p) => setModal({ tipo: 'stock', producto: p })}
          onEditar={(p) => setModal({ tipo: 'form', producto: p })}
          onBaja={pedirBaja}
        />
      )}

      {modal?.tipo === 'form' && (
        <ProductoFormModal
          producto={modal.producto}
          categorias={categorias}
          guardando={crear.isPending || actualizar.isPending}
          errorServidor={errorForm ? handleApiError(errorForm) : ''}
          onGuardar={guardarProducto}
          onClose={cerrarModal}
        />
      )}
      {modal?.tipo === 'stock' && (
        <StockModal
          producto={modal.producto}
          guardando={actualizarStock.isPending}
          errorServidor={actualizarStock.error ? handleApiError(actualizarStock.error) : ''}
          onGuardar={guardarStock}
          onClose={cerrarModal}
        />
      )}

      <ConfirmDialog config={confirmacion} cargando={eliminar.isPending} onClose={() => setConfirmacion(null)} />
    </>
  )
}
