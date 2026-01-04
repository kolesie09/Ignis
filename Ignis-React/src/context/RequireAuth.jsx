// RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const RequireAuth = ({ children }) => {
  const { authenticated } = useAuth();
  const location = useLocation();

  if (!authenticated) {
    // Przekieruj do logowania, ale zapamiętaj, skąd użytkownik przyszedł
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
