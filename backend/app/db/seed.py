"""Carga inicial de datos. Es idempotente: se puede ejecutar varias veces.

Uso (desde la carpeta backend/):  python -m app.db.seed
"""

from sqlmodel import Session, select

from app.core.database import create_all_tables, engine
from app.core.security import hash_password
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto
from app.modules.usuarios.models import Usuario

ADMIN = {
    "username": "admin",
    "full_name": "Administrador",
    "email": "admin@foodstore.com",
    "password": "Admin1234!",
}

# Cliente de prueba para la demo (rol user).
CLIENTE_DEMO = {
    "username": "lucia",
    "full_name": "Lucía Fernández",
    "email": "lucia@foodstore.com",
    "password": "Lucia1234",
}

CATEGORIAS: list[tuple[str, str]] = [
    ("Hamburguesas", "Hamburguesas caseras con papas"),
    ("Pizzas", "Pizzas a la piedra"),
    ("Empanadas", "Empanadas al horno, por unidad"),
    ("Bebidas", "Gaseosas, aguas y cervezas"),
    ("Postres", "Postres caseros"),
]

# (nombre, descripción, precio, stock, categoría, imagen)
PRODUCTOS: list[tuple[str, str, float, int, str, str]] = [
    ("Hamburguesa clásica", "Carne, lechuga, tomate y cheddar", 8500, 30, "Hamburguesas",
     "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"),
    ("Hamburguesa doble bacon", "Doble carne, doble cheddar y bacon", 11200, 20, "Hamburguesas",
     "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600"),
    ("Hamburguesa veggie", "Medallón de lentejas y vegetales grillados", 9000, 15, "Hamburguesas",
     "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600"),
    ("Pizza muzzarella", "Salsa de tomate, muzzarella y aceitunas", 9800, 25, "Pizzas",
     "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600"),
    ("Pizza napolitana", "Muzzarella, tomate en rodajas y ajo", 11000, 20, "Pizzas",
     "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600"),
    ("Pizza fugazzeta", "Muzzarella y cebolla", 10500, 18, "Pizzas",
     "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600"),
    ("Empanada de carne", "Carne cortada a cuchillo", 1500, 100, "Empanadas",
     "https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=600"),
    ("Empanada de jamón y queso", "Jamón cocido y muzzarella", 1400, 80, "Empanadas",
     "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600"),
    ("Coca-Cola 1,5 L", "Gaseosa línea regular", 3200, 50, "Bebidas",
     "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600"),
    ("Agua mineral 500 ml", "Sin gas", 1500, 60, "Bebidas",
     "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600"),
    ("Flan casero", "Con dulce de leche", 3500, 12, "Postres",
     "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600"),
    ("Brownie", "Brownie de chocolate con nueces", 3000, 3, "Postres",
     "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600"),
]


def run() -> None:
    create_all_tables()
    with Session(engine) as session:
        # Usuario admin
        if session.exec(select(Usuario).where(Usuario.username == ADMIN["username"])).first() is None:
            session.add(
                Usuario(
                    username=ADMIN["username"],
                    full_name=ADMIN["full_name"],
                    email=ADMIN["email"],
                    hashed_password=hash_password(ADMIN["password"]),
                    role="admin",
                )
            )
            print("[OK] Usuario admin creado (admin / Admin1234!)")
        else:
            print("[--] Usuario admin ya existía")

        # Cliente de prueba
        if session.exec(select(Usuario).where(Usuario.username == CLIENTE_DEMO["username"])).first() is None:
            session.add(
                Usuario(
                    username=CLIENTE_DEMO["username"],
                    full_name=CLIENTE_DEMO["full_name"],
                    email=CLIENTE_DEMO["email"],
                    hashed_password=hash_password(CLIENTE_DEMO["password"]),
                    role="user",
                )
            )
            print("[OK] Usuario cliente creado (lucia / Lucia1234)")

        # Categorías
        categorias: dict[str, Categoria] = {}
        for nombre, descripcion in CATEGORIAS:
            categoria = session.exec(select(Categoria).where(Categoria.nombre == nombre)).first()
            if categoria is None:
                categoria = Categoria(nombre=nombre, descripcion=descripcion)
                session.add(categoria)
                session.flush()
                print(f"[OK] Categoría '{nombre}' creada")
            categorias[nombre] = categoria

        # Productos
        for nombre, descripcion, precio, stock, cat, imagen in PRODUCTOS:
            if session.exec(select(Producto).where(Producto.nombre == nombre)).first() is None:
                session.add(
                    Producto(
                        nombre=nombre,
                        descripcion=descripcion,
                        precio_base=precio,
                        stock=stock,
                        imagen_url=imagen,
                        categoria_id=categorias[cat].id,  # type: ignore[arg-type]
                    )
                )
                print(f"[OK] Producto '{nombre}' creado")

        session.commit()
    print("Seed finalizado.")


if __name__ == "__main__":
    run()
