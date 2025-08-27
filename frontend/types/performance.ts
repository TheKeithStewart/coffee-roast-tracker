/**
 * TypeScript interfaces for Performance-Optimized Navigation & Monitoring
 * User Story #20: ADHD-Anxiety-Aware Performance Implementation
 */

export interface PerformanceMetrics {
  coreWebVitals: {
    LCP: number; // Largest Contentful Paint - Target: <2.5s
    FID: number; // First Input Delay - Target: <100ms
    CLS: number; // Cumulative Layout Shift - Target: <0.1
    TTI?: number; // Time to Interactive - Target: <3.5s
    TTFB?: number; // Time to First Byte
    INP?: number; // Interaction to Next Paint
  };
  customMetrics: {
    navigationDuration: number; // Target: <300ms
    authLatency: number; // Target: <500ms
    bundleLoadTime: number; // Target: <1s
    cacheHitRatio: number; // Target: >85%
    renderTime: number;
    hydrationTime: number;
  };
  resourceMetrics: {
    bundleSize: {
      main: number;
      routes: Record<string, number>;
      total: number;
    };
    imageOptimization: {
      totalImages: number;
      optimizedImages: number;
      averageSize: number;
    };
    cacheEfficiency: {
      hitRate: number;
      missRate: number;
      staleRate: number;
    };
  };
  errorMetrics: {
    jsErrorRate: number;
    apiErrorRate: number;
    securityErrorRate: number;
    pwaInstallErrors: number;
  };
}

export interface PerformanceTargets {
  good: number;
  needsImprovement: number;
  poor: number;
}

export interface PerformanceThresholds {
  LCP: PerformanceTargets; // { good: 2500, needsImprovement: 4000, poor: Infinity }
  FID: PerformanceTargets; // { good: 100, needsImprovement: 300, poor: Infinity }
  CLS: PerformanceTargets; // { good: 0.1, needsImprovement: 0.25, poor: Infinity }
  navigationDuration: PerformanceTargets;
  bundleSize: PerformanceTargets;
  cacheHitRatio: PerformanceTargets;
}

// ADHD-Friendly Performance Display Configuration
export interface PerformanceDisplayConfig {
  mode: 'hidden' | 'minimal' | 'helpful' | 'detailed' | 'coach';
  userControlled: boolean;
  positiveMessaging: boolean;
  dismissible: boolean;
  anxietyPrevention: boolean;
  showAlerts: boolean;
  alertFrequency: 'never' | 'critical-only' | 'important' | 'all';
}

export interface PerformanceMessage {
  type: 'success' | 'info' | 'warning' | 'error' | 'tip';
  title: string;
  message: string;
  action?: {
    label: string;
    handler: () => void;
  };
  dismissible: boolean;
  autoHide: boolean;
  duration?: number;
}

export interface PerformanceTip {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'advanced';
  category: 'speed' | 'efficiency' | 'user-experience' | 'accessibility';
  steps: string[];
}

export interface PerformanceAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  metric: string;
  currentValue: number;
  threshold: number;
  message: string;
  recommendation: string;
  timestamp: number;
  acknowledged: boolean;
  recurring: boolean;
}

// Navigation System Types
export interface NavigationHierarchy {
  maxLevels: 3;
  currentLevel: number;
  breadcrumbs: BreadcrumbItem[];
  availableRoutes: NavigationRoute[];
}

export interface BreadcrumbItem {
  id: string;
  label: string;
  href: string;
  level: number;
  current: boolean;
  accessible: boolean;
}

export interface NavigationRoute {
  id: string;
  path: string;
  title: string;
  description?: string;
  level: number;
  parent?: string;
  children?: string[];
  metadata: RouteMetadata;
  accessible: boolean;
  estimatedLoadTime?: number;
}

