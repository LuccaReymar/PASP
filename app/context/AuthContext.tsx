"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export enum UserRole {
  PA = "PA",
  ADMIN = "ADMIN",
  NONE = "NONE",
}

interface AuthContextType {
  role: UserRole;
  email: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<UserRole>(UserRole.NONE);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") as UserRole | null;
    const savedEmail = localStorage.getItem("userEmail");
    if (savedRole && savedEmail) {
      setRole(savedRole);
      setEmail(savedEmail);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (email: string, password: string, userRole: UserRole) => {
    // Simple validation - in production, validate against backend
    if (email && password) {
      setRole(userRole);
      setEmail(email);
      setIsLoggedIn(true);
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("userEmail", email);
    }
  };

  const logout = () => {
    setRole(UserRole.NONE);
    setEmail(null);
    setIsLoggedIn(false);
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
  };

  return (
    <AuthContext.Provider value={{ role, email, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
