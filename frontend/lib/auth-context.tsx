'use client';

/**
 * AuthProvider Context - Security State Management with OAuth Integration
 * User Story #18: Production Authentication & Security Foundation
 * 
 * Features:
 * - Comprehensive security state management
 * - CSRF token handling and rotation
 * - Cross-tab session synchronization
 * - OAuth account linking support
 * - Automatic session validation and refresh
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import type { UserSession, AuthContext, AuthError, AuthFormData, LinkedAccount } from '@/types/auth';

const AuthContextProvider = createContext<AuthContext | null>(null);

/**
 * Custom hook to access authentication context
 * Throws error if used outside of AuthProvider
 */
export function useAuth(): AuthContext {
  const context = useContext(AuthContextProvider);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider component - Provides authentication state and methods to the app
 * Implements comprehensive security features including CSRF protection,
 * session validation, and cross-tab synchronization
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { data: nextAuthSession, status, update } = useSession();
  
  // Core authentication state
  const [session, setSession] = useState<UserSession | null>(null);
  const [error, setError] = useState<AuthError | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // References for cleanup
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Loading state derived from NextAuth status and initialization
  const isLoading = status === 'loading' || !isInitialized;
  const isAuthenticated = !!session?.isAuthenticated;

  /**
   * Generate cryptographically secure CSRF token
   */
  const generateCSRFToken = useCallback((): string => {
    if (typeof window !== 'undefined' && window.crypto) {
      const array = new Uint8Array(32);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    // Fallback for environments without crypto API
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }, []);

  /**
   * Initialize CSRF token on mount
   */
  useEffect(() => {
    if (!csrfToken) {
      setCsrfToken(generateCSRFToken());
    }
  }, [csrfToken, generateCSRFToken]);

  /**
   * Setup cross-tab session synchronization
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const channel = new BroadcastChannel('auth-session');
    broadcastChannelRef.current = channel;

    channel.addEventListener('message', (event) => {
      const { type, session: broadcastSession } = event.data;
      
      switch (type) {
        case 'SESSION_CHANGED':
          setSession(broadcastSession);
          break;
        case 'SESSION_ENDED':
          setSession(null);
          setError(null);
          break;
        case 'CSRF_TOKEN_UPDATED':
          setCsrfToken(event.data.token);
          break;
      }
    });

    return () => {
      channel.removeEventListener('message', () => {});
      channel.close();
    };
  }, []);

  /**
   * Broadcast session changes to other tabs
   */
  const broadcastSessionChange = useCallback((newSession: UserSession | null) => {
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: newSession ? 'SESSION_CHANGED' : 'SESSION_ENDED',
        session: newSession
      });
    }
  }, []);

  /**
   * Validate session with backend
   */
  const validateSession = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/validate', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          return true;
        }
      }

      // Invalid session - sign out
      await signOut({ redirect: false });
      setSession(null);
      broadcastSessionChange(null);
      return false;

    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }, [broadcastSessionChange]);

  /**
   * Refresh session token
   */
  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          csrfToken
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.session) {
          setSession(data.session);
          if (data.csrfToken) {
            setCsrfToken(data.csrfToken);
            broadcastChannelRef.current?.postMessage({
              type: 'CSRF_TOKEN_UPDATED',
              token: data.csrfToken
            });
          }
          broadcastSessionChange(data.session);
          await update(); // Update NextAuth session
        }
      }
    } catch (error) {
      console.error('Session refresh error:', error);
    }
  }, [csrfToken, broadcastSessionChange, update]);

  /**
   * Setup automatic session refresh
   */
  useEffect(() => {
    if (!session || !session.expiresAt) return;

    const timeUntilExpiry = session.expiresAt - Date.now();
    const refreshThreshold = 15 * 60 * 1000; // 15 minutes

    if (timeUntilExpiry > refreshThreshold) {
      // Schedule refresh 15 minutes before expiry
      const refreshTime = timeUntilExpiry - refreshThreshold;
      refreshTimeoutRef.current = setTimeout(() => {
        refreshSession();
      }, refreshTime);
    } else if (timeUntilExpiry > 0) {
      // Session expires soon, refresh now
      refreshSession();
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [session, refreshSession]);

  /**
   * Initialize session from NextAuth
   */
  useEffect(() => {
    if (status === 'loading') return;

    if (nextAuthSession) {
      // Convert NextAuth session to our UserSession format
      const userSession: UserSession = {
        user: {
          id: nextAuthSession.user?.id || '',
          email: nextAuthSession.user?.email || '',
          firstName: nextAuthSession.user?.name?.split(' ')[0],
          lastName: nextAuthSession.user?.name?.split(' ').slice(1).join(' '),
          avatar: nextAuthSession.user?.image || undefined,
          oauthProvider: (nextAuthSession as any).provider || null,
          oauthId: (nextAuthSession as any).providerAccountId || undefined
        },
        isAuthenticated: true,
        authMethod: (nextAuthSession as any).provider ? 'oauth' : 'email',
        csrfToken: csrfToken,
        expiresAt: nextAuthSession.expires ? new Date(nextAuthSession.expires).getTime() : Date.now() + (7 * 24 * 60 * 60 * 1000),
        lastValidated: Date.now(),
        linkedAccounts: (nextAuthSession as any).linkedAccounts || []
      };

      setSession(userSession);
      broadcastSessionChange(userSession);
      
      // Validate session on initialization
      validateSession();
    } else {
      setSession(null);
      broadcastSessionChange(null);
    }

    setIsInitialized(true);
  }, [nextAuthSession, status, csrfToken, validateSession, broadcastSessionChange]);

  /**
   * Handle login with email/password
   */
  const login = useCallback(async (credentials: AuthFormData): Promise<{ success: boolean; error?: AuthError }> => {
    try {
      setError(null);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...credentials,
          csrfToken
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update CSRF token if provided
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
        }

        // Session will be updated through NextAuth useSession hook
        await update();
        
        return { success: true };
      } else {
        const authError: AuthError = {
          type: 'validation_error',
          message: data.error?.message || 'Authentication failed',
          code: data.error?.code || 'AUTH_ERROR',
          recoverable: true,
          retryable: true
        };
        
        setError(authError);
        return { success: false, error: authError };
      }

    } catch (error) {
      const networkError: AuthError = {
        type: 'oauth_network_error',
        message: 'Network error occurred during authentication',
        code: 'NETWORK_ERROR',
        recoverable: true,
        retryable: true
      };
      
      setError(networkError);
      return { success: false, error: networkError };
    }
  }, [csrfToken, update]);

  /**
   * Handle user registration
   */
  const register = useCallback(async (userData: AuthFormData): Promise<{ success: boolean; error?: AuthError }> => {
    try {
      setError(null);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          csrfToken
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update CSRF token if provided
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
        }

        // Session will be updated through NextAuth useSession hook
        await update();
        
        return { success: true };
      } else {
        const authError: AuthError = data.error || {
          type: 'validation_error',
          message: 'Registration failed',
          code: 'REGISTRATION_ERROR',
          recoverable: true,
          retryable: true
        };
        
        setError(authError);
        return { success: false, error: authError };
      }

    } catch (error) {
      const networkError: AuthError = {
        type: 'oauth_network_error',
        message: 'Network error occurred during registration',
        code: 'NETWORK_ERROR',
        recoverable: true,
        retryable: true
      };
      
      setError(networkError);
      return { success: false, error: networkError };
    }
  }, [csrfToken, update]);

  /**
   * Handle logout with cleanup
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          csrfToken
        })
      });

      await signOut({ redirect: false });
      setSession(null);
      setError(null);
      broadcastSessionChange(null);
      
      // Generate new CSRF token for security
      setCsrfToken(generateCSRFToken());

    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      await signOut({ redirect: false });
      setSession(null);
      setError(null);
      broadcastSessionChange(null);
    }
  }, [csrfToken, broadcastSessionChange, generateCSRFToken]);

  /**
   * Link OAuth account to existing user
   */
  const linkOAuthAccount = useCallback(async (provider: string, token: string): Promise<{ success: boolean; error?: AuthError }> => {
    try {
      setError(null);
      
      const response = await fetch('/api/auth/oauth/link', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          token,
          csrfToken
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update session with linked account
        if (session && data.linkedAccount) {
          const updatedSession: UserSession = {
            ...session,
            linkedAccounts: [...(session.linkedAccounts || []), data.linkedAccount]
          };
          setSession(updatedSession);
          broadcastSessionChange(updatedSession);
        }
        
        return { success: true };
      } else {
        const authError: AuthError = data.error || {
          type: 'account_linking_error',
          message: 'Failed to link account',
          code: 'LINKING_ERROR',
          recoverable: true,
          retryable: true
        };
        
        setError(authError);
        return { success: false, error: authError };
      }

    } catch (error) {
      const networkError: AuthError = {
        type: 'oauth_network_error',
        message: 'Network error occurred during account linking',
        code: 'NETWORK_ERROR',
        recoverable: true,
        retryable: true
      };
      
      setError(networkError);
      return { success: false, error: networkError };
    }
  }, [csrfToken, session, broadcastSessionChange]);

  /**
   * Clear authentication error
   */
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, []);

  const contextValue: AuthContext = {
    session,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    linkOAuthAccount,
    validateSession,
    clearError,
    refreshSession
  };

  return (
    <AuthContextProvider.Provider value={contextValue}>
      {children}
    </AuthContextProvider.Provider>
  );
}