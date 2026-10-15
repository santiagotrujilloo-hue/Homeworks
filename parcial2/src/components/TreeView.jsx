import useFileSystem from "../hooks/useFileSystem";
import { NodeIcon } from "./icons";

// Se dibuja recorriendo el árbol en profundidad (DFS) de forma recursiva
function TreeItem({ nodo }) {
  const { seleccionado, seleccionar, expandidos, alternar } = useFileSystem();
  const abierto = expandidos.has(nodo.id);
  const activo = seleccionado.id === nodo.id;
  const tieneHijos = nodo.hijos.length > 0;

  return (
    <li className="tree__item" role="treeitem" aria-expanded={nodo.esCarpeta() ? abierto : undefined} aria-selected={activo}>
      <div className={`tree__row ${activo ? "is-active" : ""}`}>
        {nodo.esCarpeta() ? (
          <button
            type="button"
            className={`tree__caret ${abierto ? "is-open" : ""}`}
            onClick={() => alternar(nodo.id)}
            disabled={!tieneHijos}
            aria-label={abierto ? "Contraer" : "Expandir"}
          >
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2.5 8 6l-4 3.5" /></svg>
          </button>
        ) : (
          <span className="tree__caret tree__caret--leaf" aria-hidden="true" />
        )}

        <button type="button" className="tree__label" onClick={() => seleccionar(nodo.id)}>
          <NodeIcon nodo={nodo} open={abierto && tieneHijos} />
          <span className="tree__name">{nodo.nombre}</span>
          {nodo.esCarpeta() && tieneHijos && <span className="tree__count">{nodo.hijos.length}</span>}
        </button>
      </div>

      {nodo.esCarpeta() && abierto && tieneHijos && (
        <ul className="tree__children" role="group">
          {nodo.hijos.map((hijo) => (
            <TreeItem key={hijo.id} nodo={hijo} />
          ))}
        </ul>
      )}
    </li>
  );
}

function TreeView() {
  const { arbol } = useFileSystem();

  return (
    <ul className="tree" role="tree" aria-label="Árbol de carpetas">
      <TreeItem nodo={arbol.raiz} />
    </ul>
  );
}

export default TreeView;
