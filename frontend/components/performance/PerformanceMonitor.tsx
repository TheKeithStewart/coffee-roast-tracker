/**
 * Performance Monitor Component with ADHD-Anxiety-Aware UI
 * User Story #20: Navigation & Performance Implementation
 * 
 * Features:
 * - User-controlled performance visibility (5 modes: Hidden, Minimal, Helpful, Detailed, Coach)
 * - Core Web Vitals tracking (LCP, FID, CLS) with positive messaging
 * - Performance coaching tips without anxiety triggers
 * - Accessibility compliant with screen reader support
 * - Real-time metrics with gentle, non-overwhelming presentation
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
import type { 
  PerformanceMetrics, 
  PerformanceDisplayConfig,
  PerformanceMessage,
  PerformanceTip,
  PerformanceTargets
} from '@/types/performance';

interface PerformanceMonitorProps {
  initialMode?: PerformanceDisplayConfig['mode'];
  onModeChange?: (mode: PerformanceDisplayConfig['mode']) => void;
  showControls?: boolean;
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
}

const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000, poor: Infinity },
  FID: { good: 100, needsImprovement: 300, poor: Infinity },
  CLS: { good: 0.1, needsImprovement: 0.25, poor: Infinity },
  FCP: { good: 1800, needsImprovement: 3000, poor: Infinity },
  TTFB: { good: 800, needsImprovement: 1800, poor: Infinity }
};

const POSITIVE_MESSAGES = {
  excellent: [
    "Great job! Your app is running smoothly.",
    "Excellent performance - everything is working well.",
    "Your app is performing beautifully!"
  ],
  good: [
    "Good performance - your app is running well.",
    "Nice! Everything is working as expected.",
    "Your app is performing nicely."
  ],
  improving: [
    "Performance is improving - great progress!",
    "Getting better! Your optimizations are working.",
    "Positive changes in app performance detected."
  ],
  coaching: [
    "Small tip: Consider reducing image sizes for faster loading.",
    "Friendly suggestion: Cache frequently used data locally.",
    "Pro tip: Preload important resources for better user experience."
  ]
};

export function PerformanceMonitor({ 
  initialMode = 'hidden',
  onModeChange,
  showControls = true,
  position = 'bottom-right'
}: PerformanceMonitorProps) {
  const [mode, setMode] = useState<PerformanceDisplayConfig['mode']>(initialMode);
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics['coreWebVitals']>>({});
  const [message, setMessage] = useState<PerformanceMessage | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Collect Web Vitals metrics
  useEffect(() => {
    if (mode === 'hidden') return;

    const updateMetric = (name: string, value: number) => {
      setMetrics(prev => ({ ...prev, [name]: value }));
      
      // Generate positive feedback based on performance
      if (name === 'LCP' && value <= PERFORMANCE_THRESHOLDS.LCP.good) {
        showPositiveMessage('excellent');
      } else if (name === 'FID' && value <= PERFORMANCE_THRESHOLDS.FID.good) {
        showPositiveMessage('good');
      }
    };

    getCLS(({ value }) => updateMetric('CLS', value));
    getFID(({ value }) => updateMetric('FID', value));
    getFCP(({ value }) => updateMetric('FCP', value));
    getLCP(({ value }) => updateMetric('LCP', value));
    getTTFB(({ value }) => updateMetric('TTFB', value));
  }, [mode]);

  const showPositiveMessage = useCallback((type: keyof typeof POSITIVE_MESSAGES) => {
    const messages = POSITIVE_MESSAGES[type];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    setMessage({
      type: 'success',
      title: 'Performance Update',
      message: randomMessage,
      dismissible: true,
      autoHide: true,
      duration: 4000
    });

    // Auto-hide message
    setTimeout(() => setMessage(null), 4000);
  }, []);

  const handleModeChange = (newMode: PerformanceDisplayConfig['mode']) => {
    setMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  const getPerformanceScore = (value: number, thresholds: PerformanceTargets) => {
    if (value <= thresholds.good) return { score: 'good', color: 'text-green-600' };
    if (value <= thresholds.needsImprovement) return { score: 'needs-improvement', color: 'text-yellow-600' };
    return { score: 'poor', color: 'text-red-600' };
  };

  const formatMetric = (value: number, unit: string = 'ms') => {
    if (unit === 'ms') {
      return value >= 1000 ? `${(value / 1000).toFixed(1)}s` : `${Math.round(value)}ms`;
    }
    return `${value.toFixed(3)}`;
  };

  const renderMinimalMode = () => (
    <div className="flex items-center space-x-2 text-xs text-gray-600">
      <div className="w-2 h-2 bg-green-500 rounded-full" title="Performance: Good" />
      <span>Performance OK</span>
    </div>
  );

  const renderHelpfulMode = () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Performance</span>
        <div className="flex items-center space-x-1">
          {metrics.LCP && (
            <div className={`text-xs ${getPerformanceScore(metrics.LCP, PERFORMANCE_THRESHOLDS.LCP).color}`}>
              LCP: {formatMetric(metrics.LCP)}
            </div>
          )}
        </div>
      </div>
      {message && (
        <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
          {message.message}
        </div>
      )}
    </div>
  );

  const renderDetailedMode = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Core Web Vitals</span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? 'Less' : 'More'}
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        {metrics.LCP && (
          <div className="flex justify-between">
            <span>LCP:</span>
            <span className={getPerformanceScore(metrics.LCP, PERFORMANCE_THRESHOLDS.LCP).color}>
              {formatMetric(metrics.LCP)}
            </span>
          </div>
        )}
        {metrics.FID && (
          <div className="flex justify-between">
            <span>FID:</span>
            <span className={getPerformanceScore(metrics.FID, PERFORMANCE_THRESHOLDS.FID).color}>
              {formatMetric(metrics.FID)}
            </span>
          </div>
        )}
        {metrics.CLS && (
          <div className="flex justify-between">
            <span>CLS:</span>
            <span className={getPerformanceScore(metrics.CLS, PERFORMANCE_THRESHOLDS.CLS).color}>
              {formatMetric(metrics.CLS, '')}
            </span>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="pt-2 border-t border-gray-200 space-y-1 text-xs">
          {metrics.FCP && (
            <div className="flex justify-between">
              <span>FCP:</span>
              <span>{formatMetric(metrics.FCP)}</span>
            </div>
          )}
          {metrics.TTFB && (
            <div className="flex justify-between">
              <span>TTFB:</span>
              <span>{formatMetric(metrics.TTFB)}</span>
            </div>
          )}
        </div>
      )}

      {message && (
        <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
          {message.message}
        </div>
      )}
    </div>
  );

  const renderCoachMode = () => (
    <div className="space-y-3">
      {renderDetailedMode()}
      
      <div className="pt-2 border-t border-gray-200">
        <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded">
          <div className="font-medium mb-1">💡 Friendly Tip</div>
          <div>Your app loads quickly! Consider preloading images for an even smoother experience.</div>
        </div>
      </div>
    </div>
  );

  const renderModeSelector = () => (
    <div className="mb-2">
      <select
        value={mode}
        onChange={(e) => handleModeChange(e.target.value as PerformanceDisplayConfig['mode'])}
        className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
        aria-label="Select performance display mode"
      >
        <option value="hidden">Hidden</option>
        <option value="minimal">Minimal</option>
        <option value="helpful">Helpful</option>
        <option value="detailed">Detailed</option>
        <option value="coach">Coach</option>
      </select>
    </div>
  );

  if (mode === 'hidden') {
    return showControls ? (
      <div className={`fixed ${position.replace('-', ' ')} z-50 p-2`}>
        {renderModeSelector()}
      </div>
    ) : null;
  }

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-left': 'top-4 left-4'
  };

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs`}
      role="region"
      aria-label="Performance monitoring"
      aria-live="polite"
    >
      {showControls && renderModeSelector()}
      
      {mode === 'minimal' && renderMinimalMode()}
      {mode === 'helpful' && renderHelpfulMode()}
      {mode === 'detailed' && renderDetailedMode()}
      {mode === 'coach' && renderCoachMode()}

      {/* Screen reader summary */}
      <div className="sr-only">
        Performance monitor active in {mode} mode. 
        {metrics.LCP && `Largest Contentful Paint: ${formatMetric(metrics.LCP)}`}
        {metrics.FID && `, First Input Delay: ${formatMetric(metrics.FID)}`}
        {metrics.CLS && `, Cumulative Layout Shift: ${formatMetric(metrics.CLS, '')}`}
      </div>
    </div>
  );
}