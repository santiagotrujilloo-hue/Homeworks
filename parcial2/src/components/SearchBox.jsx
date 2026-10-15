import { useState } from "react";
import useFileSystem from "../hooks/useFileSystem";
import { NodeIcon } from "./icons";

function SearchBox() {
  const { arbol, seleccionar } = useFileSystem();
  const [texto, setTexto] = useState("");
  const resultados = arbol.buscarPorNombre(texto).slice(0, 8);

  return (
    <div className="search">
      <input
        className="field field--search"
        type="search"
        placeholder="Buscar en el árbol…"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        aria-label="Buscar"
      />
      {texto.trim() && (
        <ul className="search__results">
          {resultados.length === 0 && <li className="search__empty">Sin resultados</li>}
          {resultados.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => {
                  seleccionar(n.id);
                  setTexto("");
                }}
              >
                <NodeIcon nodo={n} />
                <span>{n.nombre}</span>
                <small className="mono">{arbol.rutaTexto(n.id)}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBox;
