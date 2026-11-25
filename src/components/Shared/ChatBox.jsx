import { useEffect, useRef, useState } from 'react';
import { useChat } from '../../hooks/useChat';
import styles from './ChatBox.module.scss';

// role: 'user' | 'admin' (quién escribe desde esta pantalla)
export default function ChatBox({ orderId, role }) {
  const { messages, send } = useChat(orderId);
  const [text, setText] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' });
  }, [messages]);

  const submit = async (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setText('');
    await send(value, role);
  };

  return (
    <section className={styles.chat} aria-label="Chat del pedido">
      <ul className={styles.list}>
        {messages.length === 0 && (
          <li className={styles.empty}>
            {role === 'user' ? 'Escríbele a la cocina si necesitas algo del pedido.' : 'Aún no hay mensajes.'}
          </li>
        )}
        {messages.map((m) => (
          <li key={m.id} className={m.sender === role ? styles.mine : styles.theirs}>
            {m.text}
          </li>
        ))}
        <li ref={endRef} />
      </ul>
      <form onSubmit={submit} className={styles.form}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje"
          aria-label="Mensaje"
        />
        <button className="btn btn--primary">Enviar</button>
      </form>
    </section>
  );
}
