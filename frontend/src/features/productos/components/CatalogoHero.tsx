import { useNavigate } from 'react-router-dom'

import { Donut3D } from '../../../shared/components/Donut3D'
import { Button } from '../../../shared/ui/Button'

interface CatalogoHeroProps {
  onVerMenu: () => void
}

export function CatalogoHero({ onVerMenu }: CatalogoHeroProps) {
  const navigate = useNavigate()
  return (
    <section className="hero">
      <div className="hero__copy">
        <span className="eyebrow hero__eyebrow">
          <span className="pulse-dot" />
          Pago manual · Efectivo o transferencia
        </span>
        <h1 className="hero__title">
          <span className="hero__line">
            <span style={{ animationDelay: '.05s' }}>Comida</span>
          </span>
          <span className="hero__line">
            <span style={{ animationDelay: '.15s' }}>de verdad,</span>
          </span>
          <span className="hero__line">
            <span style={{ animationDelay: '.25s' }}>
              en tu puerta.
            </span>
          </span>
        </h1>
        <p className="hero__text">
          Hamburguesas, pizzas, empanadas y más, hechas en el momento. Armá tu pedido y seguilo hasta que llegue.
        </p>
        <div className="hero__actions">
          <Button size="lg" onClick={onVerMenu}>
            Ver el menú <span className="text-mostaza">↓</span>
          </Button>
          <Button size="lg" variant="outline-soft" onClick={() => navigate('/mis-pedidos')}>
            Mis pedidos
          </Button>
        </div>
      </div>
      <div className="hero__visual">
        <div className="hero__glow" />
        <div className="hero__orbit" />
        <Donut3D distancia={10.5} />
        <span className="hero__hint">Arrastrá para girar</span>
      </div>
    </section>
  )
}