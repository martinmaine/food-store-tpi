const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

/** Colores de acento por categoría (se elige por id). */
const TINTES = ['#E0A526', '#C8643B', '#B98552', '#9A9B5E', '#D98C6A', '#A86B4A', '#C9A15B']

export function formatPrecio(valor: number): string {
  return '$ ' + valor.toLocaleString('es-AR', { maximumFractionDigits: 2 })
}

/** "24 nov · 18:05" */
export function formatFechaHora(iso: string): string {
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${d.getDate()} ${MESES[d.getMonth()]} · ${hh}:${mm}`
}

/** "24 nov 2026" */
export function formatFecha(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`
}

export function iniciales(texto: string): string {
  return (
    texto
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((palabra) => palabra[0]?.toUpperCase() ?? '')
      .join('') || '?'
  )
}

/** "#0007" */
export function codigoPedido(id: number): string {
  return '#' + String(id).padStart(4, '0')
}

export function tintePorCategoria(categoriaId: number | undefined): string {
  const i = Math.max(0, (categoriaId ?? 1) - 1) % TINTES.length
  return TINTES[i] ?? TINTES[0]!
}

export function pluralizar(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`
}
