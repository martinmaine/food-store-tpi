import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { handleApiError } from '../../../shared/api/handleApiError'
import { Button } from '../../../shared/ui/Button'
import { Field, Input } from '../../../shared/ui/Input'
import { errorDeCampo } from '../../../shared/utils/formField'
import { useAuthStore } from '../../../store/authStore'
import type { Usuario } from '../../usuarios/types/usuario'

const USUARIOS_DEMO = [
  { username: 'admin', password: 'Admin1234!' },
  { username: 'lucia', password: 'Lucia1234' },
]

interface LoginFormProps {
  onExito: (usuario: Usuario) => void
}

export function LoginForm({ onExito }: LoginFormProps) {
  const login = useAuthStore((s) => s.login)
  const [errorServidor, setErrorServidor] = useState('')

  const form = useForm({
    defaultValues: { username: '', password: '' },
    onSubmit: async ({ value }) => {
      setErrorServidor('')
      try {
        const usuario = await login(value.username.trim(), value.password)
        onExito(usuario)
      } catch (error) {
        setErrorServidor(handleApiError(error))
      }
    },
  })

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
      className="contents"
    >
      <form.Subscribe selector={(s) => s.submissionAttempts > 0}>
        {(intento) => (
          <>
            <form.Field
              name="username"
              validators={{ onChange: ({ value }) => (!value.trim() ? 'Ingresá tu usuario' : undefined) }}
            >
              {(field) => (
                <Field label="Usuario" error={errorDeCampo(field.state.meta, intento)}>
                  <Input
                    name={field.name}
                    autoComplete="username"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{ onChange: ({ value }) => (!value ? 'Ingresá tu contraseña' : undefined) }}
            >
              {(field) => (
                <Field label="Contraseña" error={errorDeCampo(field.state.meta, intento)}>
                  <Input
                    type="password"
                    name={field.name}
                    autoComplete="current-password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>
          </>
        )}
      </form.Subscribe>

      {errorServidor && <div className="alert alert--error">{errorServidor}</div>}

      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(enviando) => (
          <Button type="submit" size="block" loading={enviando}>
            Ingresar
          </Button>
        )}
      </form.Subscribe>

      <div className="seed-box">
        <span className="eyebrow" style={{ fontSize: 11 }}>
          Usuarios del seed · clic para completar
        </span>
        <div className="flex gap-2 flex-wrap">
          {USUARIOS_DEMO.map((u) => (
            <button
              key={u.username}
              type="button"
              className="chip-btn"
              onClick={() => {
                form.setFieldValue('username', u.username)
                form.setFieldValue('password', u.password)
              }}
            >
              {u.username} / {u.password}
            </button>
          ))}
        </div>
      </div>

      <span className="muted" style={{ fontSize: 15 }}>
        ¿No tenés cuenta? <Link to="/register">Registrate</Link>
      </span>
    </form>
  )
}
