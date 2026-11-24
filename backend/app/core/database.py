from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

_connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(settings.DATABASE_URL, connect_args=_connect_args)


def create_all_tables() -> None:
    """Crea todas las tablas registradas en SQLModel.metadata."""
    # Importar los modelos para que queden registrados en la metadata.
    from app.modules.categorias import models as _categorias  # noqa: F401
    from app.modules.pedidos import models as _pedidos  # noqa: F401
    from app.modules.productos import models as _productos  # noqa: F401
    from app.modules.usuarios import models as _usuarios  # noqa: F401

    SQLModel.metadata.create_all(engine)


def session_factory() -> Session:
    """Devuelve una sesión nueva. El Unit of Work es quien la abre y la cierra."""
    return Session(engine, expire_on_commit=False)
