import { useCallback, useEffect, useMemo, useState } from "react";
import FileSystemContext from "./FileSystemContext";
import useAuth from "../hooks/useAuth";
import useCollection from "../hooks/useCollection";
import ArbolNario, { RAIZ_ID } from "../structures/ArbolNario";

const ok = (extra = {}) => ({ ok: true, ...extra });
const fallo = (mensaje) => ({ ok: false, mensaje });

function FileSystemProvider({ children }) {
  const { user } = useAuth();
  const { results, isPending, error, getAll, add, update, removeMany, reset } =
    useCollection("nodos");

  const [seleccionadoId, setSeleccionadoId] = useState(RAIZ_ID);
  const [expandidos, setExpandidos] = useState(() => new Set([RAIZ_ID]));

  // Todos los usuarios registrados comparten el mismo árbol de carpetas
  const refrescar = useCallback(() => getAll(), [getAll]);

  useEffect(() => {
    if (user) refrescar();
    else reset();
  }, [user, refrescar, reset]);

  // El árbol n-ario se reconstruye cada vez que llegan los registros de Firestore
  const arbol = useMemo(() => ArbolNario.desdeRegistros(results), [results]);

  const seleccionado = arbol.buscar(seleccionadoId) ?? arbol.raiz;

  const seleccionar = useCallback(
    (id) => {
      setSeleccionadoId(id);
      // Abre en el árbol todas las carpetas del camino hasta el nodo
      setExpandidos((prev) => {
        const next = new Set(prev);
        arbol.ruta(id).forEach((n) => n.esCarpeta() && n.id !== id && next.add(n.id));
        return next;
      });
    },
    [arbol]
  );

  const alternar = useCallback((id) => {
    setExpandidos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const esMio = (nodo) => !!user && nodo.creadoPor === user.email;

  // ── Crear carpeta o archivo dentro del nodo seleccionado ──
  const crear = async ({ nombre, tipo }) => {
    if (!user) return fallo("Debes iniciar sesión para crear carpetas o archivos.");

    const limpio = nombre.trim();
    const padre = seleccionado;

    if (!limpio) return fallo("Escribe un nombre.");
    if (/[/\\]/.test(limpio)) return fallo("El nombre no puede tener / ni \\.");
    if (!padre.puedeTenerHijos())
      return fallo(`"${padre.nombre}" es un archivo y no puede tener hijos.`);
    if (padre.tieneHijoLlamado(limpio))
      return fallo(`Ya existe "${limpio}" dentro de "${padre.nombre}".`);

    const id = await add({
      nombre: limpio,
      tipo,
      padreId: padre.id,
      nivel: padre.nivel + 1,
      creadoPor: user.email, // dato validador: correo de quien lo creó
      uid: user.uid,
    });
    if (!id) return fallo("No se pudo guardar en Firebase.");

    await refrescar();
    setExpandidos((prev) => new Set(prev).add(padre.id));
    return ok({ id });
  };

  // ── Renombrar ──
  const renombrar = async (nodo, nombre) => {
    const limpio = nombre.trim();
    if (!esMio(nodo)) return fallo("Solo quien lo creó puede renombrarlo.");
    if (!limpio) return fallo("Escribe un nombre.");
    if (/[/\\]/.test(limpio)) return fallo("El nombre no puede tener / ni \\.");
    if (limpio.toLowerCase() !== nodo.nombre.toLowerCase() && nodo.padre.tieneHijoLlamado(limpio))
      return fallo(`Ya existe "${limpio}" en esta carpeta.`);

    if (!(await update(nodo.id, { nombre: limpio }))) return fallo("No se pudo renombrar.");
    await refrescar();
    return ok();
  };

  // ── Eliminar el nodo y todo su subárbol ──
  const eliminar = async (nodo) => {
    if (!esMio(nodo)) return fallo("Solo quien lo creó puede eliminarlo.");

    const ajenos = arbol.ajenosEnSubarbol(nodo.id, user.email);
    if (ajenos.length > 0)
      return fallo(
        `No se puede borrar: adentro hay ${ajenos.length} elemento(s) creados por otras personas.`
      );

    // Post-orden: primero los hijos y después la carpeta
    const ids = arbol.postOrden(nodo).map((n) => n.id);
    const padreId = nodo.padre.id;

    if (!(await removeMany(ids))) return fallo("No se pudo eliminar.");
    setSeleccionadoId(padreId);
    await refrescar();
    return ok({ eliminados: ids.length });
  };

  return (
    <FileSystemContext.Provider
      value={{
        arbol,
        seleccionado,
        seleccionar,
        expandidos,
        alternar,
        isPending,
        error,
        refrescar,
        esMio,
        crear,
        renombrar,
        eliminar,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
}

export default FileSystemProvider;
