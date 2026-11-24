import { axiosInstance } from '../../../shared/api/axiosInstance'
import type { Usuario, UsuarioCreate } from '../../usuarios/types/usuario'

/** Login con formulario OAuth2: el backend deja el JWT en la cookie HttpOnly. */
export async function login(username: string, password: string): Promise<void> {
  const form = new URLSearchParams({ username, password })
  await axiosInstance.post('/auth/token', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

export async function logout(): Promise<void> {
  await axiosInstance.post('/auth/logout')
}

export async function getMe(): Promise<Usuario> {
  const { data } = await axiosInstance.get<Usuario>('/auth/me')
  return data
}

export async function register(payload: UsuarioCreate): Promise<Usuario> {
  const { data } = await axiosInstance.post<Usuario>('/auth/register', payload)
  return data
}
