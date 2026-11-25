import { useCart } from '../../context/CartContext';
import { formatCOP } from '../../helpers/format';
import styles from './ProductCard.module.scss';

export default function ProductCard({ product }) {
  const { add } = useCart();
  return (
    <article className={styles.card}>
      <div className={styles.emoji} aria-hidden="true">{product.emoji}</div>
      <div className={styles.body}>
        <h3>{product.name}</h3>
        <p className={styles.meta}>{product.category} · ★ {product.rating}</p>
        <div className={styles.row}>
          <strong>{formatCOP(product.price)}</strong>
          <button className="btn btn--primary" onClick={() => add(product)}>Agregar</button>
        </div>
      </div>
    </article>
  );
}
