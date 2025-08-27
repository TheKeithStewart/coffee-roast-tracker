/**
 * User Login API Route
 * User Story #18: Production Authentication & Security Foundation
 * 
 * Features:
 * - Email/password authentication
 * - Rate limiting protection
 * - Account lockout after failed attempts
 * - CSRF token validation and rotation
 * - Security audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import type { SecurityAuditLog } from '@/types/auth';

// Login validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  csrfToken: z.string().min(1, 'CSRF token is required'),
});

/**
 * In-memory rate limiting (would use Redis in production)
 */
const loginAttempts = new Map<string, { count: number; resetTime: number; lockedUntil?: number }>();

function checkRateLimit(ip: string): { 
  allowed: boolean; 
  remaining: number; 
  resetTime: number;
  lockedUntil?: number;
} {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 10; // More generous for login vs registration
  const lockoutDuration = 30 * 60 * 1000; // 30 minutes lockout

  const attempts = loginAttempts.get(ip);
  
  if (!attempts || now > attempts.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1, resetTime: now + windowMs };
  }

  // Check if currently locked out
  if (attempts.lockedUntil && now < attempts.lockedUntil) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: attempts.resetTime,
      lockedUntil: attempts.lockedUntil 
    };
  }

  if (attempts.count >= maxAttempts) {
    // Lockout after max attempts
    attempts.lockedUntil = now + lockoutDuration;
    loginAttempts.set(ip, attempts);
    
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: attempts.resetTime,
      lockedUntil: attempts.lockedUntil 
    };
  }

  attempts.count++;
  loginAttempts.set(ip, attempts);
  
  return { 
    allowed: true, 
    remaining: maxAttempts - attempts.count, 
    resetTime: attempts.resetTime 
  };
}

/**
 * Reset rate limit on successful login
 */
function resetRateLimit(ip: string): void {
  loginAttempts.delete(ip);
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('remote-addr');
  
  return forwarded?.split(',')[0] || realIP || remoteAddr || 'unknown';
}

/**
 * Log security event
 */
async function logSecurityEvent(event: Omit<SecurityAuditLog, 'timestamp'>): Promise<void> {
  const auditLog: SecurityAuditLog = {
    ...event,
    timestamp: Date.now()
  };

  console.log('Security Audit:', auditLog);
}

/**
 * Mock user lookup (would integrate with database)
 */
async function getUserByEmail(email: string): Promise<{
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  isLocked?: boolean;
  failedLoginAttempts?: number;
  lastFailedLogin?: Date;
} | null> {
  // Mock user data for testing
  const mockUsers = [
    {
      id: 'user_1',
      email: 'user@example.com',
      name: 'Test User',
      passwordHash: await bcrypt.hash('TestPassword123!', 12), // Hash of TestPassword123!
      isLocked: false,
      failedLoginAttempts: 0,
    },
    {
      id: 'user_2',
      email: 'admin@example.com',
      name: 'Admin User',
      passwordHash: await bcrypt.hash('AdminPass123!', 12), // Hash of AdminPass123!
      isLocked: false,
      failedLoginAttempts: 0,
    },
  ];

  return mockUsers.find(user => user.email === email) || null;
}

/**
 * Verify password
 */
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sanitize input to prevent XSS
 */
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Generate new CSRF token
 */
