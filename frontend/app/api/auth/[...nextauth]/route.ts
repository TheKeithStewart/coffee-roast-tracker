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

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-config';

/**
 * NextAuth.js handler for all authentication routes
 * Handles: /api/auth/signin, /api/auth/signout, /api/auth/callback/[provider], etc.
 */
const handler = NextAuth(authOptions);

// Export for both GET and POST requests
export { handler as GET, handler as POST };