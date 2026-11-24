from app.core.unit_of_work import UnitOfWork
from app.modules.pedidos.repository import PedidoRepository
from app.modules.productos.repository import ProductoRepository


class PedidoUnitOfWork(UnitOfWork):
    """Repositorios de pedidos y de productos sobre la MISMA sesión: el descuento
    y la restitución de stock quedan en la misma transacción que el pedido."""

    pedidos: PedidoRepository
    productos: ProductoRepository

    def _init_repositories(self) -> None:
        self.pedidos = PedidoRepository(self.session)
        self.productos = ProductoRepository(self.session)
