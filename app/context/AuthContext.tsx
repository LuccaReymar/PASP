"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole } from "@/types/user";

// Re-export UserRole so existing imports from AuthContext still work
export { UserRole };

interface AuthContextType {
  role: UserRole | "NONE";
  email: string | null;
  userName: string | null;
  firstName: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<UserRole | "NONE">("NONE");
  const [email, setEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Derive first name from full name
  const firstName = userName ? userName.split(" ")[0] : null;

  // Check session on mount by calling /api/auth/me
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (response.ok && data.success) {
          const user = data.data;
          setRole(user.role as UserRole);
          setEmail(user.email);
          setUserName(user.name);
          setIsLoggedIn(true);
        }
      } catch {
        // Session invalid or network error — stay logged out
      } finally {
        setLoading(false);
      }
    };

    checkSession();
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

      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Even if the API call fails, clear client state
    }
    setRole("NONE");
    setEmail(null);
    setUserName(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ role, email, userName, firstName, isLoggedIn, loading, login, signup, logout }}>
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
