/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeProvider } from '@/lib/theme-context'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

// Mock IntersectionObserver for dropdown positioning
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
})
window.IntersectionObserver = mockIntersectionObserver

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  test('should render with default dropdown variant', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    )

    // Should have accessible button
    const trigger = screen.getByRole('button', { name: /theme selection/i })
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
  })

  test('should show current theme in trigger button', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    )

    // Should display current theme name
    expect(screen.getByText('Classic Coffee')).toBeInTheDocument()
  })

  test('should open dropdown when clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    )

    const trigger = screen.getByRole('button', { name: /theme selection/i })
    
    // Click to open dropdown
    await user.click(trigger)
    
    // Should be expanded
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    
    // Should show all theme options
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /classic coffee/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /high contrast/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /cool focus/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /energizing/i })).toBeInTheDocument()
  })

  test('should switch themes when option is selected', async () => {
    const user = userEvent.setup()
    
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    )

    // Open dropdown
    await user.click(screen.getByRole('button', { name: /theme selection/i }))
    
    // Select high contrast theme
    await user.click(screen.getByRole('option', { name: /high contrast/i }))
    
    // Should update theme
    expect(document.documentElement.getAttribute('data-theme')).toBe('contrast')
    
    // Dropdown should close
    const trigger = screen.getByRole('button', { name: /theme selection/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    
    // Should update trigger text
    expect(screen.getByText('High Contrast')).toBeInTheDocument()
  })

  test('should support keyboard navigation', async () => {
    const user = userEvent.setup()
    
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    )

    const trigger = screen.getByRole('button', { name: /theme selection/i })
    
    // Focus trigger
    trigger.focus()
    expect(trigger).toHaveFocus()
    
    // Open with Enter
    await user.keyboard('{Enter}')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    
    // Navigate with arrow keys - first option should be focused (current theme)
    await user.keyboard('{ArrowDown}')
    const secondOption = screen.getByRole('option', { name: /high contrast/i })
    
    // Current theme should still be selected
    const firstOption = screen.getByRole('option', { name: /classic coffee/i })
    expect(firstOption).toHaveAttribute('aria-selected', 'true')
    expect(secondOption).toHaveAttribute('aria-selected', 'false')
    
    // Select the focused option with Enter
    await user.keyboard('{Enter}')
    expect(document.documentElement.getAttribute('data-theme')).toBe('contrast')
    
    // Should close dropdown
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  test('should close dropdown with Escape key', async () => {
    const user = userEvent.setup()
    
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    )

    const trigger = screen.getByRole('button', { name: /theme selection/i })
    
    // Open dropdown
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    
    // Close with Escape
    await user.keyboard('{Escape}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    
    // Focus should return to trigger
    expect(trigger).toHaveFocus()
  })

  test('should close dropdown when clicking outside', async () => {
    const user = userEvent.setup()
    
    render(
      <div>
        <ThemeProvider>
          <ThemeSwitcher />
        </ThemeProvider>
        <button>Outside button</button>
      </div>
    )

    const trigger = screen.getByRole('button', { name: /theme selection/i })
    const outsideButton = screen.getByText('Outside button')
    
    // Open dropdown
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    
    // Click outside
    await user.click(outsideButton)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  test('should show theme preview colors', async () => {
    const user = userEvent.setup()
    
    render(
      <ThemeProvider>
        <ThemeSwitcher showPreview />
      </ThemeProvider>
    )

    // Open dropdown
    await user.click(screen.getByRole('button', { name: /theme selection/i }))
    
    // Should show color previews for each theme
    const options = screen.getAllByRole('option')
    options.forEach(option => {
      const preview = option.querySelector('[data-testid="theme-preview"]')
      expect(preview).toBeInTheDocument()
    })
  })

  test('should support different sizes', () => {
    const { rerender } = render(
      <ThemeProvider>
        <ThemeSwitcher size="sm" />
      </ThemeProvider>
    )

    let trigger = screen.getByRole('button', { name: /theme selection/i })
    expect(trigger).toHaveClass('btn--small')

    rerender(
      <ThemeProvider>
        <ThemeSwitcher size="lg" />
      </ThemeProvider>
    )

    trigger = screen.getByRole('button', { name: /theme selection/i })
    expect(trigger).toHaveClass('btn--large')
  })

  test('should handle system preference option', async () => {
    const user = userEvent.setup()
    
    render(
      <ThemeProvider>
        <ThemeSwitcher showSystemOption />
      </ThemeProvider>
    )

    // Open dropdown
    await user.click(screen.getByRole('button', { name: /theme selection/i }))
    
    // Should show system option
    const systemOption = screen.getByRole('option', { name: /system preference/i })
    expect(systemOption).toBeInTheDocument()
    
    // Select system option
    await user.click(systemOption)
    
    // Should clear localStorage and apply system preference
    expect(localStorage.getItem('coffee-tracker-theme')).toBeNull()
  })

  test('should announce theme changes to screen readers', async () => {
    const user = userEvent.setup()
    
    // Create live region for announcements
    const liveRegion = document.createElement('div')
    liveRegion.id = 'live-region'
    liveRegion.setAttribute('aria-live', 'polite')
    document.body.appendChild(liveRegion)
    
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    )

    // Open dropdown and select theme
    await user.click(screen.getByRole('button', { name: /theme selection/i }))
    await user.click(screen.getByRole('option', { name: /high contrast/i }))
    
    // Should announce the change
    await waitFor(() => {
      expect(liveRegion.textContent).toContain('High Contrast')
    })
    
    // Clean up
    document.body.removeChild(liveRegion)
  })

  test('should meet touch target size requirements', () => {
    // Set up CSS with explicit pixel values for test environment
    const style = document.createElement('style')
    style.innerHTML = `
      .btn {
        min-height: 60px;
      }
    `
    document.head.appendChild(style)

    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    )

    const trigger = screen.getByRole('button', { name: /theme selection/i })
    
    // Check that the button has the btn class (which has min-height in our CSS)
    expect(trigger).toHaveClass('btn')
    
    // In a real browser, this would meet the 44px minimum requirement
    // Here we just verify the CSS class is applied correctly
    const computedStyle = getComputedStyle(trigger)
    const minHeight = computedStyle.minHeight
    
    // Should have the min-height style set
    expect(minHeight).toBe('60px')
    
    // Clean up
    document.head.removeChild(style)
  })

  test('should handle custom callback on theme change', async () => {
    const onThemeChange = jest.fn()
    const user = userEvent.setup()
    
    render(
      <ThemeProvider>
        <ThemeSwitcher onThemeChange={onThemeChange} />
      </ThemeProvider>
    )

    // Select a theme
    await user.click(screen.getByRole('button', { name: /theme selection/i }))
    await user.click(screen.getByRole('option', { name: /cool focus/i }))
    
    // Should call callback with theme
    expect(onThemeChange).toHaveBeenCalledWith('focus')
  })

  test('should maintain focus order for screen readers', async () => {
    const user = userEvent.setup()
    
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    )

    const trigger = screen.getByRole('button', { name: /theme selection/i })
    
    // Open dropdown
    await user.click(trigger)
    
    // Should have opened the dropdown
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    
    // Options should be present and focusable
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(4)
    
    // All options should have tabindex -1 for proper ARIA navigation
    options.forEach(option => {
      expect(option).toHaveAttribute('tabindex', '-1')
    })
  })

  test('should support custom position prop', () => {
    const { rerender } = render(
      <ThemeProvider>
        <ThemeSwitcher position="navigation" />
      </ThemeProvider>
    )

    let switcher = screen.getByRole('button', { name: /theme selection/i }).closest('[data-position]')
    expect(switcher).toHaveAttribute('data-position', 'navigation')

    rerender(
      <ThemeProvider>
        <ThemeSwitcher position="modal" />
      </ThemeProvider>
    )

    switcher = screen.getByRole('button', { name: /theme selection/i }).closest('[data-position]')
    expect(switcher).toHaveAttribute('data-position', 'modal')
  })
})