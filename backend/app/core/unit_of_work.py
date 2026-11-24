from types import TracebackType

from sqlmodel import Session

from app.core.database import session_factory


class UnitOfWork:
    """Unit of Work base.

    Abre la sesión en __enter__. En __exit__ hace commit si no hubo excepción
    o rollback si la hubo, y siempre cierra la sesión. Es el único lugar
    del proyecto donde se llama a session.commit().
    """

    session: Session

    def __init__(self) -> None:
        self._session_factory = session_factory

    def __enter__(self) -> "UnitOfWork":
        self.session = self._session_factory()
        self._init_repositories()
        return self

    def _init_repositories(self) -> None:
        """Las subclases crean aquí sus repositorios sobre self.session."""

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        tb: TracebackType | None,
    ) -> None:
        try:
            if exc_type is None:
                self.session.commit()
            else:
                self.session.rollback()
        finally:
            self.session.close()

    def flush(self) -> None:
        """Envía los cambios pendientes a la base (sin confirmar) para obtener ids."""
        self.session.flush()
