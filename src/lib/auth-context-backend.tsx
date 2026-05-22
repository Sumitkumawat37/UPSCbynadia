import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Role = "student" | "admin" | "super_admin";

const SUPER_ADMIN_EMAILS = ["superadmin@demo.com"];

interface AuthState {
  isLoggedIn: boolean;
  role: Role;
  user: { name: string; email: string; id: string } | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE_URL = "http://localhost:5000/api/v1";

export function AuthProviderBackend({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    role: "student",
    user: null,
    loading: true,
  });

  useEffect(() => {
    // Check for existing token on load
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("auth_user");
    if (token && userData) {
      const user = JSON.parse(userData);
      const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(user.email.toLowerCase());
      const role: Role = isSuperAdmin ? "super_admin" : user.role || "student";
      setAuth({
        isLoggedIn: true,
        role,
        user,
        loading: false,
      });
    } else {
      setAuth(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Login error:", data.error);
        return false;
      }

      // Store token and user data
      if (data.session?.access_token) {
        localStorage.setItem("auth_token", data.session.access_token);
      }

      const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(email.toLowerCase());
      const role: Role = isSuperAdmin ? "super_admin" : "student";

      const userData = {
        id: data.user?.id || "",
        email: data.user?.email || email,
        name: data.user?.user_metadata?.name || email.split("@")[0],
      };

      localStorage.setItem("auth_user", JSON.stringify(userData));

      setAuth({
        isLoggedIn: true,
        role,
        user: userData,
        loading: false,
      });

      return true;
    } catch (error: any) {
      console.error("Login error:", error.message);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Signup error:", data.error);
        throw new Error(data.error || "Signup failed");
      }

      return true;
    } catch (error: any) {
      console.error("Signup error:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      setAuth({ isLoggedIn: false, role: "student", user: null, loading: false });
    }
  };

  const switchRole = (role: Role) => {
    setAuth(prev => ({ ...prev, role }));
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, signup, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthBackend() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthBackend must be used within AuthProviderBackend");
  }
  return context;
}
