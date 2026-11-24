from datetime import datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.productos.models import Producto
    from app.modules.usuarios.models import Usuario


class Pedido(SQLModel, table=True):
    """Pedido de un usuario. No se borra: se cancela."""

    __tablename__ = "pedidos"

    id: int | None = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuarios.id", nullable=False, index=True)
    estado: str = Field(default="PENDIENTE", nullable=False, index=True)
    forma_pago: str = Field(nullable=False)  # EFECTIVO | TRANSFERENCIA
    direccion_entrega: str = Field(nullable=False, min_length=5, max_length=200)
    notas: str | None = Field(default=None)
    total: float = Field(default=0, nullable=False)  # Σ subtotales; fijo desde la creación
    created_at: datetime = Field(default_factory=datetime.now, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.now, nullable=False)

    usuario: "Usuario" = Relationship(back_populates="pedidos")
    # Composición: las líneas pertenecen al pedido.
    items: list["DetallePedido"] = Relationship(
        back_populates="pedido",
        sa_relationship_kwargs={"cascade": "all, delete-orphan", "order_by": "DetallePedido.id"},
    )


class DetallePedido(SQLModel, table=True):
    """Línea inmutable del pedido: copia nombre y precio del producto (RN-05)."""

    __tablename__ = "detalles_pedido"

    id: int | None = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="pedidos.id", nullable=False, index=True)
    producto_id: int = Field(foreign_key="productos.id", nullable=False, index=True)
    cantidad: int = Field(nullable=False, ge=1)
    nombre_producto: str = Field(nullable=False)
    precio_unitario: float = Field(nullable=False)
    subtotal: float = Field(nullable=False)

    pedido: "Pedido" = Relationship(back_populates="items")
    producto: "Producto" = Relationship(back_populates="detalles")
