/**
 * Offline Page for Epic #61 Issue #63
 * PWA Development Testing Environment
 * 
 * Fallback page when the application is offline
 */

'use client';

import React from 'react';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg 
                className="w-8 h-8 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You're Offline
          </h1>
          
          <p className="text-gray-600 mb-6">
            No internet connection detected. Some features may not be available.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h2 className="font-medium text-blue-900 mb-2">
              What you can still do:
            </h2>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• View previously cached pages</li>
              <li>• Track active roasts</li>
              <li>• View saved roast profiles</li>
              <li>• Make notes (will sync when online)</li>
            </ul>
          </div>
          
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          
          <div className="mt-4 text-sm text-gray-500">
            Connection will be restored automatically when available
          </div>
        </div>
      </div>
    </div>
  );
}