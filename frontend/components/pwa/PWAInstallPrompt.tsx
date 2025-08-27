/**
 * PWA Install Prompt Component
 * User Story #19: PWA Implementation with iOS Safari Reality Check
 * 
 * Features:
 * - Browser-specific installation UI with iOS Safari limitations clearly communicated
 * - Device-aware provider recommendations
 * - Realistic success metrics and user expectation management
 * - Accessibility compliant with ARIA labels and keyboard navigation
 * - Progressive enhancement with fallbacks
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { 
  PWACapabilities, 
  BeforeInstallPromptEvent, 
  PWAInstallInstructions 
} from '@/types/pwa';

interface PWAInstallPromptProps {
  capabilities: PWACapabilities;
  installEvent?: BeforeInstallPromptEvent;
  dismissCount?: number;
  onInstall: (result: InstallResult) => void;
  onDismiss: (result: DismissResult) => void;
  onPromptShown?: (data: PromptShownData) => void;
}

interface InstallResult {
  method: 'automatic' | 'manual' | 'guided';
  browser: string;
  device: string;
  success: boolean;
  duration?: number;
}

interface DismissResult {
  reason: 'user_dismissed' | 'error' | 'already_installed';
  promptCount: number;
  timestamp: number;
}

interface PromptShownData {
  browser: string;
  device: string;
  timestamp: number;
  userAgent: string;
}

type InstallState = 'idle' | 'installing' | 'success' | 'error';

export function PWAInstallPrompt({
  capabilities,
  installEvent,
  dismissCount = 0,
  onInstall,
  onDismiss,
  onPromptShown
}: PWAInstallPromptProps) {
  const [installState, setInstallState] = useState<InstallState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [installStartTime, setInstallStartTime] = useState<number>(0);
  const [announcement, setAnnouncement] = useState<string>('');
  const installButtonRef = useRef<HTMLButtonElement>(null);

  const isIOSSafari = capabilities.browser === 'safari' && capabilities.device === 'ios';
  const hasAutoInstall = capabilities.features.installPrompt;
  
  // Track prompt display
  useEffect(() => {
    if (onPromptShown) {
      onPromptShown({
        browser: capabilities.browser,
        device: capabilities.device,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      });
    }
  }, [capabilities.browser, capabilities.device, onPromptShown]);

  const handleInstall = useCallback(async () => {
    if (!installEvent) return;
    
    setInstallState('installing');
    setError(null);
    const startTime = Date.now();
    setInstallStartTime(startTime);
    
    // Maintain focus on the button during installation
    if (installButtonRef.current) {
      installButtonRef.current.focus();
    }
    
    try {
      await installEvent.prompt();
      const userChoice = await installEvent.userChoice;
      
      const duration = Date.now() - startTime;
      const success = userChoice.outcome === 'accepted';
      
      setInstallState(success ? 'success' : 'idle');
      
      onInstall({
        method: 'automatic',
        browser: capabilities.browser,
        device: capabilities.device,
        success,
        duration
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Installation failed');
      setInstallState('error');
      
      onInstall({
        method: 'automatic',
        browser: capabilities.browser,
        device: capabilities.device,
        success: false
      });
    }
  }, [installEvent, capabilities, onInstall]);

  const handleDismiss = useCallback(() => {
    setAnnouncement('Installation prompt dismissed');
    onDismiss({
      reason: 'user_dismissed',
      promptCount: dismissCount + 1,
      timestamp: Date.now()
    });
  }, [onDismiss, dismissCount]);

  const handleRetry = useCallback(async () => {
    if (!installEvent) return;
    setError(null);
    setInstallState('idle');
    // Retry the installation
    await handleInstall();
  }, [installEvent, handleInstall]);

  const renderIOSInstructions = () => (
    <div className="ios-instructions">
      <h3 className="text-lg font-semibold mb-3">Add to Home Screen</h3>
      <p className="text-sm text-gray-600 mb-4">
        Limited features on iOS Safari, but you can still add to home screen:
      </p>
      
      <ol className="space-y-2 mb-4">
        <li className="flex items-center text-sm">
          <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-3">1</span>
          Tap the share button <span>⎋</span>
        </li>
        <li className="flex items-center text-sm">
          <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-3">2</span>
          Scroll down and select "Add to Home Screen" <span>➕</span>
        </li>
        <li className="flex items-center text-sm">
          <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-3">3</span>
          Tap "Add" to confirm
        </li>
      </ol>

      <div className="bg-yellow-50 p-3 rounded-md mb-4">
        <h4 className="font-medium text-yellow-800 mb-2">Limitations:</h4>
        <ul className="text-xs text-yellow-700 space-y-1">
          {capabilities.limitations.map((limitation, index) => (
            <li key={index}>• {limitation}</li>
          ))}
        </ul>
        <p className="text-xs text-yellow-700 mt-2">50MB storage limit</p>
      </div>

      <div className="bg-green-50 p-3 rounded-md">
        <h4 className="font-medium text-green-800 mb-2">What you get:</h4>
        <ul className="text-xs text-green-700 space-y-1">
          <li>• Home screen access</li>
          <li>• Offline reading</li>
          <li>• Basic app-like experience</li>
        </ul>
      </div>
    </div>
  );

  const renderAutomaticPrompt = () => (
    <div className="automatic-prompt">
      <h3 className="text-lg font-semibold mb-3">Install our app</h3>
      <p className="text-sm text-gray-600 mb-4">
        Get app-like experience with enhanced features:
      </p>

      <div className="benefits mb-4">
        <ul className="text-sm space-y-2">
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Works offline
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Faster loading
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            App-like experience
          </li>
          {capabilities.features.pushNotifications && (
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Push notifications
            </li>
          )}
        </ul>
      </div>

      {capabilities.device === 'android' && (
        <p className="text-sm text-blue-600 mb-4">
          Mobile-optimized • Save to home screen
        </p>
      )}
    </div>
  );

  const renderFallbackInstructions = () => (
    <div className="fallback-instructions">
      <h3 className="text-lg font-semibold mb-3">Bookmark This Page</h3>
      <p className="text-sm text-gray-600 mb-4">
        For easy access from browser menu or bookmarks.
      </p>
      <ul className="text-sm space-y-2">
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">•</span>
          Bookmark for easy access
        </li>
        <li className="flex items-center">
          <span className="text-blue-500 mr-2">•</span>
          Use in browser
        </li>
      </ul>
    </div>
  );

  const renderActionButtons = () => {
    if (installState === 'installing') {
      return (
        <div className="flex items-center justify-center p-4">
          <div role="status" className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
            <span>Installing...</span>
          </div>
        </div>
      );
    }

    if (installState === 'success') {
      return (
        <div className="text-center p-4 text-green-600">
          <p>Successfully installed!</p>
        </div>
      );
    }

    if (installState === 'error') {
      return (
        <div className="space-y-3">
          <div role="alert" className="bg-red-50 p-3 rounded-md">
            <p className="text-red-800 text-sm">Installation failed</p>
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleRetry}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded text-sm hover:bg-blue-600"
            >
              Try again
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded text-sm hover:bg-gray-400"
            >
              Bookmark instead
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded text-sm hover:bg-gray-400"
            >
              Continue in browser
            </button>
          </div>
        </div>
      );
    }

    // Default state buttons
    if (hasAutoInstall && installEvent) {
      return (
        <div className="flex space-x-3">
          <button
            ref={installButtonRef}
            onClick={handleInstall}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded text-sm hover:bg-blue-600"
            aria-describedby="install-description"
          >
            Install app
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded text-sm hover:bg-gray-400"
          >
            Maybe later
          </button>
        </div>
      );
    }

    return (
      <div className="flex space-x-3">
        <button
          onClick={handleDismiss}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded text-sm hover:bg-gray-400"
        >
          Maybe later
        </button>
      </div>
    );
  };

  const getPromptClass = () => {
    const baseClass = "bg-white border rounded-lg shadow-lg p-4 max-w-sm mx-auto";
    if (capabilities.device === 'ios' && window.innerWidth <= 768) {
      return `${baseClass} pwa-prompt--mobile`;
    }
    return baseClass;
  };

  return (
    <div role="dialog" className={getPromptClass()} aria-label="PWA Installation Prompt">
      {/* Hidden description for screen readers */}
      <div id="install-description" className="sr-only">
        Install the app for better performance and offline access
      </div>

      {/* Status announcements */}
      <div 
        role="status" 
        aria-live="polite"
        className="sr-only"
      >
        {announcement || (installState === 'idle' && 'PWA installation prompt ready') ||
         (installState === 'installing' && 'Installing application...') ||
         (installState === 'success' && 'Application installed successfully') ||
         (installState === 'error' && 'Installation failed')}
      </div>

      {/* Main content */}
      {isIOSSafari ? renderIOSInstructions() : hasAutoInstall && installEvent ? renderAutomaticPrompt() : renderFallbackInstructions()}
      
      {/* Action buttons */}
      <div className="mt-4">
        {renderActionButtons()}
      </div>
    </div>
  );
}