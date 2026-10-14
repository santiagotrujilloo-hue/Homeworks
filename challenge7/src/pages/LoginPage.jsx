import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import AuthShell from "../layouts/AuthShell";
import useAuth from "../hooks/useAuth";

function LoginPage() {
  const { login, isPending, error, clearError } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  // Al entrar a la página no mostramos errores de otra pantalla
  useEffect(() => clearError, [clearError]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Si sale bien, PublicRoute redirige solo a /tasks
    await login(form.email, form.password);
  };

  return (
    <AuthShell
      stamp="Entrada"
      title="Lo que anotas aquí, se termina."
      subtitle="Inicia sesión para abrir tu bitácora de tareas guardada en Firebase."
    >
      <h2 className="ticket__title">Iniciar sesión</h2>

      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Correo</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="tu@correo.com"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="••••••"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <Button type="submit" className="w-100 btn-ink" disabled={isPending}>
          {isPending ? <Spinner size="sm" animation="border" /> : "Entrar"}
        </Button>
      </Form>

      <p className="ticket__switch">
        ¿Primera vez? <Link to="/register">Crea tu cuenta</Link>
      </p>
    </AuthShell>
  );
}

export default LoginPage;
