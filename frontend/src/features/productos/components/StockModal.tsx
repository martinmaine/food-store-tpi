import { useForm } from '@tanstack/react-form'

import { Button } from '../../../shared/ui/Button'
import { Modal } from '../../../shared/ui/Modal'
import { Toggle } from '../../../shared/ui/Toggle'
import { errorDeCampo } from '../../../shared/utils/formField'
import type { Producto, ProductoStockUpdate } from '../types/producto'

interface StockModalProps {
  producto: Producto
  guardando: boolean
  errorServidor: string
  onGuardar: (datos: ProductoStockUpdate) => void
  onClose: () => void
}

/** Cambio rápido de stock y disponibilidad (PATCH /productos/{id}/stock). */
export function StockModal({ producto, guardando, errorServidor, onGuardar, onClose }: StockModalProps) {
  const form = useForm({
    defaultValues: { stock: String(producto.stock), disponible: producto.disponible },
    onSubmit: ({ value }) => onGuardar({ stock: Number(value.stock), disponible: value.disponible }),
  })

  return (
    <Modal
      titulo="Stock y disponibilidad"
      onClose={onClose}
      acciones={
        <>
          <Button variant="ghost" onClick={onClose}>
            Volver
          </Button>
          <Button loading={guardando} onClick={() => void form.handleSubmit()}>
            Guardar
          </Button>
        </>
      }
    >
      <span className="muted" style={{ fontSize: 15 }}>
        {producto.nombre}
      </span>

      <form.Subscribe selector={(s) => s.submissionAttempts > 0}>
        {(intento) => (
          <form.Field
            name="stock"
            validators={{
              onChange: ({ value }) =>
                value.trim() === '' || !Number.isInteger(Number(value)) || Number(value) < 0
                  ? 'Stock entero ≥ 0'
                  : undefined,
            }}
          >
            {(field) => {
              const actual = Number(field.state.value) || 0
              const error = errorDeCampo(field.state.meta, intento)
              return (
                <>
                  <div className="stepper">
                    <button
                      type="button"
                      className="stepper__btn"
                      aria-label="Restar uno"
                      onClick={() => field.handleChange(String(Math.max(0, actual - 1)))}
                    >
                      −
                    </button>
                    <input
                      className="stepper__input"
                      type="number"
                      min={0}
                      aria-label="Stock"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <button
                      type="button"
                      className="stepper__btn"
                      aria-label="Sumar uno"
                      onClick={() => field.handleChange(String(actual + 1))}
                    >
                      +
                    </button>
                  </div>
                  {error && <span className="field__error">{error}</span>}
                </>
              )
            }}
          </form.Field>
        )}
      </form.Subscribe>

      <form.Field name="disponible">
        {(field) => (
          <Toggle checked={field.state.value} onChange={(v) => field.handleChange(v)} label="Disponible para la venta" />
        )}
      </form.Field>

      {errorServidor && <div className="alert alert--error">{errorServidor}</div>}
    </Modal>
  )
}
