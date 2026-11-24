from typing import Annotated, Callable

from fastapi import Depends, HTTPException, Request, status

from app.core.security import decode_access_token
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

COOKIE_NAME = "access_token"


def get_current_user(request: Request) -> UserPublic:
    """Lee el JWT de la cookie HttpOnly, valida firma y expiración y carga el usuario."""
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No autenticado",
    )
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        raise unauthorized
    username = decode_access_token(token)
    if username is None:
        raise unauthorized
    with UsuarioUnitOfWork() as uow:
        usuario = uow.usuarios.get_by_username(username)
        if usuario is None:
            raise unauthorized
        return UserPublic.model_validate(usuario)


def get_current_active_user(
    current_user: Annotated[UserPublic, Depends(get_current_user)],
) -> UserPublic:
    if current_user.disabled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cuenta de usuario desactivada")
    return current_user


def require_role(roles: list[str]) -> Callable[[UserPublic], UserPublic]:
    """Dependencia que exige uno de los roles indicados (403 si no lo tiene)."""

    def checker(
        current_user: Annotated[UserPublic, Depends(get_current_active_user)],
    ) -> UserPublic:
        if current_user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tenés permisos para esta acción")
        return current_user

    return checker


CurrentUser = Annotated[UserPublic, Depends(get_current_active_user)]
