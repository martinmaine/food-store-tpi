import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

export interface ConfirmacionConfig {
  titulo: string
  mensaje: string
  textoConfirmar: string
  peligro?: boolean
  onConfirmar: () => void
}

interface ConfirmDialogProps {
  config: ConfirmacionConfig | null
  onClose: () => void
  cargando?: boolean
}

/** Modal de confirmación reutilizable para acciones destructivas. */
export function ConfirmDialog({ config, onClose, cargando = false }: ConfirmDialogProps) {
  if (!config) return null
  return (
    <Modal
      titulo={config.titulo}
      onClose={onClose}
      acciones={
        <>
          <Button variant="ghost" onClick={onClose}>
            Volver
          </Button>
          <Button
            variant={config.peligro === false ? 'primary' : 'danger'}
            loading={cargando}
            onClick={config.onConfirmar}
          >
            {config.textoConfirmar}
          </Button>
        </>
      }
    >
      <p className="modal__body-text">{config.mensaje}</p>
    </Modal>
  )
}
