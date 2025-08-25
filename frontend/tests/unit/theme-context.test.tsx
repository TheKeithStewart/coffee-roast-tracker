/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// We'll implement these components next
import { ThemeProvider, useThemeData, useThemeActions } from '@/lib/theme-context'

// Test component to consume theme context
const TestComponent = () => {
  const themeData = useThemeData()
  const themeActions = useThemeActions()

  return (
    <div>
      <div data-testid="current-theme">{themeData.theme}</div>
      <div data-testid="is-loading">{themeData.isLoading ? 'loading' : 'ready'}</div>
      <div data-testid="system-preference">{themeData.systemPreference || 'none'}</div>
      
      <button 
        data-testid="set-classic" 
        onClick={() => themeActions.setTheme('classic')}
      >
        Set Classic
      </button>
      <button 
        data-testid="set-contrast" 
        onClick={() => themeActions.setTheme('contrast')}
      >
        Set Contrast
      </button>
      <button 
        data-testid="set-focus" 
        onClick={() => themeActions.setTheme('focus')}
      >
        Set Focus
      </button>
      <button 
        data-testid="set-energizing" 
        onClick={() => themeActions.setTheme('energizing')}
      >
        Set Energizing
      </button>
      <button 
        data-testid="reset-system" 
        onClick={() => themeActions.resetToSystemPreference()}
      >
        Reset to System
      </button>
      <button 
        data-testid="clear-preference" 
        onClick={() => themeActions.clearPreference()}
      >
        Clear Preference
      </button>

      <div data-testid="themes-list">
        {themeData.themes.map(theme => (
          <div key={theme.id} data-testid={`theme-${theme.id}`}>
            {theme.name} - {theme.description}
          </div>
        ))}
      </div>
    </div>
  )
}

describe('Theme Context', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    
    // Reset document theme attribute
    document.documentElement.removeAttribute('data-theme')
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should provide default theme data', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('current-theme')).toHaveTextContent('classic')
    expect(screen.getByTestId('is-loading')).toHaveTextContent('ready')
    expect(screen.getByTestId('themes-list')).toBeInTheDocument()
  })

  test('should provide all 4 themes with correct metadata', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    // Check that all 4 themes are available
    expect(screen.getByTestId('theme-classic')).toHaveTextContent('Classic Coffee')
    expect(screen.getByTestId('theme-contrast')).toHaveTextContent('High Contrast')
    expect(screen.getByTestId('theme-focus')).toHaveTextContent('Cool Focus')
    expect(screen.getByTestId('theme-energizing')).toHaveTextContent('Energizing')
  })

  test('should switch themes correctly', async () => {
    const user = userEvent.setup()
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    // Initial theme should be classic
    expect(screen.getByTestId('current-theme')).toHaveTextContent('classic')

    // Switch to contrast theme
    await user.click(screen.getByTestId('set-contrast'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('contrast')
    expect(document.documentElement.getAttribute('data-theme')).toBe('contrast')

    // Switch to focus theme
    await user.click(screen.getByTestId('set-focus'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('focus')
    expect(document.documentElement.getAttribute('data-theme')).toBe('focus')

    // Switch to energizing theme
    await user.click(screen.getByTestId('set-energizing'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('energizing')
    expect(document.documentElement.getAttribute('data-theme')).toBe('energizing')
  })

  test('should persist theme preference to localStorage', async () => {
    const user = userEvent.setup()
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    // Switch to contrast theme
    await user.click(screen.getByTestId('set-contrast'))
    
    // Check localStorage
    expect(localStorage.getItem('coffee-tracker-theme')).toBe('contrast')
  })

  test('should load theme preference from localStorage on mount', () => {
    // Set initial localStorage value
    localStorage.setItem('coffee-tracker-theme', 'focus')
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    // Should start with focus theme
    expect(screen.getByTestId('current-theme')).toHaveTextContent('focus')
    expect(document.documentElement.getAttribute('data-theme')).toBe('focus')
  })

  test('should detect system preference', () => {
    // Mock system preference for dark mode (maps to high contrast in our system)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    // The theme should still default to classic, but system preference should be detected
    expect(screen.getByTestId('current-theme')).toHaveTextContent('classic')
    expect(screen.getByTestId('system-preference')).toHaveTextContent('contrast')
  })

  test('should reset to system preference', async () => {
    const user = userEvent.setup()
    
    // Mock system preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    // First switch to a different theme
    await user.click(screen.getByTestId('set-energizing'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('energizing')

    // Then reset to system preference
    await user.click(screen.getByTestId('reset-system'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('contrast')
    expect(localStorage.getItem('coffee-tracker-theme')).toBeNull()
  })

  test('should clear preference and use default', async () => {
    const user = userEvent.setup()
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    // Set a theme first
    await user.click(screen.getByTestId('set-focus'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('focus')

    // Clear preference
    await user.click(screen.getByTestId('clear-preference'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('classic')
    expect(localStorage.getItem('coffee-tracker-theme')).toBeNull()
  })

  test('should handle invalid localStorage values gracefully', () => {
    // Set invalid theme in localStorage
    localStorage.setItem('coffee-tracker-theme', 'invalid-theme')
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    // Should fallback to default theme
    expect(screen.getByTestId('current-theme')).toHaveTextContent('classic')
  })

  test('should optimize performance with compound context pattern', () => {
    // This test ensures that theme data and actions are separate contexts
    // to minimize re-renders when actions don't change
    
    let dataRenderCount = 0
    let actionsRenderCount = 0

    const DataConsumer = () => {
      dataRenderCount++
      const data = useThemeData()
      return <div data-testid="data-consumer">{data.theme}</div>
    }

    const ActionsConsumer = () => {
      actionsRenderCount++
      const actions = useThemeActions()
      return (
        <button 
          data-testid="actions-consumer" 
          onClick={() => actions.setTheme('focus')}
        >
          Switch Theme
        </button>
      )
    }

    const { rerender } = render(
      <ThemeProvider>
        <DataConsumer />
        <ActionsConsumer />
      </ThemeProvider>
    )

    const initialDataRenders = dataRenderCount
    const initialActionsRenders = actionsRenderCount

    // Re-render the tree
    rerender(
      <ThemeProvider>
        <DataConsumer />
        <ActionsConsumer />
      </ThemeProvider>
    )

    // Actions consumer should not re-render unnecessarily
    // Data consumer may re-render due to theme changes
    expect(actionsRenderCount - initialActionsRenders).toBeLessThanOrEqual(1)
  })

  test('should measure theme switch performance', async () => {
    const user = userEvent.setup()
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const startTime = performance.now()
    
    // Switch theme
    await user.click(screen.getByTestId('set-contrast'))
    
    const endTime = performance.now()
    const switchTime = endTime - startTime

    // Theme switch should be under 100ms (requirement from technical plan)
    expect(switchTime).toBeLessThan(100)
  })

  test('should throw error when used outside provider', () => {
    // Temporarily suppress console.error for this test
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useThemeData must be used within a ThemeProvider')

    consoleError.mockRestore()
  })
})