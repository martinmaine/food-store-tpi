import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { handleApiError } from '../../../shared/api/handleApiError'
import { Button } from '../../../shared/ui/Button'
import { Field, Input } from '../../../shared/ui/Input'
import { errorDeCampo } from '../../../shared/utils/formField'
import type { UsuarioCreate } from '../../usuarios/types/usuario'
import { register } from '../api/auth'
import { PasswordStrength } from './PasswordStrength'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface RegisterFormProps {
  onExito: (datos: UsuarioCreate) => Promise<void>
}

type CampoTexto = keyof UsuarioCreate

const CAMPOS: {
  nombre: CampoTexto
  etiqueta: string
  tipo: string
  placeholder: string
  autoComplete: string
  validar: (v: string) => string | undefined
}[] = [
  {
    nombre: 'username',
    etiqueta: 'Usuario',
    tipo: 'text',
    placeholder: 'ej. lucia',
    autoComplete: 'username',
    validar: (v) => (v.trim().length < 3 ? 'Mínimo 3 caracteres' : undefined),
  },
  {
    nombre: 'full_name',
    etiqueta: 'Nombre completo',
    tipo: 'text',
    placeholder: 'Lucía Fernández',
    autoComplete: 'name',
    validar: (v) => (v.trim().length < 2 ? 'Ingresá tu nombre' : undefined),
  },
  {
    nombre: 'email',
    etiqueta: 'Email',
    tipo: 'email',
    placeholder: 'vos@mail.com',
    autoComplete: 'email',
    validar: (v) => (!EMAIL_RE.test(v.trim()) ? 'Email inválido' : undefined),
  },
  {
    nombre: 'password',
    etiqueta: 'Contraseña',
    tipo: 'password',
    placeholder: 'Mínimo 8 caracteres',
    autoComplete: 'new-password',
    validar: (v) => (v.length < 8 ? 'Mínimo 8 caracteres' : undefined),
  },
]

export function RegisterForm({ onExito }: RegisterFormProps) {
  const [errorServidor, setErrorServidor] = useState('')

  const form = useForm({
    defaultValues: { username: '', full_name: '', email: '', password: '' } satisfies UsuarioCreate,
    onSubmit: async ({ value }) => {
      setErrorServidor('')
      const datos: UsuarioCreate = {
        username: value.username.trim(),
        full_name: value.full_name.trim(),
        email: value.email.trim(),
        password: value.password,
      }
      try {
        await register(datos)
        await onExito(datos)
      } catch (error) {
        setErrorServidor(handleApiError(error))
      }
    },
  })

  return (
    <form
      noValidate
      className="contents"
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.Subscribe selector={(s) => s.submissionAttempts > 0}>
        {(intento) =>
          CAMPOS.map((c) => (
            <form.Field key={c.nombre} name={c.nombre} validators={{ onChange: ({ value }) => c.validar(value) }}>
              {(field) => {
                const error = errorDeCampo(field.state.meta, intento)
                return (
                  <Field label={c.etiqueta} error={error}>
                    <Input
                      type={c.tipo}
                      name={field.name}
                      placeholder={c.placeholder}
                      autoComplete={c.autoComplete}
                      invalido={!!error}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )
              }}
            </form.Field>
          ))
        }
      </form.Subscribe>

      <form.Subscribe selector={(s) => s.values.password}>
        {(password) => <PasswordStrength password={password} />}
      </form.Subscribe>

      {errorServidor && <div className="alert alert--error">{errorServidor}</div>}

      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(enviando) => (
          <Button type="submit" size="block" loading={enviando}>
            Crear cuenta
          </Button>
        )}
      </form.Subscribe>

      <span className="muted" style={{ fontSize: 15 }}>
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </span>
    </form>
  )
}
