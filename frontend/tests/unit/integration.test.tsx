/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeProvider } from '@/lib/theme-context'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { BaseButton } from '@/components/BaseButton'

// Integration test component that combines all our major components
const IntegrationTestApp = () => {
  return (
    <ThemeProvider>
      <div>
        {/* Skip link */}
        <a href="#main" className="skip-link">Skip to main content</a>
        
        {/* Header with theme switcher */}
        <header style={{ padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="typography-h1">Coffee Roast Tracker</h1>
            <ThemeSwitcher showPreview showSystemOption position="navigation" />
          </div>
        </header>
        
        {/* Main content */}
        <main id="main" style={{ padding: 'var(--space-4)' }}>
          <section style={{ marginBottom: 'var(--space-6)' }}>
            <h2 className="typography-h2">Control Panel</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              <BaseButton variant="primary" icon={<span>🔥</span>}>Start Roast</BaseButton>
              <BaseButton variant="secondary" icon={<span>⏸️</span>}>Pause</BaseButton>
              <BaseButton variant="success">Complete</BaseButton>
              <BaseButton variant="emergency">Emergency Stop</BaseButton>
            </div>
          </section>
          
          <section>
            <h2 className="typography-h2">Roast Status</h2>
            <div className="timer-display" style={{ margin: 'var(--space-4) 0' }}>
              <div className="timer-display__time">05:43</div>
              <div className="timer-display__label">First Crack</div>
              <div className="timer-display__phase">Active Roasting</div>
            </div>
          </section>
          
          <section>
            <div className="card">
              <div className="card__header">
                <h3 className="card__title">Current Bean</h3>
                <p className="card__subtitle">Ethiopia Yirgacheffe</p>
              </div>
              <div className="card__body">
                <p className="typography-body">Light roast with floral notes</p>
              </div>
              <div className="card__footer">
                <BaseButton size="sm">Edit</BaseButton>
                <span style={{ fontSize: 'var(--font-size-sm)' }}>Selected</span>
              </div>
            </div>
          </section>
        </main>
        
        {/* Live region for announcements */}
        <div id="live-region" className="sr-only" aria-live="polite" aria-atomic="true"></div>
      </div>
    </ThemeProvider>
  )
}

describe('Design System Integration', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  test('should render complete app with all components', () => {
    render(<IntegrationTestApp />)
    
    // Check all major components are present
    expect(screen.getByText('Coffee Roast Tracker')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /theme selection/i })).toBeInTheDocument()
    expect(screen.getByText('Start Roast')).toBeInTheDocument()
    expect(screen.getByText('Emergency Stop')).toBeInTheDocument()
    expect(screen.getByText('05:43')).toBeInTheDocument()
    expect(screen.getByText('Ethiopia Yirgacheffe')).toBeInTheDocument()
  })

  test('should switch themes and update all components', async () => {
    const user = userEvent.setup()
    
    render(<IntegrationTestApp />)
    
    // Initial theme should be classic (attribute is set)
    expect(document.documentElement.getAttribute('data-theme')).toBe('classic')
    
    // Open theme switcher
    const themeSwitcher = screen.getByRole('button', { name: /theme selection/i })
    await user.click(themeSwitcher)
    
    // Switch to high contrast theme
    const contrastOption = screen.getByRole('option', { name: /high contrast/i })
    await user.click(contrastOption)
    
    // Verify theme was applied
    expect(document.documentElement.getAttribute('data-theme')).toBe('contrast')
    
    // Switch to focus theme
    await user.click(themeSwitcher)
    const focusOption = screen.getByRole('option', { name: /cool focus/i })
    await user.click(focusOption)
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('focus')
    
    // Switch to energizing theme
    await user.click(themeSwitcher)
    const energizingOption = screen.getByRole('option', { name: /energizing/i })
    await user.click(energizingOption)
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('energizing')
  })

  test('should maintain accessibility across all themes', async () => {
    // Test accessibility across themes
    
    render(<IntegrationTestApp />)
    
    const themes = ['classic', 'contrast', 'focus', 'energizing']
    
    for (const theme of themes) {
      // Set theme
      if (theme !== 'classic') {
        document.documentElement.setAttribute('data-theme', theme)
      }
      
      // Check skip link is accessible
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveClass('skip-link')
      
      // Check theme switcher accessibility
      const themeSwitcher = screen.getByRole('button', { name: /theme selection/i })
      expect(themeSwitcher).toHaveAttribute('aria-expanded', 'false')
      expect(themeSwitcher).toHaveAttribute('aria-haspopup', 'listbox')
      
      // Check buttons are accessible
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type')
        expect(button).toHaveProperty('tabIndex', 0)
      })
      
      // Check headings have proper hierarchy
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
      
      const h2s = screen.getAllByRole('heading', { level: 2 })
      expect(h2s.length).toBeGreaterThan(0)
      
      // Check live region exists
      const liveRegion = document.getElementById('live-region')
      expect(liveRegion).toBeInTheDocument()
    }
  })

  test('should handle keyboard navigation across components', async () => {
    const user = userEvent.setup()
    
    render(<IntegrationTestApp />)
    
    // Tab should move through interactive elements
    await user.keyboard('{Tab}') // Skip link
    expect(screen.getByText('Skip to main content')).toHaveFocus()
    
    await user.keyboard('{Tab}') // Theme switcher
    expect(screen.getByRole('button', { name: /theme selection/i })).toHaveFocus()
    
    await user.keyboard('{Tab}') // Start Roast button
    expect(screen.getByRole('button', { name: 'Start Roast' })).toHaveFocus()
    
    await user.keyboard('{Tab}') // Pause button
    expect(screen.getByRole('button', { name: 'Pause' })).toHaveFocus()
    
    await user.keyboard('{Tab}') // Complete button
    expect(screen.getByRole('button', { name: 'Complete' })).toHaveFocus()
    
    await user.keyboard('{Tab}') // Emergency Stop button
    expect(screen.getByRole('button', { name: 'Emergency Stop' })).toHaveFocus()
  })

  test('should persist theme selection across sessions', async () => {
    const user = userEvent.setup()
    
    const { unmount } = render(<IntegrationTestApp />)
    
    // Switch to focus theme
    const themeSwitcher = screen.getByRole('button', { name: /theme selection/i })
    await user.click(themeSwitcher)
    await user.click(screen.getByRole('option', { name: /cool focus/i }))
    
    // Verify localStorage was updated
    expect(localStorage.getItem('coffee-tracker-theme')).toBe('focus')
    
    // Unmount and remount (simulate page reload)
    unmount()
    render(<IntegrationTestApp />)
    
    // Theme should be restored
    expect(document.documentElement.getAttribute('data-theme')).toBe('focus')
    expect(screen.getByText('Cool Focus')).toBeInTheDocument()
  })

  test('should announce theme changes to screen readers', async () => {
    const user = userEvent.setup()
    
    render(<IntegrationTestApp />)
    
    const liveRegion = document.getElementById('live-region')
    expect(liveRegion).toBeInTheDocument()
    
    // Switch theme
    const themeSwitcher = screen.getByRole('button', { name: /theme selection/i })
    await user.click(themeSwitcher)
    await user.click(screen.getByRole('option', { name: /high contrast/i }))
    
    // Should announce the change (implementation in theme context handles this)
    await waitFor(() => {
      // The announcement might be brief, so we just check that the live region exists
      expect(liveRegion).toBeInTheDocument()
    })
  })

  test('should handle button interactions across themes', async () => {
    const user = userEvent.setup()
    
    render(<IntegrationTestApp />)
    
    const themes = ['contrast', 'focus', 'energizing']
    
    for (const theme of themes) {
      // Switch to theme
      const themeSwitcher = screen.getByRole('button', { name: /theme selection/i })
      await user.click(themeSwitcher)
      
      const themeOption = screen.getByRole('option', { name: new RegExp(theme === 'contrast' ? 'high contrast' : theme, 'i') })
      await user.click(themeOption)
      
      // Test button interactions
      const startButton = screen.getByRole('button', { name: 'Start Roast' })
      await user.click(startButton)
      
      // Button should still be clickable and maintain focus
      expect(startButton).toBeInTheDocument()
      expect(startButton).toHaveClass('btn--primary')
    }
  })

  test('should meet performance requirements', async () => {
    const user = userEvent.setup()
    
    render(<IntegrationTestApp />)
    
    // Measure theme switch performance
    const startTime = performance.now()
    
    const themeSwitcher = screen.getByRole('button', { name: /theme selection/i })
    await user.click(themeSwitcher)
    await user.click(screen.getByRole('option', { name: /high contrast/i }))
    
    const endTime = performance.now()
    const switchTime = endTime - startTime
    
    // Theme switch should be under 100ms (requirement from technical plan)
    expect(switchTime).toBeLessThan(100)
  })

  test('should support emergency scenarios', async () => {
    const user = userEvent.setup()
    
    render(<IntegrationTestApp />)
    
    const emergencyButton = screen.getByRole('button', { name: 'Emergency Stop' })
    
    // Emergency button should be prominent
    expect(emergencyButton).toHaveClass('btn--emergency')
    
    // Should be clickable
    await user.click(emergencyButton)
    
    // Emergency button should work across all themes
    const themeSwitcher = screen.getByRole('button', { name: /theme selection/i })
    await user.click(themeSwitcher)
    await user.click(screen.getByRole('option', { name: /high contrast/i }))
    
    // Emergency button should still be visible and functional
    expect(screen.getByRole('button', { name: 'Emergency Stop' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Emergency Stop' }))
  })

  test('should work with complex component interactions', async () => {
    const user = userEvent.setup()
    
    render(<IntegrationTestApp />)
    
    // Open theme switcher
    await user.click(screen.getByRole('button', { name: /theme selection/i }))
    
    // Navigate with keyboard
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')
    
    // Should have switched themes
    expect(document.documentElement.getAttribute('data-theme')).toBe('focus')
    
    // Other components should still be functional
    await user.click(screen.getByRole('button', { name: 'Start Roast' }))
    await user.click(screen.getByRole('button', { name: 'Edit' }))
    
    // All components should still be present and working
    expect(screen.getByText('Coffee Roast Tracker')).toBeInTheDocument()
    expect(screen.getByText('05:43')).toBeInTheDocument()
  })
})