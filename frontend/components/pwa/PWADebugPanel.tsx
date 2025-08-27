/**
 * PWA Development Debug Panel for Epic #61 Issue #63
 * PWA Development Testing Environment
 * 
 * Real-time PWA debugging and testing tools for development
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface ServiceWorkerStatus {
  environment: 'development' | 'production';
  registered: boolean;
  active: boolean;
  waiting: boolean;
  controller: boolean;
  config?: any;
  error?: string;
}

interface CacheInfo {
  name: string;
  size: number;
  entries: number;
  lastUsed?: Date;
}

interface DebugMessage {
  timestamp: number;
  environment: string;
  message: string;
  data?: any;
}

interface PWADebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PWADebugPanel({ isOpen, onClose }: PWADebugPanelProps) {
  const [activeTab, setActiveTab] = useState<'status' | 'cache' | 'logs' | 'tools'>('status');
  const [swStatus, setSWStatus] = useState<ServiceWorkerStatus>({
    environment: 'development',
    registered: false,
    active: false,
    waiting: false,
    controller: false
  });
  const [cacheInfo, setCacheInfo] = useState<CacheInfo[]>([]);
  const [debugLogs, setDebugLogs] = useState<DebugMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Check service worker status
  const checkServiceWorkerStatus = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      setSWStatus(prev => ({ ...prev, error: 'Service Workers not supported' }));
      return;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      
      setSWStatus({
        environment: window.location.hostname.includes('localhost') ? 'development' : 'production',
        registered: !!registration,
        active: !!registration?.active,
        waiting: !!registration?.waiting,
        controller: !!navigator.serviceWorker.controller,
        error: undefined
      });

      // Get config from service worker
      if (registration?.active) {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => {
          setSWStatus(prev => ({ ...prev, config: event.data }));
        };
        
        registration.active.postMessage(
          { type: 'GET_SW_STATUS' }, 
          [channel.port2]
        );
      }
    } catch (error) {
      setSWStatus(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, []);

  // Get cache information
  const getCacheInfo = useCallback(async () => {
    if (!('caches' in window)) return;

    try {
      const cacheNames = await caches.keys();
      const cacheInfoPromises = cacheNames.map(async (name): Promise<CacheInfo> => {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        
        return {
          name,
          size: 0, // Browser doesn't expose cache size easily
          entries: keys.length,
          lastUsed: new Date()
        };
      });

      const info = await Promise.all(cacheInfoPromises);
      setCacheInfo(info);
    } catch (error) {
      console.error('Failed to get cache info:', error);
    }
  }, []);

  // Listen for debug messages from service worker
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SW_DEBUG') {
        const debugMessage: DebugMessage = {
          timestamp: event.data.timestamp,
          environment: event.data.environment,
          message: event.data.message,
          data: event.data.data
        };
        
        setDebugLogs(prev => [debugMessage, ...prev].slice(0, 100)); // Keep last 100
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleMessage);
    
    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
    };
  }, []);

  // Refresh data when panel opens
  useEffect(() => {
    if (isOpen) {
      checkServiceWorkerStatus();
      getCacheInfo();
    }
  }, [isOpen, checkServiceWorkerStatus, getCacheInfo]);

  // Clear all caches
  const clearAllCaches = async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.active) {
        const channel = new MessageChannel();
        channel.port1.onmessage = () => {
          getCacheInfo(); // Refresh cache info
          setIsLoading(false);
        };
        
        registration.active.postMessage(
          { type: 'CLEAR_CACHE' },
          [channel.port2]
        );
      } else {
        // Fallback: clear caches directly
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        getCacheInfo();
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to clear caches:', error);
      setIsLoading(false);
    }
  };

  // Force service worker update
  const forceUpdate = async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        
        if (registration.waiting) {
          const channel = new MessageChannel();
          channel.port1.onmessage = () => {
            window.location.reload();
          };
          
          registration.waiting.postMessage(
            { type: 'FORCE_UPDATE' },
            [channel.port2]
          );
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to force update:', error);
      setIsLoading(false);
    }
  };

  // Test PWA install prompt
  const testInstallPrompt = async () => {
    // Dispatch custom event for PWA install prompt testing
    window.dispatchEvent(new CustomEvent('pwa-debug-install-test'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] w-full mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">PWA Debug Panel</h2>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded ${
              swStatus.environment === 'development' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {swStatus.environment}
            </span>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close debug panel"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {(['status', 'cache', 'logs', 'tools'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'status' && (
            <div className="space-y-4">
              <h3 className="font-semibold">Service Worker Status</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Registered:</span>
                    <span className={swStatus.registered ? 'text-green-600' : 'text-red-600'}>
                      {swStatus.registered ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active:</span>
                    <span className={swStatus.active ? 'text-green-600' : 'text-red-600'}>
                      {swStatus.active ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Controller:</span>
                    <span className={swStatus.controller ? 'text-green-600' : 'text-red-600'}>
                      {swStatus.controller ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Environment:</span>
                    <span className="font-mono">{swStatus.environment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Update Waiting:</span>
                    <span className={swStatus.waiting ? 'text-yellow-600' : 'text-gray-600'}>
                      {swStatus.waiting ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
              
              {swStatus.config && (
                <div>
                  <h4 className="font-medium mb-2">Configuration</h4>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(swStatus.config, null, 2)}
                  </pre>
                </div>
              )}
              
              {swStatus.error && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <div className="text-red-800 font-medium">Error</div>
                  <div className="text-red-600 text-sm">{swStatus.error}</div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cache' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Cache Storage</h3>
                <button
                  onClick={getCacheInfo}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={isLoading}
                >
                  Refresh
                </button>
              </div>
              
              <div className="space-y-2">
                {cacheInfo.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">No caches found</div>
                ) : (
                  cacheInfo.map((cache) => (
                    <div key={cache.name} className="bg-gray-50 p-3 rounded">
                      <div className="font-medium">{cache.name}</div>
                      <div className="text-sm text-gray-600">
                        {cache.entries} entries
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Debug Logs</h3>
                <button
                  onClick={() => setDebugLogs([])}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Clear
                </button>
              </div>
              
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {debugLogs.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">No debug messages</div>
                ) : (
                  debugLogs.map((log, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded text-xs font-mono">
                      <div className="text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString()} [{log.environment}]
                      </div>
                      <div>{log.message}</div>
                      {log.data && (
                        <pre className="text-gray-600 mt-1">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-4">
              <h3 className="font-semibold">Development Tools</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={clearAllCaches}
                  disabled={isLoading}
                  className="p-4 text-left bg-red-50 border border-red-200 rounded hover:bg-red-100 disabled:opacity-50"
                >
                  <div className="font-medium text-red-800">Clear All Caches</div>
                  <div className="text-sm text-red-600">Delete all cached resources</div>
                </button>
                
                <button
                  onClick={forceUpdate}
                  disabled={isLoading}
                  className="p-4 text-left bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 disabled:opacity-50"
                >
                  <div className="font-medium text-blue-800">Force SW Update</div>
                  <div className="text-sm text-blue-600">Update service worker immediately</div>
                </button>
                
                <button
                  onClick={testInstallPrompt}
                  disabled={isLoading}
                  className="p-4 text-left bg-green-50 border border-green-200 rounded hover:bg-green-100 disabled:opacity-50"
                >
                  <div className="font-medium text-green-800">Test Install Prompt</div>
                  <div className="text-sm text-green-600">Trigger PWA installation dialog</div>
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="p-4 text-left bg-yellow-50 border border-yellow-200 rounded hover:bg-yellow-100"
                >
                  <div className="font-medium text-yellow-800">Hard Refresh</div>
                  <div className="text-sm text-yellow-600">Reload page completely</div>
                </button>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">PWA Installation Status</h4>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <div>Install prompt available: {typeof window !== 'undefined' && window.localStorage.getItem('pwa-install-dismissed') ? 'No (dismissed)' : 'Maybe'}</div>
                  <div>Standalone mode: {'standalone' in window.navigator ? 'Yes' : 'No'}</div>
                  <div>Display mode: {window.matchMedia('(display-mode: standalone)').matches ? 'Standalone' : 'Browser'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}