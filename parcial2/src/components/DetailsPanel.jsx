import { useState } from "react";
import useFileSystem from "../hooks/useFileSystem";
import { RAIZ_ID } from "../structures/ArbolNario";

const fecha = (ts) =>
  ts?.toDate
    ? ts.toDate().toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })
    : "—";

function DetailsPanel() {
  const { arbol, seleccionado: nodo, esMio, renombrar, eliminar, isPending } = useFileSystem();
  const [editando, setEditando] = useState(null); // nombre en edición
  const [confirmar, setConfirmar] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  // Al cambiar de nodo se reinicia el estado del panel (key en el padre)
  const esRaiz = nodo.id === RAIZ_ID;
  const propio = esMio(nodo);
  const total = nodo.esCarpeta() ? arbol.contar(nodo).total : 0;

  const guardar = async (e) => {
    e.preventDefault();
    const res = await renombrar(nodo, editando);
    if (res.ok) setEditando(null);
    else setMensaje(res.mensaje);
  };

  const borrar = async () => {
    const res = await eliminar(nodo);
    if (!res.ok) {
      setMensaje(res.mensaje);
      setConfirmar(false);
    }
  };

  return (
    <section className="panel">
      <h3 className="panel__title">Detalles</h3>

      <dl className="props">
        <dt>Tipo</dt>
        <dd>{esRaiz ? "raíz" : nodo.tipo}</dd>
        <dt>Ruta</dt>
        <dd className="mono">{arbol.rutaTexto(nodo.id)}</dd>
        <dt>Nivel</dt>
        <dd>{nodo.nivel}</dd>
        <dt>Hijos</dt>
        <dd>{nodo.esArchivo() ? "no puede tener" : nodo.hijos.length}</dd>
        {nodo.esCarpeta() && (
          <>
            <dt>Subárbol</dt>
            <dd>{total} nodo(s) · altura {arbol.altura(nodo)}</dd>
          </>
        )}
        {!esRaiz && (
          <>
            <dt>Creado por</dt>
            <dd className="mono">{nodo.creadoPor}</dd>
            <dt>Fecha</dt>
            <dd>{fecha(nodo.creadoEn)}</dd>
          </>
        )}
      </dl>

      {!esRaiz && propio && (
        <div className="panel__actions">
          {editando !== null ? (
            <form onSubmit={guardar} className="rename">
              <input
                className="field"
                value={editando}
                onChange={(e) => {
                  setEditando(e.target.value);
                  setMensaje(null);
                }}
                maxLength={80}
                aria-label="Nuevo nombre"
                autoFocus
              />
              <button className="btn btn--primary" disabled={isPending}>Guardar</button>
              <button type="button" className="btn btn--ghost" onClick={() => setEditando(null)}>
                Cancelar
              </button>
            </form>
          ) : confirmar ? (
            <div className="confirm">
              <p>
                ¿Eliminar <strong>{nodo.nombre}</strong>
                {nodo.esCarpeta() && total > 0 ? ` y sus ${total} elemento(s)` : ""}?
              </p>
              <button className="btn btn--danger" onClick={borrar} disabled={isPending}>
                Sí, eliminar
              </button>
              <button className="btn btn--ghost" onClick={() => setConfirmar(false)}>
                Cancelar
              </button>
            </div>
          ) : (
            <>
              <button className="btn btn--ghost" onClick={() => setEditando(nodo.nombre)}>
                Renombrar
              </button>
              <button className="btn btn--ghost btn--danger-text" onClick={() => setConfirmar(true)}>
                Eliminar
              </button>
            </>
          )}
        </div>
      )}

      {!esRaiz && !propio && (
        <p className="panel__note">Solo {nodo.creadoPor} puede renombrarlo o eliminarlo.</p>
      )}

      {mensaje && <p className="create__error" role="alert">{mensaje}</p>}
    </section>
  );
}

export default DetailsPanel;
