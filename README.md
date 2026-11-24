# Food Store — Sistema de pedidos de comida
 
Trabajo Práctico Integrador · **Programación 4** · Tecnicatura Universitaria en Programación a Distancia
 
**Alumno:** Martín Maine
 
| | |
|---|---|
| 🔗 **Repositorio** | https://github.com/martinmaine/food-store-tpi |
| 🎥 **Video de demostración** | _PEGAR ACÁ EL LINK PÚBLICO DEL VIDEO (YouTube / Drive)_ |
 
Aplicación web completa para un negocio de comidas: los clientes se registran, recorren el catálogo, arman un carrito y confirman pedidos indicando la dirección y la forma de pago (efectivo o transferencia). El administrador gestiona categorías, productos, stock, pedidos y usuarios desde un panel.
 
- **Backend:** FastAPI + SQLModel + PostgreSQL, arquitectura en capas (Router → Service → Unit of Work → Repository → Model), JWT en cookie HttpOnly y autorización por roles.
- **Frontend:** React + TypeScript (Vite), Tailwind CSS, TanStack Query, TanStack Form, TanStack Table, Zustand y Axios.
---
 
## Requisitos
 
| Herramienta | Versión |
|---|---|
| Python | 3.11, 3.12 o 3.13 (SQLModel 0.0.22 **no** funciona con 3.14) |
| PostgreSQL | 15 o superior (para desarrollo también se acepta SQLite) |
| Node.js | 20.19 o superior |
| pnpm | 9 o superior (`npm install -g pnpm`) |
 
---
 
## Estructura del repositorio
 
```
food-store-tpi/
├── backend/            API REST (FastAPI)
│   ├── app/
│   │   ├── main.py     App, CORS con credenciales y routers bajo /api/v1
│   │   ├── core/       config, database, security, deps, unit_of_work, base_repository
│   │   ├── modules/    auth, usuarios, categorias, productos, pedidos
│   │   │               (router · service · unit_of_work · repository · models · schemas)
│   │   └── db/seed.py  Carga inicial idempotente
│   ├── requirements.txt
│   └── .env.example
├── frontend/           Aplicación React + TypeScript
│   ├── src/
│   │   ├── features/   auth, categorias, productos, pedidos, usuarios
│   │   │               (pages · components · hooks · api · types)
│   │   ├── shared/     api (axios, errores, queryClient), ui, components, layout, hooks, utils
│   │   ├── store/      authStore, cartStore (Zustand + persist), toastStore
│   │   ├── routes/     AppRouter y ProtectedRoute
│   │   ├── style.css   Estilos globales: tokens de diseño y clases de componentes
│   │   └── index.css   @import "tailwindcss" + style.css
│   ├── package.json
│   ├── pnpm-workspace.yaml   Configuración de pnpm (permite el build de esbuild)
│   └── .env.example
├── .gitignore
└── README.md
```
 
---
 
## 1. Backend
 
### 1.1 Crear la base de datos (PostgreSQL)
 
```bash
# con psql (usuario postgres)
psql -U postgres -c "CREATE DATABASE foodstore_db;"
```
 
También se puede crear desde **pgAdmin**: clic derecho en *Databases → Create → Database…* con el nombre `foodstore_db`.
 
> Alternativa sin PostgreSQL: en el `.env` usar `DATABASE_URL=sqlite:///./foodstore.db` (no hace falta crear nada).
 
### 1.2 Instalar y configurar
 
```bash
cd backend
 
# entorno virtual
python -m venv venv
# Si la versión por defecto es Python 3.14, crear el entorno con otra versión:
#   Windows: py -3.12 -m venv venv
# Activar:
#   Windows (PowerShell): Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#                         .\venv\Scripts\Activate.ps1
#   Windows (cmd):        venv\Scripts\activate
#   Linux / macOS:        source venv/bin/activate
 
pip install -r requirements.txt
 
# variables de entorno
cp .env.example .env        # Windows: copy .env.example .env
# editar .env si el usuario/contraseña de PostgreSQL no es postgres/postgres
```
 
### 1.3 Cargar datos iniciales (seed)
 
```bash
python -m app.db.seed
```
 
Crea las tablas y carga el usuario **admin**, un cliente de prueba, 5 categorías y 12 productos con stock. Es **idempotente**: se puede ejecutar varias veces sin duplicar datos.
 
### 1.4 Ejecutar
 
```bash
uvicorn app.main:app --reload
```
 
- API: http://localhost:8000/api/v1
- Documentación Swagger: http://localhost:8000/docs
- Documentación ReDoc: http://localhost:8000/redoc
### 1.5 Variables de entorno (`backend/.env`)
 
| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Conexión a la base | `postgresql://postgres:postgres@localhost:5432/foodstore_db` (o `sqlite:///./foodstore.db`) |
| `SECRET_KEY` | Firma del JWT (mínimo 32 caracteres) | `cambiar-esta-clave-de-al-menos-32-caracteres` |
| `ALGORITHM` | Algoritmo del JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiración del token y de la cookie | `30` |
| `FRONTEND_ORIGIN` | Origen permitido en CORS (con credenciales) | `http://localhost:5173` |
 
---
 
## 2. Frontend
 
### 2.1 Instalar y configurar
 
```bash
cd frontend
pnpm install
 
cp .env.example .env        # Windows: copy .env.example .env
```
 
### 2.2 Ejecutar
 
```bash
pnpm build     # compila y verifica los tipos (TypeScript strict)
pnpm dev       # servidor de desarrollo
```
 
Abrir http://localhost:5173 (el backend tiene que estar corriendo).
 
### 2.3 Variables de entorno (`frontend/.env`)
 
| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `http://localhost:8000/api/v1` |
 
---
 
## 3. Usuarios del seed
 
| Rol | Usuario | Contraseña |
|---|---|---|
| **admin** | `admin` | `Admin1234!` |
| user (cliente de prueba) | `lucia` | `Lucia1234` |
 
En la pantalla de login hay botones para completar estas credenciales con un clic. También se puede crear una cuenta nueva desde **Registrarse** (siempre con rol `user`).
 
---
 
## 4. Funcionalidades
 
### Cliente (`user`)
- Registro e inicio de sesión (TanStack Form con validación).
- Catálogo paginado en el servidor, con búsqueda por nombre, filtro por categoría y “solo disponibles”, skeleton mientras carga y estado vacío.
- Carrito persistido en el navegador (Zustand + `persist`): cantidades limitadas al stock, subtotal y total.
- Checkout con dirección (5 a 200 caracteres), forma de pago (efectivo / transferencia) y notas.
- «Mis pedidos»: listado con filtros por estado, detalle, progreso y cancelación solo en `PENDIENTE`.
### Administrador (`admin`)
- **Resumen:** ingresos de pedidos entregados, pedidos de hoy y cantidad por estado.
- **Pedidos:** tabla (TanStack Table) con filtro por estado, detalle y botones para avanzar o cancelar según la máquina de estados.
- **Productos:** ABM con TanStack Table y TanStack Form, cambio de stock y disponibilidad, baja lógica.
- **Categorías:** ABM con baja lógica (el nombre queda reservado).
- **Usuarios:** listado, activar y desactivar (el admin no puede desactivarse a sí mismo).
### Reglas de negocio (backend)
| Regla | Dónde |
|---|---|
| RN-01 Crear pedido en una sola transacción (stock, copia de nombre y precio, total) | `modules/pedidos/service.py` → `PedidoService.crear` |
| RN-02 Máquina de estados (`TRANSICIONES`) | `modules/pedidos/service.py` |
| RN-03 Cancelar restituye el stock en la misma transacción | `PedidoService._transicionar` |
| RN-04 Permisos por dueño y rol | `PedidoService.obtener / cancelar / listar` + `require_role` |
| RN-05 Líneas y total inmutables (no hay PUT ni DELETE de pedidos) | `modules/pedidos/router.py` |
| RN-06 Forma de pago y dirección validadas en el schema | `modules/pedidos/schemas.py` → `PedidoCreate` |
| Commit / rollback únicamente en el Unit of Work | `core/unit_of_work.py` → `__exit__` |
 
---
 
## 5. Notas técnicas
 
- **Sesión:** el login (`POST /auth/token`) deja el JWT en la cookie **HttpOnly** `access_token`. El token nunca viaja en el cuerpo ni se guarda en el frontend; Axios usa `withCredentials: true`.
- **Interceptor de Axios:** ante un 401 (fuera de `/auth/token` y `/auth/me`) o un 400 «Cuenta de usuario desactivada», limpia el `authStore` y `ProtectedRoute` redirige a `/login`.
- **Estado:** TanStack Query maneja los datos del servidor (con invalidación tras cada mutación); Zustand maneja la sesión (`authStore`, persiste solo el usuario) y el carrito (`cartStore`).
- **Diseño:** paleta, tipografías y componentes definidos en `frontend/src/style.css`. Las animaciones 3D usan three.js, que se carga con `import()` dinámico (no afecta la carga inicial).
 