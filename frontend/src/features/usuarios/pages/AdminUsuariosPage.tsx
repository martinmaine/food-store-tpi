import { handleApiError } from '../../../shared/api/handleApiError'
import { EstadoError } from '../../../shared/components/EstadoError'
import { AdminHeader } from '../../../shared/layout/AdminHeader'
import { useAuthStore } from '../../../store/authStore'
import { toast } from '../../../store/toastStore'
import { UsuariosTable } from '../components/UsuariosTable'
import { useActivarUsuario, useDesactivarUsuario, useUsuarios } from '../hooks/useUsuarios'
import type { Usuario } from '../types/usuario'

export function AdminUsuariosPage() {
  const idSesion = useAuthStore((s) => s.usuario?.id)
  const { data: usuarios = [], isPending, isError, error, refetch } = useUsuarios()
  const activar = useActivarUsuario()
  const desactivar = useDesactivarUsuario()

  const onActivar = (u: Usuario) =>
    activar.mutate(u.id, {
      onSuccess: () => toast.ok(`${u.username} activado`),
      onError: (e) => toast.error(handleApiError(e)),
    })

  const onDesactivar = (u: Usuario) =>
    desactivar.mutate(u.id, {
      onSuccess: () => toast.ok(`${u.username} desactivado`),
      onError: (e) => toast.error(handleApiError(e)),
    })

  return (
    <>
      <AdminHeader titulo="Usuarios" endpoint="/admin/usuarios" />
      {isError ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
      ) : (
        <UsuariosTable
          usuarios={usuarios}
          idSesion={idSesion}
          cargando={isPending}
          ocupado={activar.isPending || desactivar.isPending}
          onActivar={onActivar}
          onDesactivar={onDesactivar}
        />
      )}
    </>
  )
}
