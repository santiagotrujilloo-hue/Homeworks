import { useCallback, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * CRUD genérico para cualquier colección de Cloud Firestore.
 *
 * getAll(filters)  → trae los documentos. filters = [["campo", "==", valor], ...]
 * add(data)        → crea un documento (Firebase genera el id)
 * update(id, data) → actualiza los campos indicados del documento
 * remove(id)       → elimina el documento
 */
const useCollection = (table) => {
  const [results, setResults] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  // ── Obtener documentos ─────────────────────────────
  const getAll = useCallback(
    async (filters = []) => {
      setIsPending(true);
      setError(null);

      try {
        let q = query(collection(db, table));

        for (const [field, op, value] of filters) {
          q = query(q, where(field, op, value));
        }

        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

        setResults(docs);
        return docs;
      } catch (err) {
        setError(err.message);
        return [];
      } finally {
        setIsPending(false);
      }
    },
    [table]
  );

  // ── Agregar documento ──────────────────────────────
  const add = useCallback(
    async (data) => {
      setIsPending(true);
      setError(null);

      try {
        const ref = await addDoc(collection(db, table), {
          ...data,
          createdAt: serverTimestamp(),
        });
        return ref.id;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setIsPending(false);
      }
    },
    [table]
  );

  // ── Actualizar documento ───────────────────────────
  const update = useCallback(
    async (id, data) => {
      setIsPending(true);
      setError(null);

      try {
        await updateDoc(doc(db, table, id), {
          ...data,
          updatedAt: serverTimestamp(),
        });
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setIsPending(false);
      }
    },
    [table]
  );

  // ── Eliminar documento ─────────────────────────────
  const remove = useCallback(
    async (id) => {
      setIsPending(true);
      setError(null);

      try {
        await deleteDoc(doc(db, table, id));
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setIsPending(false);
      }
    },
    [table]
  );

  const reset = useCallback(() => setResults([]), []);

  return { results, isPending, error, getAll, add, update, remove, reset };
};

export default useCollection;
