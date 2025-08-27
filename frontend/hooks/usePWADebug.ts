/**
 * PWA Debug Hook for Epic #61 Issue #63
 * PWA Development Testing Environment
 * 
 * Hook for managing PWA debugging functionality in development
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface PWADebugState {
  isDebugPanelOpen: boolean;
  isDevelopment: boolean;
  isServiceWorkerSupported: boolean;
  installPromptEvent: any;
}

export function usePWADebug() {
  const [state, setState] = useState<PWADebugState>({
    isDebugPanelOpen: false,
    isDevelopment: false,
    isServiceWorkerSupported: false,
    installPromptEvent: null
  });

  // Initialize debug state
  useEffect(() => {
    setState(prev => ({
      ...prev,
      isDevelopment: process.env.NODE_ENV === 'development' || 
                    window.location.hostname.includes('localhost'),
      isServiceWorkerSupported: 'serviceWorker' in navigator
    }));
  }, []);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault(); // Prevent default browser install prompt
      setState(prev => ({ ...prev, installPromptEvent: event }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Keyboard shortcut to toggle debug panel (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (state.isDevelopment && 
          event.ctrlKey && 
          event.shiftKey && 
          event.key === 'D') {
        event.preventDefault();
        toggleDebugPanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.isDevelopment]);

  // Listen for PWA debug install test events
  useEffect(() => {
    const handleInstallTest = () => {
      if (state.installPromptEvent) {
        state.installPromptEvent.prompt();
        state.installPromptEvent.userChoice.then((choiceResult: any) => {
          console.log('[PWA Debug] Install choice:', choiceResult);
        });
      } else {
        console.log('[PWA Debug] No install prompt available');
      }
    };

    window.addEventListener('pwa-debug-install-test', handleInstallTest);
    
    return () => {
      window.removeEventListener('pwa-debug-install-test', handleInstallTest);
    };
  }, [state.installPromptEvent]);

  // Toggle debug panel
  const toggleDebugPanel = useCallback(() => {
    setState(prev => ({
      ...prev,
      isDebugPanelOpen: !prev.isDebugPanelOpen
    }));
  }, []);

  // Show debug panel
  const showDebugPanel = useCallback(() => {
    setState(prev => ({ ...prev, isDebugPanelOpen: true }));
  }, []);

  // Hide debug panel
  const hideDebugPanel = useCallback(() => {
    setState(prev => ({ ...prev, isDebugPanelOpen: false }));
  }, []);

  // Check if PWA is installable
  const isInstallable = useCallback(() => {
    return !!state.installPromptEvent;
  }, [state.installPromptEvent]);

  // Trigger install prompt
  const triggerInstall = useCallback(async () => {
    if (state.installPromptEvent) {
      const result = await state.installPromptEvent.prompt();
      const choice = await state.installPromptEvent.userChoice;
      
      // Clear the event after use
      setState(prev => ({ ...prev, installPromptEvent: null }));
      
      return {
        result,
        choice: choice.outcome
      };
    }
    
    return null;
  }, [state.installPromptEvent]);

  // Get PWA status information
  const getPWAStatus = useCallback(async () => {
    const status = {
      isInstalled: window.matchMedia('(display-mode: standalone)').matches ||
                  (window.navigator as any).standalone === true,
      isInstallable: isInstallable(),
      supportsPWA: 'serviceWorker' in navigator && 'PushManager' in window,
      isOnline: navigator.onLine,
      serviceWorkerRegistered: false,
      serviceWorkerActive: false
    };

    // Check service worker status
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        status.serviceWorkerRegistered = !!registration;
        status.serviceWorkerActive = !!registration?.active;
      } catch (error) {
        console.warn('[PWA Debug] Failed to check service worker status:', error);
      }
    }

    return status;
  }, [isInstallable]);

  // Log PWA debug information
  const logPWAInfo = useCallback(async () => {
    const status = await getPWAStatus();
    console.group('[PWA Debug] Current Status');
    console.table(status);
    console.log('Install event available:', !!state.installPromptEvent);
    console.log('Development mode:', state.isDevelopment);
    console.groupEnd();
  }, [getPWAStatus, state.installPromptEvent, state.isDevelopment]);

  return {
    // State
    isDebugPanelOpen: state.isDebugPanelOpen,
    isDevelopment: state.isDevelopment,
    isServiceWorkerSupported: state.isServiceWorkerSupported,
    installPromptEvent: state.installPromptEvent,
    
    // Actions
    toggleDebugPanel,
    showDebugPanel,
    hideDebugPanel,
    triggerInstall,
    
    // Utilities
    isInstallable,
    getPWAStatus,
    logPWAInfo
  };
}