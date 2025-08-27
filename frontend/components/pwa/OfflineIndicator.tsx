/**
 * Offline Indicator Component
 * User Story #19: PWA Implementation & Offline Architecture
 * 
 * Features:
 * - Real-time connection monitoring with Network Information API
 * - Sync status display with user-friendly messaging
 * - Retry mechanisms for failed network requests
 * - Connection transition animations
 * - Accessibility compliant with ARIA labels and keyboard navigation
 * - Multiple display modes (compact/full)
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { OfflineState, SyncStatus, SyncFailure } from '@/types/pwa';

interface OfflineIndicatorProps {
  offlineState: OfflineState;
  syncStatus: SyncStatus;
  onRetrySync?: () => void;
  onSettingsOpen?: () => void;
  compact?: boolean;
}

export function OfflineIndicator({
  offlineState,
  syncStatus,
  onRetrySync,
  onSettingsOpen,
  compact = false
}: OfflineIndicatorProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [previousOfflineState, setPreviousOfflineState] = useState(offlineState.isOnline);
  const [showReconnectedMessage, setShowReconnectedMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Handle connection state transitions
  useEffect(() => {
    if (previousOfflineState !== offlineState.isOnline) {
      setShowTransition(true);
      
      // Show reconnection celebration if coming back online after being offline
      if (!previousOfflineState && offlineState.isOnline && offlineState.wasOffline) {
        setShowReconnectedMessage(true);
        setTimeout(() => setShowReconnectedMessage(false), 3000);
      }
      
      setPreviousOfflineState(offlineState.isOnline);
      setTimeout(() => setShowTransition(false), 500);
    }
  }, [offlineState.isOnline, previousOfflineState, offlineState.wasOffline]);

  // Handle sync success messages
  useEffect(() => {
    if (syncStatus.state === 'success') {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  }, [syncStatus.state]);

  const getConnectionQuality = () => {
    if (!offlineState.isOnline) return 'offline';
    
    const { effectiveType, downlink, rtt } = offlineState;
    
    if (effectiveType === '4g' && downlink && downlink > 10 && rtt && rtt < 50) {
      return 'excellent';
    } else if (effectiveType === '4g' || (downlink && downlink > 2)) {
      return 'good';
    } else if (effectiveType === '3g' || (downlink && downlink > 0.5)) {
      return 'moderate';
    } else {
      return 'slow';
    }
  };

  const getConnectionText = () => {
    if (!offlineState.isOnline) {
      if (showTransition) return 'Connection lost';
      return 'Offline';
    }
    
    if (showReconnectedMessage) {
      return 'Back online';
    }
    
    const quality = getConnectionQuality();
    const connectionType = offlineState.connectionType || 'unknown';
    
    switch (quality) {
      case 'excellent':
        return `Excellent connection`;
      case 'good':
        return `Good connection`;
      case 'moderate':
        return `Moderate speed`;
      case 'slow':
        return `Slow connection`;
      default:
        return 'Online';
    }
  };

  const getSyncStatusText = () => {
    if (showSuccessMessage) {
      return `Sync complete - ${formatLastSync()}`;
    }
    
    switch (syncStatus.state) {
      case 'syncing':
        return `Syncing ${syncStatus.pendingChanges} changes`;
      case 'error':
        const retryableCount = syncStatus.failedItems?.filter(item => item.retryable).length || 0;
        const nonRetryableCount = (syncStatus.failedItems?.length || 0) - retryableCount;
        return `Sync failed - ${retryableCount} item${retryableCount !== 1 ? 's' : ''} can be retried${nonRetryableCount > 0 ? `, ${nonRetryableCount} item${nonRetryableCount !== 1 ? 's' : ''} need${nonRetryableCount === 1 ? 's' : ''} attention` : ''}`;
      case 'pending':
        return `${syncStatus.pendingChanges} changes waiting`;
      default:
        return '';
    }
  };

  const formatLastSync = () => {
    if (!syncStatus.lastSyncTime) return 'never';
    
    const now = new Date();
    const diff = now.getTime() - syncStatus.lastSyncTime.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return syncStatus.lastSyncTime.toLocaleDateString();
  };

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleRetrySync = useCallback(() => {
    if (onRetrySync) {
      onRetrySync();
    }
  }, [onRetrySync]);

  const handleSettingsOpen = useCallback(() => {
    if (onSettingsOpen) {
      onSettingsOpen();
    }
  }, [onSettingsOpen]);

  const renderOfflineCapabilities = () => (
    <div className="mt-3 p-3 bg-blue-50 rounded-md">
      <h4 className="font-medium text-blue-800 mb-2">What can I do offline?</h4>
      <ul className="text-sm text-blue-700 space-y-1">
        <li>• Track active roasts</li>
        <li>• View saved data</li>
        <li>• Make notes</li>
      </ul>
      <p className="text-xs text-blue-600 mt-2">Changes sync when reconnected</p>
    </div>
  );

  const renderSyncProgress = () => {
    if (syncStatus.state !== 'syncing' || !syncStatus.syncProgress) return null;
    
    return (
      <div className="mt-2">
        <div 
          role="progressbar"
          aria-valuenow={syncStatus.syncProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Syncing ${syncStatus.pendingChanges} changes, ${syncStatus.syncProgress}% complete`}
          className="w-full bg-gray-200 rounded-full h-2"
        >
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${syncStatus.syncProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1">{syncStatus.syncProgress}%</p>
      </div>
    );
  };

  const renderErrorDetails = () => {
    if (syncStatus.state !== 'error' || !syncStatus.failedItems) return null;
    
    return (
      <div className="mt-2 space-y-2">
        {syncStatus.failedItems.map((failure, index) => (
          <div key={failure.id} className="text-xs text-gray-600">
            <span className="font-medium">{failure.type}:</span> {failure.error}
          </div>
        ))}
      </div>
    );
  };

  const renderActionButtons = () => {
    if (compact) return null;
    
    return (
      <div className="flex space-x-2 mt-3">
        {syncStatus.state === 'error' && offlineState.isOnline && (
          <button
            onClick={handleRetrySync}
            className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Retry now
          </button>
        )}
        
        {offlineState.isOnline ? (
          <button
            onClick={handleRetrySync}
            className="text-xs bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
          >
            Sync now
          </button>
        ) : (
          <button
            disabled
            className="text-xs bg-gray-300 text-gray-500 px-3 py-1 rounded cursor-not-allowed"
            aria-describedby="sync-disabled-description"
          >
            Sync when online
          </button>
        )}
        
        {onSettingsOpen && (
          <button
            onClick={handleSettingsOpen}
            className="text-xs bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
          >
            Sync settings
          </button>
        )}
      </div>
    );
  };

  if (compact && !showDetails) {
    return (
      <button
        onClick={handleToggleDetails}
        className="flex items-center space-x-2 p-2 rounded text-sm"
        aria-label={offlineState.isOnline ? 'Show connection details' : 'Show offline details'}
      >
        <div className={`w-3 h-3 rounded-full ${offlineState.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="sr-only">{offlineState.isOnline ? 'Online' : 'Offline'}</span>
      </button>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-3 max-w-sm">
      {/* Hidden descriptions */}
      <div id="sync-disabled-description" className="sr-only">
        Sync will resume automatically when connection is restored
      </div>
      
      {/* Status announcement */}
      <div
        role="status"
        aria-live={offlineState.isOnline ? 'polite' : 'assertive'}
        aria-label={`Connection status: ${offlineState.isOnline ? 'Online' : 'Offline'}`}
        className="sr-only"
      >
        {offlineState.isOnline ? 'Online' : 'Offline - No internet connection'}
      </div>

      {/* Main status display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${offlineState.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          <div>
            <p 
              className="text-sm font-medium"
              aria-label={getConnectionQuality() === 'slow' ? 'Slow network connection' : undefined}
            >
              {getConnectionText()}
              {showReconnectedMessage && <span className="ml-1">🎉</span>}
            </p>
            
            {offlineState.isOnline && offlineState.saveData && (
              <p className="text-xs text-gray-600" aria-label="Data saver mode enabled">
                Data saver mode
              </p>
            )}
            
            {!offlineState.isOnline && (
              <p className="text-xs text-gray-600">No internet connection</p>
            )}
          </div>
        </div>

        {compact && (
          <button
            onClick={handleToggleDetails}
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            {showDetails ? 'Less' : 'More'}
          </button>
        )}
      </div>

      {/* Connection quality details */}
      {offlineState.isOnline && !compact && (
        <div className="mt-2 text-xs text-gray-600">
          {offlineState.connectionType && (
            <span className="capitalize">{offlineState.connectionType}</span>
          )}
          {offlineState.effectiveType && (
            <span className="ml-2 uppercase">{offlineState.effectiveType}</span>
          )}
          <span 
            aria-label={`Connection quality: ${getConnectionQuality()}`}
            className="sr-only"
          />
        </div>
      )}

      {/* Sync status */}
      {(syncStatus.pendingChanges > 0 || syncStatus.state !== 'idle') && (
        <div className="mt-2">
          <p className="text-sm text-gray-700">{getSyncStatusText()}</p>
          {renderSyncProgress()}
          {renderErrorDetails()}
        </div>
      )}

      {/* Pending changes indicator */}
      {!offlineState.isOnline && syncStatus.pendingChanges > 0 && (
        <div className="mt-2">
          <p 
            className="text-sm text-orange-600"
            aria-label={`${syncStatus.pendingChanges} changes pending sync`}
          >
            {syncStatus.pendingChanges} changes waiting
          </p>
        </div>
      )}

      {/* Offline capabilities */}
      {!offlineState.isOnline && !compact && (
        <details className="mt-3">
          <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
            <button className="text-sm text-blue-600 hover:text-blue-800">
              What can I do offline?
            </button>
          </summary>
          {renderOfflineCapabilities()}
        </details>
      )}

      {/* Action buttons */}
      {renderActionButtons()}
    </div>
  );
}