import '@testing-library/jest-dom'

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