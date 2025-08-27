/**
 * Breadcrumb Navigation Component
 * User Story #20: ADHD-Optimized Navigation & Performance
 * 
 * Features:
 * - Maximum 3-level hierarchy to reduce cognitive load
 * - Clear visual hierarchy with ADHD-friendly design
 * - Accessibility compliant with proper ARIA navigation landmarks
 * - Mobile-responsive with truncation for smaller screens
 * - Performance-optimized with preloading hints
 */

'use client';

import React from 'react';
import Link from 'next/link';
import type { BreadcrumbItem, NavigationRoute } from '@/types/performance';

// Simple SVG icons to avoid external dependencies
const ChevronRightIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

const HomeIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  maxLevels?: number;
  showHome?: boolean;
  onNavigate?: (href: string) => void;
}

export function BreadcrumbNavigation({ 
  items, 
  maxLevels = 3, 
  showHome = true,
  onNavigate 
}: BreadcrumbNavigationProps) {
  // Ensure we don't exceed the maximum hierarchy depth
  const limitedItems = items.slice(0, maxLevels);
  
  const handleNavigate = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    }
  };

  const renderBreadcrumbItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
    const baseClasses = "flex items-center text-sm font-medium transition-colors duration-200";
    const linkClasses = isLast 
      ? `${baseClasses} text-gray-700 cursor-default` 
      : `${baseClasses} text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-md px-1`;

    return (
      <li key={item.id} className="flex items-center">
        {index > 0 && (
          <ChevronRightIcon 
            className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" 
            aria-hidden="true" 
          />
        )}
        
        {isLast ? (
          <span 
            className={linkClasses}
            aria-current="page"
            aria-label={`Current page: ${item.label}`}
          >
            <span className="truncate max-w-32 sm:max-w-48 md:max-w-none">
              {item.label}
            </span>
          </span>
        ) : (
          <Link
            href={item.href}
            className={linkClasses}
            onClick={() => handleNavigate(item.href)}
            aria-label={`Navigate to ${item.label}`}
            {...(item.accessible === false ? { 'aria-disabled': 'true', tabIndex: -1 } : {})}
          >
            <span className="truncate max-w-32 sm:max-w-48 md:max-w-none">
              {item.label}
            </span>
          </Link>
        )}
      </li>
    );
  };

  if (limitedItems.length === 0) {
    return null;
  }

  return (
    <nav 
      className="flex mb-4" 
      aria-label="Breadcrumb navigation"
      role="navigation"
    >
      <ol className="flex items-center space-x-1">
        {showHome && (
          <li className="flex items-center">
            <Link
              href="/"
              className="text-gray-400 hover:text-gray-500 focus:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-md p-1"
              onClick={() => handleNavigate('/')}
              aria-label="Go to homepage"
            >
              <HomeIcon className="flex-shrink-0 h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
        )}
        
        {limitedItems.map((item, index) => 
          renderBreadcrumbItem(item, index, index === limitedItems.length - 1)
        )}
      </ol>

      {/* Hierarchy level indicator for ADHD users */}
      <div className="ml-auto flex items-center">
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          Level {limitedItems.length}/{maxLevels}
        </span>
      </div>

      {/* Screen reader summary */}
      <div className="sr-only">
        You are currently at level {limitedItems.length} of {maxLevels} in the navigation hierarchy. 
        Current page: {limitedItems[limitedItems.length - 1]?.label}.
      </div>
    </nav>
  );
}