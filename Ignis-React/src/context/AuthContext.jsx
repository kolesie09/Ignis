import React, { createContext, useContext, useState } from "react";

// 1. Tworzymy Kontekst - to jest ten "globalny pojemnik"
const AuthContext = createContext(null);

// 2. Tworzymy Provider - komponent, który będzie otaczał Twoją aplikację
export const AuthProvider = ({ children }) => {
  // Tutaj przenosimy logikę, którą miałeś wcześniej w App.js
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("authenticated") === "true"
  );

  // Funkcja logowania
  const login = () => {
    setAuthenticated(true);
    localStorage.setItem("authenticated", "true");
  };

  // Funkcja wylogowania
  const logout = () => {
    setAuthenticated(false);
    localStorage.removeItem("authenticated");
  };

  // Przekazujemy te wartości w dół do każdego komponentu w aplikacji
  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Własny hook - dzięki niemu w innych plikach wystarczy napisać `useAuth()`
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth musi być użyte wewnątrz AuthProvider");
  }
  return context;
};
