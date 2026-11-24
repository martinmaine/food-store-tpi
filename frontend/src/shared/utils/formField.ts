interface MetaDeCampo {
  isTouched: boolean
  errors: readonly unknown[]
}

/**
 * Devuelve el primer error de un campo de TanStack Form, solo si el usuario
 * ya lo tocó o intentó enviar el formulario.
 */
export function errorDeCampo(meta: MetaDeCampo, intentoDeEnvio: boolean): string | undefined {
  if (!meta.isTouched && !intentoDeEnvio) return undefined
  const primero = meta.errors.find((e) => typeof e === 'string' && e.length > 0)
  return typeof primero === 'string' ? primero : undefined
}
