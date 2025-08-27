/**
 * Error Boundary System with Recovery Actions
 * User Story #20: Navigation & Performance Implementation
 * 
 * Features:
 * - Component-level error boundaries with recovery actions
 * - ADHD-friendly error messaging with clear next steps
 * - Error logging and monitoring integration
 * - Progressive degradation with fallback UI
 * - User-friendly recovery options without technical jargon
 */

'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import type { MonitoringAlert } from '@/types/performance';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
  maxRetries: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
  maxRetries?: number;
  showDetails?: boolean;
  level?: 'page' | 'component' | 'section';
  name?: string;
}

// Simple icons to avoid external dependencies
const RefreshIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const HomeIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const AlertIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
      maxRetries: props.maxRetries || 3
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log error for monitoring
    this.logError(error, errorInfo);

    // Call onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo, this.state.errorId);
    }
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    const logData: MonitoringAlert = {
      id: this.state.errorId,
      type: 'error',
      severity: 'critical',
      message: error.message,
      timestamp: Date.now(),
      source: this.props.name || 'ErrorBoundary',
      metadata: {
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        props: this.props.level,
        retryCount: this.state.retryCount
      },
      acknowledged: false,
      resolved: false
    };

    // In a real app, this would send to a logging service
    console.error('ErrorBoundary caught an error:', logData);
  };

  private handleRetry = () => {
    if (this.state.retryCount >= this.state.maxRetries) {
      return;
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));

    // Clear any existing timeout
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    // Reset retry count after successful render
    this.retryTimeoutId = setTimeout(() => {
      this.setState({ retryCount: 0 });
    }, 30000); // Reset after 30 seconds of successful operation
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  private renderFallbackUI = () => {
    const { error, retryCount, maxRetries, errorId } = this.state;
    const { level = 'component', name, showDetails = false } = this.props;

    const canRetry = retryCount < maxRetries;
    const isPageLevel = level === 'page';

    // ADHD-friendly error messages
    const messages = {
      page: {
        title: "Something went wrong with this page",
        description: "Don't worry! This happens sometimes. You can try refreshing the page or go back to the home screen.",
        icon: <AlertIcon className="h-12 w-12 text-red-400" />
      },
      component: {
        title: "This section isn't working right now",
        description: "The rest of the app is fine. You can try refreshing this part or continue using other features.",
        icon: <AlertIcon className="h-8 w-8 text-yellow-400" />
      },
      section: {
        title: "This part needs a moment",
        description: "Something's not quite right here, but you can keep using the rest of the app.",
        icon: <AlertIcon className="h-6 w-6 text-orange-400" />
      }
    };

    const message = messages[level];

    return (
      <div className={`bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 text-center ${
        isPageLevel ? 'min-h-screen flex items-center justify-center' : 'min-h-32 flex items-center justify-center'
      }`}>
        <div className="max-w-md mx-auto">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            {message.icon}
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {message.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-6">
            {message.description}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            {canRetry && (
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                aria-label="Try again"
              >
                <RefreshIcon className="h-4 w-4 mr-2" />
                Try Again
              </button>
            )}

            <div className="flex space-x-3">
              {isPageLevel && (
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  aria-label="Go to home page"
                >
                  <HomeIcon className="h-4 w-4 mr-2" />
                  Go Home
                </button>
              )}

              <button
                onClick={this.handleReload}
                className={`${isPageLevel ? 'flex-1' : 'w-full'} px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors`}
                aria-label="Refresh the page"
              >
                Refresh Page
              </button>
            </div>
          </div>

          {/* Retry limit message */}
          {!canRetry && (
            <p className="text-xs text-gray-500 mt-4">
              Maximum retry attempts reached. Try refreshing the page or going home.
            </p>
          )}

          {/* Technical details (only if requested) */}
          {showDetails && error && (
            <details className="mt-6 text-left">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                Technical Details (for developers)
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-600 font-mono">
                <div className="mb-2"><strong>Error ID:</strong> {errorId}</div>
                <div className="mb-2"><strong>Component:</strong> {name || 'Unknown'}</div>
                <div><strong>Message:</strong> {error.message}</div>
              </div>
            </details>
          )}

          {/* Screen reader information */}
          <div className="sr-only">
            An error occurred in the {name || level} component. 
            {canRetry ? `You can try again. ${retryCount} of ${maxRetries} attempts used.` : 'Maximum retry attempts reached.'}
            Error ID {errorId} has been logged for technical support.
          </div>
        </div>
      </div>
    );
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return this.renderFallbackUI();
    }

    return this.props.children;
  }
}

// Higher-order component for easy wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// Hook for reporting errors manually
export const useErrorHandler = () => {
  const handleError = (error: Error, context?: string) => {
    const errorId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const logData: MonitoringAlert = {
      id: errorId,
      type: 'error',
      severity: 'warning',
      message: error.message,
      timestamp: Date.now(),
      source: context || 'Manual Error Report',
      metadata: {
        stack: error.stack,
        context
      },
      acknowledged: false,
      resolved: false
    };

    console.error('Manual error report:', logData);
    
    return errorId;
  };

  return { handleError };
};