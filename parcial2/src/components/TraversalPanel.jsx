import { useState } from "react";
import useFileSystem from "../hooks/useFileSystem";

const MODOS = {
  dfs: { label: "DFS", ayuda: "Profundidad: baja por cada rama antes de pasar a la siguiente." },
  bfs: { label: "BFS", ayuda: "Anchura: recorre nivel por nivel, de izquierda a derecha." },
};

function TraversalPanel() {
  const { arbol, seleccionado, seleccionar } = useFileSystem();
  const [modo, setModo] = useState("dfs");
  const stats = arbol.contar();

  // Se recorre desde la raíz; el nodo seleccionado se resalta
  const recorrido = modo === "dfs" ? arbol.dfs() : arbol.bfs();

  return (
    <section className="panel">
      <h3 className="panel__title">Árbol n-ario</h3>

      <div className="stats">
        <div><strong>{stats.carpetas}</strong><span>carpetas</span></div>
        <div><strong>{stats.archivos}</strong><span>archivos</span></div>
        <div><strong>{arbol.altura()}</strong><span>altura</span></div>
      </div>

      <div className="tabs" role="tablist">
        {Object.entries(MODOS).map(([key, { label }]) => (
          <button
            key={key}
            role="tab"
            aria-selected={modo === key}
            className={modo === key ? "is-on" : ""}
            onClick={() => setModo(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="panel__note">{MODOS[modo].ayuda}</p>

      <ol className="walk">
        {recorrido.map((n, i) => (
          <li key={n.id}>
            <button
              type="button"
              className={`walk__step walk__step--${n.tipo} ${n.id === seleccionado.id ? "is-active" : ""}`}
              onClick={() => seleccionar(n.id)}
              style={{ "--nivel": n.nivel }}
            >
              <span className="walk__i mono">{i + 1}</span>
              {n.id === "raiz" ? "raíz" : n.nombre}
              <span className="walk__lvl mono">n{n.nivel}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default TraversalPanel;
