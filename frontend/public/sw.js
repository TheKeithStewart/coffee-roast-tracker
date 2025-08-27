/**
 * Unified Service Worker for Epic #61 Issue #63
 * PWA Development Testing Environment
 * 
 * Provides environment-aware PWA functionality with development debugging support
 */

// Environment detection
const isProduction = !self.location.hostname.includes('localhost') && 
                    !self.location.hostname.includes('127.0.0.1');
const isDevelopment = !isProduction;

// Configuration based on environment
const CONFIG = {
  environment: isDevelopment ? 'development' : 'production',
  debug: isDevelopment,
  cacheName: isDevelopment ? 'roast-tracker-dev-v1' : 'roast-tracker-prod-v1',
  enableNotifications: isProduction,
  enableBackgroundSync: isProduction,
  cacheStrategy: isDevelopment ? 'NetworkFirst' : 'StaleWhileRevalidate'
};

// Debug logging for development
function debugLog(message, data = null) {
  if (CONFIG.debug) {
    console.log(`[SW-${CONFIG.environment}] ${message}`, data || '');
    
    // Send debug info to PWA debug panel
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SW_DEBUG',
          timestamp: Date.now(),
          environment: CONFIG.environment,
          message,
          data
        });
      });
    });
  }
}

// Cache management with environment awareness
const CACHE_STRATEGIES = {
  // Development: Always fresh content, minimal caching
  development: {
    pages: 'NetworkFirst',
    api: 'NetworkOnly',
    static: 'NetworkFirst',
    images: 'NetworkFirst'
  },
  // Production: Optimized caching
  production: {
    pages: 'StaleWhileRevalidate', 
    api: 'NetworkFirst',
    static: 'CacheFirst',
    images: 'StaleWhileRevalidate'
  }
};

// Install event - Environment-aware setup
self.addEventListener('install', event => {
  debugLog('Service Worker installing', { config: CONFIG });
  
  event.waitUntil(
    caches.open(CONFIG.cacheName).then(cache => {
      debugLog('Cache opened', { cacheName: CONFIG.cacheName });
      
      // In development, only cache essential resources
      if (isDevelopment) {
        return cache.addAll([
          '/',
          '/manifest.json'
        ]);
      }
      
      // In production, cache more aggressively
      return cache.addAll([
        '/',
        '/manifest.json',
        '/offline',
        '/icons/icon-192x192.png'
      ]);
    })
  );
  
  // Skip waiting in development for faster testing
  if (isDevelopment) {
    self.skipWaiting();
  }
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
  debugLog('Service Worker activating');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CONFIG.cacheName) {
            debugLog('Deleting old cache', { cacheName });
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      debugLog('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - Environment-aware caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) return;
  
  // Skip in development for specific debugging endpoints
  if (isDevelopment && url.pathname.startsWith('/_next/webpack-hmr')) {
    return;
  }
  
  debugLog('Fetching', { 
    url: request.url, 
    method: request.method,
    strategy: getStrategy(request)
  });
  
  event.respondWith(handleRequest(request));
});

// Get caching strategy based on request and environment
function getStrategy(request) {
  const url = new URL(request.url);
  const strategies = CACHE_STRATEGIES[CONFIG.environment];
  
  // API requests
  if (url.pathname.startsWith('/api/')) {
    return strategies.api;
  }
  
  // Static assets
  if (request.destination === 'image') {
    return strategies.images;
  }
  
  if (request.destination === 'style' || 
      request.destination === 'script' || 
      url.pathname.startsWith('/_next/static/')) {
    return strategies.static;
  }
  
  // Pages and documents
  return strategies.pages;
}

// Handle requests with appropriate caching strategy
async function handleRequest(request) {
  const strategy = getStrategy(request);
  const url = new URL(request.url);
  
  try {
    switch (strategy) {
      case 'NetworkOnly':
        return await fetch(request);
        
      case 'CacheFirst':
        return await cacheFirst(request);
        
      case 'NetworkFirst':
        return await networkFirst(request);
        
      case 'StaleWhileRevalidate':
        return await staleWhileRevalidate(request);
        
      default:
        return await networkFirst(request);
    }
  } catch (error) {
    debugLog('Request failed', { url: request.url, error: error.message });
    
    // Fallback for navigation requests
    if (request.mode === 'navigate') {
      return await caches.match('/offline') || 
             new Response('Offline - Please check your connection', {
               status: 503,
               statusText: 'Service Unavailable'
             });
    }
    
    throw error;
  }
}

// Cache-first strategy
async function cacheFirst(request) {
  const cache = await caches.open(CONFIG.cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    debugLog('Cache hit', { url: request.url });
    return cached;
  }
  
  const response = await fetch(request);
  
  if (response.ok) {
    cache.put(request, response.clone());
    debugLog('Response cached', { url: request.url });
  }
  
  return response;
}

// Network-first strategy  
async function networkFirst(request) {
  const cache = await caches.open(CONFIG.cacheName);
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
      debugLog('Network success, cached', { url: request.url });
    }
    
    return response;
  } catch (error) {
    debugLog('Network failed, checking cache', { url: request.url });
    
    const cached = await cache.match(request);
    if (cached) {
      debugLog('Cache fallback', { url: request.url });
      return cached;
    }
    
    throw error;
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CONFIG.cacheName);
  const cached = await cache.match(request);
  
  // Always try to fetch in background
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
      debugLog('Background update', { url: request.url });
    }
    return response;
  }).catch(error => {
    debugLog('Background update failed', { url: request.url, error: error.message });
  });
  
  // Return cache immediately if available
  if (cached) {
    debugLog('Stale response, updating in background', { url: request.url });
    return cached;
  }
  
  // Wait for network if no cache
  debugLog('No cache, waiting for network', { url: request.url });
  return await fetchPromise;
}

// Message handling for PWA debug panel communication
self.addEventListener('message', event => {
  const { type, payload } = event.data || {};
  
  debugLog('Message received', { type, payload });
  
  switch (type) {
    case 'GET_SW_STATUS':
      event.ports[0].postMessage({
        environment: CONFIG.environment,
        config: CONFIG,
        caches: null // Will be populated by cache inspection
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'FORCE_UPDATE':
      self.skipWaiting().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    default:
      debugLog('Unknown message type', { type });
  }
});

// Clear all caches (for debugging)
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  const promises = cacheNames.map(name => caches.delete(name));
  await Promise.all(promises);
  debugLog('All caches cleared');
}

// Periodic debug info (development only)
if (isDevelopment) {
  setInterval(() => {
    debugLog('SW Status Check', {
      environment: CONFIG.environment,
      cacheName: CONFIG.cacheName,
      timestamp: Date.now()
    });
  }, 30000); // Every 30 seconds
}

debugLog('Unified Service Worker initialized', CONFIG);