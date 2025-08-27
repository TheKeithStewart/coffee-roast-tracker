/**
 * NextAuth.js v5 Main Configuration
 * User Story #18: Production Authentication & Security Foundation
 * 
 * This file exports the main NextAuth.js v5 authentication functions:
 * - auth(): Server-side session retrieval
 * - handlers: GET/POST route handlers for /api/auth/[...nextauth]
 * - signIn/signOut: Server-side authentication actions
 */

import NextAuth from 'next-auth';
import { authConfig } from './auth-config';

export const {
  auth,
  handlers,
  signIn,
  signOut
} = NextAuth(authConfig);