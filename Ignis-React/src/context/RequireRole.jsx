import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export const RequireRole = ({ allowedRoles, children }) => {
  const { authenticated, hasAnyRole } = useAuth();
  const location = useLocation();

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!hasAnyRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
