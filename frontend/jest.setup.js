import '@testing-library/jest-dom'

// Mock HTMLFormElement.requestSubmit for JSDOM compatibility
Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
  value: function(submitter) {
    if (submitter && submitter.form !== this) {
      throw new DOMException('The specified element is not a descendant of the form element.', 'NotFoundError');
    }
    
    if (submitter && (submitter.type === 'submit' || submitter.type === 'image')) {
      // Mock form validation
      if (this.checkValidity && this.checkValidity()) {
        // Dispatch submit event
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        const dispatched = this.dispatchEvent(submitEvent);
        
        if (dispatched && this.submit) {
          this.submit();
        }
      }
    } else {
      if (this.submit) {
        this.submit();
      }
    }
  },
  writable: true,
  configurable: true
});

// Mock NextAuth.js
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
    update: jest.fn()
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }) => children,
  getSession: jest.fn()
}));

// Mock TextEncoder/TextDecoder for JSDOM (needed for PKCE)
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Mock crypto for testing environment
Object.defineProperty(global, 'crypto', {
  value: {
    subtle: {
      digest: jest.fn().mockResolvedValue(new ArrayBuffer(32))
    },
    getRandomValues: jest.fn((arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    })
  }
});

// Mock BroadcastChannel
global.BroadcastChannel = class BroadcastChannel {
  constructor(name) {
    this.name = name;
  }
  
  postMessage = jest.fn();
  addEventListener = jest.fn();
  removeEventListener = jest.fn();
  close = jest.fn();
};

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  }
});

// Mock localStorage for tests
const localStorageData = new Map()

const localStorageMock = {
  getItem: jest.fn((key) => localStorageData.get(key) || null),
  setItem: jest.fn((key, value) => localStorageData.set(key, value)),
  removeItem: jest.fn((key) => localStorageData.delete(key)),
  clear: jest.fn(() => localStorageData.clear()),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver for components that might use it
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock requestAnimationFrame for animations
global.requestAnimationFrame = callback => setTimeout(callback, 0)
global.cancelAnimationFrame = id => clearTimeout(id)

// Setup custom matchers for better assertions
expect.extend({
  toHaveAccessibleDescription(element, description) {
    const describedBy = element.getAttribute('aria-describedby')
    const labelledBy = element.getAttribute('aria-labelledby')
    const label = element.getAttribute('aria-label')
    
    const hasDescription = !!(describedBy || labelledBy || label)
    
    if (description) {
      const pass = (label === description) || 
                  (describedBy && document.getElementById(describedBy)?.textContent === description) ||
                  (labelledBy && document.getElementById(labelledBy)?.textContent === description)
      
      return {
        message: () => 
          pass 
            ? `expected element not to have accessible description "${description}"`
            : `expected element to have accessible description "${description}"`,
        pass,
      }
    }
    
    return {
      message: () => 
        hasDescription
          ? `expected element not to have accessible description`
          : `expected element to have accessible description`,
      pass: hasDescription,
    }
  }
})