import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export type Role = "student" | "admin" | "super_admin";

// Emails that get super_admin role (add yours here for production)
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    role: "student",
    user: null,
    loading: true,
  });

  // Prevent duplicate calls when both onAuthStateChange + getSession fire
  const lastSessionToken = useRef<string | null>("__init__");

  const setUserFromSession = async (session: Session | null) => {
    const token = session?.access_token ?? null;
    if (lastSessionToken.current === token) return;
    lastSessionToken.current = token;

    if (!session?.user) {
      setAuth({ isLoggedIn: false, role: "student", user: null, loading: false });
      return;
    }
    const u = session.user;

    // Parallel fetch — 2× faster than sequential
    const [{ data: roleData }, { data: profile }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", u.id),
      supabase.from("profiles").select("name").eq("user_id", u.id).single(),
    ]);

    const isAdmin = roleData?.some((r) => r.role === "admin") ?? false;
    const isSuperAdmin = SUPER_ADMIN_EMAILS.includes((u.email ?? "").toLowerCase());
    const role: Role = isSuperAdmin ? "super_admin" : isAdmin ? "admin" : "student";

    setAuth({
      isLoggedIn: true,
      role,
      user: { name: profile?.name || u.email?.split("@")[0] || "", email: u.email || "", id: u.id },
      loading: false,
    });
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserFromSession(session);
    });
    // getSession covers the case where onAuthStateChange hasn't fired yet
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserFromSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // 1. Try normal sign-in first
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (!signInErr) return true;

    // 2. For demo accounts — auto-create if missing, then retry
    const demoEmails = ["student@demo.com", "teacher@demo.com", "superadmin@demo.com"];
    if (!demoEmails.includes(email) || password !== "123456") return false;

    const name = email === "teacher@demo.com" ? "Teacher Admin"
               : email === "superadmin@demo.com" ? "Super Admin"
               : "Demo Student";

    // Attempt signup — ignore errors ("already registered" is fine)
    await supabase.auth.signUp({ email, password, options: { data: { name } } });

    // 3. Retry sign-in (works when email confirmation is disabled)
    const { error: retryErr } = await supabase.auth.signInWithPassword({ email, password });
    return !retryErr;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name }, emailRedirectTo: redirectUrl },
    });
    if (error) {
      console.error("Signup error:", error.message);
      throw error;
    }
    return true;
  };

  const logout = async () => {
    // Instantly clear UI state, then sign out in background
    lastSessionToken.current = null;
    setAuth({ isLoggedIn: false, role: "student", user: null, loading: false });
    supabase.auth.signOut();
  };

  const switchRole = (role: Role) => {
    setAuth((prev) => ({ ...prev, role }));
  };

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mx-auto mb-3 animate-pulse">
            <span className="text-primary-foreground text-lg">📚</span>
          </div>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, signup, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
