'use client';

/**
 * OAuthButtonGroup Component - Secure OAuth Provider Buttons with PKCE
 * User Story #18: Production Authentication & Security Foundation
 * 
 * Features:
 * - PKCE (Proof Key for Code Exchange) security implementation
 * - Device-specific provider prioritization
 * - Comprehensive error handling with recovery options
 * - ADHD-friendly loading states and feedback
 * - Keyboard navigation support
 * - Cross-browser OAuth compatibility
 */

import React, { useState, useCallback, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import type { OAuthProvider, AuthError } from '@/types/auth';

interface OAuthButtonGroupProps {
  providers: OAuthProvider[];
  onProviderSelect?: (providerId: string, metadata: any) => void;
  onComplete?: (providerId: string, result: any) => void;
  onError?: (error: AuthError) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Generate PKCE code verifier (base64url-encoded random string)
 */
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generate PKCE code challenge from verifier using SHA256
 */
async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generate cryptographically secure state parameter for CSRF protection
 */
function generateStateParameter(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Detect device type for provider prioritization
 */
function getDeviceInfo() {
  if (typeof window === 'undefined') return { platform: 'desktop', isMobile: false };
  
  const userAgent = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  const isMobile = isIOS || isAndroid || window.innerWidth <= 768;
  
  return {
    platform: isIOS ? 'ios' : isAndroid ? 'android' : 'desktop',
    isMobile,
    userAgent
  };
}

/**
 * Sort providers based on device platform preferences
 */
function sortProvidersByPlatform(providers: OAuthProvider[]): OAuthProvider[] {
  const deviceInfo = getDeviceInfo();
  
  if (deviceInfo.platform === 'ios') {
    return [...providers].sort((a, b) => {
      if (a.id === 'apple') return -1;
      if (b.id === 'apple') return 1;
      if (a.id === 'google') return -1;
      if (b.id === 'google') return 1;
      return 0;
    });
  }
  
  if (deviceInfo.platform === 'android') {
    return [...providers].sort((a, b) => {
      if (a.id === 'google') return -1;
      if (b.id === 'google') return 1;
      return 0;
    });
  }
  
  // Desktop - keep original order
  return providers;
}

export function OAuthButtonGroup({
  providers,
  onProviderSelect,
  onComplete,
  onError,
  className = '',
  disabled = false
}: OAuthButtonGroupProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState<AuthError | null>(null);
  
  // Sort providers based on device preferences
  const sortedProviders = sortProvidersByPlatform(providers);

  /**
   * Handle OAuth provider button click
   */
  const handleOAuthSignIn = useCallback(async (provider: OAuthProvider) => {
    if (loadingProvider || disabled) return;

    try {
      setLoadingProvider(provider.id);
      setError(null);

      const startTime = Date.now();
      const deviceInfo = getDeviceInfo();
      
      // Track provider selection
      onProviderSelect?.(provider.id, {
        timestamp: Date.now(),
        userAgent: deviceInfo.userAgent,
        deviceType: deviceInfo.isMobile ? 'mobile' : 'desktop'
      });

      // Generate PKCE parameters for security
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const state = generateStateParameter();

      // Store OAuth state securely in session storage for callback verification
      const oauthState = {
        state,
        codeVerifier,
        redirectUri: `${window.location.origin}/auth/callback`,
        provider: provider.id,
        timestamp: Date.now()
      };
      
      sessionStorage.setItem(`oauth_state_${provider.id}`, JSON.stringify(oauthState));

      // Initiate OAuth flow with PKCE
      const result = await signIn(provider.id, {
        callbackUrl: '/dashboard',
        redirect: false,
        state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        scope: provider.scopes.join(' ')
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Track successful completion
      const duration = Date.now() - startTime;
      onComplete?.(provider.id, {
        success: true,
        duration,
        method: 'oauth'
      });

    } catch (error) {
      console.error(`OAuth ${provider.id} error:`, error);
      
      const authError: AuthError = {
        type: 'oauth_callback_error',
        message: error instanceof Error ? error.message : `OAuth ${provider.displayName} authentication failed`,
        code: 'OAUTH_ERROR',
        recoverable: true,
        retryable: true
      };

      setError(authError);
      onError?.(authError);

    } finally {
      setLoadingProvider(null);
    }
  }, [loadingProvider, disabled, onProviderSelect, onComplete, onError]);

  /**
   * Handle keyboard navigation between provider buttons
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent, provider: OAuthProvider) => {
    const buttons = document.querySelectorAll('[data-oauth-button]');
    const currentIndex = Array.from(buttons).findIndex(btn => 
      btn.getAttribute('data-provider') === provider.id
    );

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % buttons.length;
        (buttons[nextIndex] as HTMLElement).focus();
        break;
        
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = currentIndex === 0 ? buttons.length - 1 : currentIndex - 1;
        (buttons[prevIndex] as HTMLElement).focus();
        break;
        
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleOAuthSignIn(provider);
        break;
    }
  }, [handleOAuthSignIn]);

  /**
   * Dismiss error alert
   */
  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Retry failed OAuth authentication
   */
  const retryOAuth = useCallback((provider: OAuthProvider) => {
    setError(null);
    handleOAuthSignIn(provider);
  }, [handleOAuthSignIn]);

  return (
    <div className={`oauth-button-group ${className}`}>
      {error && (
        <div 
          className="oauth-error-alert alert alert--error" 
          role="alert"
          aria-live="polite"
        >
          <div className="alert-content">
            <div className="alert-icon" aria-hidden="true">⚠️</div>
            <div className="alert-message">
              <div className="alert-title">OAuth Authentication Failed</div>
              <div className="alert-description">{error.message}</div>
            </div>
          </div>
          <div className="alert-actions">
            {error.retryable && (
              <button
                type="button"
                className="btn btn--sm btn--primary"
                onClick={() => {
                  const provider = sortedProviders.find(p => p.id === error.code?.split('_')[0]);
                  if (provider) retryOAuth(provider);
                }}
              >
                Try Again
              </button>
            )}
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={dismissError}
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="oauth-providers-grid">
        {sortedProviders.map((provider) => {
          const isLoading = loadingProvider === provider.id;
          const isDisabled = disabled || !!loadingProvider;
          
          return (
            <button
              key={provider.id}
              type="button"
              className={`oauth-btn oauth-btn--${provider.id} ${isLoading ? 'oauth-btn--loading' : ''}`}
              onClick={() => handleOAuthSignIn(provider)}
              onKeyDown={(e) => handleKeyDown(e, provider)}
              disabled={isDisabled}
              aria-label={`Continue with ${provider.displayName}`}
              aria-describedby={`oauth-desc-${provider.id}`}
              data-oauth-button
              data-provider={provider.id}
              style={{
                '--provider-color': provider.color
              } as React.CSSProperties}
            >
              <div className="oauth-btn-content">
                <span className="oauth-icon" aria-hidden="true">
                  {provider.icon}
                </span>
                <span className="oauth-text">
                  {isLoading ? `Connecting to ${provider.displayName}...` : `Continue with ${provider.displayName}`}
                </span>
                {isLoading && (
                  <span className="oauth-loading" aria-label="Loading" role="status">
                    <span className="loading-spinner" aria-hidden="true"></span>
                  </span>
                )}
              </div>
              
              <span 
                id={`oauth-desc-${provider.id}`} 
                className="sr-only"
              >
                Sign in using your {provider.displayName} account. This will redirect to {provider.displayName} to authenticate.
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading status for screen readers */}
      {loadingProvider && (
        <div className="sr-only" aria-live="polite" role="status">
          Connecting to {sortedProviders.find(p => p.id === loadingProvider)?.displayName}. Please wait...
        </div>
      )}

      {/* Provide help text for OAuth */}
      <div className="oauth-help">
        <p className="oauth-help-text">
          By continuing with a social account, you agree to our terms and privacy policy.
          Your account will be created automatically if this is your first visit.
        </p>
      </div>
    </div>
  );
}

// Default provider configurations
export const DEFAULT_OAUTH_PROVIDERS: OAuthProvider[] = [
  {
    id: 'google',
    name: 'google',
    displayName: 'Google',
    icon: '🔍',
    color: '#4285f4',
    supportsPKCE: true,
    requiresState: true,
    scopes: ['email', 'profile']
  },
  {
    id: 'github',
    name: 'github',
    displayName: 'GitHub',
    icon: '🐱',
    color: '#333',
    supportsPKCE: true,
    requiresState: true,
    scopes: ['user:email']
  },
  {
    id: 'apple',
    name: 'apple',
    displayName: 'Apple',
    icon: '🍎',
    color: '#000',
    supportsPKCE: true,
    requiresState: true,
    scopes: ['name', 'email']
  },
  {
    id: 'microsoft',
    name: 'microsoft',
    displayName: 'Microsoft',
    icon: '🔷',
    color: '#00a1f1',
    supportsPKCE: true,
    requiresState: true,
    scopes: ['openid', 'profile', 'email']
  }
];