import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildProductTrie } from '../../helpers/dataStructures/Trie';
import { useProducts } from '../../hooks/useProducts';
import styles from './SearchBar.module.scss';

// Autocompletado con TRIE: cada letra consulta el árbol de prefijos.
export default function SearchBar() {
  const products = useProducts();
  const trie = useMemo(() => buildProductTrie(products), [products]);
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const suggestions = value.trim() ? trie.search(value, 5) : [];

  const go = (q) => navigate(`/menu?q=${encodeURIComponent(q)}`);

  return (
    <form
      className={styles.bar}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        go(value);
      }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Marranitas, cholado, sancocho…"
        aria-label="Buscar comida"
        autoComplete="off"
      />
      <button className="btn btn--primary">Buscar</button>
      {suggestions.length > 0 && (
        <ul className={styles.list}>
          {suggestions.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => go(p.name)}>
                <span>{p.emoji}</span> {p.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
