/**
 * SimplifiedCognitiveLoadOptimizer for Epic #61 Issue #64
 * Enhanced ADHD-Friendly Navigation System  
 * Option B: Adaptive Intelligence Navigation
 * 
 * Rule-based cognitive load optimization for ADHD-friendly interfaces
 */

'use client';

import { usePersonalization } from './PersonalizationProvider';
import { useEffect, useState, useMemo } from 'react';

// Types for cognitive load optimization
interface CognitiveLoadFactors {
  timeOfDay: number; // 0-23 hour
  sessionDuration: number; // minutes in current session  
  recentNavigations: number; // navigations in last 5 minutes
  errorCount: number; // errors in last 10 minutes
  taskComplexity: 'simple' | 'medium' | 'complex';
  interruptionCount: number; // interruptions in last 30 minutes
}

interface OptimizationRecommendations {
  // UI Simplification
  simplifyInterface: boolean;
  hideNonEssential: boolean;
  increaseWhitespace: boolean;
  
  // Navigation Assistance  
  enableGuidedMode: boolean;
  showProgressIndicators: boolean;
  provideTutorialHints: boolean;
  
  // Focus Management
  enableFocusMode: boolean;
  reduceAnimations: boolean;
  highlightCurrentTask: boolean;
  
  // Break Suggestions
  suggestBreak: boolean;
  breakType: 'micro' | 'short' | 'long' | null;
  
  // Confidence score (0-1)
  confidence: number;
  reasoning: string[];
}

interface CognitiveLoadMetrics {
  currentLoad: number; // 0-10 scale
  trend: 'decreasing' | 'stable' | 'increasing';
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: OptimizationRecommendations;
}

// Rule-based cognitive load assessment
class CognitiveLoadCalculator {
  // Time-based rules
  private getTimeOfDayFactor(hour: number): number {
    // ADHD focus patterns: typically better in morning, worse in afternoon
    if (hour >= 6 && hour <= 10) return 0.3; // Best focus time
    if (hour >= 11 && hour <= 14) return 0.5; // Good focus time  
    if (hour >= 15 && hour <= 18) return 0.8; // Declining focus
    if (hour >= 19 && hour <= 22) return 0.6; // Variable evening focus
    return 0.9; // Late night/early morning - poor focus
  }

  // Session duration rules
  private getSessionDurationFactor(minutes: number): number {
    if (minutes <= 15) return 0.2; // Fresh start
    if (minutes <= 30) return 0.4; // Still focused
    if (minutes <= 60) return 0.6; // Starting to tire
    if (minutes <= 90) return 0.8; // Noticeable fatigue
    return 1.0; // High fatigue
  }

  // Recent activity rules
  private getActivityFactor(navigations: number, errors: number): number {
    const navigationStress = Math.min(navigations * 0.1, 0.5); // Max 0.5 from navigation
    const errorStress = Math.min(errors * 0.2, 0.6); // Max 0.6 from errors
    return navigationStress + errorStress;
  }

  // Task complexity rules
  private getComplexityFactor(complexity: 'simple' | 'medium' | 'complex'): number {
    switch (complexity) {
      case 'simple': return 0.2;
      case 'medium': return 0.5;
      case 'complex': return 0.8;
    }
  }

  // Calculate overall cognitive load
  public calculateLoad(factors: CognitiveLoadFactors): number {
    const timeScore = this.getTimeOfDayFactor(factors.timeOfDay);
    const durationScore = this.getSessionDurationFactor(factors.sessionDuration);
    const activityScore = this.getActivityFactor(factors.recentNavigations, factors.errorCount);
    const complexityScore = this.getComplexityFactor(factors.taskComplexity);
    const interruptionScore = Math.min(factors.interruptionCount * 0.15, 0.6);

    // Weighted average - session duration and activity are most important for ADHD
    const totalScore = 
      timeScore * 0.2 +
      durationScore * 0.3 +
      activityScore * 0.25 +
      complexityScore * 0.15 +
      interruptionScore * 0.1;

    return Math.min(Math.max(totalScore * 10, 0), 10); // Scale to 0-10
  }

