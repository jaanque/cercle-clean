import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { supabaseAuth } from '@/lib/supabase/supabase';
import { Session, User } from '@supabase/supabase-js';

// 1. Definición estricta de tipos para el Contexto de Autenticación
type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider - Proveedor global de autenticación robusto y de seguridad mejorada.
 * - Evita condiciones de carrera mediante banderas de montaje.
 * - Sincroniza y valida la sesión ante cambios de estado de la app (Background -> Foreground).
 * - Proporciona un método seguro de cierre de sesión global.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // A) Recuperar la sesión inicial de forma segura
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabaseAuth.auth.getSession();
        if (error) {
          console.warn('Error al recuperar sesión inicial:', error.message);
        }
        
        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
        }
      } catch (err) {
        console.error('Fallo crítico en la inicialización de autenticación:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // B) Suscribirse a cambios en el estado de autenticación (Login, Logout, Token Refreshed, etc.)
    const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);

      // Si el token expira o el usuario es eliminado/cerrado externamente
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
      }
    });

    // C) Seguridad Inquebrantable ante Backgrounding: Refrescar y validar sesión cuando la app vuelve al primer plano
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Fuerza a Supabase a validar y refrescar el token si es necesario al volver a la app
        const { data: { session: refreshedSession } } = await supabaseAuth.auth.getSession();
        if (isMounted) {
          setSession(refreshedSession);
          setUser(refreshedSession?.user ?? null);
        }
      }
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    // Limpieza de todos los listeners al desmontar para evitar fugas de memoria y exploits de estado
    return () => {
      isMounted = false;
      subscription.unsubscribe();
      appStateSubscription.remove();
    };
  }, []);

  // Método seguro y centralizado para cerrar la sesión
  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabaseAuth.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Error al cerrar sesión:', err.message);
    } finally {
      setSession(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth - Hook personalizado de seguridad estricta para acceder al estado de autenticación.
 * Lanza un error explícito si se invoca fuera del AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado exclusivamente dentro de un AuthProvider.');
  }
  return context;
};