export function PageLoader({ texto = 'Verificando sesión…' }: { texto?: string }) {
  return (
    <div className="page-loader" role="status">
      <span className="spinner spinner--dark" />
      <span className="eyebrow">{texto}</span>
    </div>
  )
}
