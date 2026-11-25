import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, async (u) => {
        setUser(u);
        if (u) {
          try {
            const snap = await getDoc(doc(db, 'users', u.uid));
            setProfile(
              snap.exists() ? snap.data() : { name: u.displayName, email: u.email, role: 'user' }
            );
          } catch {
            setProfile({ name: u.displayName, email: u.email, role: 'user' });
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
      }),
    []
  );

  const register = async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const data = { name, email, role: 'user' };
    await setDoc(doc(db, 'users', cred.user.uid), { ...data, createdAt: serverTimestamp() });
    setProfile(data);
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
