import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function PrivateLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            P
          </div>

          <div>
            <span>ÁREA PRIVADA</span>
            <h2>Portal</h2>
          </div>
        </div>

        <div className="sidebar-label">
          NAVEGACIÓN
        </div>

        <nav>
          <NavLink
            to="/exercise-one"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            <span className="nav-number">
              01
            </span>

            <div>
              <strong>
                Ejercicio uno
              </strong>

              <small>
                Pila de libros
              </small>
            </div>
          </NavLink>

          <NavLink
            to="/exercise-two"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            <span className="nav-number">
              02
            </span>

            <div>
              <strong>
                Ejercicio dos
              </strong>

              <small>
                Cola del cajero
              </small>
            </div>
          </NavLink>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.email
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <div className="user-info">
            <small>
              SESIÓN INICIADA COMO
            </small>

            <strong>
              {user?.email}
            </strong>
          </div>

          <button
            onClick={cerrarSesion}
            className="logout-icon"
            title="Cerrar sesión"
          >
            ×
          </button>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span>
              ÁREA PRIVADA
            </span>

            <h1>
              Panel de ejercicios
            </h1>
          </div>

          <div className="current-user">
            <span>
              Usuario actual
            </span>

            <strong>
              {user?.username}
            </strong>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </section>
    </div>
  );
}

export default PrivateLayout;