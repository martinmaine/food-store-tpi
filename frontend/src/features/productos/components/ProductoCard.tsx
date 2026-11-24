import { useRef, useState, type CSSProperties, type MouseEvent } from 'react'

import { formatPrecio, iniciales, tintePorCategoria } from '../../../shared/utils/format'
import type { Producto } from '../types/producto'

interface ProductoCardProps {
  producto: Producto
  enCarrito: number
  onAgregar: (producto: Producto, boton: HTMLButtonElement) => void
  /** Retraso de la animación de entrada (efecto cascada). */
  delay: number
}

/** Tarjeta del catálogo con efecto tilt 3D al pasar el mouse. */
export function ProductoCard({ producto, enCarrito, onAgregar, delay }: ProductoCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const plateRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const [imagenRota, setImagenRota] = useState(false)

  const bloqueado = !producto.disponible || producto.stock === 0
  const stockBajo = !bloqueado && producto.stock <= 5
  const tieneImagen = !!producto.imagen_url && !imagenRota

  const inclinar = (e: MouseEvent<HTMLElement>) => {
    const card = cardRef.current
    if (!card) return
    const r = card.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    card.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg) translateY(-6px)`
    card.style.boxShadow = '0 34px 60px -30px rgba(46,26,16,.5)'
    if (plateRef.current) {
      plateRef.current.style.transform = `translate(${x * 24}px,${y * 24}px) scale(1.08) rotate(${x * 10}deg)`
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '1'
      glareRef.current.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,.42), transparent 55%)`
    }
  }

  const soltar = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = ''
      cardRef.current.style.boxShadow = ''
    }
    if (plateRef.current) plateRef.current.style.transform = ''
    if (glareRef.current) glareRef.current.style.opacity = '0'
  }

  return (
    <article
      ref={cardRef}
      className="product-card"
      style={{ animationDelay: `${delay}s` }}
      onMouseMove={inclinar}
      onMouseLeave={soltar}
    >
      <div className="product-card__media" style={{ '--tint': tintePorCategoria(producto.categoria_id) } as CSSProperties}>
        {tieneImagen ? (
          <img
            className="product-card__img"
            src={producto.imagen_url ?? ''}
            alt={producto.nombre}
            loading="lazy"
            onError={() => setImagenRota(true)}
          />
        ) : (
          <div ref={plateRef} className="plate">
            {iniciales(producto.nombre)}
          </div>
        )}
        <div ref={glareRef} className="product-card__glare" />
        <span className="product-card__tag">{producto.categoria.nombre}</span>
        {bloqueado && (
          <div className="product-card__blocked">
            <span>{!producto.disponible ? 'No disponible' : 'Sin stock'}</span>
          </div>
        )}
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">{producto.nombre}</h3>
        {producto.descripcion && <p className="product-card__desc">{producto.descripcion}</p>}
      </div>

      <div className="product-card__footer">
        <div className="flex flex-col gap-0.5">
          <span className="product-card__price">{formatPrecio(producto.precio_base)}</span>
          <span className={`product-card__stock ${stockBajo ? 'product-card__stock--low' : ''}`}>
            {bloqueado ? '—' : stockBajo ? `Quedan ${producto.stock}` : `Stock ${producto.stock}`}
          </span>
        </div>
        <button
          type="button"
          className="btn-add"
          disabled={bloqueado}
          onClick={(e) => onAgregar(producto, e.currentTarget)}
        >
          <span className="btn-add__plus">+</span>
          {enCarrito > 0 ? `${enCarrito} en carrito` : 'Agregar'}
        </button>
      </div>
    </article>
  )
}
