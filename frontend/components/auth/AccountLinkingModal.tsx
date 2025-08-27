'use client';

/**
 * AccountLinkingModal Component - OAuth Account Linking Interface
 * User Story #18: Production Authentication & Security Foundation
 * 
 * Features:
 * - ADHD-friendly account linking workflow
 * - Clear security explanations and benefits
 * - User-controlled account consolidation
 * - Comprehensive error handling and recovery
 * - WCAG 2.1 AA accessibility compliance
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import type { AccountLinkingData, AuthError, LinkedAccount } from '@/types/auth';

interface AccountLinkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkingData: AccountLinkingData;
  onLinkComplete: (linkedAccount: LinkedAccount) => void;
  onCreateSeparate: () => void;
}

/**
 * Get provider display information
 */
function getProviderInfo(provider: string) {
  const providers = {
    google: { name: 'Google', icon: '🔍', color: '#4285f4' },
    github: { name: 'GitHub', icon: '🐱', color: '#333' },
    apple: { name: 'Apple', icon: '🍎', color: '#000' },
    microsoft: { name: 'Microsoft', icon: '🔷', color: '#00a1f1' },
  };
  
  return providers[provider as keyof typeof providers] || { 
    name: provider.charAt(0).toUpperCase() + provider.slice(1), 
    icon: '🔗', 
    color: '#666' 
  };
}

