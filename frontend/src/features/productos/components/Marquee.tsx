interface MarqueeProps {
  palabras: string[]
}

/** Cinta animada con los nombres de las categorías. */
export function Marquee({ palabras }: MarqueeProps) {
  if (palabras.length === 0) return null
  // Se repite la lista para que la animación (-50%) sea continua.
  const repetidas = [...palabras, ...palabras, ...palabras, ...palabras]
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee__track">
        {repetidas.map((p, i) => (
          <span key={i} className="marquee__item">
            {p}
          </span>
        ))}
      </div>
    </div>
  )
}
