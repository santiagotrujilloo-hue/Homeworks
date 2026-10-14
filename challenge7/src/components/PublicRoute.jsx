import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import FullScreenLoader from "./FullScreenLoader";

function PublicRoute() {
  const { isAuthenticated, checking } = useAuth();

  if (checking) return <FullScreenLoader />;

  if (isAuthenticated) return <Navigate to="/tasks" replace />;

  return <Outlet />;
}

export default PublicRoute;
