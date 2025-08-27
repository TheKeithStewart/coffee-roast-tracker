/**
 * Comprehensive TypeScript interfaces for Epic #12: Foundation & PWA Setup
 * Authentication System with OAuth Integration and ADHD-friendly UX
 */

export interface UserSession {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    oauthProvider?: 'google' | 'github' | 'apple' | 'microsoft' | null;
    oauthId?: string;
    avatar?: string;
  };
  isAuthenticated: boolean;
  authMethod: 'email' | 'oauth';
  csrfToken: string;
  expiresAt: number; // Max 7 days
  lastValidated: number;
  linkedAccounts?: LinkedAccount[];
}

export interface LinkedAccount {
  provider: 'google' | 'github' | 'apple' | 'microsoft';
  linkedAt: number;
  email: string;
  providerId: string;
}

export interface AuthError {
  type: 'oauth_callback_error' | 'oauth_access_denied' | 'oauth_network_error' | 'validation_error' | 'rate_limit_exceeded' | 'csrf_violation' | 'oauth_state_mismatch' | 'account_linking_error';
  message: string;
  code?: string;
  recoverable: boolean;
  retryable: boolean;
  details?: any; // Zod validation issues or other error details
}

export interface OAuthProvider {
  id: 'google' | 'github' | 'apple' | 'microsoft';
  name: string;
  displayName: string;
  icon: string;
  color: string;
  supportsPKCE: boolean;
  requiresState: boolean;
  scopes: string[];
}

export interface AuthFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
  termsAccepted?: boolean;
  marketingConsent?: boolean;
}

export interface AuthValidationError {
  field: keyof AuthFormData;
  message: string;
  code: string;
}

export interface ProgressiveAuthStep {
  id: string;
  title: string;
  description: string;
  fields: (keyof AuthFormData)[];
  validation: AuthValidationSchema;
  optional?: boolean;
  completed: boolean;
}

export interface AuthValidationSchema {
  [key: string]: {
    required: boolean;
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    customValidator?: (value: string) => boolean;
    errorMessage: string;
  };
}

export interface SecurityAuditLog {
  timestamp: number;
  event: 'login' | 'logout' | 'failed_login' | 'oauth_login' | 'oauth_callback' | 'account_linked' | 'csrf_violation' | 'oauth_state_mismatch' | 'rate_limit_exceeded' | 'registration';
  userId?: string;
  oauthProvider?: 'google' | 'github' | 'apple' | 'microsoft';
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  additionalData?: {
    oauthState?: string;
    accountLinkingAttempt?: boolean;
    pkceVerified?: boolean;
    failureReason?: string;
    lockedUntil?: number;
    error?: string;
    refreshedSession?: boolean;
  };
}

export interface AuthContext {
  session: UserSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
  login: (credentials: AuthFormData) => Promise<{ success: boolean; error?: AuthError }>;
  register: (userData: AuthFormData) => Promise<{ success: boolean; error?: AuthError }>;
  logout: () => Promise<void>;
  linkOAuthAccount: (provider: string, token: string) => Promise<{ success: boolean; error?: AuthError }>;
  validateSession: () => Promise<boolean>;
  clearError: () => void;
  refreshSession: () => Promise<void>;
}

// OAuth Integration Types
export interface OAuthState {
  state: string;
  codeVerifier?: string; // For PKCE
  redirectUri: string;
  provider: string;
  timestamp: number;
}

export interface OAuthCallbackParams {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
}

export interface AccountLinkingData {
  oauthProvider: 'google' | 'github' | 'apple' | 'microsoft';
  oauthEmail: string;
  existingUser: {
    id: string;
    email: string;
    authMethods: string[];
  };
  requiresVerification: boolean;
}

// Rate Limiting Types
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
  isLimited: boolean;
}

// Security Headers Configuration
export interface SecurityHeaders {
  'Content-Security-Policy': string;
  'Strict-Transport-Security': string;
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
}