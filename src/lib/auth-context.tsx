import React, { createContext, useContext, useState, ReactNode } from "react";

type Role = "student" | "admin";

interface AuthState {
  isLoggedIn: boolean;
  role: Role;
  user: { name: string; email: string } | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const demoAccounts = [
  { email: "student@demo.com", password: "123456", role: "student" as Role, name: "Demo Student" },
  { email: "teacher@demo.com", password: "123456", role: "admin" as Role, name: "Teacher Admin" },
];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    role: "student",
    user: null,
  });

  const login = (email: string, password: string): boolean => {
    const account = demoAccounts.find((a) => a.email === email && a.password === password);
    if (account) {
      setAuth({
        isLoggedIn: true,
        role: account.role,
        user: { name: account.name, email: account.email },
      });
      return true;
    }
    // Also allow any credentials for demo flexibility
    const isTeacher = email.includes("teacher");
    setAuth({
      isLoggedIn: true,
      role: isTeacher ? "admin" : "student",
      user: { name: isTeacher ? "Teacher Admin" : "Demo Student", email },
    });
    return true;
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, role: "student", user: null });
  };

  const switchRole = (role: Role) => {
    setAuth((prev) => ({
      ...prev,
      role,
      user: role === "admin"
        ? { name: "Teacher Admin", email: "teacher@demo.com" }
        : { name: "Demo Student", email: "student@demo.com" },
    }));
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
