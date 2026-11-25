import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { SEED_PRODUCTS } from '../helpers/seedProducts';

// Productos en tiempo real. Si la colección está vacía usa los de ejemplo.
export function useProducts() {
  const [products, setProducts] = useState(SEED_PRODUCTS);

  useEffect(
    () =>
      onSnapshot(
        collection(db, 'products'),
        (snap) => {
          if (!snap.empty) setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        },
        () => setProducts(SEED_PRODUCTS)
      ),
    []
  );

  return products;
}
