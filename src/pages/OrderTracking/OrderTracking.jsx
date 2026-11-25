import { Link, useParams } from 'react-router-dom';
import { useOrder } from '../../hooks/useOrders';
import MapView from '../../components/Shared/MapView';
import ChatBox from '../../components/Shared/ChatBox';
import { STATUS, formatCOP } from '../../helpers/format';
import { placeById } from '../../helpers/cali';
import styles from './OrderTracking.module.scss';

const STEPS = ['pendiente', 'preparando', 'en_camino', 'entregado'];

export default function OrderTracking() {
  const { id } = useParams();
  const { order, state } = useOrder(id);

  if (state === 'loading') return <p>Cargando pedido…</p>;
  if (state === 'missing')
    return (
      <p className="empty">
        No encontramos este pedido. <Link to="/cuenta/pedidos">Volver a mis pedidos</Link>
      </p>
    );

  const current = STEPS.indexOf(order.status);
  const here = placeById(order.route[Math.min(order.courierStep, order.route.length - 1)]);

  return (
    <>
      <h1 className={styles.title}>Tu pedido</h1>
      <ol className={styles.steps} aria-label="Estado del pedido">
        {STEPS.map((s, i) => (
          <li key={s} className={i <= current ? styles.done : undefined} aria-current={i === current ? 'step' : undefined}>
            {STATUS[s]}
          </li>
        ))}
      </ol>

      <div className={styles.grid}>
        <section>
          <MapView route={order.route} courierStep={order.courierStep} showCourier={order.status === 'en_camino'} />
          <p className={styles.note}>
            {order.status === 'en_camino' && `Tu repartidor está en ${here?.name}. `}
            {order.status === 'entregado' && '¡Pedido entregado! Buen provecho. '}
            {order.distanceKm} km · {order.etaMin} min estimados
          </p>
          <ul className={styles.items}>
            {order.items.map((i) => (
              <li key={i.id}>
                <span>{i.qty}× {i.name}</span>
                <span>{formatCOP(i.qty * i.price)}</span>
              </li>
            ))}
            <li className={styles.total}>
              <span>Total</span>
              <strong>{formatCOP(order.total)}</strong>
            </li>
          </ul>
        </section>
        <section>
          <h2>Chat con la cocina</h2>
          <ChatBox orderId={order.id} role="user" />
        </section>
      </div>
    </>
  );
}
