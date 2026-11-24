import { useEffect, useRef } from 'react'
import type { Mesh } from 'three'

export interface Donut3DProps {
  /** Distancia de la cámara. */
  distancia?: number
  /** Desplazamiento del grupo en la escena. */
  x?: number
  y?: number
  /** Iluminación pensada para fondo oscuro. */
  oscuro?: boolean
  /** Solo la dona, sin figuras flotantes. */
  mini?: boolean
  /** Glaseado gris (pantalla "sin permiso"). */
  triste?: boolean
  className?: string
}

/**
 * Dona 3D interactiva hecha con three.js (se arrastra para girarla).
 * three se carga con import() dinámico para no engordar el bundle inicial.
 */
export function Donut3D({
  distancia = 10,
  x = 0,
  y = 0,
  oscuro = false,
  mini = false,
  triste = false,
  className = 'canvas-3d',
}: Donut3DProps) {
  const contenedorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contenedorRef.current
    if (!el) return
    let destruido = false
    let liberar: (() => void) | undefined

    import('three')
      .then((THREE) => {
        if (destruido) return
        let w = el.clientWidth || 400
        let h = el.clientHeight || 400

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
        renderer.setSize(w, h)
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.05
        el.appendChild(renderer.domElement)

        const scene = new THREE.Scene()
        const camara = new THREE.PerspectiveCamera(32, w / h, 0.1, 100)
        camara.position.set(0, 0, distancia)
        scene.add(new THREE.HemisphereLight(0xfff4e2, 0x4a2c1d, oscuro ? 1.4 : 1.1))
        const luzPrincipal = new THREE.DirectionalLight(0xffe7c2, 2.6)
        luzPrincipal.position.set(4, 6, 6)
        scene.add(luzPrincipal)
        const contraluz = new THREE.PointLight(0xe0a526, 40, 30)
        contraluz.position.set(-5, -2, 3)
        scene.add(contraluz)
        const relleno = new THREE.DirectionalLight(0xffffff, 0.6)
        relleno.position.set(-4, 2, 5)
        scene.add(relleno)

        const raiz = new THREE.Group()
        raiz.position.set(x, y, 0)
        scene.add(raiz)

        // Dona: masa + glaseado + granas.
        const dona = new THREE.Group()
        const masa = new THREE.Mesh(
          new THREE.TorusGeometry(1.25, 0.55, 48, 128),
          new THREE.MeshStandardMaterial({ color: 0xd9a35a, roughness: 0.75 }),
        )
        const glaseado = new THREE.Mesh(
          new THREE.TorusGeometry(1.25, 0.575, 48, 128),
          new THREE.MeshPhysicalMaterial({
            color: triste ? 0x9c8676 : 0x4a2c1d,
            roughness: 0.28,
            clearcoat: 1,
            clearcoatRoughness: 0.15,
          }),
        )
        glaseado.scale.set(1, 1, 0.62)
        glaseado.position.z = 0.2
        dona.add(masa, glaseado)

        const coloresGranas = [0xefe2cf, 0xe0a526, 0xc8643b, 0xfbf5ec]
        const geoGrana = new THREE.CapsuleGeometry(0.035, 0.16, 4, 8)
        const matGranas = coloresGranas.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.4 }))
        const eje = new THREE.Vector3(0, 0, 1)
        for (let i = 0; i < 70; i++) {
          const u = Math.random() * Math.PI * 2
          const v = (Math.random() - 0.5) * 0.85
          const r = 1.25 + v
          const z = 0.2 + 0.355 * Math.sqrt(Math.max(0, 1 - Math.pow(v / 0.575, 2))) + 0.02
          const grana = new THREE.Mesh(geoGrana, matGranas[i % 4])
          grana.position.set(Math.cos(u) * r, Math.sin(u) * r, z)
          grana.rotation.set(Math.PI / 2, 0, 0)
          grana.rotateOnWorldAxis(eje, Math.random() * Math.PI)
          dona.add(grana)
        }
        dona.rotation.x = -0.55
        raiz.add(dona)

        // Figuras flotantes alrededor (solo en la versión grande).
        interface Flotante {
          malla: Mesh
          base: [number, number, number]
          fase: number
          giro: number
        }
        const flotantes: Flotante[] = []
        if (!mini) {
          const agregar = (malla: Mesh, pos: [number, number, number]) => {
            malla.position.set(...pos)
            raiz.add(malla)
            flotantes.push({ malla, base: pos, fase: Math.random() * 6, giro: (Math.random() - 0.5) * 0.02 })
          }
          agregar(new THREE.Mesh(new THREE.SphereGeometry(0.55, 48, 48), new THREE.MeshPhysicalMaterial({ color: 0xe0a526, roughness: 0.2, clearcoat: 1 })), [2.7, 1.6, -1])
          agregar(new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 0), new THREE.MeshStandardMaterial({ color: 0xefe2cf, roughness: 0.5, flatShading: true })), [-2.8, -1.4, 0.4])
          agregar(new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), new THREE.MeshPhysicalMaterial({ color: 0x4a2c1d, roughness: 0.3, clearcoat: 1 })), [-2.3, 1.9, -0.6])
          agregar(new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.13, 24, 64), new THREE.MeshStandardMaterial({ color: 0xc8643b, roughness: 0.5 })), [2.4, -1.9, 0.5])
          agregar(new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.5, 8, 16), new THREE.MeshStandardMaterial({ color: 0xefe2cf, roughness: 0.45 })), [0.4, 2.7, -1.6])
          agregar(new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), new THREE.MeshStandardMaterial({ color: 0xe0a526, roughness: 0.4, flatShading: true })), [-0.6, -2.6, -0.8])
        }

        // Interacción: el mouse inclina la escena y arrastrar hace girar la dona.
        const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
        let giro = 0
        let velocidad = 0.004
        let arrastreX: number | null = null
        const onMove = (e: PointerEvent) => {
          mouse.tx = (e.clientX / window.innerWidth) * 2 - 1
          mouse.ty = (e.clientY / window.innerHeight) * 2 - 1
          if (arrastreX !== null) {
            velocidad = (e.clientX - arrastreX) * 0.004
            arrastreX = e.clientX
          }
        }
        const onDown = (e: PointerEvent) => {
          arrastreX = e.clientX
        }
        const onUp = () => {
          arrastreX = null
        }
        window.addEventListener('pointermove', onMove)
        el.addEventListener('pointerdown', onDown)
        window.addEventListener('pointerup', onUp)

        const observador = new ResizeObserver(() => {
          w = el.clientWidth || w
          h = el.clientHeight || h
          renderer.setSize(w, h)
          camara.aspect = w / h
          camara.updateProjectionMatrix()
        })
        observador.observe(el)

        const t0 = performance.now()
        let raf = 0
        const loop = (ahora: number) => {
          const t = (ahora - t0) / 1000
          mouse.x += (mouse.tx - mouse.x) * 0.06
          mouse.y += (mouse.ty - mouse.y) * 0.06
          const intro = Math.min(1, t / 1.4)
          const escala = 1 - Math.pow(1 - intro, 3) * Math.cos(intro * 4.5)
          raiz.scale.setScalar(Math.max(0.001, escala))
          if (arrastreX === null) velocidad += (0.004 - velocidad) * 0.03
          giro += velocidad
          const scroll = Math.min(1, window.scrollY / 800)
          dona.rotation.y = giro + mouse.x * 0.45 + scroll * 1.2
          dona.rotation.x = -0.55 + mouse.y * 0.3 + Math.sin(t * 0.6) * 0.06 + scroll * 0.5
          dona.position.y = Math.sin(t * 0.9) * 0.12
          for (const f of flotantes) {
            f.malla.position.y = f.base[1] + Math.sin(t * 0.9 + f.fase) * 0.22
            f.malla.position.x = f.base[0] - mouse.x * 0.35 * (1 + f.base[2] * 0.3)
            f.malla.rotation.x += f.giro + 0.004
            f.malla.rotation.y += f.giro * 1.5 + 0.006
          }
          renderer.render(scene, camara)
          raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)

        liberar = () => {
          cancelAnimationFrame(raf)
          observador.disconnect()
          window.removeEventListener('pointermove', onMove)
          window.removeEventListener('pointerup', onUp)
          el.removeEventListener('pointerdown', onDown)
          scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
              obj.geometry.dispose()
              const materiales = Array.isArray(obj.material) ? obj.material : [obj.material]
              materiales.forEach((m) => m.dispose())
            }
          })
          renderer.dispose()
          renderer.domElement.remove()
        }
      })
      .catch(() => {
        // Si WebGL no está disponible, la página sigue funcionando sin la animación.
      })

    return () => {
      destruido = true
      liberar?.()
    }
  }, [distancia, x, y, oscuro, mini, triste])

  return <div ref={contenedorRef} className={className} aria-hidden />
}
