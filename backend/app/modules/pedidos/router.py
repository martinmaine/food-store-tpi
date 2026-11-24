from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.deps import CurrentUser, require_role
from app.modules.pedidos.schemas import (
    CambioEstado,
    EstadoPedido,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.service import (
    PedidoAjeno,
    PedidoNoEncontrado,
    PedidoService,
    ProductoNoEncontrado,
    ReglaDeNegocio,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.usuarios.schemas import UserPublic

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


def get_pedido_service() -> PedidoService:
    return PedidoService(PedidoUnitOfWork())


ServiceDep = Annotated[PedidoService, Depends(get_pedido_service)]
AdminUser = Annotated[UserPublic, Depends(require_role(["admin"]))]


def _traducir(e: Exception) -> HTTPException:
    """Traduce las excepciones de dominio a códigos HTTP."""
    if isinstance(e, (PedidoNoEncontrado, ProductoNoEncontrado)):
        return HTTPException(status.HTTP_404_NOT_FOUND, str(e))
    if isinstance(e, PedidoAjeno):
        return HTTPException(status.HTTP_403_FORBIDDEN, str(e))
    return HTTPException(status.HTTP_400_BAD_REQUEST, str(e))


_ERRORES = (PedidoNoEncontrado, ProductoNoEncontrado, PedidoAjeno, ReglaDeNegocio)


@router.post(
    "",
    response_model=PedidoRead,
    status_code=status.HTTP_201_CREATED,
    summary="Crea un pedido desde el carrito (RN-01)",
)
def crear_pedido(data: PedidoCreate, user: CurrentUser, service: ServiceDep) -> PedidoRead:
    try:
        return service.crear(data, user)
    except _ERRORES as e:
        raise _traducir(e) from e


@router.get("", response_model=PedidosPaginados, summary="Pedidos propios (user) o todos (admin)")
def listar_pedidos(
    user: CurrentUser,
    service: ServiceDep,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    estado: EstadoPedido | None = None,
) -> PedidosPaginados:
    return service.listar(user, estado=estado, skip=skip, limit=limit)


# Se declara ANTES de /{pedido_id} para que "resumen" no se tome como id.
@router.get("/resumen", response_model=ResumenPedidos, summary="Indicadores del panel (admin)")
def resumen_pedidos(_: AdminUser, service: ServiceDep) -> ResumenPedidos:
    return service.resumen()


@router.get("/{pedido_id}", response_model=PedidoRead, summary="Detalle de un pedido (dueño o admin)")
def obtener_pedido(pedido_id: int, user: CurrentUser, service: ServiceDep) -> PedidoRead:
    try:
        return service.obtener(pedido_id, user)
    except _ERRORES as e:
        raise _traducir(e) from e


@router.patch(
    "/{pedido_id}/estado",
    response_model=PedidoRead,
    summary="Avanza o cancela un pedido según la máquina de estados (admin)",
)
def cambiar_estado(
    pedido_id: int, data: CambioEstado, _: AdminUser, service: ServiceDep
) -> PedidoRead:
    try:
        return service.cambiar_estado(pedido_id, data.estado)
    except _ERRORES as e:
        raise _traducir(e) from e


@router.patch(
    "/{pedido_id}/cancelar",
    response_model=PedidoRead,
    summary="El dueño cancela su pedido en PENDIENTE (RN-03, RN-04)",
)
def cancelar_pedido(pedido_id: int, user: CurrentUser, service: ServiceDep) -> PedidoRead:
    try:
        return service.cancelar(pedido_id, user)
    except _ERRORES as e:
        raise _traducir(e) from e
