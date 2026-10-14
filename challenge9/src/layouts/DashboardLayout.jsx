import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function DashboardLayout() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-area">
        <header className="topbar">
          <div>
            <span>ESTRUCTURAS DE DATOS</span>

            <h1>Árbol N-ario de navegación</h1>
          </div>

          <div className="status">
            <div className="status-dot"></div>

            <div>
              <small>ESTRUCTURA</small>
              <strong>Activa</strong>
            </div>
          </div>
        </header>

        <section className="page-area">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;