function generateCSRFToken(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Update user login attempt count (would update database)
 */
async function updateLoginAttempt(
  userId: string, 
  success: boolean
): Promise<void> {
  // In a real app, this would update the database
  console.log(`Login attempt for user ${userId}: ${success ? 'SUCCESS' : 'FAILED'}`);
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';

  try {
    // Check rate limiting
    const rateLimit = checkRateLimit(ip);
    
    if (!rateLimit.allowed) {
      await logSecurityEvent({
        event: 'rate_limit_exceeded',
        ipAddress: ip,
        userAgent,
        severity: 'high',
        additionalData: {
          lockedUntil: rateLimit.lockedUntil,
        },
      });

      const message = rateLimit.lockedUntil 
        ? 'Account temporarily locked due to repeated failed attempts. Please try again later.'
        : 'Too many login attempts. Please try again later.';

      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'rate_limit_exceeded',
            message,
            code: 'RATE_LIMIT_EXCEEDED',
            recoverable: true,
            retryable: false,
          },
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.lockedUntil 
              ? Math.ceil((rateLimit.lockedUntil - Date.now()) / 1000).toString()
              : Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    
    // Sanitize string inputs
    const sanitizedBody = {
      ...body,
      email: typeof body.email === 'string' ? sanitizeInput(body.email) : body.email,
    };

    const validatedData = loginSchema.parse(sanitizedBody);

    // TODO: Validate CSRF token (would require session management)
    if (!validatedData.csrfToken) {
      await logSecurityEvent({
        event: 'csrf_violation',
        ipAddress: ip,
        userAgent,
        severity: 'high',
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'csrf_violation',
            message: 'Invalid security token. Please refresh the page and try again.',
            code: 'CSRF_VIOLATION',
            recoverable: true,
            retryable: true,
          },
        },
        { status: 403 }
      );
    }

    // Find user
    const user = await getUserByEmail(validatedData.email);
    
    if (!user) {
      // Don't reveal whether email exists
      await logSecurityEvent({
        event: 'failed_login',
        ipAddress: ip,
        userAgent,
        severity: 'medium',
        additionalData: {
          failureReason: 'user_not_found',
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'validation_error',
            message: 'Invalid email or password.',
            code: 'INVALID_CREDENTIALS',
            recoverable: true,
            retryable: true,
          },
        },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (user.isLocked) {
      await logSecurityEvent({
        event: 'failed_login',
        userId: user.id,
        ipAddress: ip,
        userAgent,
        severity: 'medium',
        additionalData: {
          failureReason: 'account_locked',
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'account_linking_error',
            message: 'Account is temporarily locked. Please contact support.',
            code: 'ACCOUNT_LOCKED',
            recoverable: false,
            retryable: false,
          },
        },
        { status: 423 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(validatedData.password, user.passwordHash);
    
    if (!isValidPassword) {
      await updateLoginAttempt(user.id, false);
      
      await logSecurityEvent({
        event: 'failed_login',
        userId: user.id,
        ipAddress: ip,
        userAgent,
        severity: 'medium',
        additionalData: {
          failureReason: 'invalid_password',
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'validation_error',
            message: 'Invalid email or password.',
            code: 'INVALID_CREDENTIALS',
            recoverable: true,
            retryable: true,
          },
        },
        { status: 401 }
      );
    }

    // Successful login
    await updateLoginAttempt(user.id, true);
    resetRateLimit(ip); // Reset rate limit on successful login

    await logSecurityEvent({
      event: 'login',
      userId: user.id,
      ipAddress: ip,
      userAgent,
      severity: 'low',
    });

    // Generate new CSRF token for security
    const newCSRFToken = generateCSRFToken();

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        csrfToken: newCSRFToken,
        message: 'Login successful.',
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
        },
      }
    );

  } catch (error) {
    console.error('Login error:', error);

    let errorResponse;

    if (error instanceof z.ZodError) {
      // Validation errors
      errorResponse = {
        success: false,
        error: {
          type: 'validation_error',
          message: 'Please check your input and try again.',
          code: 'VALIDATION_ERROR',
          recoverable: true,
          retryable: true,
          details: error.issues,
        },
      };
    } else {
      // Unexpected server errors
      await logSecurityEvent({
        event: 'failed_login',
        ipAddress: ip,
        userAgent,
        severity: 'high',
        additionalData: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      errorResponse = {
        success: false,
        error: {
          type: 'oauth_network_error',
          message: 'An unexpected error occurred. Please try again.',
          code: 'INTERNAL_ERROR',
          recoverable: true,
          retryable: true,
        },
      };
    }

    return NextResponse.json(errorResponse, { status: 400 });
  }
}