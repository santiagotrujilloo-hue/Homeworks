import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { seconds } from '../helpers/format';

// scope = 'user' (mis pedidos) | 'all' (admin)
export function useOrders(scope = 'user') {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return undefined;
    const col = collection(db, 'orders');
    const q = scope === 'all' ? col : query(col, where('userId', '==', user.uid));
    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => seconds(b) - seconds(a));
        setOrders(list);
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, [user, scope]);

  return { orders, loading };
}

export function useOrder(id) {
  const [order, setOrder] = useState(null);
  const [state, setState] = useState('loading'); // loading | ok | missing

  useEffect(
    () =>
      onSnapshot(
        doc(db, 'orders', id),
        (snap) => {
          setOrder(snap.exists() ? { id: snap.id, ...snap.data() } : null);
          setState(snap.exists() ? 'ok' : 'missing');
        },
        () => setState('missing')
      ),
    [id]
  );

  return { order, state };
}
