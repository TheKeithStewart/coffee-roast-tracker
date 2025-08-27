/**
 * Unit Tests for OfflineIndicator Component (TDD)
 * User Story #19: PWA Implementation & Offline Architecture
 * Tests written BEFORE implementation following TDD Red-Green-Refactor cycle
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { OfflineIndicator } from '@/components/pwa/OfflineIndicator';
import type { OfflineState, SyncStatus } from '@/types/pwa';

// Mock Network Information API
const mockConnection = {
  effectiveType: '4g',
  downlink: 10,
  rtt: 50,
  saveData: false,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};

Object.defineProperty(navigator, 'connection', {
  value: mockConnection,
  configurable: true
});

// Mock online/offline state
const mockOnlineState = {
  isOnline: true,
  wasOffline: false,
  connectionType: 'wifi' as const,
  effectiveType: '4g' as const,
  downlink: 10,
  rtt: 50,
  saveData: false
};

const mockOfflineState: OfflineState = {
  isOnline: false,
  wasOffline: true,
  connectionType: undefined,
  effectiveType: undefined,
  downlink: undefined,
  rtt: undefined,
  saveData: undefined
};

const mockSyncStatus: SyncStatus = {
  state: 'idle',
  pendingChanges: 0,
  lastSyncTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  nextRetryTime: undefined,
  retryCount: 0,
  maxRetries: 3,
  syncProgress: undefined,
  failedItems: []
};

describe('OfflineIndicator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Online State Display', () => {
    test('shows online status with good connection', () => {
      render(
        <OfflineIndicator 
          offlineState={mockOnlineState}
          syncStatus={mockSyncStatus}
        />
      );

      expect(screen.getByText(/online/i)).toBeInTheDocument();
      expect(screen.getByText(/good connection/i)).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    test('indicates slow connection when appropriate', () => {
      const slowConnection = {
        ...mockOnlineState,
        effectiveType: '2g' as const,
        downlink: 0.5,
        rtt: 2000
      };

      render(
        <OfflineIndicator 
          offlineState={slowConnection}
          syncStatus={mockSyncStatus}
        />
      );

      expect(screen.getByText(/slow connection/i)).toBeInTheDocument();
      expect(screen.getByText(/2g/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/slow network connection/i)).toBeInTheDocument();
    });

    test('shows data saver mode when enabled', () => {
      const dataSaverConnection = {
        ...mockOnlineState,
        saveData: true
      };

      render(
        <OfflineIndicator 
          offlineState={dataSaverConnection}
          syncStatus={mockSyncStatus}
        />
      );

      expect(screen.getByText(/data saver/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/data saver mode enabled/i)).toBeInTheDocument();
    });
  });

  describe('Offline State Display', () => {
    test('shows offline status clearly', () => {
      render(
        <OfflineIndicator 
          offlineState={mockOfflineState}
          syncStatus={mockSyncStatus}
        />
      );

      expect(screen.getByText(/offline/i)).toBeInTheDocument();
      expect(screen.getByText(/no internet connection/i)).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'assertive');
    });

    test('explains offline capabilities', async () => {
      const user = userEvent.setup();
      
      render(
        <OfflineIndicator 
          offlineState={mockOfflineState}
          syncStatus={mockSyncStatus}
        />
      );

      const helpButton = screen.getByRole('button', { name: /what can i do offline/i });
      await user.click(helpButton);

      expect(screen.getByText(/you can still/i)).toBeInTheDocument();
      expect(screen.getByText(/track active roasts/i)).toBeInTheDocument();
      expect(screen.getByText(/view saved data/i)).toBeInTheDocument();
      expect(screen.getByText(/make notes/i)).toBeInTheDocument();
      expect(screen.getByText(/changes sync when reconnected/i)).toBeInTheDocument();
    });

    test('shows pending changes count when offline', () => {
      const syncStatusWithPendingChanges: SyncStatus = {
        ...mockSyncStatus,
        pendingChanges: 3
      };

      render(
        <OfflineIndicator 
          offlineState={mockOfflineState}
          syncStatus={syncStatusWithPendingChanges}
        />
      );

      expect(screen.getByText(/3 changes waiting/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/3 changes pending sync/i)).toBeInTheDocument();
    });
  });

  describe('Sync Status Display', () => {
    test('shows active sync progress', () => {
      const syncingStatus: SyncStatus = {
        ...mockSyncStatus,
        state: 'syncing',
        syncProgress: 45,
        pendingChanges: 10
      };

      render(
        <OfflineIndicator 
          offlineState={mockOnlineState}
          syncStatus={syncingStatus}
        />
      );

      expect(screen.getByText(/syncing/i)).toBeInTheDocument();
      expect(screen.getByText(/45%/i)).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '45');
      expect(screen.getByLabelText(/syncing 10 changes, 45% complete/i)).toBeInTheDocument();
    });

    test('shows sync success state temporarily', async () => {
      const successStatus: SyncStatus = {
        ...mockSyncStatus,
        state: 'success',
        lastSyncTime: new Date()
      };

      render(
        <OfflineIndicator 
          offlineState={mockOnlineState}
          syncStatus={successStatus}
        />
      );

      expect(screen.getByText(/sync complete/i)).toBeInTheDocument();
      expect(screen.getByText(/just now/i)).toBeInTheDocument();

      // Should return to normal state after delay
      await waitFor(() => {
        expect(screen.queryByText(/sync complete/i)).not.toBeInTheDocument();
      }, { timeout: 4000 });
    });

    test('shows sync errors with retry option', async () => {
      const user = userEvent.setup();
      const errorStatus: SyncStatus = {
        ...mockSyncStatus,
        state: 'error',
        retryCount: 1,
        nextRetryTime: new Date(Date.now() + 30000), // 30 seconds from now
        failedItems: [
          {
            id: 'roast-1',
            type: 'roast',
            error: 'Network timeout',
            timestamp: Date.now(),
            retryable: true
          }
        ]
      };

      const mockRetrySync = jest.fn();

      render(
        <OfflineIndicator 
          offlineState={mockOnlineState}
          syncStatus={errorStatus}
          onRetrySync={mockRetrySync}
        />
      );

      expect(screen.getByText(/sync failed/i)).toBeInTheDocument();
      expect(screen.getByText(/1 item failed/i)).toBeInTheDocument();

      const retryButton = screen.getByRole('button', { name: /retry now/i });
      await user.click(retryButton);

      expect(mockRetrySync).toHaveBeenCalled();
    });
  });

  describe('Connection Transition Animations', () => {
    test('shows transition when going offline', () => {
      const { rerender } = render(
        <OfflineIndicator 
          offlineState={mockOnlineState}
          syncStatus={mockSyncStatus}
        />
      );

      expect(screen.getByText(/online/i)).toBeInTheDocument();

      rerender(
        <OfflineIndicator 
          offlineState={mockOfflineState}
          syncStatus={mockSyncStatus}
        />
      );

      expect(screen.getByText(/connection lost/i)).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'assertive');
    });

    test('shows reconnection celebration', async () => {
      const { rerender } = render(
        <OfflineIndicator 
          offlineState={mockOfflineState}
          syncStatus={mockSyncStatus}
        />
      );

      expect(screen.getByText(/offline/i)).toBeInTheDocument();

      const reconnectedState = {
        ...mockOnlineState,
        wasOffline: true
      };

      rerender(
        <OfflineIndicator 
          offlineState={reconnectedState}
          syncStatus={mockSyncStatus}
        />
      );

      expect(screen.getByText(/back online/i)).toBeInTheDocument();
      expect(screen.getByText(/🎉/)).toBeInTheDocument();

      // Should return to normal state after celebration
      await waitFor(() => {
        expect(screen.queryByText(/back online/i)).not.toBeInTheDocument();
      }, { timeout: 4000 });
    });
  });

  describe('Accessibility Features', () => {
    test('provides appropriate ARIA labels for all states', () => {
      render(
        <OfflineIndicator 
          offlineState={mockOfflineState}
          syncStatus={mockSyncStatus}
        />
      );

      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveAttribute('aria-label', 'Connection status: Offline');
      expect(statusElement).toHaveAttribute('aria-live', 'assertive');
    });

    test('announces connection changes to screen readers', () => {
      const { rerender } = render(
        <OfflineIndicator 
          offlineState={mockOnlineState}
          syncStatus={mockSyncStatus}
        />
      );

      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveTextContent(/online/i);

      rerender(
        <OfflineIndicator 
          offlineState={mockOfflineState}
          syncStatus={mockSyncStatus}
        />
      );

      expect(statusElement).toHaveAttribute('aria-live', 'assertive');
      expect(statusElement).toHaveTextContent(/offline/i);
    });

    test('provides keyboard navigation for interactive elements', async () => {
      const user = userEvent.setup();
      const mockRetrySync = jest.fn();
      
      const errorStatus: SyncStatus = {
        ...mockSyncStatus,
        state: 'error',
        failedItems: [
          {
            id: 'item-1',
            type: 'roast',
            error: 'Failed',
            timestamp: Date.now(),
            retryable: true
          }
        ]
      };

      render(
        <OfflineIndicator 
          offlineState={mockOnlineState}
          syncStatus={errorStatus}
          onRetrySync={mockRetrySync}
        />
      );

      const retryButton = screen.getByRole('button', { name: /retry now/i });
      
      // Should be focusable
      retryButton.focus();
      expect(document.activeElement).toBe(retryButton);

      // Should work with keyboard
      await user.keyboard('{Enter}');
      expect(mockRetrySync).toHaveBeenCalled();
    });
  });

  describe('Performance Indicators', () => {
    test('shows connection quality indicators', () => {
      const fastConnection = {
        ...mockOnlineState,
        connectionType: 'wifi' as const,
        effectiveType: '4g' as const,
        downlink: 50,
        rtt: 20
      };

      render(
        <OfflineIndicator 
          offlineState={fastConnection}
          syncStatus={mockSyncStatus}
        />
      );

      expect(screen.getByText(/excellent connection/i)).toBeInTheDocument();
      expect(screen.getByText(/wifi/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/connection quality: excellent/i)).toBeInTheDocument();
    });

    test('adapts messaging for different connection types', () => {
      const cellularConnection = {
        ...mockOnlineState,
        connectionType: 'cellular' as const,
        effectiveType: '3g' as const,
        downlink: 2,
        rtt: 300
      };

      render(
        <OfflineIndicator 
          offlineState={cellularConnection}
          syncStatus={mockSyncStatus}
        />
      );

      expect(screen.getByText(/cellular/i)).toBeInTheDocument();
      expect(screen.getByText(/3g/i)).toBeInTheDocument();
      expect(screen.getByText(/moderate speed/i)).toBeInTheDocument();
    });
  });

  describe('User Controls', () => {
    test('allows manual sync trigger when online', async () => {
      const user = userEvent.setup();
      const mockRetrySync = jest.fn();

      render(
        <OfflineIndicator 
          offlineState={mockOnlineState}
          syncStatus={mockSyncStatus}
          onRetrySync={mockRetrySync}
        />
      );

      const syncButton = screen.getByRole('button', { name: /sync now/i });
      await user.click(syncButton);

      expect(mockRetrySync).toHaveBeenCalled();
    });

    test('disables sync trigger when offline', () => {
      render(
        <OfflineIndicator 
          offlineState={mockOfflineState}
          syncStatus={mockSyncStatus}
          onRetrySync={jest.fn()}
        />
      );

      const syncButton = screen.getByRole('button', { name: /sync when online/i });
      expect(syncButton).toBeDisabled();
      expect(syncButton).toHaveAttribute('aria-describedby');
      
      const description = document.getElementById(syncButton.getAttribute('aria-describedby')!);
      expect(description).toHaveTextContent(/sync will resume automatically when connection is restored/i);
    });

    test('provides sync settings access', async () => {
      const user = userEvent.setup();
      const mockOnSettingsOpen = jest.fn();

      render(
        <OfflineIndicator 
          offlineState={mockOnlineState}
          syncStatus={mockSyncStatus}
          onSettingsOpen={mockOnSettingsOpen}
        />
      );

      const settingsButton = screen.getByRole('button', { name: /sync settings/i });
      await user.click(settingsButton);

      expect(mockOnSettingsOpen).toHaveBeenCalled();
    });
  });

  describe('Error Recovery', () => {
    test('provides clear error explanations', () => {
      const errorStatus: SyncStatus = {
        ...mockSyncStatus,
        state: 'error',
        failedItems: [
          {
            id: 'roast-1',
            type: 'roast',
            error: 'Server unavailable',
            timestamp: Date.now(),
            retryable: true
          },
          {
            id: 'profile-1',
            type: 'profile',
            error: 'Permission denied',
            timestamp: Date.now(),
            retryable: false
          }
        ]
      };

      render(
        <OfflineIndicator 
          offlineState={mockOnlineState}
          syncStatus={errorStatus}
        />
      );

      expect(screen.getByText(/2 items failed/i)).toBeInTheDocument();
      expect(screen.getByText(/server unavailable/i)).toBeInTheDocument();
      expect(screen.getByText(/permission denied/i)).toBeInTheDocument();
    });

    test('distinguishes between retryable and non-retryable errors', () => {
      const errorStatus: SyncStatus = {
        ...mockSyncStatus,
        state: 'error',
        failedItems: [
          {
            id: 'item-1',
            type: 'roast',
            error: 'Network timeout',
            timestamp: Date.now(),
            retryable: true
          },
          {
            id: 'item-2',
            type: 'profile',
            error: 'Invalid data format',
            timestamp: Date.now(),
            retryable: false
          }
        ]
      };

      render(
        <OfflineIndicator 
          offlineState={mockOnlineState}
          syncStatus={errorStatus}
        />
      );

      expect(screen.getByText(/1 item can be retried/i)).toBeInTheDocument();
      expect(screen.getByText(/1 item needs attention/i)).toBeInTheDocument();
    });
  });

  describe('Compact Mode', () => {
    test('shows minimal interface in compact mode', () => {
      render(
        <OfflineIndicator 
          offlineState={mockOnlineState}
          syncStatus={mockSyncStatus}
          compact={true}
        />
      );

      // Should show just the essential status
      expect(screen.getByLabelText(/online/i)).toBeInTheDocument();
      expect(screen.queryByText(/good connection/i)).not.toBeInTheDocument();
    });

    test('expands details on interaction in compact mode', async () => {
      const user = userEvent.setup();
      
      render(
        <OfflineIndicator 
          offlineState={mockOnlineState}
          syncStatus={mockSyncStatus}
          compact={true}
        />
      );

      const statusIndicator = screen.getByRole('button', { name: /show connection details/i });
      await user.click(statusIndicator);

      expect(screen.getByText(/good connection/i)).toBeInTheDocument();
      expect(screen.getByText(/wifi/i)).toBeInTheDocument();
    });
  });
});