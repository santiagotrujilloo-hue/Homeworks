import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
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
    if (form.password.length < 6)
      return setLocalError("La contraseña debe tener al menos 6 caracteres.");
    if (form.password !== form.confirm)
      return setLocalError("Las contraseñas no coinciden.");

    // createUserWithEmailAndPassword deja la sesión iniciada → PublicRoute lleva a /tasks
    await register(form.name, form.email, form.password);
  };

  const message = localError || error;

  return (
    <AuthShell
      stamp="Registro"
      title="Abre una bitácora nueva."
      subtitle="Crea tu cuenta con correo y contraseña. Tus tareas quedan guardadas solo para ti."
    >
      <h2 className="ticket__title">Crear cuenta</h2>

      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            name="name"
            placeholder="¿Cómo te llamas?"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Correo</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="tu@correo.com"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="row g-3 mb-4">
          <Form.Group className="col-sm-6" controlId="password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Mín. 6 caracteres"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="col-sm-6" controlId="confirm">
            <Form.Label>Repetir</Form.Label>
            <Form.Control
              type="password"
              name="confirm"
              placeholder="Otra vez"
              autoComplete="new-password"
              value={form.confirm}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        {message && <Alert variant="danger">{message}</Alert>}

        <Button type="submit" className="w-100 btn-ink" disabled={isPending}>
          {isPending ? <Spinner size="sm" animation="border" /> : "Crear cuenta"}
        </Button>
      </Form>

      <p className="ticket__switch">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </AuthShell>
  );
}

export default RegisterPage;
