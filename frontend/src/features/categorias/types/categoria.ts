/** Espejo de CategoriaRead. */
export interface Categoria {
  id: number
  nombre: string
  descripcion: string | null
  activo: boolean
}

/** Espejo de CategoriaCreate / CategoriaUpdate. */
export interface CategoriaInput {
  nombre: string
  descripcion: string | null
}