  // Generate recommendations based on load
  public generateRecommendations(load: number, factors: CognitiveLoadFactors): OptimizationRecommendations {
    const reasoning: string[] = [];
    
    // Base recommendations
    const recommendations: OptimizationRecommendations = {
      simplifyInterface: false,
      hideNonEssential: false,
      increaseWhitespace: false,
      enableGuidedMode: false,
      showProgressIndicators: false,
      provideTutorialHints: false,
      enableFocusMode: false,
      reduceAnimations: false,
      highlightCurrentTask: false,
      suggestBreak: false,
      breakType: null,
      confidence: 0.7, // Default confidence
      reasoning: []
    };

    // High cognitive load (7-10)
    if (load >= 7) {
      recommendations.simplifyInterface = true;
      recommendations.hideNonEssential = true;
      recommendations.increaseWhitespace = true;
      recommendations.enableFocusMode = true;
      recommendations.reduceAnimations = true;
      recommendations.highlightCurrentTask = true;
      recommendations.confidence = 0.9;
      
      reasoning.push('High cognitive load detected');
      
      if (factors.sessionDuration > 60) {
        recommendations.suggestBreak = true;
        recommendations.breakType = factors.sessionDuration > 120 ? 'long' : 'short';
        reasoning.push('Extended session detected - break recommended');
      }
      
      if (factors.errorCount > 2) {
        recommendations.enableGuidedMode = true;
        recommendations.provideTutorialHints = true;
        reasoning.push('Multiple errors suggest need for guidance');
      }
    }

    // Medium cognitive load (4-6)
    else if (load >= 4) {
      recommendations.showProgressIndicators = true;
      recommendations.increaseWhitespace = true;
      
      reasoning.push('Moderate cognitive load - providing assistance');
      
      if (factors.taskComplexity === 'complex') {
        recommendations.enableGuidedMode = true;
        reasoning.push('Complex task requires guided assistance');
      }
      
      if (factors.sessionDuration > 45) {
        recommendations.suggestBreak = true;
        recommendations.breakType = 'micro';
        reasoning.push('Session length suggests micro-break needed');
      }
    }

    // Low cognitive load (0-3) - minimal intervention
    else {
      reasoning.push('Low cognitive load - minimal optimization needed');
      
      // Only suggest guidance for complex tasks
      if (factors.taskComplexity === 'complex') {
        recommendations.showProgressIndicators = true;
        reasoning.push('Complex task benefits from progress tracking');
      }
    }

    // Time-based adjustments
    const hour = factors.timeOfDay;
    if ((hour >= 15 && hour <= 18) || hour >= 22) {
      recommendations.reduceAnimations = true;
      recommendations.increaseWhitespace = true;
      reasoning.push('Time of day suggests reduced stimulation needed');
    }

    // Interruption handling
    if (factors.interruptionCount > 2) {
      recommendations.enableFocusMode = true;
      recommendations.highlightCurrentTask = true;
      reasoning.push('Multiple interruptions require focus assistance');
    }

    recommendations.reasoning = reasoning;
    return recommendations;
  }
}

