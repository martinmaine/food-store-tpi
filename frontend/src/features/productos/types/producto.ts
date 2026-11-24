import type { Categoria } from '../../categorias/types/categoria'

/** Espejo de ProductoRead. */
export interface Producto {
  id: number
  nombre: string
  descripcion: string | null
  precio_base: number
  imagen_url: string | null
  stock: number
  disponible: boolean
  activo: boolean
  categoria_id: number
  categoria: Categoria
}

/** Espejo de ProductoCreate / ProductoUpdate. */
export interface ProductoInput {
  nombre: string
  descripcion: string | null
  precio_base: number
  imagen_url: string | null
  stock: number
  disponible: boolean
  categoria_id: number
}

/** Espejo de ProductoStockUpdate. */
export interface ProductoStockUpdate {
  stock: number
  disponible: boolean
}

/** Espejo de ProductosPaginados. */
export interface ProductosPaginados {
  total: number
  items: Producto[]
}

export interface FiltrosProductos {
  skip?: number
  limit?: number
  search?: string
  categoria_id?: number
  disponible?: boolean
}
