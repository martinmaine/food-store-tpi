import { iniciales } from '../utils/format'

interface AvatarProps {
  nombre: string
  size?: 'sm' | 'md'
  apagado?: boolean
}

export function Avatar({ nombre, size = 'md', apagado = false }: AvatarProps) {
  const clases = ['avatar', size === 'sm' ? 'avatar--sm' : '', apagado ? 'avatar--muted' : ''].filter(Boolean).join(' ')
  return (
    <span className={clases} aria-hidden>
      {iniciales(nombre)}
    </span>
  )
}
