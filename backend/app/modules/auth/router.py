from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.deps import COOKIE_NAME, CurrentUser
from app.modules.auth.schemas import MensajeResponse
from app.modules.auth.service import AuthService
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix="/auth", tags=["Auth"])


def get_auth_service() -> AuthService:
    return AuthService(UsuarioUnitOfWork())


ServiceDep = Annotated[AuthService, Depends(get_auth_service)]


@router.post(
    "/register",
    response_model=UserPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Registro público (rol user)",
)
def register(data: UserCreate, service: ServiceDep) -> UserPublic:
    return service.registrar(data)


@router.post("/token", response_model=MensajeResponse, summary="Login: deja el JWT en una cookie HttpOnly")
def login(
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    service: ServiceDep,
) -> MensajeResponse:
    token = service.login(form_data.username, form_data.password)
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,  # en producción con HTTPS: True
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    # El token NO viaja en el cuerpo de la respuesta.
    return MensajeResponse(message="Login exitoso")


@router.post("/logout", response_model=MensajeResponse, summary="Logout: borra la cookie")
def logout(response: Response) -> MensajeResponse:
    response.delete_cookie(key=COOKIE_NAME, path="/", httponly=True, samesite="lax")
    return MensajeResponse(message="Sesión cerrada")


@router.get("/me", response_model=UserPublic, summary="Usuario autenticado")
def me(current_user: CurrentUser) -> UserPublic:
    return current_user
