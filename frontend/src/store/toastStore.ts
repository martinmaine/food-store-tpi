import { create } from 'zustand'

export type TipoToast = 'ok' | 'error'

export interface Toast {
  id: number
  mensaje: string
  tipo: TipoToast
}

interface ToastState {
  toasts: Toast[]
  mostrar: (mensaje: string, tipo?: TipoToast) => void
  cerrar: (id: number) => void
}

let siguienteId = 1

/** Notificaciones efímeras de la interfaz (estado del cliente, sin persistencia). */
export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  mostrar: (mensaje, tipo = 'ok') => {
    const id = siguienteId++
    set((state) => ({ toasts: [...state.toasts, { id, mensaje, tipo }] }))
    window.setTimeout(() => get().cerrar(id), 3200)
  },
  cerrar: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

/** Atajo para usar fuera de componentes (por ejemplo en onSuccess de una mutación). */
export const toast = {
  ok: (mensaje: string) => useToastStore.getState().mostrar(mensaje, 'ok'),
  error: (mensaje: string) => useToastStore.getState().mostrar(mensaje, 'error'),
}
