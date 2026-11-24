import type { FormaPago } from '../types/pedido'

const OPCIONES: { valor: FormaPago; etiqueta: string; descripcion: string }[] = [
  { valor: 'EFECTIVO', etiqueta: 'Efectivo', descripcion: 'Abonás en el momento de la entrega.' },
  { valor: 'TRANSFERENCIA', etiqueta: 'Transferencia', descripcion: 'Transferís el total antes del envío.' },
]

interface PaymentOptionsProps {
  valor: FormaPago | ''
  onCambiar: (valor: FormaPago) => void
}

/** Selector de forma de pago con tarjetas grandes (radio group accesible). */
export function PaymentOptions({ valor, onCambiar }: PaymentOptionsProps) {
  return (
    <div className="pay-options" role="radiogroup" aria-label="Forma de pago">
      {OPCIONES.map((op) => {
        const seleccionada = valor === op.valor
        return (
          <button
            key={op.valor}
            type="button"
            role="radio"
            aria-checked={seleccionada}
            className={`pay-card ${seleccionada ? 'pay-card--selected' : ''}`}
            onClick={() => onCambiar(op.valor)}
          >
            <span className="pay-card__top">
              {op.valor}
              <span className="pay-card__radio" />
            </span>
            <span className="pay-card__label">{op.etiqueta}</span>
            <span className="pay-card__desc">{op.descripcion}</span>
          </button>
        )
      })}
    </div>
  )
}
