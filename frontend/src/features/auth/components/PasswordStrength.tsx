const COLORES = ['#A23B1A', '#C8643B', '#E0A526', '#9A9B5E', '#6E7F35']
const ETIQUETAS = ['Débil', 'Aceptable', 'Buena', 'Muy buena', 'Excelente']

/** Barra de seguridad de la contraseña (solo visual; la regla real es mínimo 8). */
export function PasswordStrength({ password }: { password: string }) {
  const largo = password.length
  const puntaje = Math.min(
    4,
    Number(largo >= 8) + Number(largo >= 12) + Number(/[A-Z]/.test(password)) + Number(/[\d\W]/.test(password)),
  )
  const ancho = largo ? Math.max(10, puntaje * 25) : 0
  const etiqueta =
    largo === 0 ? 'Seguridad de la contraseña' : largo < 8 ? `Faltan ${8 - largo} caracteres` : ETIQUETAS[puntaje]

  return (
    <div className="pw-meter">
      <div className="pw-meter__track">
        <div className="pw-meter__fill" style={{ width: `${ancho}%`, background: COLORES[puntaje] }} />
      </div>
      <span className="tag-label" style={{ color: 'var(--color-texto-suave)' }}>
        {etiqueta}
      </span>
    </div>
  )
}
