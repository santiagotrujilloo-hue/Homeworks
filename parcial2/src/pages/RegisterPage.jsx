import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "../layouts/AuthShell";
import useAuth from "../hooks/useAuth";

function RegisterPage() {
  const { register, isPending, error, clearError } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [localError, setLocalError] = useState("");

  useEffect(() => clearError, [clearError]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalError("");
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setLocalError("Escribe tu nombre.");
    if (form.password.length < 6) return setLocalError("La contraseña debe tener al menos 6 caracteres.");
    if (form.password !== form.confirm) return setLocalError("Las contraseñas no coinciden.");
    await register(form.name, form.email, form.password);
  };

  const message = localError || error;

  return (
    <AuthShell title="Crear cuenta" subtitle="Solo los usuarios registrados pueden crear carpetas y archivos.">
      <form onSubmit={handleSubmit} noValidate>
        <label className="label" htmlFor="name">Nombre</label>
        <input id="name" name="name" className="field" autoComplete="name"
          placeholder="¿Cómo te llamas?" value={form.name} onChange={handleChange} />

        <label className="label" htmlFor="email">Correo</label>
        <input id="email" name="email" type="email" className="field" autoComplete="email"
          placeholder="tu@correo.com" value={form.email} onChange={handleChange} />

        <div className="two">
          <div>
            <label className="label" htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" className="field"
              autoComplete="new-password" placeholder="mín. 6" value={form.password} onChange={handleChange} />
          </div>
          <div>
            <label className="label" htmlFor="confirm">Repetir</label>
            <input id="confirm" name="confirm" type="password" className="field"
              autoComplete="new-password" placeholder="otra vez" value={form.confirm} onChange={handleChange} />
          </div>
        </div>

        {message && <p className="alert" role="alert">{message}</p>}

        <button className="btn btn--primary btn--block" disabled={isPending}>
          {isPending ? "Creando…" : "Crear cuenta"}
        </button>
      </form>

      <p className="auth__switch">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </AuthShell>
  );
}

export default RegisterPage;
