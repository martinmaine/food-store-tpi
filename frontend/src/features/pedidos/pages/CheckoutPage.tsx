import { Link, useNavigate } from 'react-router-dom'

import { handleApiError } from '../../../shared/api/handleApiError'
import { codigoPedido } from '../../../shared/utils/format'
import { useCartStore } from '../../../store/cartStore'
import { toast } from '../../../store/toastStore'
import { CheckoutForm, type DatosCheckout } from '../components/CheckoutForm'
import { CheckoutSummary } from '../components/CheckoutSummary'
import { useCrearPedido } from '../hooks/useCrearPedido'

export function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total())
  const vaciar = useCartStore((s) => s.vaciar)
  const crearPedido = useCrearPedido()

  const confirmar = (datos: DatosCheckout) => {
    crearPedido.mutate(
      {
        ...datos,
        items: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
      },
      {
        onSuccess: (pedido) => {
          vaciar()
          toast.ok(`Pedido ${codigoPedido(pedido.id)} creado · PENDIENTE`)
          navigate('/mis-pedidos', { state: { nuevoPedidoId: pedido.id } })
        },
        onError: (error) => toast.error(handleApiError(error)),
      },
    )
  }

  return (
    <main className="page anim-page">
      <div className="steps eyebrow">
        <Link to="/carrito">01 Carrito</Link>
        <span>—</span>
        <span className="steps__current">02 Entrega y pago</span>
        <span>—</span>
        <span>03 Mis pedidos</span>
      </div>
      <h1 className="page-title" style={{ marginBottom: 32, fontSize: 'clamp(44px, 5.5vw, 80px)' }}>
        Confirmar pedido
      </h1>

      {items.length === 0 ? (
        <p className="muted" style={{ fontSize: 18 }}>
          No hay productos en el carrito. <Link to="/">Volver al menú</Link>
        </p>
      ) : (
        <div className="split">
          <CheckoutForm
            total={total}
            enviando={crearPedido.isPending}
            errorServidor={crearPedido.isError ? handleApiError(crearPedido.error) : ''}
            onConfirmar={confirmar}
          />
          <CheckoutSummary items={items} total={total} />
        </div>
      )}
    </main>
  )
}
