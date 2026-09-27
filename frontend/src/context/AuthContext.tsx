import { useEffect, useState, type ReactNode } from "react";

import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase.ts";
import { AuthContext } from "./authContext";
import { isUserRole, type UserRole } from "../types/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const role: UserRole = isUserRole(user?.app_metadata?.role)
    ? user.app_metadata.role
    : "tourist";

  useEffect(() => {
    let mounted = true;

    async function loadSession(): Promise<void> {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}