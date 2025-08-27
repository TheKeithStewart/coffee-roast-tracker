/**
 * NextAuth.js API Route Handler
 * User Story #18: Production Authentication & Security Foundation
 * 
 * This file handles all authentication requests including:
 * - OAuth provider authentication (Google, GitHub, Apple, Microsoft)
 * - Session management with security features
 * - PKCE implementation for enhanced OAuth security
 * - Security audit logging
 */

import { handlers } from '@/lib/auth';

/**
 * NextAuth.js v5 API Route Handler
 * User Story #18: Production Authentication & Security Foundation
 * 
 * This file handles all authentication requests including:
 * - OAuth provider authentication (Google, GitHub, Apple, Microsoft)
 * - Session management with security features
 * - PKCE implementation for enhanced OAuth security
 * - Security audit logging
 * 
 * Handles: /api/auth/signin, /api/auth/signout, /api/auth/callback/[provider], etc.
 */

// Export NextAuth.js v5 handlers
export const { GET, POST } = handlers;