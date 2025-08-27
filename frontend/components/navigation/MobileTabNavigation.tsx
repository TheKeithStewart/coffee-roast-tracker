/**
 * Mobile Bottom Tab Navigation Component
 * User Story #20: ADHD-Optimized Navigation & Performance
 * 
 * Features:
 * - Bottom-positioned tab navigation optimized for mobile use
 * - Maximum 5 tabs to reduce cognitive overload for ADHD users
 * - Clear visual indicators for active/inactive states
 * - Accessibility compliant with proper ARIA labels and roles
 * - Haptic feedback support for mobile devices
 * - Badge support for notifications/counts
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavigationRoute } from '@/types/performance';

// Simple SVG icons for common navigation items
const HomeIcon = ({ className, active, ...props }: React.SVGProps<SVGSVGElement> & { active?: boolean }) => (
  <svg className={className} fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const RoastIcon = ({ className, active, ...props }: React.SVGProps<SVGSVGElement> & { active?: boolean }) => (
  <svg className={className} fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
  </svg>
);

const ProfileIcon = ({ className, active, ...props }: React.SVGProps<SVGSVGElement> & { active?: boolean }) => (
  <svg className={className} fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const BeansIcon = ({ className, active, ...props }: React.SVGProps<SVGSVGElement> & { active?: boolean }) => (
  <svg className={className} fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const StatsIcon = ({ className, active, ...props }: React.SVGProps<SVGSVGElement> & { active?: boolean }) => (
  <svg className={className} fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

interface TabItem extends Pick<NavigationRoute, 'id' | 'path' | 'title'> {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { active?: boolean }>;
  badge?: number | string;
  ariaLabel?: string;
}

interface MobileTabNavigationProps {
  tabs: TabItem[];
  maxTabs?: number;
  onTabChange?: (tabId: string) => void;
  showInDesktop?: boolean;
}

export function MobileTabNavigation({ 
  tabs, 
  maxTabs = 5, 
  onTabChange,
  showInDesktop = false 
}: MobileTabNavigationProps) {
  const pathname = usePathname();
  const [lastActiveTab, setLastActiveTab] = useState<string>('');

  // Limit tabs to reduce cognitive overload for ADHD users
  const limitedTabs = tabs.slice(0, maxTabs);

  const handleTabChange = (tabId: string, path: string) => {
    // Haptic feedback for supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    setLastActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const containerClasses = showInDesktop 
    ? "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
    : "md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50";

  return (
    <nav 
      className={containerClasses}
      role="tablist"
      aria-label="Main navigation tabs"
    >
      <div className="flex justify-around items-center py-2 px-1">
        {limitedTabs.map((tab) => {
          const active = isActive(tab.path);
          const IconComponent = tab.icon;
          
          return (
            <Link
              key={tab.id}
              href={tab.path}
              onClick={() => handleTabChange(tab.id, tab.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                active 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              role="tab"
              aria-selected={active}
              aria-label={tab.ariaLabel || `Navigate to ${tab.title}`}
              tabIndex={active ? 0 : -1}
            >
              {/* Icon with badge support */}
              <div className="relative">
                <IconComponent 
                  className="h-6 w-6 mb-1" 
                  active={active}
                  aria-hidden="true"
                />
                {tab.badge && (
                  <span 
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    aria-label={`${tab.badge} notifications`}
                  >
                    {typeof tab.badge === 'number' && tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              
              {/* Label */}
              <span 
                className={`text-xs font-medium truncate max-w-full ${
                  active ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {tab.title}
              </span>

              {/* Active indicator */}
              {active && (
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Screen reader navigation summary */}
      <div className="sr-only">
        Mobile navigation with {limitedTabs.length} tabs. 
        Current tab: {limitedTabs.find(tab => isActive(tab.path))?.title || 'None'}.
        Use tab key to navigate between options.
      </div>
    </nav>
  );
}

// Default tab configuration for coffee roasting app
export const defaultMobileTabs: TabItem[] = [
  {
    id: 'home',
    path: '/',
    title: 'Home',
    icon: HomeIcon,
    ariaLabel: 'Go to home dashboard'
  },
  {
    id: 'roasts',
    path: '/roasts',
    title: 'Roasts',
    icon: RoastIcon,
    ariaLabel: 'View and manage coffee roasts'
  },
  {
    id: 'profiles',
    path: '/profiles',
    title: 'Profiles',
    icon: ProfileIcon,
    ariaLabel: 'Browse roast profiles'
  },
  {
    id: 'beans',
    path: '/beans',
    title: 'Beans',
    icon: BeansIcon,
    ariaLabel: 'Manage coffee bean inventory'
  },
  {
    id: 'analytics',
    path: '/analytics',
    title: 'Stats',
    icon: StatsIcon,
    ariaLabel: 'View roasting statistics and analytics'
  }
];