import { useState } from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return (
      <Navigate
        to="/exercise-one"
        replace
      />
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = login(
      form.email,
      form.password
    );

    if (success) {
      navigate("/exercise-one");
    } else {
      setError(
        "El correo o la contraseña son incorrectos."
      );
    }
  };

  return (
    <div className="login-screen">
      <div className="login-decoration">
        <span>CHALLENGE 06</span>

        <h1>
          Acceso privado
          <br />
          de forma sencilla.
        </h1>

        <p>
          Inicia sesión para acceder a los ejercicios
          protegidos de la aplicación.
        </p>

        <div className="security-message">
          <div>✓</div>

          <span>
            Rutas protegidas mediante
            <strong> React Context</strong>
          </span>
        </div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-top">
            <span>BIENVENIDO</span>

            <h2>Iniciar sesión</h2>

            <p>
              Ingresa tus credenciales para continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email">
                Correo electrónico
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">
                Contraseña
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              className="login-button"
              type="submit"
            >
              Iniciar sesión
              <span>→</span>
            </button>
          </form>

          <div className="demo-account">
            <span>CUENTA DE PRUEBA</span>

            <p>
              user@mail.com
              <strong> / </strong>
              123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;