export function AccountLinkingModal({
  isOpen,
  onClose,
  linkingData,
  onLinkComplete,
  onCreateSeparate
}: AccountLinkingModalProps) {
  const { linkOAuthAccount, error, clearError } = useAuth();
  const [isLinking, setIsLinking] = useState(false);
  const [linkingError, setLinkingError] = useState<AuthError | null>(null);
  const [step, setStep] = useState<'confirm' | 'benefits' | 'security'>('confirm');
  
  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const providerInfo = getProviderInfo(linkingData.oauthProvider);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus the modal after a brief delay to ensure it's rendered
      const timeout = setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }, 100);
      
      return () => clearTimeout(timeout);
    } else {
      // Return focus to previous element when closing
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen]);

  /**
   * Handle modal close with cleanup
   */
  const handleClose = useCallback(() => {
    if (!isLinking) {
      clearError();
      setLinkingError(null);
      setStep('confirm');
      onClose();
    }
  }, [isLinking, clearError, onClose]);

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        handleClose();
      }

      // Trap focus within modal
      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  /**
   * Handle account linking
   */
  const handleLinkAccounts = useCallback(async () => {
    if (isLinking) return;

    try {
      setIsLinking(true);
      setLinkingError(null);
      clearError();

      const result = await linkOAuthAccount(
        linkingData.oauthProvider,
        'oauth-token-placeholder' // In real app, this would be the actual OAuth token
      );

      if (result.success) {
        const linkedAccount: LinkedAccount = {
          provider: linkingData.oauthProvider,
          linkedAt: Date.now(),
          email: linkingData.oauthEmail,
          providerId: `${linkingData.oauthProvider}_${Date.now()}` // Mock provider ID
        };

        onLinkComplete(linkedAccount);
        handleClose();
      } else if (result.error) {
        setLinkingError(result.error);
      }

    } catch (error) {
      console.error('Account linking error:', error);
      const linkError: AuthError = {
        type: 'account_linking_error',
        message: 'Failed to link accounts. Please try again.',
        code: 'LINK_ERROR',
        recoverable: true,
        retryable: true
      };
      setLinkingError(linkError);
    } finally {
      setIsLinking(false);
    }
  }, [
    isLinking, 
    linkOAuthAccount, 
    linkingData.oauthProvider, 
    linkingData.oauthEmail, 
    onLinkComplete, 
    handleClose, 
    clearError
  ]);

  /**
   * Handle creating separate account
   */
  const handleCreateSeparate = useCallback(() => {
    onCreateSeparate();
    handleClose();
  }, [onCreateSeparate, handleClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="account-linking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h2 id="modal-title" className="modal-title">
              Link Your {providerInfo.name} Account?
            </h2>
            <button
              type="button"
              className="modal-close"
              onClick={handleClose}
              disabled={isLinking}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          {/* Main Content */}
          <div className="modal-body">
            <div id="modal-description" className="account-detection">
              <div className="provider-info">
                <span 
                  className="provider-icon" 
                  style={{ color: providerInfo.color }}
                  aria-hidden="true"
                >
                  {providerInfo.icon}
                </span>
                <div className="account-info">
                  <div className="oauth-email">{linkingData.oauthEmail}</div>
                  <div className="existing-account">
                    Already has an account with {linkingData.existingUser.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Step Content */}
            {step === 'confirm' && (
              <div className="step-content">
                <div className="linking-explanation">
                  <h3>What would you like to do?</h3>
                  <p>
                    We found an existing account with the same email address. 
                    You can link your {providerInfo.name} account to make signing in easier.
                  </p>
                </div>

                <div className="options-grid">
                  <div className="option-card option-card--recommended">
                    <div className="option-header">
                      <span className="option-icon">🔗</span>
                      <div>
                        <div className="option-title">Link Accounts</div>
                        <div className="option-badge">Recommended</div>
                      </div>
                    </div>
                    <div className="option-description">
                      Connect your {providerInfo.name} account for convenient sign-in while 
                      keeping all your existing data and settings.
                    </div>
                    <button
                      type="button"
                      className="option-button"
                      onClick={() => setStep('benefits')}
                      disabled={isLinking}
                    >
                      Learn More
                    </button>
                  </div>

                  <div className="option-card">
                    <div className="option-header">
                      <span className="option-icon">👤</span>
                      <div>
                        <div className="option-title">Keep Separate</div>
                      </div>
                    </div>
                    <div className="option-description">
                      Create a new account with {providerInfo.name}. 
                      You&apos;ll have two separate accounts to manage.
                    </div>
                    <button
                      type="button"
                      className="option-button option-button--secondary"
                      onClick={handleCreateSeparate}
                      disabled={isLinking}
                    >
                      Create New Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 'benefits' && (
              <div className="step-content">
                <div className="benefits-section">
                  <h3>Benefits of linking accounts:</h3>
                  <ul className="benefits-list">
                    <li>
                      <span className="benefit-icon" aria-hidden="true">🔐</span>
                      <div className="benefit-text">
                        <strong>Convenient Sign-in</strong>
                        <div>Use either {providerInfo.name} or your email to sign in</div>
                      </div>
                    </li>
                    <li>
                      <span className="benefit-icon" aria-hidden="true">💾</span>
                      <div className="benefit-text">
                        <strong>Keep Your Data</strong>
                        <div>All your existing roasting data and preferences are preserved</div>
                      </div>
                    </li>
                    <li>
                      <span className="benefit-icon" aria-hidden="true">🔒</span>
                      <div className="benefit-text">
                        <strong>Enhanced Security</strong>
                        <div>Benefit from {providerInfo.name}'s security features</div>
                      </div>
                    </li>
                    <li>
                      <span className="benefit-icon" aria-hidden="true">📱</span>
                      <div className="benefit-text">
                        <strong>Cross-Device Sync</strong>
                        <div>Access your account seamlessly across all devices</div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="step-actions">
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => setStep('confirm')}
                    disabled={isLinking}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => setStep('security')}
                    disabled={isLinking}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 'security' && (
              <div className="step-content">
                <div className="security-section">
                  <h3>Security & Privacy</h3>
                  <div className="security-info">
                    <div className="security-item">
                      <span className="security-icon" aria-hidden="true">🔐</span>
                      <div className="security-text">
                        <strong>Your data stays secure</strong>
                        <div>We only link accounts - no data is shared with {providerInfo.name}</div>
                      </div>
                    </div>
                    <div className="security-item">
                      <span className="security-icon" aria-hidden="true">🚫</span>
                      <div className="security-text">
                        <strong>You stay in control</strong>
                        <div>You can unlink accounts anytime from your account settings</div>
                      </div>
                    </div>
                    <div className="security-item">
                      <span className="security-icon" aria-hidden="true">🛡️</span>
                      <div className="security-text">
                        <strong>Enhanced protection</strong>
                        <div>Benefit from two-factor authentication if enabled on {providerInfo.name}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="step-actions">
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => setStep('benefits')}
                    disabled={isLinking}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className={`btn btn--primary ${isLinking ? 'btn--loading' : ''}`}
                    onClick={handleLinkAccounts}
                    disabled={isLinking}
                    aria-describedby="linking-status"
                  >
                    <span className="btn-text">
                      {isLinking ? 'Linking Accounts...' : 'Link Accounts'}
                    </span>
                    {isLinking && (
                      <span className="btn-spinner" aria-hidden="true"></span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error Display */}
            {(linkingError || error) && (
              <div className="modal-error" role="alert" aria-live="polite">
                <div className="error-content">
                  <span className="error-icon" aria-hidden="true">⚠️</span>
                  <div className="error-message">
                    <div className="error-title">Account Linking Failed</div>
                    <div className="error-description">
                      {linkingError?.message || error?.message}
                    </div>
                  </div>
                </div>
                <div className="error-actions">
                  {(linkingError?.retryable || error?.retryable) && (
                    <button
                      type="button"
                      className="btn btn--sm btn--primary"
                      onClick={handleLinkAccounts}
                      disabled={isLinking}
                    >
                      Try Again
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn--sm btn--secondary"
                    onClick={() => {
                      setLinkingError(null);
                      clearError();
                    }}
                    disabled={isLinking}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <div className="footer-text">
              Questions about account linking? <a href="/support" target="_blank" rel="noopener noreferrer">Contact Support</a>
            </div>
          </div>
        </div>

        {/* Status for screen readers */}
        <div id="linking-status" className="sr-only" aria-live="polite">
          {isLinking ? `Linking your ${providerInfo.name} account. Please wait...` : ''}
        </div>
      </div>
    </>
  );
}