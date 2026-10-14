import { useCallback, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/config";

// Mensajes en español para los códigos de error de Firebase Auth
const MENSAJES = {
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/wrong-password": "Correo o contraseña incorrectos.",
  "auth/user-not-found": "No existe una cuenta con ese correo.",
  "auth/invalid-email": "El correo no tiene un formato válido.",
  "auth/email-already-in-use": "Ya existe una cuenta con ese correo.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/missing-password": "Escribe la contraseña.",
  "auth/too-many-requests": "Demasiados intentos. Espera un momento y vuelve a intentar.",
  "auth/network-request-failed": "Sin conexión con Firebase. Revisa tu internet.",
  "auth/operation-not-allowed": "El acceso con correo y contraseña no está habilitado en Firebase.",
  "auth/configuration-not-found": "Authentication no está configurado en el proyecto de Firebase.",
};

const traducir = (err) =>
  MENSAJES[err?.code] ??
  (err?.code?.includes("api-key")
    ? "La configuración de Firebase no es válida (revisa src/firebase/config.js)."
    : "Ocurrió un error inesperado. Intenta de nuevo.");

// Solo guardamos lo que la app necesita del usuario de Firebase
const mapUser = (u) =>
  u ? { uid: u.uid, email: u.email, displayName: u.displayName } : null;

/**
 * Toda la lógica de Firebase Authentication:
 * escucha la sesión, login, registro y logout.
 */
const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true); // ¿Firebase ya respondió si hay sesión?
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(mapUser(firebaseUser));
      setChecking(false);
    });

    return unsubscribe;
  }, []);

  const run = async (action) => {
    setIsPending(true);
    setError(null);

    try {
      await action();
      return true;
    } catch (err) {
      setError(traducir(err));
      return false;
    } finally {
      setIsPending(false);
    }
  };

  const login = (email, password) =>
    run(() => signInWithEmailAndPassword(auth, email.trim(), password));

  const register = (name, email, password) =>
    run(async () => {
      const { user: nuevo } = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      await updateProfile(nuevo, { displayName: name.trim() });
      // onAuthStateChanged no se vuelve a disparar tras updateProfile
      setUser({ uid: nuevo.uid, email: nuevo.email, displayName: name.trim() });
    });

  const logout = () => run(() => signOut(auth));

  const clearError = useCallback(() => setError(null), []);

  return { user, checking, isPending, error, login, register, logout, clearError };
};

export default useFirebaseAuth;
