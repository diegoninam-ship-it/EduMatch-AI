import { Navigate, Outlet, useLocation } from "react-router";
import { isAuthenticated, getRol } from "../../api/auth";

interface PrivateRouteProps {
  allowedRoles?: string[];
}

export function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Bloquea acceso y redirige al inicio
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const rol = getRol();
    if (!rol || !allowedRoles.includes(rol)) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
