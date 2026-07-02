"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthMeResponse } from "@queueflow/shared";
import { getMe, logout } from "@/lib/api-client";

type AuthContextValue = {
  auth: AuthMeResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (auth: AuthMeResponse | null) => void;
  refresh: () => Promise<AuthMeResponse | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const session = await getMe();
      setAuth(session);
      return session;
    } catch {
      setAuth(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const signOut = useCallback(async () => {
    try {
      await logout();
    } finally {
      setAuth(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      auth,
      isLoading,
      isAuthenticated: auth !== null,
      setAuth,
      refresh,
      signOut,
    }),
    [auth, isLoading, refresh, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
