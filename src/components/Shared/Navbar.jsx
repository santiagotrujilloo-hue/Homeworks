import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const { user, profile, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const cls = ({ isActive }) => (isActive ? styles.active : undefined);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <nav className={`container ${styles.nav}`} aria-label="Principal">
        <Link to="/" className={styles.logo}>Cali Delivery</Link>
        <div className={styles.links}>
          <NavLink to="/" end className={cls}>Inicio</NavLink>
          <NavLink to="/menu" className={cls}>Menú</NavLink>
          {user && !isAdmin && <NavLink to="/cuenta/pedidos" className={cls}>Mis pedidos</NavLink>}
          {isAdmin && <NavLink to="/admin" className={cls}>Panel admin</NavLink>}
        </div>
        <div className={styles.actions}>
          <Link to="/carrito" className={styles.cart} aria-label={`Carrito, ${count} productos`}>
            🛒 <span>{count}</span>
          </Link>
          {user ? (
            <>
              <span className={styles.hello}>Hola, {profile?.name?.split(' ')[0] ?? 'tú'}</span>
              <button className="btn btn--ghost" onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost">Iniciar sesión</Link>
              <Link to="/registro" className="btn btn--primary">Crear cuenta</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
