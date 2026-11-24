import { useState } from 'react'

import { handleApiError } from '../../../shared/api/handleApiError'
import { ConfirmDialog, type ConfirmacionConfig } from '../../../shared/components/ConfirmDialog'
import { EstadoError } from '../../../shared/components/EstadoError'
import { AdminHeader } from '../../../shared/layout/AdminHeader'
import { Button } from '../../../shared/ui/Button'
import { toast } from '../../../store/toastStore'
import { useProductos } from '../../productos/hooks/useProductos'
import { CategoriaFormModal } from '../components/CategoriaFormModal'
import { CategoriasTable, type FilaCategoria } from '../components/CategoriasTable'
import {
  useActualizarCategoria,
  useCategorias,
  useCrearCategoria,
  useEliminarCategoria,
} from '../hooks/useCategorias'
import type { Categoria, CategoriaInput } from '../types/categoria'

type ModalAbierto = { categoria: Categoria | null } | null

export function AdminCategoriasPage() {
  const [modal, setModal] = useState<ModalAbierto>(null)
  const [confirmacion, setConfirmacion] = useState<ConfirmacionConfig | null>(null)

  const { data: categorias = [], isPending, isError, error, refetch } = useCategorias()
  // Para contar productos activos por categoría.
  const { data: productos } = useProductos({ limit: 100 })

  const crear = useCrearCategoria()
  const actualizar = useActualizarCategoria()
  const eliminar = useEliminarCategoria()

  const filas: FilaCategoria[] = categorias.map((c) => ({
    ...c,
    cantidadProductos: productos?.items.filter((p) => p.categoria_id === c.id).length ?? 0,
  }))

  const cerrarModal = () => {
    setModal(null)
    crear.reset()
    actualizar.reset()
  }

  const guardar = (datos: CategoriaInput) => {
    if (!modal) return
    const opciones = {
      onSuccess: () => {
        toast.ok(modal.categoria ? 'Categoría actualizada' : 'Categoría creada')
        cerrarModal()
      },
    }
    if (modal.categoria) actualizar.mutate({ id: modal.categoria.id, payload: datos }, opciones)
    else crear.mutate(datos, opciones)
  }

  const pedirBaja = (c: Categoria) =>
    setConfirmacion({
      titulo: '¿Dar de baja la categoría?',
      mensaje: `«${c.nombre}» pasa a inactiva. Su nombre sigue reservado y sus productos no se ocultan: para retirarlos del catálogo dalos de baja también.`,
      textoConfirmar: 'Dar de baja',
      onConfirmar: () =>
        eliminar.mutate(c.id, {
          onSuccess: () => toast.ok(`Categoría ${c.nombre} dada de baja`),
          onError: (e) => toast.error(handleApiError(e)),
          onSettled: () => setConfirmacion(null),
        }),
    })

  const errorForm = crear.error ?? actualizar.error

  return (
    <>
      <AdminHeader
        titulo="Categorías"
        endpoint="/categorias"
        accion={
          <Button variant="accent" onClick={() => setModal({ categoria: null })}>
            + Nueva categoría
          </Button>
        }
      />

      {isError ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
      ) : (
        <CategoriasTable
          categorias={filas}
          cargando={isPending}
          onEditar={(c) => setModal({ categoria: c })}
          onBaja={pedirBaja}
        />
      )}

      {modal && (
        <CategoriaFormModal
          categoria={modal.categoria}
          guardando={crear.isPending || actualizar.isPending}
          errorServidor={errorForm ? handleApiError(errorForm) : ''}
          onGuardar={guardar}
          onClose={cerrarModal}
        />
      )}

      <ConfirmDialog config={confirmacion} cargando={eliminar.isPending} onClose={() => setConfirmacion(null)} />
    </>
  )
}
