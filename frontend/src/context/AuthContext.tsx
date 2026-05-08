import React, { createContext, useContext, useState, useEffect } from 'react';

// Defining the shape of our Auth state to ensure TypeScript type safety
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage to persist login across page refreshes
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // Derived state for easier consumption in components like RequireAuth
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for a cleaner developer experience in other components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider - check App.tsx wrapping.");
  }
  return context;
};