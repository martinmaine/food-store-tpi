import { Link } from 'react-router-dom'

interface LogoProps {
  inverso?: boolean
  subtitulo?: string
}

export function Logo({ inverso = false, subtitulo }: LogoProps) {
  return (
    <Link to="/" className="logo">
      <span className={`logo__mark ${inverso ? 'logo__mark--inverse' : ''}`} aria-hidden />
      {subtitulo ? (
        <span className="sidebar__brand">
          <span className="logo__text">Food Store</span>
          <span className="logo__sub">{subtitulo}</span>
        </span>
      ) : (
        <span className="logo__text">Food Store</span>
      )}
    </Link>
  )
}
