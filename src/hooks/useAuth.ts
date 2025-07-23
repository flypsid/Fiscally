"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { Session } from "better-auth/types";

// Better Auth user type
interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await authClient.getSession();
        
        if (error) {
          console.error("Session error:", error);
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
          });
          return;
        }
        
        if (data?.user && data?.session) {
          setAuthState({
            user: data.user as User,
            session: data.session,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error("Failed to get session:", error);
        setAuthState({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    getSession();
  }, []);

  return authState;
}