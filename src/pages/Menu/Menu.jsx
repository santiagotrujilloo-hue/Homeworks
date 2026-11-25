import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/Index/ProductCard';
import SearchBar from '../../components/Shared/SearchBar';
import { buildProductTrie } from '../../helpers/dataStructures/Trie';
import { useProducts } from '../../hooks/useProducts';
import styles from './Menu.module.scss';

export default function Menu() {
  const products = useProducts();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const category = params.get('cat') ?? 'Todos';

  const trie = useMemo(() => buildProductTrie(products), [products]);
  const categories = ['Todos', ...new Set(products.map((p) => p.category))];

  const visible = useMemo(() => {
    const base = q ? trie.search(q) : products;
    return category === 'Todos' ? base : base.filter((p) => p.category === category);
  }, [q, category, products, trie]);

  const setCategory = (c) => {
    const next = new URLSearchParams(params);
    if (c === 'Todos') next.delete('cat');
    else next.set('cat', c);
    setParams(next);
  };

  return (
    <>
      <h1 className={styles.title}>Menú</h1>
      <div className={styles.tools}>
        <SearchBar />
        <div className={styles.chips} role="group" aria-label="Categorías">
          {categories.map((c) => (
            <button
              key={c}
              className={c === category ? styles.chipOn : styles.chip}
              aria-pressed={c === category}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      {q && <p className={styles.q}>Resultados para “{q}”</p>}
      {visible.length === 0 ? (
        <p className="empty">No encontramos platos con esa búsqueda. Prueba con otra palabra.</p>
      ) : (
        <div className="grid">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
