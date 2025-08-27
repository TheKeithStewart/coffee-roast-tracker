/**
 * SmartAutomation Component for Epic #61 Issue #64  
 * Enhanced ADHD-Friendly Navigation System
 * Option B: Adaptive Intelligence Navigation
 * 
 * Provides smart automation features with full user transparency and control
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { usePersonalization } from '@/lib/PersonalizationProvider';
import { useCognitiveLoadOptimizer } from '@/lib/SimplifiedCognitiveLoadOptimizer';

// Types for automation features
interface AutomationAction {
  id: string;
  type: 'navigation' | 'ui' | 'data' | 'notification';
  title: string;
  description: string;
  confidence: number;
  reasoning: string[];
  preview?: string;
  consequences?: string[];
  userBenefits: string[];
  canUndo: boolean;
}

interface AutomationSuggestion {
  action: AutomationAction;
  triggerTime: number;
  expiresAt?: number;
  priority: 'low' | 'medium' | 'high';
  context: string;
}

interface SmartAutomationState {
  isEnabled: boolean;
  pendingSuggestions: AutomationSuggestion[];
  activeAutomations: AutomationAction[];
  dismissedActions: string[];
  userFeedback: { [actionId: string]: 'helpful' | 'annoying' | 'irrelevant' };
}

interface SmartAutomationProps {
  className?: string;
  position?: 'fixed' | 'inline';
  compact?: boolean;
}

export function SmartAutomation({ 
  className = '',
  position = 'fixed',
  compact = false
}: SmartAutomationProps) {
  const { preferences, getFrequentRoutes, getNavigationInsights } = usePersonalization();
  const { metrics, isOptimizationEnabled } = useCognitiveLoadOptimizer();
  
  const [state, setState] = useState<SmartAutomationState>({
    isEnabled: preferences.enableSmartSuggestions,
    pendingSuggestions: [],
    activeAutomations: [],
    dismissedActions: [],
    userFeedback: {}
  });

  const [showDetails, setShowDetails] = useState(false);
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);

  // Generate smart suggestions based on current context
  const generateSuggestions = useMemo(() => {
    if (!state.isEnabled || !preferences.enableSmartSuggestions) {
      return [];
    }

    const suggestions: AutomationSuggestion[] = [];
    const insights = getNavigationInsights();
    const currentHour = new Date().getHours();
    const currentPath = window.location.pathname;

    // High cognitive load assistance
    if (isOptimizationEnabled && metrics.currentLoad >= 7) {
      suggestions.push({
        action: {
          id: 'reduce-cognitive-load',
          type: 'ui',
          title: 'Simplify Interface',
          description: 'Temporarily hide non-essential elements to reduce cognitive load',
          confidence: 0.9,
          reasoning: [
            `Current cognitive load is ${metrics.currentLoad.toFixed(1)}/10`,
            'Multiple factors indicate mental fatigue',
            'Interface simplification can improve focus'
          ],
          consequences: [
            'Some menu items will be hidden',
            'Animations will be reduced',
            'Whitespace will be increased'
          ],
          userBenefits: [
            'Easier to focus on current task',
            'Reduced mental strain',
            'Better task completion'
          ],
          canUndo: true
        },
        triggerTime: Date.now(),
        expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes
        priority: 'high',
        context: 'cognitive-load'
      });
    }

    // Break suggestions
    if (isOptimizationEnabled && metrics.recommendations.suggestBreak) {
      const breakType = metrics.recommendations.breakType || 'micro';
      suggestions.push({
        action: {
          id: `suggest-${breakType}-break`,
          type: 'notification',
          title: `Take a ${breakType} break`,
          description: `You've been working for a while. A ${breakType} break could help refresh your focus.`,
          confidence: 0.8,
          reasoning: [
            'Extended work session detected',
            'Cognitive load indicators suggest fatigue',
            'Breaks improve ADHD focus and productivity'
          ],
          consequences: [
            'Current work will be saved automatically',
            'A gentle reminder will be shown',
            'You can continue anytime'
          ],
          userBenefits: [
            'Restored mental energy',
            'Better focus when you return',
            'Reduced burnout risk'
          ],
          canUndo: false
        },
        triggerTime: Date.now(),
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
        priority: 'medium',
        context: 'wellness'
      });
    }

    // Quick access suggestions based on patterns
    const frequentRoutes = getFrequentRoutes(3);
    if (currentPath === '/' && frequentRoutes.length > 0) {
      const topRoute = frequentRoutes[0];
      if (topRoute !== '/') {
        suggestions.push({
          action: {
            id: 'quick-access-favorite',
            type: 'navigation',
            title: 'Quick Access to Favorite',
            description: `Add a quick access button for ${topRoute} - you visit it often`,
            confidence: 0.7,
            reasoning: [
              `You've visited ${topRoute} ${insights.totalNavigations} times`,
              'Quick access can save time and reduce navigation steps',
              'Fits your current usage patterns'
            ],
            preview: `A floating button will appear for instant access to ${topRoute}`,
            consequences: [
              'A small button will appear on relevant pages',
              'One-click access to your frequent destination',
              'Can be hidden or moved if needed'
            ],
            userBenefits: [
              'Faster navigation to frequent pages',
              'Reduced cognitive load for common tasks',
              'More efficient workflow'
            ],
            canUndo: true
          },
          triggerTime: Date.now(),
          priority: 'low',
          context: 'efficiency'
        });
      }
    }

    // Time-based suggestions
    if (currentHour >= 14 && currentHour <= 16) { // Afternoon low-focus period
      suggestions.push({
        action: {
          id: 'afternoon-focus-mode',
          type: 'ui',
          title: 'Afternoon Focus Mode',
          description: 'Enable focus mode to help with typical afternoon attention challenges',
          confidence: 0.6,
          reasoning: [
            'Afternoon hours often bring focus challenges',
            'ADHD symptoms typically worsen in afternoon',
            'Focus mode can provide needed structure'
          ],
          consequences: [
            'Distracting elements will be minimized',
            'Color contrast will be increased',
            'Task highlighting will be enhanced'
          ],
          userBenefits: [
            'Better focus during challenging hours',
            'Reduced afternoon productivity dip',
            'Maintained task engagement'
          ],
          canUndo: true
        },
        triggerTime: Date.now(),
        expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
        priority: 'medium',
        context: 'circadian'
      });
    }

    // Filter out dismissed suggestions
    return suggestions.filter(suggestion => 
      !state.dismissedActions.includes(suggestion.action.id) &&
      !state.userFeedback[suggestion.action.id]
    );
  }, [
    state.isEnabled,
    preferences.enableSmartSuggestions,
    isOptimizationEnabled,
    metrics,
    getNavigationInsights,
    getFrequentRoutes,
    state.dismissedActions,
    state.userFeedback
  ]);

  // Update suggestions when they change
  useEffect(() => {
    setState(prev => ({
      ...prev,
      pendingSuggestions: generateSuggestions
    }));
  }, [generateSuggestions]);

  // Handle suggestion acceptance
  const acceptSuggestion = (suggestionId: string) => {
    const suggestion = state.pendingSuggestions.find(s => s.action.id === suggestionId);
    if (!suggestion) return;

    // Execute the automation
    executeAutomation(suggestion.action);

    // Move from pending to active
    setState(prev => ({
      ...prev,
      pendingSuggestions: prev.pendingSuggestions.filter(s => s.action.id !== suggestionId),
      activeAutomations: [...prev.activeAutomations, suggestion.action]
    }));

    // Track user acceptance for learning
    setState(prev => ({
      ...prev,
      userFeedback: {
        ...prev.userFeedback,
        [suggestionId]: 'helpful'
      }
    }));
  };

  // Handle suggestion dismissal
  const dismissSuggestion = (suggestionId: string, feedback: 'annoying' | 'irrelevant') => {
    setState(prev => ({
      ...prev,
      pendingSuggestions: prev.pendingSuggestions.filter(s => s.action.id !== suggestionId),
      dismissedActions: [...prev.dismissedActions, suggestionId],
      userFeedback: {
        ...prev.userFeedback,
        [suggestionId]: feedback
      }
    }));
  };

  // Execute automation action
  const executeAutomation = (action: AutomationAction) => {
    switch (action.type) {
      case 'ui':
        // Dispatch custom events for UI changes
        if (action.id.includes('cognitive-load') || action.id.includes('focus-mode')) {
          window.dispatchEvent(new CustomEvent('automation:enable-focus-mode', {
            detail: { actionId: action.id }
          }));
        }
        break;

      case 'navigation':
        // Handle navigation automations
        if (action.id.includes('quick-access')) {
          window.dispatchEvent(new CustomEvent('automation:add-quick-access', {
            detail: { actionId: action.id }
          }));
        }
        break;

      case 'notification':
        // Handle notification automations
        if (action.id.includes('break')) {
          window.dispatchEvent(new CustomEvent('automation:suggest-break', {
            detail: { actionId: action.id, breakType: action.id.split('-')[1] }
          }));
        }
        break;
    }
  };

  // Undo automation
  const undoAutomation = (actionId: string) => {
    const action = state.activeAutomations.find(a => a.id === actionId);
    if (!action || !action.canUndo) return;

    // Dispatch undo events
    window.dispatchEvent(new CustomEvent('automation:undo', {
      detail: { actionId }
    }));

    setState(prev => ({
      ...prev,
      activeAutomations: prev.activeAutomations.filter(a => a.id !== actionId)
    }));
  };

  // Toggle automation system
  const toggleAutomation = (enabled: boolean) => {
    setState(prev => ({
      ...prev,
      isEnabled: enabled
    }));
  };

  if (!state.isEnabled || state.pendingSuggestions.length === 0) {
    return null;
  }

  const containerClasses = position === 'fixed' 
    ? 'fixed bottom-20 right-4 max-w-sm z-30'
    : 'w-full max-w-md';

  return (
    <div className={`smart-automation ${containerClasses} ${className}`}>
      {/* Suggestions */}
      {state.pendingSuggestions.map((suggestion, index) => (
        <div 
          key={suggestion.action.id}
          className={`
            bg-white border-l-4 rounded-lg shadow-lg mb-3 overflow-hidden
            ${suggestion.priority === 'high' ? 'border-red-400' :
              suggestion.priority === 'medium' ? 'border-yellow-400' : 'border-blue-400'}
          `}
        >
          {/* Header */}
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                <div className={`
                  w-2 h-2 rounded-full mt-1.5
                  ${suggestion.priority === 'high' ? 'bg-red-400' :
                    suggestion.priority === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'}
                `} />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {suggestion.action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {suggestion.action.description}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setExpandedSuggestion(
                  expandedSuggestion === suggestion.action.id ? null : suggestion.action.id
                )}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Show details"
              >
                ℹ️
              </button>
            </div>

            {/* Expanded details */}
            {expandedSuggestion === suggestion.action.id && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="space-y-2 text-sm">
                  <div>
                    <strong className="text-gray-700">Why suggested:</strong>
                    <ul className="mt-1 space-y-1 text-gray-600">
                      {suggestion.action.reasoning.map((reason, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <strong className="text-gray-700">Benefits:</strong>
                    <ul className="mt-1 space-y-1 text-gray-600">
                      {suggestion.action.userBenefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {suggestion.action.consequences && (
                    <div>
                      <strong className="text-gray-700">What will happen:</strong>
                      <ul className="mt-1 space-y-1 text-gray-600">
                        {suggestion.action.consequences.map((consequence, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-gray-400 mr-2">→</span>
                            {consequence}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <span>Confidence: {Math.round(suggestion.action.confidence * 100)}%</span>
                    {suggestion.action.canUndo && (
                      <span className="ml-3">• Can be undone</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-2 mt-3">
              <button
                onClick={() => acceptSuggestion(suggestion.action.id)}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Apply
              </button>
              <button
                onClick={() => dismissSuggestion(suggestion.action.id, 'irrelevant')}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
              >
                Not now
              </button>
              <button
                onClick={() => dismissSuggestion(suggestion.action.id, 'annoying')}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Don't suggest this
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Active automations indicator */}
      {state.activeAutomations.length > 0 && (
        <div className="text-xs text-gray-500 text-center">
          {state.activeAutomations.length} automation(s) active
        </div>
      )}
    </div>
  );
}