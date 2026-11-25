import { createContext, useContext, useRef, useState } from 'react';
import { Stack } from '../helpers/dataStructures/Stack';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [canUndo, setCanUndo] = useState(false);
  // PILA: cada cambio guarda el estado anterior; "Deshacer" hace pop.
  const history = useRef(new Stack());

  const commit = (next) => {
    history.current.push(items);
    setCanUndo(true);
    setItems(next);
  };

  const add = (product) => {
    const exists = items.find((i) => i.id === product.id);
    commit(
      exists
        ? items.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
        : [...items, { id: product.id, name: product.name, price: product.price, emoji: product.emoji, qty: 1 }]
    );
  };

  const changeQty = (id, delta) =>
    commit(
      items
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );

  const remove = (id) => commit(items.filter((i) => i.id !== id));

  const undo = () => {
    const previous = history.current.pop();
    if (previous) setItems(previous);
    setCanUndo(!history.current.isEmpty());
  };

  const clear = () => {
    history.current = new Stack();
    setCanUndo(false);
    setItems([]);
  };

  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((n, i) => n + i.qty * i.price, 0);

  return (
    <CartContext.Provider value={{ items, count, total, canUndo, add, changeQty, remove, undo, clear }}>
      {children}
    </CartContext.Provider>
  );
}
