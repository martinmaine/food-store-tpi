import { useForm } from '@tanstack/react-form'

import { Button } from '../../../shared/ui/Button'
import { Field, Input, Select, TextArea } from '../../../shared/ui/Input'
import { Modal } from '../../../shared/ui/Modal'
import { Toggle } from '../../../shared/ui/Toggle'
import { errorDeCampo } from '../../../shared/utils/formField'
import type { Categoria } from '../../categorias/types/categoria'
import type { Producto, ProductoInput } from '../types/producto'

interface ProductoFormModalProps {
  /** null = crear; un producto = editar. */
  producto: Producto | null
  categorias: Categoria[]
  guardando: boolean
  errorServidor: string
  onGuardar: (datos: ProductoInput) => void
  onClose: () => void
}

interface Valores {
  nombre: string
  descripcion: string
  precio_base: string
  stock: string
  categoria_id: string
  imagen_url: string
  disponible: boolean
}

function valoresIniciales(p: Producto | null): Valores {
  return {
    nombre: p?.nombre ?? '',
    descripcion: p?.descripcion ?? '',
    precio_base: p ? String(p.precio_base) : '',
    stock: p ? String(p.stock) : '0',
    categoria_id: p ? String(p.categoria_id) : '',
    imagen_url: p?.imagen_url ?? '',
    disponible: p?.disponible ?? true,
  }
}

const esEnteroNoNegativo = (v: string) => v.trim() !== '' && Number.isInteger(Number(v)) && Number(v) >= 0

/** Alta y edición de productos con TanStack Form. */
export function ProductoFormModal({
  producto,
  categorias,
  guardando,
  errorServidor,
  onGuardar,
  onClose,
}: ProductoFormModalProps) {
  const form = useForm({
    defaultValues: valoresIniciales(producto),
    onSubmit: ({ value }) => {
      const descripcion = value.descripcion.trim()
      const imagen = value.imagen_url.trim()
      onGuardar({
        nombre: value.nombre.trim(),
        descripcion: descripcion || null,
        precio_base: Number(value.precio_base),
        stock: Number(value.stock),
        categoria_id: Number(value.categoria_id),
        imagen_url: imagen || null,
        disponible: value.disponible,
      })
    },
  })

  const enviar = () => void form.handleSubmit()

  return (
    <Modal
      titulo={producto ? 'Editar producto' : 'Nuevo producto'}
      onClose={onClose}
      ancho="wide"
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
        onSubmit={(e) => {
          e.preventDefault()
          enviar()
        }}
      >
        <form.Subscribe selector={(s) => s.submissionAttempts > 0}>
          {(intento) => (
            <div className="form-grid-2">
              <form.Field
                name="nombre"
                validators={{
                  onChange: ({ value }) =>
                    value.trim().length < 2 ? 'El nombre es obligatorio (mínimo 2 caracteres)' : undefined,
                }}
              >
                {(field) => (
                  <Field className="span-2" label="Nombre" error={errorDeCampo(field.state.meta, intento)}>
                    <Input
                      variante="compact"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="descripcion">
                {(field) => (
                  <Field className="span-2" label="Descripción">
                    <TextArea
                      variante="compact"
                      rows={2}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="precio_base"
                validators={{
                  onChange: ({ value }) =>
                    value.trim() === '' || Number.isNaN(Number(value)) || Number(value) < 0 ? 'Precio ≥ 0' : undefined,
                }}
              >
                {(field) => (
                  <Field label="Precio base" error={errorDeCampo(field.state.meta, intento)}>
                    <Input
                      variante="compact"
                      type="number"
                      min={0}
                      step="0.01"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="stock"
                validators={{ onChange: ({ value }) => (!esEnteroNoNegativo(value) ? 'Stock entero ≥ 0' : undefined) }}
              >
                {(field) => (
                  <Field label="Stock" error={errorDeCampo(field.state.meta, intento)}>
                    <Input
                      variante="compact"
                      type="number"
                      min={0}
                      step={1}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field
                name="categoria_id"
                validators={{ onChange: ({ value }) => (value === '' ? 'Elegí una categoría' : undefined) }}
              >
                {(field) => (
                  <Field label="Categoría" error={errorDeCampo(field.state.meta, intento)}>
                    <Select
                      variante="compact"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    >
                      <option value="">Elegí una…</option>
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Field name="imagen_url">
                {(field) => (
                  <Field label="Imagen (URL)">
                    <Input
                      variante="compact"
                      type="url"
                      placeholder="https://…"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="disponible">
                {(field) => (
                  <Toggle
                    className="span-2"
                    checked={field.state.value}
                    onChange={(v) => field.handleChange(v)}
                    label="Disponible para la venta"
                  />
                )}
              </form.Field>
            </div>
          )}
        </form.Subscribe>
        {/* Permite enviar con Enter. */}
        <button type="submit" hidden />
      </form>

      {errorServidor && <div className="alert alert--error">{errorServidor}</div>}
    </Modal>
  )
}
