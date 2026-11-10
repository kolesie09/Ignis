import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const getStoredRoles = () => {
  try {
    const storedRoles = localStorage.getItem("roles");

    return storedRoles ? JSON.parse(storedRoles) : [];
  } catch (error) {
    console.error("Nie udało się odczytać ról:", error);
    return [];
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [roles, setRoles] = useState(getStoredRoles);

  const authenticated = Boolean(token);

  const login = (newToken, newRoles = []) => {
    const safeRoles = Array.isArray(newRoles) ? newRoles : [];

    localStorage.setItem("token", newToken);
    localStorage.setItem("roles", JSON.stringify(safeRoles));

    setToken(newToken);
    setRoles(safeRoles);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");

    setToken(null);
    setRoles([]);
  };

  const hasRole = (requiredRole) => {
    return roles.includes(requiredRole);
  };

  const hasAnyRole = (requiredRoles = []) => {
    return requiredRoles.some((role) => roles.includes(role));
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        roles,
        authenticated,
        login,
        logout,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth musi być użyte wewnątrz AuthProvider");
  }

  return context;
};
