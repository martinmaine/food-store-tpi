import { useNavigate } from 'react-router-dom'

import { Donut3D } from '../../../shared/components/Donut3D'
import { Button } from '../../../shared/ui/Button'

export function UnauthorizedPage() {
  const navigate = useNavigate()
  return (
    <div className="unauth">
      <span className="unauth__number" aria-hidden>
        403
      </span>
      <div className="unauth__visual">
        <Donut3D distancia={7.5} mini triste />
      </div>
      <h1 className="unauth__title">Esta sección no es para vos</h1>
      <p className="unauth__text">Tu cuenta no tiene el rol necesario para entrar acá.</p>
      <Button size="lg" onClick={() => navigate('/')}>
        Volver al inicio
      </Button>
    </div>
  )
}
