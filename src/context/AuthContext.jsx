import { createContext, useContext, useEffect, useState } from 'react';
import {
  getCurrentSession,
  onAuthStateChange,
  signInWithEmail,
  signOutUser,
} from '../services/supabase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const currentSession = await getCurrentSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } finally {
        setAuthLoading(false);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function login(email, password) {
    const data = await signInWithEmail(email, password);
    setSession(data.session);
    setUser(data.user);
    return data;
  }

  async function logout() {
    await signOutUser();
    setSession(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        authLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}