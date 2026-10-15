import useFileSystem from "../hooks/useFileSystem";

function PathBar() {
  const { arbol, seleccionado, seleccionar } = useFileSystem();
  const ruta = arbol.ruta(seleccionado.id);

  return (
    <nav className="pathbar" aria-label="Ruta">
      {ruta.map((nodo, i) => (
        <span key={nodo.id} className="pathbar__part">
          {i > 0 && <span className="pathbar__sep">/</span>}
          <button
            type="button"
            onClick={() => seleccionar(nodo.id)}
            aria-current={i === ruta.length - 1 ? "page" : undefined}
          >
            {i === 0 ? "raíz" : nodo.nombre}
          </button>
        </span>
      ))}
    </nav>
  );
}

export default PathBar;