// Hook for cognitive load optimization
export function useCognitiveLoadOptimizer() {
  const { recordCognitiveEvent, preferences } = usePersonalization();
  const [calculator] = useState(() => new CognitiveLoadCalculator());
  
  // Session tracking
  const [sessionStart] = useState(Date.now());
  const [navigationCount, setNavigationCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [interruptionCount, setInterruptionCount] = useState(0);
  const [currentTask, setCurrentTask] = useState<'simple' | 'medium' | 'complex'>('simple');
  
  // Load history for trend analysis
  const [loadHistory, setLoadHistory] = useState<{ timestamp: number; load: number }[]>([]);

  // Calculate current factors
  const currentFactors: CognitiveLoadFactors = useMemo(() => ({
    timeOfDay: new Date().getHours(),
    sessionDuration: Math.floor((Date.now() - sessionStart) / (1000 * 60)),
    recentNavigations: navigationCount,
    errorCount,
    taskComplexity: currentTask,
    interruptionCount
  }), [sessionStart, navigationCount, errorCount, currentTask, interruptionCount]);

  // Calculate current metrics
  const metrics: CognitiveLoadMetrics = useMemo(() => {
    const load = calculator.calculateLoad(currentFactors);
    const recommendations = calculator.generateRecommendations(load, currentFactors);
    
    // Determine trend
    let trend: 'decreasing' | 'stable' | 'increasing' = 'stable';
    if (loadHistory.length >= 2) {
      const recent = loadHistory.slice(-2);
      const diff = recent[1].load - recent[0].load;
      if (diff > 0.5) trend = 'increasing';
      else if (diff < -0.5) trend = 'decreasing';
    }
    
    // Risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (load >= 7) riskLevel = 'high';
    else if (load >= 4) riskLevel = 'medium';

    return {
      currentLoad: load,
      trend,
      riskLevel,
      recommendations
    };
  }, [calculator, currentFactors, loadHistory]);

  // Record load in history
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setLoadHistory(prev => [...prev, { timestamp: now, load: metrics.currentLoad }].slice(-10));
      
      // Record significant load changes
      if (metrics.currentLoad >= 7) {
        recordCognitiveEvent('high_load', metrics.currentLoad);
      }
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [metrics.currentLoad, recordCognitiveEvent]);

  // Methods for tracking events
  const trackNavigation = () => {
    setNavigationCount(prev => prev + 1);
    
    // Reset count every 5 minutes
    setTimeout(() => {
      setNavigationCount(prev => Math.max(0, prev - 1));
    }, 5 * 60 * 1000);
  };

  const trackError = (errorType: string) => {
    setErrorCount(prev => prev + 1);
    recordCognitiveEvent(`error_${errorType}`, 3); // Errors add cognitive load
    
    // Reset count every 10 minutes
    setTimeout(() => {
      setErrorCount(prev => Math.max(0, prev - 1));
    }, 10 * 60 * 1000);
  };

  const trackInterruption = (source: string) => {
    setInterruptionCount(prev => prev + 1);
    recordCognitiveEvent(`interruption_${source}`, 2);
    
    // Reset count every 30 minutes
    setTimeout(() => {
      setInterruptionCount(prev => Math.max(0, prev - 1));
    }, 30 * 60 * 1000);
  };

  const setTaskComplexity = (complexity: 'simple' | 'medium' | 'complex') => {
    setCurrentTask(complexity);
    recordCognitiveEvent(`task_${complexity}`, complexity === 'complex' ? 3 : complexity === 'medium' ? 2 : 1);
  };

  // Check if optimization is enabled
  const isOptimizationEnabled = preferences.enableCognitiveLoadOptimization;

  return {
    // Current state
    metrics: isOptimizationEnabled ? metrics : {
      currentLoad: 0,
      trend: 'stable' as const,
      riskLevel: 'low' as const,
      recommendations: {
        simplifyInterface: false,
        hideNonEssential: false,
        increaseWhitespace: false,
        enableGuidedMode: false,
        showProgressIndicators: false,
        provideTutorialHints: false,
        enableFocusMode: false,
        reduceAnimations: false,
        highlightCurrentTask: false,
        suggestBreak: false,
        breakType: null,
        confidence: 0,
        reasoning: ['Cognitive load optimization disabled']
      }
    },
    
    // Tracking methods
    trackNavigation,
    trackError,
    trackInterruption,
    setTaskComplexity,
    
    // Current factors (for debugging)
    currentFactors: isOptimizationEnabled ? currentFactors : null,
    
    // Optimization status
    isOptimizationEnabled
  };
}