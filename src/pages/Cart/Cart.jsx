import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import MapView from '../../components/Shared/MapView';
import { ORIGIN, PLACES, buildCaliGraph, etaMinutes } from '../../helpers/cali';
import { formatCOP } from '../../helpers/format';
import styles from './Cart.module.scss';

export default function Cart() {
  const { items, total, canUndo, changeQty, remove, undo, clear } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [dest, setDest] = useState('univalle');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // GRAFO + Dijkstra: ruta más corta desde la cocina hasta el barrio elegido.
  const graph = useMemo(buildCaliGraph, []);
  const { path, distance } = useMemo(() => graph.dijkstra(ORIGIN, dest), [graph, dest]);
  const eta = etaMinutes(distance);

  const confirm = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/carrito' } });
      return;
    }
    setBusy(true);
    setError('');
    try {
      const ref = await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        userName: profile?.name ?? user.email,
        items,
        total,
        destination: dest,
        route: path,
        distanceKm: Number(distance.toFixed(1)),
        etaMin: eta,
        status: 'pendiente',
        courierStep: 0,
        createdAt: serverTimestamp(),
      });
      clear();
      navigate(`/cuenta/pedidos/${ref.id}`);
    } catch {
      setError('No pudimos enviar el pedido. Revisa tu conexión e intenta de nuevo.');
      setBusy(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="empty">
        <p>Tu carrito está vacío.</p>
        <p><Link to="/menu">Elige algo del menú</Link></p>
        {canUndo && <button className="btn btn--ghost" onClick={undo}>Deshacer último cambio</button>}
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <section>
        <div className={styles.head}>
          <h1>Tu carrito</h1>
          <button className="btn btn--ghost" onClick={undo} disabled={!canUndo}>Deshacer</button>
        </div>
        <ul className={styles.list}>
          {items.map((i) => (
            <li key={i.id}>
              <span className={styles.emoji}>{i.emoji}</span>
              <div className={styles.info}>
                <strong>{i.name}</strong>
                <span>{formatCOP(i.price)}</span>
              </div>
              <div className={styles.qty}>
                <button onClick={() => changeQty(i.id, -1)} aria-label={`Quitar uno de ${i.name}`}>−</button>
                <span>{i.qty}</span>
                <button onClick={() => changeQty(i.id, 1)} aria-label={`Agregar uno de ${i.name}`}>+</button>
              </div>
              <button className={styles.remove} onClick={() => remove(i.id)}>Quitar</button>
            </li>
          ))}
        </ul>
      </section>

      <aside className={styles.side}>
        <h2>Entrega</h2>
        <label className={styles.field}>
          Barrio de entrega
          <select value={dest} onChange={(e) => setDest(e.target.value)}>
            {PLACES.filter((p) => p.id !== ORIGIN).map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>
        <MapView route={path} />
        <p className={styles.eta}>
          {distance.toFixed(1)} km · llega en unos {eta} min
        </p>
        <p className={styles.total}>Total <strong>{formatCOP(total)}</strong></p>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <button className="btn btn--primary" onClick={confirm} disabled={busy}>
          {user ? (busy ? 'Enviando…' : 'Confirmar pedido') : 'Inicia sesión para pedir'}
        </button>
      </aside>
    </div>
  );
}
