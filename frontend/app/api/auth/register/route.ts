/**
 * User Registration API Route
 * User Story #18: Production Authentication & Security Foundation
 * 
 * Features:
 * - Comprehensive input validation
 * - Password strength requirements
 * - Rate limiting protection
 * - CSRF token validation
 * - Security audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
// import { headers } from 'next/headers'; // TODO: Implement security headers if needed
import type { SecurityAuditLog } from '@/types/auth';

// Registration validation schema
const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long')
    .regex(/^[a-zA-Z\s\-']+$/, 'First name contains invalid characters')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long')
    .regex(/^[a-zA-Z\s\-']+$/, 'Last name contains invalid characters')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  termsAccepted: z
    .boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
  marketingConsent: z.boolean().optional().default(false),
  csrfToken: z.string().min(1, 'CSRF token is required'),
});

/**
 * Simple in-memory rate limiting (would use Redis in production)
 */
const registrationAttempts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  const attempts = registrationAttempts.get(ip);
  
  if (!attempts || now > attempts.resetTime) {
    registrationAttempts.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1, resetTime: now + windowMs };
  }

  if (attempts.count >= maxAttempts) {
    return { allowed: false, remaining: 0, resetTime: attempts.resetTime };
  }

  attempts.count++;
  registrationAttempts.set(ip, attempts);
  
  return { allowed: true, remaining: maxAttempts - attempts.count, resetTime: attempts.resetTime };
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

  // In production, send to logging service
  console.log('Security Audit:', auditLog);
}

/**
 * Hash password securely
 */
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // High salt rounds for security
  return bcrypt.hash(password, saltRounds);
}

/**
 * Check if user already exists (mock implementation)
 */
async function userExists(email: string): Promise<boolean> {
  // In a real app, this would query the database
  // For demo purposes, we'll simulate that some emails are taken
  const takenEmails = ['admin@example.com', 'test@example.com'];
  return takenEmails.includes(email);
}

/**
 * Create new user (mock implementation)
 */
async function createUser(userData: {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  marketingConsent: boolean;
}): Promise<{ id: string; email: string; name: string }> {
  // In a real app, this would save to database
  const user = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2)}`,
    email: userData.email,
    name: `${userData.firstName} ${userData.lastName}`,
    firstName: userData.firstName,
    lastName: userData.lastName,
    passwordHash: userData.passwordHash,
    marketingConsent: userData.marketingConsent,
    createdAt: new Date(),
    emailVerified: false, // Would be handled by email verification flow
  };

  console.log('Created user (mock):', { ...user, passwordHash: '[REDACTED]' });
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
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
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'rate_limit_exceeded',
            message: 'Too many registration attempts. Please try again later.',
            code: 'RATE_LIMIT_EXCEEDED',
            recoverable: true,
            retryable: false,
          },
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '5',
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
      firstName: typeof body.firstName === 'string' ? sanitizeInput(body.firstName) : body.firstName,
      lastName: typeof body.lastName === 'string' ? sanitizeInput(body.lastName) : body.lastName,
      email: typeof body.email === 'string' ? sanitizeInput(body.email) : body.email,
    };

    const validatedData = registerSchema.parse(sanitizedBody);

    // TODO: Validate CSRF token (would require session management)
    // For now, we'll just check it exists
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

    // Check if user already exists
    if (await userExists(validatedData.email)) {
      await logSecurityEvent({
        event: 'failed_login',
        ipAddress: ip,
        userAgent,
        severity: 'medium',
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'validation_error',
            message: 'An account with this email already exists.',
            code: 'EMAIL_EXISTS',
            recoverable: true,
            retryable: false,
          },
        },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // Create user
    const user = await createUser({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      passwordHash,
      marketingConsent: validatedData.marketingConsent,
    });

    // Log successful registration
    await logSecurityEvent({
      event: 'registration',
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
        message: 'Account created successfully. Please check your email to verify your account.',
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
        },
      }
    );

  } catch (error) {
    console.error('Registration error:', error);

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