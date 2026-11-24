import { useEffect, useState } from 'react'

/** Anima un número desde 0 hasta `target` (easing out quart). */
export function useCountUp(target: number, duration = 1200): number {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf = 0
    const inicio = performance.now()
    const paso = (ahora: number) => {
      const k = Math.min(1, (ahora - inicio) / duration)
      setValue(target * (1 - Math.pow(1 - k, 4)))
      if (k < 1) raf = requestAnimationFrame(paso)
    }
    raf = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}
