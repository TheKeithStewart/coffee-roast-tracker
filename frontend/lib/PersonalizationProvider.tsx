/**
 * PersonalizationProvider for Epic #61 Issue #64
 * Enhanced ADHD-Friendly Navigation System
 * Option B: Adaptive Intelligence Navigation
 * 
 * Provides personalization and adaptive behavior with simplified local storage
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Types for personalization data
interface NavigationPattern {
  route: string;
  timestamp: number;
  timeSpent: number;
  fromRoute?: string;
  context?: string; // 'search' | 'menu' | 'quick-action' | 'breadcrumb'
}

interface UserPreferences {
  // Navigation preferences
  preferredStartPage: string;
  quickAccessRoutes: string[];
  hiddenMenuItems: string[];
  navigationStyle: 'guided' | 'streamlined' | 'minimal';
  
  // ADHD-specific preferences
  enableFocusMode: boolean;
  enableCognitiveLoadOptimization: boolean;
  enableSmartSuggestions: boolean;
  enableHapticFeedback: boolean;
  
  // Accessibility preferences
  enableHighContrast: boolean;
  enableReducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  
  // Privacy preferences
  enableDataCollection: boolean;
  enableAnalytics: boolean;
}

interface PersonalizationData {
  navigationPatterns: NavigationPattern[];
  preferences: UserPreferences;
  frequentRoutes: { route: string; count: number; lastVisit: number }[];
  searchHistory: { query: string; timestamp: number; resultClicked?: string }[];
  cognitiveLoadEvents: { timestamp: number; event: string; severity: number }[];
  lastUpdated: number;
}

interface PersonalizationContextType {
  data: PersonalizationData;
  preferences: UserPreferences;
  
  // Data collection methods
  recordNavigation: (pattern: Omit<NavigationPattern, 'timestamp'>) => void;
  recordSearch: (query: string, resultClicked?: string) => void;
  recordCognitiveEvent: (event: string, severity: number) => void;
  
  // Preference management
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  
  // Analytics and insights
  getFrequentRoutes: (limit?: number) => string[];
  getNavigationInsights: () => any;
  shouldSuggestRoute: (route: string) => boolean;
  
  // Data management
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  clearAllData: () => void;
  
  // Privacy
  toggleDataCollection: (enabled: boolean) => void;
  getDataSummary: () => any;
}

// Default preferences optimized for ADHD users
const defaultPreferences: UserPreferences = {
  preferredStartPage: '/',
  quickAccessRoutes: ['/roasts/new', '/profiles', '/beans'],
  hiddenMenuItems: [],
  navigationStyle: 'guided',
  
  enableFocusMode: true,
  enableCognitiveLoadOptimization: true,
  enableSmartSuggestions: true,
  enableHapticFeedback: false,
  
  enableHighContrast: false,
  enableReducedMotion: false,
  fontSize: 'medium',
  
  enableDataCollection: true,
  enableAnalytics: false
};

// Initial personalization data
const initialData: PersonalizationData = {
  navigationPatterns: [],
  preferences: defaultPreferences,
  frequentRoutes: [],
  searchHistory: [],
  cognitiveLoadEvents: [],
  lastUpdated: Date.now()
};

const PersonalizationContext = createContext<PersonalizationContextType | null>(null);

// Local storage keys
const STORAGE_KEY = 'coffee-tracker-personalization';
const STORAGE_VERSION = '1.0';

interface PersonalizationProviderProps {
  children: React.ReactNode;
}

export function PersonalizationProvider({ children }: PersonalizationProviderProps) {
  const [data, setData] = useState<PersonalizationData>(initialData);
  
  // Load data from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Validate version and structure
        if (parsed.version === STORAGE_VERSION && parsed.data) {
          setData({
            ...initialData,
            ...parsed.data,
            preferences: {
              ...defaultPreferences,
              ...parsed.data.preferences
            }
          });
        }
      }
    } catch (error) {
      console.warn('[Personalization] Failed to load data:', error);
      // Continue with default data
    }
  }, []);
  
  // Save data to local storage when it changes
  const saveData = (newData: PersonalizationData) => {
    if (!newData.preferences.enableDataCollection) {
      return; // Don't save if data collection is disabled
    }
    
    try {
      const toStore = {
        version: STORAGE_VERSION,
        data: {
          ...newData,
          lastUpdated: Date.now()
        }
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.warn('[Personalization] Failed to save data:', error);
    }
  };

  // Record navigation pattern
  const recordNavigation = (pattern: Omit<NavigationPattern, 'timestamp'>) => {
    if (!data.preferences.enableDataCollection) return;
    
    setData(prevData => {
      const newPattern: NavigationPattern = {
        ...pattern,
        timestamp: Date.now()
      };
      
      const newPatterns = [...prevData.navigationPatterns, newPattern].slice(-1000); // Keep last 1000
      
      // Update frequent routes
      const routeIndex = prevData.frequentRoutes.findIndex(r => r.route === pattern.route);
      let newFrequentRoutes = [...prevData.frequentRoutes];
      
      if (routeIndex >= 0) {
        newFrequentRoutes[routeIndex] = {
          ...newFrequentRoutes[routeIndex],
          count: newFrequentRoutes[routeIndex].count + 1,
          lastVisit: Date.now()
        };
      } else {
        newFrequentRoutes.push({
          route: pattern.route,
          count: 1,
          lastVisit: Date.now()
        });
      }
      
      // Sort and limit to top 50
      newFrequentRoutes = newFrequentRoutes
        .sort((a, b) => b.count - a.count)
        .slice(0, 50);
      
      const newData = {
        ...prevData,
        navigationPatterns: newPatterns,
        frequentRoutes: newFrequentRoutes
      };
      
      saveData(newData);
      return newData;
    });
  };

  // Record search
  const recordSearch = (query: string, resultClicked?: string) => {
    if (!data.preferences.enableDataCollection) return;
    
    setData(prevData => {
      const newSearch = {
        query: query.toLowerCase().trim(),
        timestamp: Date.now(),
        resultClicked
      };
      
      const newSearchHistory = [...prevData.searchHistory, newSearch].slice(-500); // Keep last 500
      
      const newData = {
        ...prevData,
        searchHistory: newSearchHistory
      };
      
      saveData(newData);
      return newData;
    });
  };

  // Record cognitive load event
  const recordCognitiveEvent = (event: string, severity: number) => {
    if (!data.preferences.enableDataCollection) return;
    
    setData(prevData => {
      const newEvent = {
        timestamp: Date.now(),
        event,
        severity: Math.max(0, Math.min(10, severity)) // Clamp 0-10
      };
      
      const newEvents = [...prevData.cognitiveLoadEvents, newEvent].slice(-1000); // Keep last 1000
      
      const newData = {
        ...prevData,
        cognitiveLoadEvents: newEvents
      };
      
      saveData(newData);
      return newData;
    });
  };

  // Update preferences
  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setData(prevData => {
      const newData = {
        ...prevData,
        preferences: {
          ...prevData.preferences,
          ...updates
        }
      };
      
      saveData(newData);
      return newData;
    });
  };

  // Reset preferences to defaults
  const resetPreferences = () => {
    setData(prevData => {
      const newData = {
        ...prevData,
        preferences: { ...defaultPreferences }
      };
      
      saveData(newData);
      return newData;
    });
  };

  // Get frequent routes
  const getFrequentRoutes = (limit = 5) => {
    return data.frequentRoutes
      .slice(0, limit)
      .map(item => item.route);
  };

  // Get navigation insights
  const getNavigationInsights = () => {
    const patterns = data.navigationPatterns;
    const recent = patterns.filter(p => Date.now() - p.timestamp < 7 * 24 * 60 * 60 * 1000); // Last 7 days
    
    return {
      totalNavigations: patterns.length,
      recentNavigations: recent.length,
      averageTimeSpent: patterns.reduce((sum, p) => sum + p.timeSpent, 0) / patterns.length || 0,
      mostVisitedRoutes: getFrequentRoutes(10),
      searchQueries: data.searchHistory.length,
      cognitiveLoadAverage: data.cognitiveLoadEvents.reduce((sum, e) => sum + e.severity, 0) / data.cognitiveLoadEvents.length || 0
    };
  };

  // Should suggest route based on patterns
  const shouldSuggestRoute = (route: string) => {
    if (!data.preferences.enableSmartSuggestions) return false;
    
    const routeData = data.frequentRoutes.find(r => r.route === route);
    if (!routeData) return false;
    
    // Suggest if route is frequently used and hasn't been visited recently
    const daysSinceLastVisit = (Date.now() - routeData.lastVisit) / (1000 * 60 * 60 * 24);
    
    return routeData.count >= 3 && daysSinceLastVisit >= 1;
  };

  // Export data as JSON
  const exportData = () => {
    return JSON.stringify({
      version: STORAGE_VERSION,
      exportDate: new Date().toISOString(),
      data: data
    }, null, 2);
  };

  // Import data from JSON
  const importData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      
      if (parsed.version === STORAGE_VERSION && parsed.data) {
        setData({
          ...initialData,
          ...parsed.data,
          preferences: {
            ...defaultPreferences,
            ...parsed.data.preferences
          }
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('[Personalization] Failed to import data:', error);
      return false;
    }
  };

  // Clear all data
  const clearAllData = () => {
    setData(initialData);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Toggle data collection
  const toggleDataCollection = (enabled: boolean) => {
    updatePreferences({ enableDataCollection: enabled });
    
    if (!enabled) {
      // Clear existing data
      clearAllData();
    }
  };

  // Get data summary for privacy transparency
  const getDataSummary = () => {
    return {
      navigationRecords: data.navigationPatterns.length,
      searchRecords: data.searchHistory.length,
      cognitiveEvents: data.cognitiveLoadEvents.length,
      dataCollectionEnabled: data.preferences.enableDataCollection,
      lastUpdated: new Date(data.lastUpdated).toLocaleString(),
      storageSize: new Blob([exportData()]).size
    };
  };

  const contextValue: PersonalizationContextType = {
    data,
    preferences: data.preferences,
    
    recordNavigation,
    recordSearch,
    recordCognitiveEvent,
    
    updatePreferences,
    resetPreferences,
    
    getFrequentRoutes,
    getNavigationInsights,
    shouldSuggestRoute,
    
    exportData,
    importData,
    clearAllData,
    
    toggleDataCollection,
    getDataSummary
  };

  return (
    <PersonalizationContext.Provider value={contextValue}>
      {children}
    </PersonalizationContext.Provider>
  );
}

// Hook to use personalization context
export function usePersonalization(): PersonalizationContextType {
  const context = useContext(PersonalizationContext);
  
  if (!context) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  
  return context;
}

// Hook for navigation tracking
export function useNavigationTracking() {
  const { recordNavigation } = usePersonalization();
  const [currentRoute, setCurrentRoute] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    // SSR-safe check for window
    if (typeof window === 'undefined') return;
    
    const path = window.location.pathname;
    
    if (currentRoute && currentRoute !== path) {
      // Record the previous route
      recordNavigation({
        route: currentRoute,
        timeSpent: Date.now() - startTime,
        fromRoute: path
      });
    }
    
    setCurrentRoute(path);
    setStartTime(Date.now());
  }, [recordNavigation, currentRoute, startTime]);

  return {
    currentRoute,
    recordNavigationEvent: (context: string) => {
      recordNavigation({
        route: currentRoute,
        timeSpent: Date.now() - startTime,
        context
      });
    }
  };
}