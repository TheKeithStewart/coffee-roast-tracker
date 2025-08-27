/**
 * AdaptiveNavigation Component for Epic #61 Issue #64
 * Enhanced ADHD-Friendly Navigation System
 * Option B: Adaptive Intelligence Navigation
 * 
 * Smart navigation with pattern recognition and ADHD-optimized assistance
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePersonalization } from '@/lib/PersonalizationProvider';
import { useCognitiveLoadOptimizer } from '@/lib/SimplifiedCognitiveLoadOptimizer';

// Navigation item structure
interface NavigationItem {
  route: string;
  label: string;
  icon: string;
  description: string;
  complexity: 'simple' | 'medium' | 'complex';
  category: 'primary' | 'secondary' | 'utility';
  keywords: string[];
}

// Smart suggestion based on patterns
interface SmartSuggestion {
  item: NavigationItem;
  reason: string;
  confidence: number;
  type: 'frequent' | 'pattern' | 'time-based' | 'context';
}

// Adaptive navigation state
interface AdaptiveState {
  showSuggestions: boolean;
  showGuidance: boolean;
  simplifiedMode: boolean;
  focusMode: boolean;
  suggestions: SmartSuggestion[];
}

// All available navigation items
const navigationItems: NavigationItem[] = [
  {
    route: '/',
    label: 'Dashboard',
    icon: '📊',
    description: 'Overview of your roasting activity',
    complexity: 'simple',
    category: 'primary',
    keywords: ['dashboard', 'overview', 'home', 'main']
  },
  {
    route: '/roasts/new',
    label: 'New Roast',
    icon: '🔥',
    description: 'Start tracking a new coffee roast',
    complexity: 'medium',
    category: 'primary',
    keywords: ['roast', 'new', 'start', 'begin', 'create']
  },
  {
    route: '/profiles',
    label: 'Roast Profiles',
    icon: '📋',
    description: 'Manage your saved roasting profiles',
    complexity: 'medium',
    category: 'primary',
    keywords: ['profiles', 'saved', 'templates', 'recipes']
  },
  {
    route: '/beans',
    label: 'Bean Inventory',
    icon: '☕',
    description: 'Track your coffee bean inventory',
    complexity: 'simple',
    category: 'primary',
    keywords: ['beans', 'inventory', 'stock', 'coffee']
  },
  {
    route: '/analytics',
    label: 'Analytics',
    icon: '📈',
    description: 'View detailed roasting analytics',
    complexity: 'complex',
    category: 'secondary',
    keywords: ['analytics', 'charts', 'data', 'statistics']
  },
  {
    route: '/settings',
    label: 'Settings',
    icon: '⚙️',
    description: 'Configure your preferences',
    complexity: 'medium',
    category: 'utility',
    keywords: ['settings', 'preferences', 'config', 'options']
  },
  {
    route: '/help',
    label: 'Help & Tutorials',
    icon: '❓',
    description: 'Get help and learn features',
    complexity: 'simple',
    category: 'utility',
    keywords: ['help', 'tutorial', 'guide', 'support']
  }
];

interface AdaptiveNavigationProps {
  className?: string;
  variant?: 'sidebar' | 'top' | 'mobile' | 'contextual';
  showSearch?: boolean;
}

export function AdaptiveNavigation({ 
  className = '', 
  variant = 'sidebar',
  showSearch = true 
}: AdaptiveNavigationProps) {
  const pathname = usePathname();
  const { 
    preferences, 
    getFrequentRoutes, 
    shouldSuggestRoute,
    recordNavigation,
    recordSearch 
  } = usePersonalization();
  
  const { 
    metrics, 
    trackNavigation, 
    setTaskComplexity,
    isOptimizationEnabled 
  } = useCognitiveLoadOptimizer();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [adaptiveState, setAdaptiveState] = useState<AdaptiveState>({
    showSuggestions: true,
    showGuidance: false,
    simplifiedMode: false,
    focusMode: false,
    suggestions: []
  });

  // Apply cognitive load optimizations
  useEffect(() => {
    if (!isOptimizationEnabled) return;

    const { recommendations } = metrics;
    
    setAdaptiveState(prev => ({
      ...prev,
      showGuidance: recommendations.enableGuidedMode || recommendations.provideTutorialHints,
      simplifiedMode: recommendations.simplifyInterface || recommendations.hideNonEssential,
      focusMode: recommendations.enableFocusMode,
      showSuggestions: !recommendations.hideNonEssential
    }));
  }, [metrics, isOptimizationEnabled]);

  // Generate smart suggestions
  const smartSuggestions = useMemo(() => {
    if (!adaptiveState.showSuggestions || !preferences.enableSmartSuggestions) {
      return [];
    }

    const suggestions: SmartSuggestion[] = [];
    const frequentRoutes = getFrequentRoutes(3);
    const currentHour = new Date().getHours();

    // Frequent route suggestions
    frequentRoutes.forEach(route => {
      const item = navigationItems.find(item => item.route === route);
      if (item && item.route !== pathname) {
        suggestions.push({
          item,
          reason: 'You visit this frequently',
          confidence: 0.8,
          type: 'frequent'
        });
      }
    });

    // Time-based suggestions
    if (currentHour >= 8 && currentHour <= 12) {
      const newRoastItem = navigationItems.find(item => item.route === '/roasts/new');
      if (newRoastItem && pathname !== '/roasts/new') {
        suggestions.push({
          item: newRoastItem,
          reason: 'Good time to start a new roast',
          confidence: 0.6,
          type: 'time-based'
        });
      }
    }

    // Context-based suggestions
    if (pathname === '/' || pathname === '/dashboard') {
      const profilesItem = navigationItems.find(item => item.route === '/profiles');
      if (profilesItem && shouldSuggestRoute('/profiles')) {
        suggestions.push({
          item: profilesItem,
          reason: 'Review your roast profiles',
          confidence: 0.7,
          type: 'context'
        });
      }
    }

    // Sort by confidence and limit to top 3
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  }, [
    adaptiveState.showSuggestions,
    preferences.enableSmartSuggestions,
    getFrequentRoutes,
    pathname,
    shouldSuggestRoute
  ]);

  // Filter items for search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return navigationItems;

    const query = searchQuery.toLowerCase();
    return navigationItems.filter(item =>
      item.label.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.keywords.some(keyword => keyword.includes(query))
    ).sort((a, b) => {
      // Prioritize exact matches
      const aExact = a.label.toLowerCase() === query ? 1 : 0;
      const bExact = b.label.toLowerCase() === query ? 1 : 0;
      return bExact - aExact;
    });
  }, [searchQuery]);

  // Handle navigation click
  const handleNavClick = (item: NavigationItem, context: string = 'menu') => {
    trackNavigation();
    setTaskComplexity(item.complexity);
    recordNavigation({
      route: item.route,
      timeSpent: 0,
      fromRoute: pathname,
      context
    });

    if (searchQuery) {
      recordSearch(searchQuery, item.route);
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.trim().length > 0);
    
    if (query.trim()) {
      recordSearch(query);
    }
  };

  // Get filtered navigation items based on mode
  const visibleItems = useMemo(() => {
    let items = navigationItems;

    // Apply simplification
    if (adaptiveState.simplifiedMode) {
      items = items.filter(item => 
        item.category === 'primary' || 
        (item.category === 'utility' && item.route === '/help')
      );
    }

    // Apply focus mode
    if (adaptiveState.focusMode) {
      items = items.filter(item => 
        item.category === 'primary' && item.complexity !== 'complex'
      );
    }

    // Hide certain items based on preferences
    return items.filter(item => 
      !preferences.hiddenMenuItems.includes(item.route)
    );
  }, [adaptiveState.simplifiedMode, adaptiveState.focusMode, preferences.hiddenMenuItems]);

  // Render navigation item
  const renderNavItem = (item: NavigationItem, context: 'main' | 'suggestion' | 'search' = 'main') => {
    const isActive = pathname === item.route;
    const showDescription = adaptiveState.showGuidance || context === 'suggestion';
    
    return (
      <Link
        key={`${item.route}-${context}`}
        href={item.route}
        onClick={() => handleNavClick(item, context)}
        className={`
          group flex items-center px-3 py-2 rounded-md transition-colors
          ${isActive 
            ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }
          ${adaptiveState.focusMode ? 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' : ''}
        `}
        aria-current={isActive ? 'page' : undefined}
      >
        <span className="text-xl mr-3" role="img" aria-label={item.label}>
          {item.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">
            {item.label}
          </div>
          {showDescription && (
            <div className="text-sm text-gray-500 truncate">
              {item.description}
            </div>
          )}
        </div>
        {item.complexity === 'complex' && adaptiveState.showGuidance && (
          <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
            Advanced
          </span>
        )}
      </Link>
    );
  };

  // Base classes for variant styling
  const getVariantClasses = () => {
    switch (variant) {
      case 'top':
        return 'flex flex-row space-x-2 overflow-x-auto';
      case 'mobile':
        return 'flex flex-col space-y-1 max-h-96 overflow-y-auto';
      case 'contextual':
        return 'flex flex-col space-y-1 max-w-xs';
      default: // sidebar
        return 'flex flex-col space-y-1';
    }
  };

  return (
    <nav className={`adaptive-navigation ${className}`} aria-label="Main navigation">
      {/* Search */}
      {showSearch && (
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder={adaptiveState.focusMode ? "Quick search..." : "Search navigation..."}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className={`
              w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500
              ${adaptiveState.focusMode ? 'text-lg' : 'text-sm'}
            `}
          />
          
          {/* Search Results */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No results found
                </div>
              ) : (
                <div className="py-1">
                  {filteredItems.slice(0, 5).map(item => renderNavItem(item, 'search'))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Smart Suggestions */}
      {smartSuggestions.length > 0 && !showSearchResults && (
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Suggested for you
          </h3>
          <div className="space-y-1">
            {smartSuggestions.map((suggestion, index) => (
              <div key={index} className="relative">
                {renderNavItem(suggestion.item, 'suggestion')}
                <div className="text-xs text-gray-400 px-3 py-1">
                  {suggestion.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className={getVariantClasses()}>
        {visibleItems.map(item => renderNavItem(item, 'main'))}
      </div>

      {/* Cognitive Load Indicator (Development only) */}
      {process.env.NODE_ENV === 'development' && isOptimizationEnabled && (
        <div className="mt-4 p-2 bg-gray-50 rounded text-xs">
          <div className="flex justify-between items-center">
            <span>Cognitive Load:</span>
            <span className={`font-bold ${
              metrics.currentLoad >= 7 ? 'text-red-600' :
              metrics.currentLoad >= 4 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {metrics.currentLoad.toFixed(1)}
            </span>
          </div>
          {metrics.recommendations.reasoning.length > 0 && (
            <div className="mt-1 text-gray-600">
              {metrics.recommendations.reasoning[0]}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}