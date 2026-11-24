export const CART_BUTTON_ID = 'nav-cart-button'

/** Animación: una "bolita" vuela desde el botón hasta el carrito de la Navbar. */
export function flyToCart(origen: HTMLElement): void {
  const destino = document.getElementById(CART_BUTTON_ID)
  if (!destino) return
  const a = origen.getBoundingClientRect()
  const b = destino.getBoundingClientRect()

  const bolita = document.createElement('div')
  Object.assign(bolita.style, {
    position: 'fixed',
    left: `${a.left + a.width / 2 - 14}px`,
    top: `${a.top + a.height / 2 - 14}px`,
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 35% 30%,#F3D58A,#E0A526)',
    boxShadow: '0 8px 20px rgba(74,44,29,.35)',
    zIndex: '999',
    pointerEvents: 'none',
  })
  document.body.appendChild(bolita)

  const dx = b.left + b.width / 2 - (a.left + a.width / 2)
  const dy = b.top + b.height / 2 - (a.top + a.height / 2)
  const vuelo = bolita.animate(
    [
      { transform: 'translate(0,0) scale(1)' },
      { transform: `translate(${dx * 0.45}px,${Math.min(dy, 0) - 140}px) scale(1.3)`, offset: 0.45 },
      { transform: `translate(${dx}px,${dy}px) scale(.35)`, opacity: 0.7 },
    ],
    { duration: 780, easing: 'cubic-bezier(.45,0,.3,1)' },
  )
  vuelo.onfinish = () => {
    bolita.remove()
    destino.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.15) rotate(-3deg)' }, { transform: 'scale(1)' }],
      { duration: 420, easing: 'ease-out' },
    )
  }
}
