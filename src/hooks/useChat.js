import { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

// Chat en tiempo real por pedido: orders/{id}/messages
export function useChat(orderId) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!orderId) return undefined;
    const q = query(collection(db, 'orders', orderId, 'messages'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snap) =>
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, [orderId]);

  const send = (text, sender) =>
    addDoc(collection(db, 'orders', orderId, 'messages'), {
      text,
      sender, // 'user' | 'admin'
      createdAt: serverTimestamp(),
    });

  return { messages, send };
}
