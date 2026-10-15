import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useFileSystem from "../hooks/useFileSystem";
import { TIPOS } from "../structures/Nodo";
import { FileIcon, FolderIcon } from "./icons";

function CreatePanel() {
  const { user } = useAuth();
  const { seleccionado, crear, seleccionar, isPending } = useFileSystem();
  const [tipo, setTipo] = useState(TIPOS.CARPETA);
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState(null);

  // Regla del árbol: un archivo es hoja, no puede tener hijos
  const bloqueado = !seleccionado.puedeTenerHijos();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await crear({ nombre, tipo });
    if (res.ok) {
      setNombre("");
      setMensaje(null);
      if (tipo === TIPOS.ARCHIVO) seleccionar(res.id);
    } else {
      setMensaje(res.mensaje);
    }
  };

  if (bloqueado) {
    return (
      <div className="create create--blocked" role="status">
        <FileIcon />
        <p>
          <strong>{seleccionado.nombre}</strong> es un archivo: es una hoja del árbol y no puede
          tener hijos. Selecciona una carpeta para crear algo adentro.
        </p>
      </div>
    );
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <div className="segmented" role="radiogroup" aria-label="Tipo">
        {[
          { value: TIPOS.CARPETA, label: "Carpeta", Icon: FolderIcon },
          { value: TIPOS.ARCHIVO, label: "Archivo", Icon: FileIcon },
        ].map(({ value, label, Icon }) => (
          <label key={value} className={tipo === value ? "is-on" : ""}>
            <input
              type="radio"
              name="tipo"
              value={value}
              checked={tipo === value}
              onChange={() => setTipo(value)}
            />
            <Icon /> {label}
          </label>
        ))}
      </div>

      <input
        className="field"
        value={nombre}
        onChange={(e) => {
          setNombre(e.target.value);
          setMensaje(null);
        }}
        placeholder={tipo === TIPOS.CARPETA ? "nombre de la carpeta" : "archivo.txt"}
        maxLength={80}
        aria-label="Nombre"
      />

      <button className="btn btn--primary" disabled={isPending || !nombre.trim() || !user}>
        Crear en {seleccionado.id === "raiz" ? "raíz" : seleccionado.nombre}
      </button>

      {mensaje && <p className="create__error" role="alert">{mensaje}</p>}
    </form>
  );
}

export default CreatePanel;
