import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Tareas from "./components/Tareas";
import Avatar from "./components/Avatar";
import "./App.css";

function App() {
  // ESTADOS DE AUTENTICACIÓN
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [modoRegistro, setModoRegistro] = useState(false);

  // DATOS DEL FORMULARIO
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // MENSAJES Y CARGA
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // VERIFICAR SI HAY SESIÓN ACTIVA
  useEffect(() => {
    if (!supabase) return;

    let activo = true;

    const verificarSesion = async () => {
      try {
        const { data, error: sesionError } =
          await supabase.auth.getSession();

        if (sesionError) throw sesionError;

        if (activo) {
          setUsuario(data.session?.user ?? null);
        }
      } catch (err) {
        if (activo) setError(err.message);
      } finally {
        if (activo) setCargandoSesion(false);
      }
    };

    verificarSesion();

    // ESCUCHAR CAMBIOS DE AUTENTICACIÓN
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_evento, session) => {
        if (activo) {
          setUsuario(session?.user ?? null);
          setCargandoSesion(false);
        }
      }
    );

    return () => {
      activo = false;
      subscription.unsubscribe();
    };
  }, []);

  // REGISTRO E INICIO DE SESIÓN
  const manejarAutenticacion = async (e) => {
    e.preventDefault();

    if (!supabase) return;

    setCargando(true);
    setError("");
    setMensaje("");

    try {
      const correo = email.trim();

      if (modoRegistro) {
        const { data, error: registroError } =
          await supabase.auth.signUp({
            email: correo,
            password,
          });

        if (registroError) throw registroError;

        if (data.session) {
          setMensaje("Cuenta creada correctamente.");
        } else {
          setMensaje(
            "Revisa tu correo electrónico para confirmar tu cuenta."
          );
        }
      } else {
        const { error: loginError } =
          await supabase.auth.signInWithPassword({
            email: correo,
            password,
          });

        if (loginError) throw loginError;

        setMensaje("Inicio de sesión exitoso.");
      }

      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // CERRAR SESIÓN
  const cerrarSesion = async () => {
    if (!supabase) return;

    setError("");
    setMensaje("");
    setCargando(true);

    try {
      const { error: salidaError } =
        await supabase.auth.signOut();

      if (salidaError) throw salidaError;

      setUsuario(null);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // CAMBIAR ENTRE REGISTRO Y LOGIN
  const cambiarModo = () => {
    setModoRegistro((anterior) => !anterior);
    setError("");
    setMensaje("");
    setPassword("");
  };

  // COMPROBAR CONFIGURACIÓN DE SUPABASE
  if (!supabase) {
    return (
      <div className="app">
        <header className="header">
          <h1>Challenge 10</h1>
        </header>

        <main className="container">
          <section className="auth-card">
            <h2>Falta configurar Supabase</h2>
            <p>
              Revisa las variables del archivo .env.local.
            </p>
          </section>
        </main>
      </div>
    );
  }

  // PANTALLA DE CARGA
  if (cargandoSesion) {
    return (
      <div className="app">
        <main className="container">
          <p className="loading-text">
            Verificando sesión...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      {/* ENCABEZADO */}
      <header className="header">
        <h1>Challenge 10</h1>
        <p>Gestor de tareas con React y Supabase</p>
      </header>

      <main className="container">
        {usuario ? (
          // PANEL DEL USUARIO AUTENTICADO
          <section className="dashboard-card">

            <div className="dashboard-header">
              <div>
                <h2>Bienvenido</h2>

                <p>
                  Sesión iniciada como:
                  <strong> {usuario.email}</strong>
                </p>
              </div>

              <button
                type="button"
                className="logout-button"
                onClick={cerrarSesion}
                disabled={cargando}
              >
                Cerrar sesión
              </button>
            </div>

            {/* FOTO DE PERFIL */}
            <Avatar
              key={usuario.id}
              usuario={usuario}
            />

            {/* GESTIÓN DE TAREAS */}
            <Tareas usuario={usuario} />

          </section>
        ) : (
          // REGISTRO E INICIO DE SESIÓN
          <section className="auth-card">
            <h2>
              {modoRegistro
                ? "Crear una cuenta"
                : "Iniciar sesión"}
            </h2>

            <p>
              {modoRegistro
                ? "Regístrate para organizar tus tareas."
                : "Ingresa para administrar tus tareas."}
            </p>

            <form
              className="auth-form"
              onSubmit={manejarAutenticacion}
            >
              <label htmlFor="email">
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="password">
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                minLength={6}
                required
              />

              <button
                type="submit"
                className="primary-button"
                disabled={cargando}
              >
                {cargando
                  ? "Procesando..."
                  : modoRegistro
                  ? "Registrarse"
                  : "Iniciar sesión"}
              </button>
            </form>

            <p className="auth-switch">
              {modoRegistro
                ? "¿Ya tienes una cuenta?"
                : "¿No tienes una cuenta?"}
            </p>

            <button
              type="button"
              className="switch-button"
              onClick={cambiarModo}
            >
              {modoRegistro
                ? "Ir a iniciar sesión"
                : "Crear una cuenta"}
            </button>
          </section>
        )}

        {/* MENSAJES */}
        {mensaje && (
          <p className="success-message" role="status">
            {mensaje}
          </p>
        )}

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="footer">
        <p>
          Challenge 10 — Estructura de Datos y Algoritmos
        </p>
      </footer>
    </div>
  );
}

export default App;