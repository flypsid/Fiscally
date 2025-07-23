"use client";

import { authClient } from "@/lib/auth-client";

// Infer types from Better Auth
type Session = typeof authClient.$Infer.Session;
type User = Session['user'];

interface AuthState {
  user: User | null;
  session: Session["session"] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): AuthState {
  // Use Better Auth's native useSession hook
  const { data: session, isPending } = authClient.useSession();

  return {
    user: session?.user || null,
    session: session?.session || null,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
  };
}
