import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useFileSystem from "../hooks/useFileSystem";

function AppLayout() {
  const { user, logout } = useAuth();
  const { refrescar, isPending } = useFileSystem();

  return (
    <div className="shell">
      <header className="topbar">
        <span className="brand mono">
          raíz<b>/</b>
        </span>
        <span className="topbar__tag">árbol n-ario de carpetas</span>

        <div className="topbar__right">
          <button className="btn btn--ghost btn--sm" onClick={refrescar} disabled={isPending}>
            {isPending ? "Sincronizando…" : "Actualizar"}
          </button>
          <span className="user mono" title={user?.email}>
            {user?.email}
          </span>
          <button className="btn btn--ghost btn--sm" onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      <Outlet />
    </div>
  );
}

export default AppLayout;
