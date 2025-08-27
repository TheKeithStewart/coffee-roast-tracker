/**
 * TypeScript interfaces for PWA Implementation & Offline Architecture
 * User Story #19: PWA with iOS Safari Reality Check
 */

export interface PWACapabilities {
  browser: 'safari' | 'chrome' | 'firefox' | 'edge' | 'samsung';
  device: 'ios' | 'android' | 'desktop';
  features: {
    installPrompt: boolean;        // Automatic install prompts available
    pushNotifications: boolean;    // Push notification support
    backgroundSync: boolean;       // Background sync capabilities
    unlimitedStorage: boolean;     // No storage limitations
    deviceAccess: boolean;         // Camera, contacts, etc.
    fullscreen: boolean;          // True fullscreen mode
    orientationLock: boolean;     // Screen orientation control
  };
  limitations: string[];          // Known limitations for user education
  storageQuota: number;          // Storage limit in bytes (50MB for iOS Safari)
}

export interface PWAExperience {
  installationType: 'automatic' | 'manual' | 'unavailable';
  featureSet: 'full' | 'limited' | 'basic';
  storageStrategy: 'aggressive' | 'conservative' | 'minimal';
  offlineCapability: 'advanced' | 'basic' | 'none';
  userEducation: 'benefits-focused' | 'limitations-aware' | 'feature-comparison';
}

export interface PWAInstallPromptState {
  canInstall: boolean;
  hasBeenPrompted: boolean;
  userDismissed: boolean;
  installEvent?: BeforeInstallPromptEvent;
  lastPromptTime?: number;
  promptCount: number;
  installMethod: 'automatic' | 'manual' | 'guided';
}

export interface BeforeInstallPromptEvent extends Event {
  platforms: string[];
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

export interface PWAInstallInstructions {
  browser: string;
  device: string;
  steps: InstallStep[];
  visualAids: string[];
  troubleshooting: string[];
  expectedOutcome: string;
  limitations?: string[];
}

export interface InstallStep {
  id: string;
  title: string;
  description: string;
  action: string;
  visual?: string;
  alternative?: string;
}

// Offline & Sync Management
export interface OfflineState {
  isOnline: boolean;
  wasOffline: boolean;
  connectionType?: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

export interface SyncStatus {
  state: 'idle' | 'syncing' | 'error' | 'success' | 'pending';
  pendingChanges: number;
  lastSyncTime?: Date;
  nextRetryTime?: Date;
  retryCount: number;
  maxRetries: number;
  syncProgress?: number; // 0-100
  failedItems?: SyncFailure[];
}

export interface SyncFailure {
  id: string;
  type: string;
  error: string;
  timestamp: number;
  retryable: boolean;
}

export interface ServiceWorkerStatus {
  isSupported: boolean;
  isRegistered: boolean;
  isControlling: boolean;
  hasUpdate: boolean;
  registration?: ServiceWorkerRegistration;
  error?: string;
  cacheStatus: CacheStatus;
}

export interface CacheStatus {
  caches: CacheInfo[];
  totalSize: number;
  availableSpace: number;
  healthScore: number; // 0-100
  lastCleaned: Date;
  corruptedCaches: string[];
}

export interface CacheInfo {
  name: string;
  size: number;
  entries: number;
  lastUsed: Date;
  strategy: 'CacheFirst' | 'NetworkFirst' | 'StaleWhileRevalidate' | 'NetworkOnly' | 'CacheOnly';
  maxAge: number;
  maxEntries: number;
}

// PWA Manifest Types
export interface PWAManifest {
  name: string;
  short_name: string;
  description?: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  orientation?: 'portrait' | 'landscape' | 'portrait-primary' | 'landscape-primary';
  theme_color: string;
  background_color: string;
  start_url: string;
  scope: string;
  id?: string;
  categories: string[];
  icons: PWAIcon[];
  screenshots?: PWAScreenshot[];
  shortcuts?: PWAShortcut[];
  related_applications?: RelatedApplication[];
  prefer_related_applications?: boolean;
}

export interface PWAIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: 'any' | 'maskable' | 'monochrome';
}

export interface PWAScreenshot {
  src: string;
  sizes: string;
  type: string;
  platform?: 'wide' | 'narrow';
  label?: string;
}

export interface PWAShortcut {
  name: string;
  description?: string;
  url: string;
  icons?: PWAIcon[];
}

export interface RelatedApplication {
  platform: string;
  url: string;
  id?: string;
}

// User Context for PWA Experience
export interface UserContext {
  isFirstTime: boolean;
  isADHD: boolean;
  isMobile: boolean;
  isReturning: boolean;
  isDesktop: boolean;
  isBusinessUser: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  preferredUX: 'guided' | 'streamlined' | 'minimal';
  hasSeenInstallPrompt: boolean;
  installPromptDismissals: number;
}

// Analytics & Tracking
export interface PWAAnalytics {
  installPromptShown: number;
  installPromptAccepted: number;
  installPromptDismissed: number;
  successfulInstalls: number;
  installationMethod: Record<string, number>;
  browserInstallSupport: Record<string, boolean>;
  offlineUsage: {
    sessions: number;
    duration: number;
    featuresUsed: string[];
  };
  cacheHitRatio: number;
  syncSuccessRate: number;
}