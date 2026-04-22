"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole } from "@/types/user";

// Re-export UserRole so existing imports from AuthContext still work
export { UserRole };

interface AuthContextType {
  role: UserRole | "NONE";
  email: string | null;
  userName: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<UserRole | "NONE">("NONE");
  const [email, setEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") as UserRole | null;
    const savedEmail = localStorage.getItem("userEmail");
    const savedName = localStorage.getItem("userName");
    if (savedRole && savedEmail) {
      setRole(savedRole);
      setEmail(savedEmail);
      setUserName(savedName);
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, error: data.error || "Login failed" };
      }

      const user = data.data;
      setRole(user.role);
      setEmail(user.email);
      setUserName(user.name);
      setIsLoggedIn(true);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", user.name);

      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    userRole: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: userRole }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, error: data.error || "Signup failed" };
      }

      // Auto-login after signup
      const user = data.data;
      setRole(user.role);
      setEmail(user.email);
      setUserName(user.name);
      setIsLoggedIn(true);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", user.name);

      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    setRole("NONE");
    setEmail(null);
    setUserName(null);
    setIsLoggedIn(false);
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
  };

  return (
    <AuthContext.Provider value={{ role, email, userName, isLoggedIn, login, signup, logout }}>
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
