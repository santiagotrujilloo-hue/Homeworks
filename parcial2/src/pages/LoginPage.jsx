import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "../layouts/AuthShell";
import useAuth from "../hooks/useAuth";

function LoginPage() {
  const { login, isPending, error, clearError } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => clearError, [clearError]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form.email, form.password); // PublicRoute redirige al explorador
  };

  return (
    <AuthShell title="Iniciar sesión" subtitle="Entra para ver y organizar el árbol de carpetas.">
      <form onSubmit={handleSubmit} noValidate>
        <label className="label" htmlFor="email">Correo</label>
        <input id="email" name="email" type="email" className="field" autoComplete="email"
          placeholder="tu@correo.com" value={form.email} onChange={handleChange} />

        <label className="label" htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" className="field"
          autoComplete="current-password" placeholder="••••••" value={form.password} onChange={handleChange} />

        {error && <p className="alert" role="alert">{error}</p>}

        <button className="btn btn--primary btn--block" disabled={isPending}>
          {isPending ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <p className="auth__switch">
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </AuthShell>
  );
}

export default LoginPage;
