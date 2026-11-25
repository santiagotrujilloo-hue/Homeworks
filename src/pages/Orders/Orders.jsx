import { Link } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { STATUS, formatCOP } from '../../helpers/format';
import { placeById } from '../../helpers/cali';
import styles from './Orders.module.scss';

export default function Orders() {
  const { orders, loading } = useOrders('user');

  if (loading) return <p>Cargando tus pedidos…</p>;

  return (
    <>
      <h1 className={styles.title}>Mis pedidos</h1>
      {orders.length === 0 ? (
        <p className="empty">Aún no has pedido nada. <Link to="/menu">Ir al menú</Link></p>
      ) : (
        <ul className={styles.list}>
          {orders.map((o) => (
            <li key={o.id}>
              <Link to={`/cuenta/pedidos/${o.id}`}>
                <div>
                  <strong>{o.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}</strong>
                  <p>Entrega en {placeById(o.destination)?.name}</p>
                </div>
                <div className={styles.right}>
                  <span className={`${styles.badge} ${styles[o.status]}`}>{STATUS[o.status]}</span>
                  <strong>{formatCOP(o.total)}</strong>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