export interface RouteMetadata {
  bundleSize?: number;
  preloadPriority: 'high' | 'medium' | 'low';
  cacheStrategy: 'immediate' | 'lazy' | 'prefetch';
  accessibilityLevel: 'AA' | 'AAA';
  adhdOptimized: boolean;
  cognitiveLoad: 'low' | 'medium' | 'high';
}

// Navigation Performance Monitoring
export interface NavigationPerformance {
  routeTransitions: RouteTransition[];
  averageNavigationTime: number;
  slowestRoutes: string[];
  fastestRoutes: string[];
  errorRoutes: string[];
  userPatterns: NavigationPattern[];
}

export interface RouteTransition {
  from: string;
  to: string;
  duration: number;
  timestamp: number;
  success: boolean;
  error?: string;
  bundleLoadTime?: number;
  renderTime?: number;
}

export interface NavigationPattern {
  sequence: string[];
  frequency: number;
  averageDuration: number;
  abandonmentRate: number;
  successRate: number;
}

// Bundle Analysis and Optimization
export interface BundleAnalysis {
  bundles: BundleInfo[];
  totalSize: number;
  duplicateModules: DuplicateModule[];
  unusedCode: UnusedCodeInfo[];
  optimizationOpportunities: OptimizationOpportunity[];
  sizeComparison: {
    previous?: number;
    change: number;
    changePercent: number;
  };
}

export interface BundleInfo {
  name: string;
  size: number;
  gzipSize: number;
  modules: ModuleInfo[];
  loadTime: number;
  cacheability: 'high' | 'medium' | 'low';
}

export interface ModuleInfo {
  name: string;
  size: number;
  imported: boolean;
  treeshakeable: boolean;
  critical: boolean;
}

export interface DuplicateModule {
  name: string;
  instances: number;
  totalSize: number;
  bundles: string[];
}

export interface UnusedCodeInfo {
  file: string;
  size: number;
  percentage: number;
  removable: boolean;
}

export interface OptimizationOpportunity {
  type: 'bundle-split' | 'lazy-load' | 'tree-shake' | 'compress' | 'cache-optimize';
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  estimatedSavings: number;
  implementation: string;
}

// Performance Budget Management
export interface PerformanceBudget {
  budgets: BudgetRule[];
  violations: BudgetViolation[];
  compliance: number; // 0-100%
  trend: 'improving' | 'stable' | 'declining';
}

export interface BudgetRule {
  metric: string;
  limit: number;
  warning: number;
  current: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface BudgetViolation {
  rule: string;
  current: number;
  limit: number;
  severity: 'warning' | 'error';
  timestamp: number;
  resolved: boolean;
}

// User Experience Metrics
export interface UXMetrics {
  taskCompletionRate: number;
  taskCompletionTime: number;
  errorRecoveryRate: number;
  userSatisfactionScore: number; // 1-10
  cognitiveLoadScore: number; // 1-10 (lower is better)
  accessibilityScore: number; // 0-100
  adhdFriendlinessScore: number; // 0-100
}

export interface UserFeedback {
  type: 'performance' | 'usability' | 'accessibility' | 'general';
  rating: number; // 1-5
  comment?: string;
  category: string;
  timestamp: number;
  resolved: boolean;
}

// Real-time Monitoring
export interface MonitoringAlert {
  id: string;
  type: 'performance' | 'error' | 'security' | 'accessibility';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: number;
  source: string;
  metadata: Record<string, any>;
  acknowledged: boolean;
  resolved: boolean;
}

export interface MonitoringDashboard {
  realTimeMetrics: PerformanceMetrics;
  alerts: MonitoringAlert[];
  trends: TrendData[];
  healthScore: number; // 0-100
  recommendations: PerformanceTip[];
  userExperience: UXMetrics;
}

export interface TrendData {
  metric: string;
  timeframe: string;
  data: TimeSeriesPoint[];
  trend: 'up' | 'down' | 'stable';
  significance: 'high' | 'medium' | 'low';
}

export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
  label?: string;
}