import { Button } from '../ui/Button'

interface EstadoErrorProps {
  mensaje: string
  onReintentar?: () => void
}

export function EstadoError({ mensaje, onReintentar }: EstadoErrorProps) {
  return (
    <div className="empty-state empty-state--compact empty-state--error" role="alert">
      <span className="empty-state__big">!</span>
      <h3 className="empty-state__title">No pudimos cargar los datos</h3>
      <p className="empty-state__text">{mensaje}</p>
      {onReintentar && <Button onClick={onReintentar}>Reintentar</Button>}
    </div>
  )
}
