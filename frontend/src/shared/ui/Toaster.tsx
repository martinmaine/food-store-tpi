import { useToastStore } from '../../store/toastStore'

/** Muestra las notificaciones apiladas abajo a la derecha. */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const cerrar = useToastStore((s) => s.cerrar)
  return (
    <div className="toaster" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast ${t.tipo === 'error' ? 'toast--error' : ''}`}
          onClick={() => cerrar(t.id)}
        >
          {t.mensaje}
        </div>
      ))}
    </div>
  )
}
