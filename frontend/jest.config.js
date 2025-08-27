// Simplified Jest Configuration for Epic #61 - Focus on reliability over complexity
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // Simplified transform patterns - only what's absolutely necessary
  transformIgnorePatterns: [
    'node_modules/(?!(next-auth|@hookform/resolvers|react-hook-form)/)',
  ],
  
  // Basic performance settings - avoid over-optimization
  testTimeout: 10000, // Simplified from 15000
  maxWorkers: '50%',
  
  // Standard coverage configuration - Use Next.js built-in TypeScript handling
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/*.test.{js,jsx,ts,tsx}',
    '!**/*.spec.{js,jsx,ts,tsx}',
  ],
  
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  
  // Standard test path configuration
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/tests/e2e/',
  ],
}

module.exports = createJestConfig(customJestConfig)