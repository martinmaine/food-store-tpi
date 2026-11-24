import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  titulo: ReactNode
  onClose: () => void
  children: ReactNode
  /** Botones al pie (Volver / Guardar). */
  acciones?: ReactNode
  ancho?: 'normal' | 'wide'
}

export function Modal({ titulo, onClose, children, acciones, ancho = 'normal' }: ModalProps) {
  // Cerrar con Escape y bloquear el scroll del fondo mientras está abierto.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflowPrevio
    }
  }, [onClose])

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal ${ancho === 'wide' ? 'modal--wide' : ''}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 className="modal__title">{titulo}</h2>
          <button type="button" className="icon-btn" aria-label="Cerrar" onClick={onClose}>
            ×
          </button>
        </div>
        {children}
        {acciones && <div className="modal__actions">{acciones}</div>}
      </div>
    </div>,
    document.body,
  )
}
