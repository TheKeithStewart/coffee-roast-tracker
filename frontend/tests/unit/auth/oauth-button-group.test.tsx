/**
 * Unit Tests for OAuthButtonGroup Component (TDD)
 * OAuth Provider Buttons with PKCE Security Implementation
 * Tests written BEFORE implementation following TDD Red-Green-Refactor cycle
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { OAuthButtonGroup } from '@/components/auth/OAuthButtonGroup';
import type { OAuthProvider, AuthError } from '@/types/auth';

// Mock NextAuth
const mockSignIn = jest.fn();
jest.mock('next-auth/react', () => ({
  signIn: mockSignIn
}));

// Mock crypto for PKCE
const mockCrypto = {
  subtle: {
    digest: jest.fn(),
  },
  getRandomValues: jest.fn((arr: Uint8Array) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  })
};

Object.defineProperty(window, 'crypto', {
  value: mockCrypto
});

const mockOAuthProviders: OAuthProvider[] = [
  {
    id: 'google',
    name: 'google',
    displayName: 'Google',
    icon: '🎯',
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

describe('OAuthButtonGroup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignIn.mockResolvedValue({ ok: true });
  });

  describe('Rendering and Accessibility', () => {
    test('renders all OAuth provider buttons', () => {
      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      mockOAuthProviders.forEach(provider => {
        expect(screen.getByRole('button', { 
          name: new RegExp(`continue with ${provider.displayName}`, 'i') 
        })).toBeInTheDocument();
      });
    });

    test('applies proper ARIA labels and descriptions', () => {
      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      
      expect(googleButton).toHaveAttribute('aria-label', 'Continue with Google');
      expect(googleButton).toHaveAttribute('aria-describedby');
      
      const description = document.getElementById(
        googleButton.getAttribute('aria-describedby')!
      );
      expect(description).toHaveTextContent(/sign in using your google account/i);
    });

    test('implements proper focus management', async () => {
      const user = userEvent.setup();
      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      const githubButton = screen.getByRole('button', { name: /continue with github/i });

      await user.tab();
      expect(document.activeElement).toBe(googleButton);

      await user.tab();
      expect(document.activeElement).toBe(githubButton);
    });

    test('displays provider-specific branding', () => {
      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      const githubButton = screen.getByRole('button', { name: /continue with github/i });

      // Should have provider-specific styling
      expect(googleButton).toHaveStyle(`color: ${mockOAuthProviders[0].color}`);
      expect(githubButton).toHaveStyle(`color: ${mockOAuthProviders[1].color}`);
    });

    test('shows provider icons and text', () => {
      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      mockOAuthProviders.forEach(provider => {
        const button = screen.getByRole('button', { 
          name: new RegExp(`continue with ${provider.displayName}`, 'i') 
        });
        
        // Icon should be present
        expect(button.querySelector('.oauth-icon')).toHaveTextContent(provider.icon);
        
        // Text should be present
        expect(button).toHaveTextContent(`Continue with ${provider.displayName}`);
      });
    });
  });

  describe('PKCE Security Implementation', () => {
    test('generates PKCE code verifier and challenge', async () => {
      const user = userEvent.setup();
      
      // Mock successful PKCE generation
      mockCrypto.subtle.digest.mockResolvedValue(
        new ArrayBuffer(32) // Mock SHA256 result
      );

      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      await user.click(googleButton);

      // Should generate code verifier
      expect(mockCrypto.getRandomValues).toHaveBeenCalled();
      
      // Should generate code challenge
      expect(mockCrypto.subtle.digest).toHaveBeenCalledWith(
        'SHA-256',
        expect.any(Uint8Array)
      );
    });

    test('stores PKCE state securely in session storage', async () => {
      const user = userEvent.setup();
      const mockSetItem = jest.fn();
      
      Object.defineProperty(window, 'sessionStorage', {
        value: {
          setItem: mockSetItem,
          getItem: jest.fn(),
          removeItem: jest.fn()
        }
      });

      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      await user.click(googleButton);

      await waitFor(() => {
        expect(mockSetItem).toHaveBeenCalledWith(
          'oauth_state_google',
          expect.stringMatching(/^{.*}$/) // JSON string
        );
      });
    });

    test('generates unique state parameter for CSRF protection', async () => {
      const user = userEvent.setup();
      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      
      // Click twice to generate two different states
      await user.click(googleButton);
      const firstCall = mockSignIn.mock.calls[0];
      
      jest.clearAllMocks();
      await user.click(googleButton);
      const secondCall = mockSignIn.mock.calls[0];

      // State parameters should be different
      expect(firstCall[1].state).not.toBe(secondCall[1].state);
      expect(firstCall[1].state).toMatch(/^[a-zA-Z0-9_-]+$/);
      expect(secondCall[1].state).toMatch(/^[a-zA-Z0-9_-]+$/);
    });
  });

  describe('OAuth Flow Integration', () => {
    test('initiates OAuth flow with correct parameters', async () => {
      const user = userEvent.setup();
      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      await user.click(googleButton);

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('google', {
          callbackUrl: expect.stringContaining('/auth/callback'),
          redirect: false,
          state: expect.any(String),
          code_challenge: expect.any(String),
          code_challenge_method: 'S256',
          scope: 'email profile'
        });
      });
    });

    test('handles different provider scopes correctly', async () => {
      const user = userEvent.setup();
      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      // Test Google scopes
      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      await user.click(googleButton);

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('google', 
          expect.objectContaining({
            scope: 'email profile'
          })
        );
      });

      jest.clearAllMocks();

      // Test GitHub scopes
      const githubButton = screen.getByRole('button', { name: /continue with github/i });
      await user.click(githubButton);

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('github',
          expect.objectContaining({
            scope: 'user:email'
          })
        );
      });
    });

    test('prevents concurrent OAuth requests', async () => {
      const user = userEvent.setup();
      
      // Make signIn slow to simulate network request
      mockSignIn.mockImplementation(() => new Promise(resolve => 
        setTimeout(() => resolve({ ok: true }), 1000)
      ));

      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      
      // Click multiple times rapidly
      await user.click(googleButton);
      await user.click(googleButton);
      await user.click(googleButton);

      // Should only be called once
      expect(mockSignIn).toHaveBeenCalledTimes(1);
      
      // Button should be disabled during request
      expect(googleButton).toBeDisabled();
    });
  });

  describe('Loading States', () => {
    test('shows loading state during OAuth initiation', async () => {
      const user = userEvent.setup();
      
      // Make signIn return a pending promise
      let resolveSignIn: (value: any) => void;
      mockSignIn.mockImplementation(() => new Promise(resolve => {
        resolveSignIn = resolve;
      }));

      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      await user.click(googleButton);

      // Should show loading state
      expect(googleButton).toBeDisabled();
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText(/connecting to google/i)).toBeInTheDocument();
      
      // Loading spinner should be visible
      expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    });

    test('disables all provider buttons during any OAuth flow', async () => {
      const user = userEvent.setup();
      
      let resolveSignIn: (value: any) => void;
      mockSignIn.mockImplementation(() => new Promise(resolve => {
        resolveSignIn = resolve;
      }));

      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      const githubButton = screen.getByRole('button', { name: /continue with github/i });
      
      await user.click(googleButton);

      // All buttons should be disabled
      expect(googleButton).toBeDisabled();
      expect(githubButton).toBeDisabled();
    });

    test('restores buttons after OAuth completion', async () => {
      const user = userEvent.setup();
      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      const githubButton = screen.getByRole('button', { name: /continue with github/i });
      
      await user.click(googleButton);
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalled();
      });

      // Buttons should be re-enabled
      expect(googleButton).not.toBeDisabled();
      expect(githubButton).not.toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    test('handles OAuth errors gracefully', async () => {
      const user = userEvent.setup();
      const oauthError = new Error('OAuth provider rejected request');
      mockSignIn.mockRejectedValue(oauthError);

      const mockOnError = jest.fn();
      render(
        <OAuthButtonGroup 
          providers={mockOAuthProviders} 
          onError={mockOnError}
        />
      );

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      await user.click(googleButton);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith({
          type: 'oauth_callback_error',
          message: 'OAuth provider rejected request',
          code: 'OAUTH_ERROR',
          recoverable: true,
          retryable: true
        });
      });
    });

    test('shows error message with retry option', async () => {
      const user = userEvent.setup();
      mockSignIn.mockRejectedValue(new Error('Network error'));

      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      await user.click(googleButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(/oauth authentication failed/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      });
    });

    test('allows error dismissal', async () => {
      const user = userEvent.setup();
      mockSignIn.mockRejectedValue(new Error('Network error'));

      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      await user.click(googleButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      const dismissButton = screen.getByRole('button', { name: /dismiss/i });
      await user.click(dismissButton);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Device-Specific Behavior', () => {
    test('prioritizes platform-native providers', () => {
      // Mock iOS Safari
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        configurable: true
      });

      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      const buttons = screen.getAllByRole('button');
      const buttonTexts = buttons.map(btn => btn.textContent);

      // Apple should be first on iOS
      expect(buttonTexts[0]).toMatch(/apple/i);
    });

    test('adapts button sizing for touch devices', () => {
      // Mock touch device
      Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 5,
        configurable: true
      });

      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        const styles = window.getComputedStyle(button);
        expect(parseInt(styles.minHeight)).toBeGreaterThanOrEqual(60); // ADHD-friendly touch targets
      });
    });
  });

  describe('Keyboard Navigation', () => {
    test('supports arrow key navigation between providers', async () => {
      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      const buttons = screen.getAllByRole('button');
      const [googleBtn, githubBtn, appleBtn, microsoftBtn] = buttons;

      // Focus first button
      googleBtn.focus();
      expect(document.activeElement).toBe(googleBtn);

      // Arrow down should move to next button
      fireEvent.keyDown(googleBtn, { key: 'ArrowDown' });
      expect(document.activeElement).toBe(githubBtn);

      // Arrow up should move to previous button
      fireEvent.keyDown(githubBtn, { key: 'ArrowUp' });
      expect(document.activeElement).toBe(googleBtn);

      // Arrow down from last button should wrap to first
      microsoftBtn.focus();
      fireEvent.keyDown(microsoftBtn, { key: 'ArrowDown' });
      expect(document.activeElement).toBe(googleBtn);
    });

    test('supports Enter and Space key activation', async () => {
      render(<OAuthButtonGroup providers={mockOAuthProviders} />);

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      googleButton.focus();

      // Enter key should activate
      fireEvent.keyDown(googleButton, { key: 'Enter' });
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('google', expect.any(Object));
      });

      jest.clearAllMocks();

      // Space key should also activate
      fireEvent.keyDown(googleButton, { key: ' ' });
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('google', expect.any(Object));
      });
    });
  });

  describe('Analytics and Tracking', () => {
    test('tracks OAuth provider selection', async () => {
      const user = userEvent.setup();
      const mockOnProviderSelect = jest.fn();
      
      render(
        <OAuthButtonGroup 
          providers={mockOAuthProviders}
          onProviderSelect={mockOnProviderSelect}
        />
      );

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      await user.click(googleButton);

      expect(mockOnProviderSelect).toHaveBeenCalledWith('google', {
        timestamp: expect.any(Number),
        userAgent: expect.any(String),
        deviceType: expect.stringMatching(/mobile|tablet|desktop/)
      });
    });

    test('tracks OAuth completion success/failure', async () => {
      const user = userEvent.setup();
      const mockOnComplete = jest.fn();
      
      render(
        <OAuthButtonGroup 
          providers={mockOAuthProviders}
          onComplete={mockOnComplete}
        />
      );

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      await user.click(googleButton);

      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith('google', {
          success: true,
          duration: expect.any(Number),
          method: 'oauth'
        });
      });
    });
  });
});