import { useCallback, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";

/**
 * CRUD genérico para cualquier colección de Cloud Firestore.
 *
 * getAll(filters)    → trae los documentos. filters = [["campo", "==", valor], ...]
 * add(data)          → crea un documento (Firebase genera el id)
 * update(id, data)   → actualiza campos de un documento
 * removeMany(ids)    → elimina varios documentos en una sola operación atómica
 */
const useCollection = (table) => {
  const [results, setResults] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (action, fallback) => {
    setIsPending(true);
    setError(null);
    try {
      return await action();
    } catch (err) {
      setError(err.message);
      return fallback;
    } finally {
      setIsPending(false);
    }
  }, []);

  // ── Obtener documentos ─────────────────────────────
  const getAll = useCallback(
    (filters = []) =>
      run(async () => {
        let q = query(collection(db, table));
        for (const [field, op, value] of filters) {
          q = query(q, where(field, op, value));
        }
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setResults(docs);
        return docs;
      }, []),
    [table, run]
  );

  // ── Agregar documento ──────────────────────────────
  const add = useCallback(
    (data) =>
      run(async () => {
        const ref = await addDoc(collection(db, table), {
          ...data,
          creadoEn: serverTimestamp(),
        });
        return ref.id;
      }, null),
    [table, run]
  );

  // ── Actualizar documento ───────────────────────────
  const update = useCallback(
    (id, data) =>
      run(async () => {
        await updateDoc(doc(db, table, id), { ...data, actualizadoEn: serverTimestamp() });
        return true;
      }, false),
    [table, run]
  );

  // ── Eliminar varios documentos (batch) ─────────────
  const removeMany = useCallback(
    (ids) =>
      run(async () => {
        const batch = writeBatch(db);
        ids.forEach((id) => batch.delete(doc(db, table, id)));
        await batch.commit();
        return true;
      }, false),
    [table, run]
  );

  const reset = useCallback(() => setResults([]), []);

  return { results, isPending, error, getAll, add, update, removeMany, reset };
};

export default useCollection;
