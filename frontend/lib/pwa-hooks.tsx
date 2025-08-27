/**
 * PWA React Hooks for Service Worker and Connectivity Management
 * User Story #19: PWA Implementation & Offline Architecture
 * 
 * Features:
 * - Service worker registration and lifecycle management
 * - Real-time connectivity monitoring with Network Information API
 * - PWA installation prompt handling
 * - Offline/online state management with sync capabilities
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { 
  OfflineState, 
  SyncStatus, 
  ServiceWorkerStatus,
  BeforeInstallPromptEvent,
  PWACapabilities,
  PWAInstallPromptState
} from '@/types/pwa';

// Service Worker Hook
export function useServiceWorker() {
  const [swStatus, setSWStatus] = useState<ServiceWorkerStatus>({
    isSupported: false,
    isRegistered: false,
    isControlling: false,
    hasUpdate: false,
    cacheStatus: {
      caches: [],
      totalSize: 0,
      availableSpace: 0,
      healthScore: 100,
      lastCleaned: new Date(),
      corruptedCaches: []
    }
  });

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setSWStatus(prev => ({ ...prev, isSupported: false }));
      return;
    }

    setSWStatus(prev => ({ ...prev, isSupported: true }));

    // Register service worker if supported
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        setSWStatus(prev => ({
          ...prev,
          isRegistered: true,
          registration,
          isControlling: !!navigator.serviceWorker.controller
        }));

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          setSWStatus(prev => ({ ...prev, hasUpdate: true }));
        });
      })
      .catch((error) => {
        setSWStatus(prev => ({ 
          ...prev, 
          isRegistered: false, 
          error: error.message 
        }));
      });

    // Listen for controlling changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      setSWStatus(prev => ({ 
        ...prev, 
        isControlling: !!navigator.serviceWorker.controller 
      }));
    });
  }, []);

  const updateServiceWorker = useCallback(() => {
    if (swStatus.registration?.waiting) {
      swStatus.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }, [swStatus.registration]);

  return {
    ...swStatus,
    updateServiceWorker
  };
}

// Connectivity Hook
export function useConnectivity(): OfflineState {
  const [offlineState, setOfflineState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    wasOffline: false,
    connectionType: undefined,
    effectiveType: undefined,
    downlink: undefined,
    rtt: undefined,
    saveData: undefined
  });

  useEffect(() => {
    const updateConnectivity = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
      
      setOfflineState(prev => ({
        isOnline: navigator.onLine,
        wasOffline: prev.isOnline === false && navigator.onLine === false ? prev.wasOffline : !navigator.onLine ? true : prev.wasOffline,
        connectionType: connection?.type || undefined,
        effectiveType: connection?.effectiveType || undefined,
        downlink: connection?.downlink || undefined,
        rtt: connection?.rtt || undefined,
        saveData: connection?.saveData || undefined
      }));
    };

    // Initial update
    updateConnectivity();

    // Listen for online/offline events
    window.addEventListener('online', updateConnectivity);
    window.addEventListener('offline', updateConnectivity);

    // Listen for connection changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateConnectivity);
    }

    return () => {
      window.removeEventListener('online', updateConnectivity);
      window.removeEventListener('offline', updateConnectivity);
      if (connection) {
        connection.removeEventListener('change', updateConnectivity);
      }
    };
  }, []);

  return offlineState;
}

// PWA Install Prompt Hook
export function usePWAInstall() {
  const [installState, setInstallState] = useState<PWAInstallPromptState>({
    canInstall: false,
    hasBeenPrompted: false,
    userDismissed: false,
    lastPromptTime: undefined,
    promptCount: 0,
    installMethod: 'manual'
  });

  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [capabilities, setCapabilities] = useState<PWACapabilities | null>(null);

  useEffect(() => {
    // Detect browser capabilities
    const detectCapabilities = (): PWACapabilities => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
      const isChrome = /chrome/.test(userAgent);
      const isFirefox = /firefox/.test(userAgent);
      const isEdge = /edg/.test(userAgent);
      const isSamsung = /samsungbrowser/.test(userAgent);

      let browser: PWACapabilities['browser'] = 'chrome';
      if (isIOS && isSafari) browser = 'safari';
      else if (isFirefox) browser = 'firefox';
      else if (isEdge) browser = 'edge';
      else if (isSamsung) browser = 'samsung';

      const device: PWACapabilities['device'] = isIOS ? 'ios' : 
                   /android/.test(userAgent) ? 'android' : 'desktop';

      const features = {
        installPrompt: !isIOS || !isSafari,
        pushNotifications: 'Notification' in window && !isIOS,
        backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
        unlimitedStorage: !isIOS,
        deviceAccess: 'mediaDevices' in navigator,
        fullscreen: 'requestFullscreen' in document.documentElement,
        orientationLock: 'orientation' in screen
      };

      const limitations: string[] = [];
      let storageQuota = Infinity;

      if (isIOS && isSafari) {
        limitations.push(
          'No automatic installation prompts',
          'Manual "Add to Home Screen" only', 
          '50MB storage limit',
          'No push notifications',
          'No background sync',
          'Limited device API access'
        );
        storageQuota = 50 * 1024 * 1024; // 50MB
      }

      return {
        browser,
        device,
        features,
        limitations,
        storageQuota
      };
    };

    setCapabilities(detectCapabilities());

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;
      setInstallEvent(installEvent);
      setInstallState(prev => ({
        ...prev,
        canInstall: true,
        installMethod: 'automatic'
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstallState(prev => ({ ...prev, canInstall: false }));
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installEvent) return { success: false, error: 'No install event available' };

    try {
      await installEvent.prompt();
      const userChoice = await installEvent.userChoice;
      
      setInstallState(prev => ({
        ...prev,
        hasBeenPrompted: true,
        userDismissed: userChoice.outcome === 'dismissed',
        lastPromptTime: Date.now(),
        promptCount: prev.promptCount + 1
      }));

      return { 
        success: userChoice.outcome === 'accepted',
        outcome: userChoice.outcome 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Installation failed' 
      };
    }
  }, [installEvent]);

  const dismissInstall = useCallback(() => {
    setInstallState(prev => ({
      ...prev,
      userDismissed: true,
      lastPromptTime: Date.now(),
      promptCount: prev.promptCount + 1
    }));
  }, []);

  return {
    ...installState,
    installEvent,
    capabilities,
    promptInstall,
    dismissInstall
  };
}

// Sync Status Hook (placeholder for future backend integration)
export function useSyncStatus(): SyncStatus {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    state: 'idle',
    pendingChanges: 0,
    lastSyncTime: undefined,
    nextRetryTime: undefined,
    retryCount: 0,
    maxRetries: 3,
    syncProgress: undefined,
    failedItems: []
  });

  // This would integrate with your backend sync system
  // For now, it's a placeholder that can be extended
  const triggerSync = useCallback(async () => {
    setSyncStatus(prev => ({ ...prev, state: 'syncing' }));
    
    // Simulate sync process
    setTimeout(() => {
      setSyncStatus(prev => ({ 
        ...prev, 
        state: 'success',
        lastSyncTime: new Date(),
        pendingChanges: 0
      }));
      
      // Return to idle after success message
      setTimeout(() => {
        setSyncStatus(prev => ({ ...prev, state: 'idle' }));
      }, 2000);
    }, 1000);
  }, []);

  return {
    ...syncStatus,
    triggerSync
  } as SyncStatus & { triggerSync: () => Promise<void> };
}