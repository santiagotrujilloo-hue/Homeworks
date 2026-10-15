import AuthContext from "./AuthContext";
import useFirebaseAuth from "../hooks/useFirebaseAuth";

function AuthProvider({ children }) {
  // La lógica de Firebase vive en el custom hook; el contexto solo la comparte
  const auth = useFirebaseAuth();

  return (
    <AuthContext.Provider value={{ ...auth, isAuthenticated: !!auth.user }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
