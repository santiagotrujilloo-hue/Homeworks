import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/Shared/SearchBar';
import ProductCard from '../../components/Index/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { topN } from '../../helpers/dataStructures/Heap';
import styles from './Home.module.scss';

export default function Home() {
  const products = useProducts();
  // HEAP: los 5 productos mejor calificados.
  const top = useMemo(() => topN(products, 5, (a, b) => b.rating - a.rating), [products]);

  return (
    <>
      <section className={styles.hero}>
        <h1>¿Qué se te antoja hoy en Cali?</h1>
        <p>Comida valluna recién hecha, con seguimiento del repartidor en el mapa.</p>
        <SearchBar />
      </section>

      <section className={styles.section}>
        <div className={styles.head}>
          <h2>Los más pedidos</h2>
          <Link to="/menu">Ver todo el menú</Link>
        </div>
        <div className="grid">
          {top.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
