import { useForm } from '@tanstack/react-form'

import { Button } from '../../../shared/ui/Button'
import { Field, Input, TextArea } from '../../../shared/ui/Input'
import { errorDeCampo } from '../../../shared/utils/formField'
import { formatPrecio } from '../../../shared/utils/format'
import type { FormaPago } from '../types/pedido'
import { PaymentOptions } from './PaymentOptions'

export interface DatosCheckout {
  direccion_entrega: string
  forma_pago: FormaPago
  notas: string | null
}

interface CheckoutFormProps {
  total: number
  enviando: boolean
  errorServidor: string
  onConfirmar: (datos: DatosCheckout) => void
}

interface ValoresFormulario {
  direccion_entrega: string
  forma_pago: FormaPago | ''
  notas: string
}

const VALORES_INICIALES: ValoresFormulario = { direccion_entrega: '', forma_pago: '', notas: '' }

/** Formulario de checkout con TanStack Form: dirección (5 a 200), forma de pago y notas. */
export function CheckoutForm({ total, enviando, errorServidor, onConfirmar }: CheckoutFormProps) {
  const form = useForm({
    defaultValues: VALORES_INICIALES,
    onSubmit: ({ value }) => {
      if (value.forma_pago === '') return
      const notas = value.notas.trim()
      onConfirmar({
        direccion_entrega: value.direccion_entrega.trim(),
        forma_pago: value.forma_pago,
        notas: notas.length > 0 ? notas : null,
      })
    },
  })

  return (
    <form
      noValidate
      className="form-card split__main"
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.Subscribe selector={(s) => s.submissionAttempts > 0}>
        {(intento) => (
          <>
            <form.Field
              name="direccion_entrega"
              validators={{
                onChange: ({ value }) => {
                  const largo = value.trim().length
                  return largo < 5 || largo > 200 ? 'La dirección debe tener entre 5 y 200 caracteres' : undefined
                },
              }}
            >
              {(field) => {
                const error = errorDeCampo(field.state.meta, intento)
                return (
                  <Field label="Dirección de entrega" hint={`${field.state.value.length}/200`} error={error}>
                    <Input
                      variante="crema"
                      name={field.name}
                      maxLength={200}
                      placeholder="Calle, número, piso y departamento"
                      autoComplete="street-address"
                      invalido={!!error}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )
              }}
            </form.Field>

            <form.Field
              name="forma_pago"
              validators={{ onChange: ({ value }) => (value === '' ? 'Elegí una forma de pago' : undefined) }}
            >
              {(field) => {
                const error = errorDeCampo(field.state.meta, intento)
                return (
                  <div className="field">
                    <span className="field__label">Forma de pago</span>
                    <PaymentOptions valor={field.state.value} onCambiar={(v) => field.handleChange(v)} />
                    {error && <span className="field__error">{error}</span>}
                  </div>
                )
              }}
            </form.Field>
          </>
        )}
      </form.Subscribe>

      <form.Field name="notas">
        {(field) => (
          <Field
            label={
              <>
                Notas <span className="muted" style={{ fontWeight: 400 }}>(opcional)</span>
              </>
            }
          >
            <TextArea
              variante="crema"
              name={field.name}
              rows={3}
              maxLength={500}
              placeholder="Ej.: tocar timbre 2, sin cebolla…"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Field>
        )}
      </form.Field>

      {errorServidor && (
        <div className="alert alert--error" role="alert">
          {errorServidor}
        </div>
      )}

      <Button type="submit" size="block" loading={enviando}>
        {enviando ? (
          'Creando pedido…'
        ) : (
          <>
            Confirmar pedido · <span className="text-mostaza">{formatPrecio(total)}</span>
          </>
        )}
      </Button>
    </form>
  )
}
