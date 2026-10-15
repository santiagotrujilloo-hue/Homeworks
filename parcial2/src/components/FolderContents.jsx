import useFileSystem from "../hooks/useFileSystem";
import { FileIcon, FolderIcon } from "./icons";
import { extension } from "../utils/extension";

function FolderContents() {
  const { arbol, seleccionado, seleccionar } = useFileSystem();

  if (seleccionado.esArchivo()) {
    const ext = extension(seleccionado.nombre);
    return (
      <div className="file-sheet">
        <div className="file-sheet__icon">
          <FileIcon />
          {ext && <span>.{ext}</span>}
        </div>
        <div>
          <h2>{seleccionado.nombre}</h2>
          <p className="mono">{arbol.rutaTexto(seleccionado.id)}</p>
          <p>Nodo hoja · nivel {seleccionado.nivel} · sin hijos</p>
        </div>
      </div>
    );
  }

  if (seleccionado.hijos.length === 0) {
    return (
      <div className="empty">
        <FolderIcon />
        <p>Carpeta vacía. Crea una carpeta o un archivo aquí.</p>
      </div>
    );
  }

  return (
    <ul className="tiles">
      {seleccionado.hijos.map((hijo) => (
        <li key={hijo.id}>
          <button
            type="button"
            className={`tile tile--${hijo.tipo}`}
            onClick={() => seleccionar(hijo.id)}
            title={hijo.nombre}
          >
            {hijo.esCarpeta() ? <FolderIcon /> : <FileIcon />}
            <span className="tile__name">{hijo.nombre}</span>
            <span className="tile__meta mono">
              {hijo.esCarpeta()
                ? `${hijo.hijos.length} elemento${hijo.hijos.length === 1 ? "" : "s"}`
                : extension(hijo.nombre) || "archivo"}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default FolderContents;
