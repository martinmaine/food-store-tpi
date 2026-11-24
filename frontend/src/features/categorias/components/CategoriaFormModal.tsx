import { useForm } from '@tanstack/react-form'

import { Button } from '../../../shared/ui/Button'
import { Field, Input, TextArea } from '../../../shared/ui/Input'
import { Modal } from '../../../shared/ui/Modal'
import { errorDeCampo } from '../../../shared/utils/formField'
import type { Categoria, CategoriaInput } from '../types/categoria'

interface CategoriaFormModalProps {
  categoria: Categoria | null
  guardando: boolean
  errorServidor: string
  onGuardar: (datos: CategoriaInput) => void
  onClose: () => void
}

/** Alta y edición de categorías con TanStack Form (nombre de 2 a 100 caracteres). */
export function CategoriaFormModal({ categoria, guardando, errorServidor, onGuardar, onClose }: CategoriaFormModalProps) {
  const form = useForm({
    defaultValues: { nombre: categoria?.nombre ?? '', descripcion: categoria?.descripcion ?? '' },
    onSubmit: ({ value }) => {
      const descripcion = value.descripcion.trim()
      onGuardar({ nombre: value.nombre.trim(), descripcion: descripcion || null })
    },
  })
  const enviar = () => void form.handleSubmit()

  return (
    <Modal
      titulo={categoria ? 'Editar categoría' : 'Nueva categoría'}
      onClose={onClose}
      acciones={
        <>
          <Button variant="ghost" onClick={onClose}>
            Volver
          </Button>
          <Button loading={guardando} onClick={enviar}>
            Guardar
          </Button>
        </>
      }
    >
      <form
        noValidate
        className="flex flex-col gap-[18px]"
        onSubmit={(e) => {
          e.preventDefault()
          enviar()
        }}
      >
        <form.Subscribe selector={(s) => s.submissionAttempts > 0}>
          {(intento) => (
            <form.Field
              name="nombre"
              validators={{
                onChange: ({ value }) => {
                  const largo = value.trim().length
                  return largo < 2 || largo > 100 ? 'Entre 2 y 100 caracteres' : undefined
                },
              }}
            >
              {(field) => (
                <Field label="Nombre" error={errorDeCampo(field.state.meta, intento)}>
                  <Input
                    variante="compact"
                    maxLength={100}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>
          )}
        </form.Subscribe>
        <form.Field name="descripcion">
          {(field) => (
            <Field label="Descripción">
              <TextArea
                variante="compact"
                rows={3}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Field>
          )}
        </form.Field>
        <button type="submit" hidden />
      </form>
      {errorServidor && <div className="alert alert--error">{errorServidor}</div>}
    </Modal>
  )
}
