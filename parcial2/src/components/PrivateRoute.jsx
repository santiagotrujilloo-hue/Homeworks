import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import FullScreenLoader from "./FullScreenLoader";

function PrivateRoute({ children }) {
  const { isAuthenticated, checking } = useAuth();

  // Firebase tarda un instante en confirmar si hay una sesión guardada
  if (checking) return <FullScreenLoader />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}

export default PrivateRoute;
