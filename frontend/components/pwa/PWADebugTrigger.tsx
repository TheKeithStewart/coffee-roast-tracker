/**
 * PWA Debug Trigger for Epic #61 Issue #63
 * PWA Development Testing Environment
 * 
 * Floating debug button for development environment
 */

'use client';

import React from 'react';
import { usePWADebug } from '@/hooks/usePWADebug';
import { PWADebugPanel } from './PWADebugPanel';

export function PWADebugTrigger() {
  const { 
    isDevelopment, 
    isDebugPanelOpen, 
    showDebugPanel, 
    hideDebugPanel 
  } = usePWADebug();

  // Only show in development
  if (!isDevelopment) return null;

  return (
    <>
      {/* Floating debug button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={showDebugPanel}
          className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          title="Open PWA Debug Panel (Ctrl+Shift+D)"
          aria-label="Open PWA debug panel"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
            <path d="m9 9 5 0"/>
            <path d="m9 12 3 0"/>
          </svg>
        </button>
        
        {/* Development indicator */}
        <div className="absolute -top-2 -left-2 bg-yellow-400 text-black text-xs px-1 rounded">
          DEV
        </div>
      </div>

      {/* Debug Panel */}
      <PWADebugPanel 
        isOpen={isDebugPanelOpen} 
        onClose={hideDebugPanel} 
      />
    </>
  );
}