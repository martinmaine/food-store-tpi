from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.deps import require_role
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.service import UsuarioService
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix="/admin/usuarios", tags=["Usuarios (admin)"])

AdminUser = Annotated[UserPublic, Depends(require_role(["admin"]))]


def get_usuario_service() -> UsuarioService:
    return UsuarioService(UsuarioUnitOfWork())


ServiceDep = Annotated[UsuarioService, Depends(get_usuario_service)]


@router.get("", response_model=list[UserPublic], summary="Listado de usuarios")
def listar_usuarios(_: AdminUser, service: ServiceDep) -> list[UserPublic]:
    return service.listar()


@router.post("/{usuario_id}/activar", response_model=UserPublic, summary="Activar usuario")
def activar_usuario(usuario_id: int, _: AdminUser, service: ServiceDep) -> UserPublic:
    return service.activar(usuario_id)


@router.post("/{usuario_id}/desactivar", response_model=UserPublic, summary="Desactivar usuario")
def desactivar_usuario(usuario_id: int, admin: AdminUser, service: ServiceDep) -> UserPublic:
    return service.desactivar(usuario_id, admin.id)
