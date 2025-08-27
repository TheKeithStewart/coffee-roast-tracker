/**
 * Feature Flags System for Epic #61
 * PWA Foundation Enhancement & Testing Stabilization
 * 
 * Enables gradual rollout with A/B testing for all Epic #61 features
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Feature flag definitions
interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number; // 0-100
  targetGroups?: string[];
  dependencies?: string[];
  abTestVariant?: 'A' | 'B' | null;
}

interface FeatureFlagContextType {
  flags: { [key: string]: FeatureFlag };
  isFeatureEnabled: (key: string) => boolean;
  getFeatureVariant: (key: string) => 'A' | 'B' | null;
  toggleFeatureForTesting: (key: string, enabled?: boolean) => void;
  getUserGroup: () => string;
  getFeatureFlagSummary: () => any;
}

// Epic #61 feature flags configuration
const FEATURE_FLAGS: FeatureFlag[] = [
  {
    key: 'pwa_debug_panel',
    name: 'PWA Development Debug Panel',
    description: 'PWA debugging tools and real-time monitoring',
    enabled: true, // Always enabled in development
    rolloutPercentage: process.env.NODE_ENV === 'development' ? 100 : 0,
    dependencies: []
  },
  {
    key: 'adaptive_navigation',
    name: 'Adaptive Intelligence Navigation',
    description: 'ADHD-optimized navigation with pattern recognition',
    enabled: true,
    rolloutPercentage: 25, // Gradual rollout - 25%
    abTestVariant: null // Will be determined per user
  },
  {
    key: 'cognitive_load_optimization',
    name: 'Cognitive Load Optimization',
    description: 'Rule-based cognitive load optimization for ADHD users',
    enabled: true,
    rolloutPercentage: 50, // 50% rollout
    dependencies: ['adaptive_navigation']
  },
  {
    key: 'smart_automation',
    name: 'Smart Automation Features',
    description: 'Intelligent automation with user transparency',
    enabled: true,
    rolloutPercentage: 15, // Conservative rollout - 15%
    dependencies: ['adaptive_navigation', 'cognitive_load_optimization']
  },
  {
    key: 'personalization_tracking',
    name: 'User Personalization Tracking',
    description: 'Navigation pattern learning and personalization',
    enabled: true,
    rolloutPercentage: 75, // High rollout - established feature
    dependencies: []
  },
  {
    key: 'ab_test_navigation_style',
    name: 'Navigation Style A/B Test',
    description: 'A/B test between guided vs streamlined navigation',
    enabled: true,
    rolloutPercentage: 50,
    abTestVariant: null, // A = guided, B = streamlined
    dependencies: ['adaptive_navigation']
  },
  {
    key: 'enhanced_pwa_caching',
    name: 'Enhanced PWA Caching',
    description: 'Improved service worker caching strategies',
    enabled: true,
    rolloutPercentage: 100, // Core infrastructure - full rollout
    dependencies: []
  }
];

const FeatureFlagContext = createContext<FeatureFlagContextType | null>(null);

// Generate consistent user ID for feature flag assignment
function getUserId(): string {
  let userId = localStorage.getItem('feature-flag-user-id');
  if (!userId) {
    userId = 'user-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('feature-flag-user-id', userId);
  }
  return userId;
}

// Hash function for consistent assignment
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Determine if user should see feature based on rollout percentage
function shouldShowFeature(userId: string, flagKey: string, rolloutPercentage: number): boolean {
  const hash = hashString(userId + flagKey);
  const userPercentile = hash % 100;
  return userPercentile < rolloutPercentage;
}

// Determine A/B test variant
function getABTestVariant(userId: string, flagKey: string): 'A' | 'B' {
  const hash = hashString(userId + flagKey + 'ab');
  return hash % 2 === 0 ? 'A' : 'B';
}

interface FeatureFlagProviderProps {
  children: React.ReactNode;
  overrides?: { [key: string]: boolean }; // For testing
}

export function FeatureFlagProvider({ children, overrides = {} }: FeatureFlagProviderProps) {
  const [flags, setFlags] = useState<{ [key: string]: FeatureFlag }>({});
  const [userId] = useState(() => getUserId());
  const [userGroup] = useState(() => {
    // Assign user to group based on user ID hash
    const hash = hashString(userId);
    if (hash % 10 < 2) return 'early_adopters'; // 20%
    if (hash % 10 < 5) return 'regular_users';   // 30% 
    return 'conservative_users';                 // 50%
  });

  // Initialize feature flags
  useEffect(() => {
    const initializedFlags: { [key: string]: FeatureFlag } = {};
    
    FEATURE_FLAGS.forEach(flag => {
      const shouldShow = shouldShowFeature(userId, flag.key, flag.rolloutPercentage);
      const variant = flag.abTestVariant !== undefined ? getABTestVariant(userId, flag.key) : null;
      
      initializedFlags[flag.key] = {
        ...flag,
        enabled: overrides[flag.key] !== undefined 
          ? overrides[flag.key] 
          : flag.enabled && shouldShow,
        abTestVariant: variant
      };
    });

    setFlags(initializedFlags);

    // Log feature flag initialization in development
    if (process.env.NODE_ENV === 'development') {
      console.group('[Feature Flags] User Assignment');
      console.log('User ID:', userId);
      console.log('User Group:', userGroup);
      console.table(Object.entries(initializedFlags).map(([key, flag]) => ({
        Feature: flag.name,
        Enabled: flag.enabled,
        Rollout: `${flag.rolloutPercentage}%`,
        Variant: flag.abTestVariant || 'N/A'
      })));
      console.groupEnd();
    }
  }, [userId, userGroup, overrides]);

  // Check if feature is enabled
  const isFeatureEnabled = (key: string): boolean => {
    const flag = flags[key];
    if (!flag) return false;

    // Check dependencies
    if (flag.dependencies) {
      const dependenciesMet = flag.dependencies.every(dep => 
        flags[dep] && flags[dep].enabled
      );
      if (!dependenciesMet) return false;
    }

    return flag.enabled;
  };

  // Get A/B test variant for feature
  const getFeatureVariant = (key: string): 'A' | 'B' | null => {
    const flag = flags[key];
    return flag?.abTestVariant || null;
  };

  // Toggle feature for testing (development only)
  const toggleFeatureForTesting = (key: string, enabled?: boolean) => {
    if (process.env.NODE_ENV !== 'development') return;

    setFlags(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: enabled !== undefined ? enabled : !prev[key]?.enabled
      }
    }));
  };

  // Get feature flag summary
  const getFeatureFlagSummary = () => {
    return {
      userId,
      userGroup,
      enabledFeatures: Object.entries(flags)
        .filter(([_, flag]) => flag.enabled)
        .map(([key, flag]) => ({
          key,
          name: flag.name,
          variant: flag.abTestVariant
        })),
      totalFlags: Object.keys(flags).length,
      enabledCount: Object.values(flags).filter(flag => flag.enabled).length
    };
  };

  const contextValue: FeatureFlagContextType = {
    flags,
    isFeatureEnabled,
    getFeatureVariant,
    toggleFeatureForTesting,
    getUserGroup: () => userGroup,
    getFeatureFlagSummary
  };

  return (
    <FeatureFlagContext.Provider value={contextValue}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

// Hook to use feature flags
export function useFeatureFlags(): FeatureFlagContextType {
  const context = useContext(FeatureFlagContext);
  
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  
  return context;
}

// Convenience hook for specific feature
export function useFeature(key: string): {
  enabled: boolean;
  variant: 'A' | 'B' | null;
} {
  const { isFeatureEnabled, getFeatureVariant } = useFeatureFlags();
  
  return {
    enabled: isFeatureEnabled(key),
    variant: getFeatureVariant(key)
  };
}

// Development component for testing feature flags
export function FeatureFlagDebugPanel() {
  const { flags, toggleFeatureForTesting, getFeatureFlagSummary } = useFeatureFlags();
  const [isOpen, setIsOpen] = useState(false);

  if (process.env.NODE_ENV !== 'development') return null;

  const summary = getFeatureFlagSummary();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-32 right-4 bg-green-600 text-white p-2 rounded z-50 text-xs"
        title="Feature Flags Debug"
      >
        🚩 {summary.enabledCount}/{summary.totalFlags}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Feature Flags Debug</h3>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            
            <div className="mb-4 text-sm">
              <p><strong>User ID:</strong> {summary.userId}</p>
              <p><strong>User Group:</strong> {summary.userGroup}</p>
            </div>

            <div className="space-y-2">
              {Object.entries(flags).map(([key, flag]) => (
                <div key={key} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <div className="font-medium">{flag.name}</div>
                    <div className="text-xs text-gray-600">{flag.description}</div>
                    <div className="text-xs text-gray-500">
                      Rollout: {flag.rolloutPercentage}% 
                      {flag.abTestVariant && ` | Variant: ${flag.abTestVariant}`}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFeatureForTesting(key)}
                    className={`px-2 py-1 rounded text-xs ${
                      flag.enabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {flag.enabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}