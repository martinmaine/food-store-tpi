import { axiosInstance } from '../../../shared/api/axiosInstance'
import type {
  FiltrosProductos,
  Producto,
  ProductoInput,
  ProductosPaginados,
  ProductoStockUpdate,
} from '../types/producto'

export async function listarProductos(filtros: FiltrosProductos): Promise<ProductosPaginados> {
  // Se omiten los filtros vacíos para no mandar "search=" o "categoria_id=undefined".
  const params = Object.fromEntries(
    Object.entries(filtros).filter(([, valor]) => valor !== undefined && valor !== ''),
  )
  const { data } = await axiosInstance.get<ProductosPaginados>('/productos', { params })
  return data
}

export async function obtenerProducto(id: number): Promise<Producto> {
  const { data } = await axiosInstance.get<Producto>(`/productos/${id}`)
  return data
}

export async function crearProducto(payload: ProductoInput): Promise<Producto> {
  const { data } = await axiosInstance.post<Producto>('/productos', payload)
  return data
}

export async function actualizarProducto(id: number, payload: Partial<ProductoInput>): Promise<Producto> {
  const { data } = await axiosInstance.put<Producto>(`/productos/${id}`, payload)
  return data
}

export async function actualizarStock(id: number, payload: Partial<ProductoStockUpdate>): Promise<Producto> {
  const { data } = await axiosInstance.patch<Producto>(`/productos/${id}/stock`, payload)
  return data
}

export async function eliminarProducto(id: number): Promise<void> {
  await axiosInstance.delete(`/productos/${id}`)
}
