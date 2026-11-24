import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface CartItem {
  producto_id: number
  nombre: string
  precio_unitario: number
  cantidad: number
  /** Stock conocido al agregar: limita la cantidad en el carrito (el backend valida igual). */
  stock: number
  categoria_id: number
  imagen_url: string | null
}

export type ProductoParaCarrito = Omit<CartItem, 'cantidad'>

/** Resultado de agregar: permite a la UI mostrar el mensaje adecuado. */
export type ResultadoAgregar = 'agregado' | 'sin-stock'

interface CartState {
  items: CartItem[]
  agregar: (producto: ProductoParaCarrito) => ResultadoAgregar
  quitar: (productoId: number) => void
  cambiarCantidad: (productoId: number, cantidad: number) => void
  vaciar: () => void
  total: () => number
  unidades: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      agregar: (producto) => {
        const actual = get().items.find((i) => i.producto_id === producto.producto_id)
        const cantidad = (actual?.cantidad ?? 0) + 1
        if (cantidad > producto.stock) return 'sin-stock'
        set((state) => ({
          items: actual
            ? state.items.map((i) =>
                i.producto_id === producto.producto_id ? { ...i, ...producto, cantidad } : i,
              )
            : [...state.items, { ...producto, cantidad: 1 }],
        }))
        return 'agregado'
      },

      quitar: (productoId) =>
        set((state) => ({ items: state.items.filter((i) => i.producto_id !== productoId) })),

      cambiarCantidad: (productoId, cantidad) => {
        if (cantidad <= 0) {
          get().quitar(productoId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.producto_id === productoId ? { ...i, cantidad: Math.min(cantidad, i.stock) } : i,
          ),
        }))
      },

      vaciar: () => set({ items: [] }),

      total: () => get().items.reduce((acc, i) => acc + i.precio_unitario * i.cantidad, 0),

      unidades: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),
    }),
    {
      name: 'foodstore-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
