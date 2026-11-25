import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authErrorMessage } from '../../helpers/format';
import styles from './AuthForm.module.scss';

export default function AuthForm({ mode }) {
  const isRegister = mode === 'register';
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (isRegister) await register(form.name.trim(), form.email.trim(), form.password);
      else await login(form.email.trim(), form.password);
      navigate(location.state?.from ?? '/', { replace: true });
    } catch (err) {
      setError(authErrorMessage(err.code));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className={styles.wrap}>
      <h1>{isRegister ? 'Crea tu cuenta' : 'Inicia sesión'}</h1>
      <form onSubmit={submit} className={styles.form}>
        {isRegister && (
          <label>
            Nombre
            <input value={form.name} onChange={set('name')} required autoComplete="name" />
          </label>
        )}
        <label>
          Correo
          <input type="email" value={form.email} onChange={set('email')} required autoComplete="email" />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={form.password}
            onChange={set('password')}
            required
            minLength={6}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
          />
        </label>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <button className="btn btn--primary" disabled={busy}>
          {busy ? 'Un momento…' : isRegister ? 'Crear cuenta' : 'Entrar'}
        </button>
      </form>
      <p className={styles.alt}>
        {isRegister ? (
          <>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></>
        ) : (
          <>¿Eres nuevo? <Link to="/registro">Crea tu cuenta</Link></>
        )}
      </p>
    </section>
  );
}
