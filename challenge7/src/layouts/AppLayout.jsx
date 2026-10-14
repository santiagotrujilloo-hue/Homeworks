import { Outlet } from "react-router-dom";
import { Button, Container, Navbar } from "react-bootstrap";
import useAuth from "../hooks/useAuth";

function AppLayout() {
  const { user, logout, isPending } = useAuth();
  const name = user?.displayName || user?.email;

  // Al cerrar sesión, PrivateRoute detecta que no hay usuario y lleva a /login
  return (
    <div className="app-shell">
      <Navbar className="app-nav" expand={false}>
        <Container className="app-container">
          <Navbar.Brand className="brand-mark">
            Bitácora<em>·07</em>
          </Navbar.Brand>

          <div className="app-nav__user">
            <span className="avatar">{name?.charAt(0).toUpperCase()}</span>
            <span className="d-none d-sm-inline">{name}</span>
            <Button
              variant="outline-dark"
              size="sm"
              className="btn-logout"
              onClick={logout}
              disabled={isPending}
            >
              Salir
            </Button>
          </div>
        </Container>
      </Navbar>

      <Container as="main" className="app-container py-4 py-md-5">
        <Outlet />
      </Container>
    </div>
  );
}

export default AppLayout;
