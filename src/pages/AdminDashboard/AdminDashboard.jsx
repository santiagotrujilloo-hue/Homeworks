import { useMemo, useState } from 'react';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useOrders } from '../../hooks/useOrders';
import { Queue } from '../../helpers/dataStructures/Queue';
import { SEED_PRODUCTS } from '../../helpers/seedProducts';
import { STATUS, formatCOP, seconds } from '../../helpers/format';
import { placeById } from '../../helpers/cali';
import ChatBox from '../../components/Shared/ChatBox';
import styles from './AdminDashboard.module.scss';

export default function AdminDashboard() {
  const { orders, loading } = useOrders('all');
  const [chatId, setChatId] = useState(null);
  const [seeded, setSeeded] = useState(false);

  // COLA (FIFO): los pedidos pendientes se atienden en orden de llegada.
  const queue = useMemo(() => {
    const q = new Queue();
    orders
      .filter((o) => o.status === 'pendiente')
      .sort((a, b) => seconds(a) - seconds(b))
      .forEach((o) => q.enqueue(o));
    return q;
  }, [orders]);

  const next = queue.peek();
  const active = orders.filter((o) => o.status === 'preparando' || o.status === 'en_camino');
  const chatOrder = orders.find((o) => o.id === chatId);

  const attendNext = () => {
    const order = queue.dequeue();
    if (order) updateDoc(doc(db, 'orders', order.id), { status: 'preparando' });
  };

  const advance = (o) => {
    const ref = doc(db, 'orders', o.id);
    if (o.status === 'preparando') return updateDoc(ref, { status: 'en_camino', courierStep: 0 });
    const last = o.route.length - 1;
    if (o.courierStep >= last - 1) return updateDoc(ref, { status: 'entregado', courierStep: last });
    return updateDoc(ref, { courierStep: o.courierStep + 1 });
  };

  const seed = async () => {
    const batch = writeBatch(db);
    SEED_PRODUCTS.forEach(({ id, ...data }) => batch.set(doc(db, 'products', id), data));
    await batch.commit();
    setSeeded(true);
  };

  if (loading) return <p>Cargando pedidos…</p>;

  return (
    <>
      <div className={styles.top}>
        <h1>Panel de pedidos</h1>
        <button className="btn btn--ghost" onClick={seed} disabled={seeded}>
          {seeded ? 'Productos cargados' : 'Cargar productos a la base de datos'}
        </button>
      </div>

      <section className={styles.queue}>
        <div>
          <h2>Cola de pedidos pendientes ({queue.size})</h2>
          {next ? (
            <p>
              Sigue {next.userName}: {next.items.map((i) => `${i.qty}× ${i.name}`).join(', ')} ·{' '}
              {formatCOP(next.total)}
            </p>
          ) : (
            <p>No hay pedidos esperando.</p>
          )}
        </div>
        <button className="btn btn--primary" onClick={attendNext} disabled={!next}>
          Atender siguiente
        </button>
      </section>

      <div className={styles.grid}>
        <section>
          <h2>En curso</h2>
          {active.length === 0 ? (
            <p className="empty">Ningún pedido en preparación o en camino.</p>
          ) : (
            <ul className={styles.list}>
              {active.map((o) => (
                <li key={o.id}>
                  <div>
                    <strong>{o.userName}</strong>
                    <p>
                      {STATUS[o.status]} · {placeById(o.destination)?.name}
                    </p>
                  </div>
                  <div className={styles.btns}>
                    <button className="btn btn--ghost" onClick={() => setChatId(o.id)}>Chat</button>
                    <button className="btn btn--primary" onClick={() => advance(o)}>
                      {o.status === 'preparando' ? 'Sacar a reparto' : 'Avanzar repartidor'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2>Chat{chatOrder ? ` con ${chatOrder.userName}` : ''}</h2>
          {chatOrder ? (
            <ChatBox key={chatOrder.id} orderId={chatOrder.id} role="admin" />
          ) : (
            <p className="empty">Elige “Chat” en un pedido para responder al cliente.</p>
          )}
        </section>
      </div>
    </>
  );
}
