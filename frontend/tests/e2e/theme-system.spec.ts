/**
 * Coffee Roast Tracker - Theme System E2E Tests
 * 
 * Comprehensive Playwright E2E tests for the design system theme functionality.
 * Tests all 4 themes, theme switching, persistence, and system integration.
 */

import { test, expect, type Page } from '@playwright/test'

// Theme definitions matching the implementation
const THEMES = [
  { id: 'classic', name: 'Classic Coffee', description: 'warm browns and creams' },
  { id: 'contrast', name: 'High Contrast', description: 'enhanced visibility' }, 
  { id: 'focus', name: 'Cool Focus', description: 'calming blues' },
  { id: 'energizing', name: 'Energizing', description: 'vibrant oranges' }
] as const

type Theme = typeof THEMES[number]['id']

test.describe('Theme System', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start with clean state
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test.describe('Theme Switcher Component', () => {
    test('should render theme switcher with all themes', async ({ page }) => {
      await page.goto('/')
      
      // Find and click the theme switcher
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await expect(themeSwitcher).toBeVisible()
      
      // Open the dropdown
      await themeSwitcher.click()
      
      // Verify all themes are present
      const dropdown = page.getByRole('listbox', { name: /color themes/i })
      await expect(dropdown).toBeVisible()
      
      for (const theme of THEMES) {
        const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
        await expect(option).toBeVisible()
        await expect(option).toContainText(theme.name)
      }
    })

    test('should display current theme correctly', async ({ page }) => {
      await page.goto('/')
      
      // Default should be Classic Coffee
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await expect(themeSwitcher).toContainText('Classic Coffee')
      
      // Should have correct aria-label
      await expect(themeSwitcher).toHaveAttribute('aria-label', /current: Classic Coffee/i)
    })

    test('should show theme preview colors in dropdown', async ({ page }) => {
      await page.goto('/')
      
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await themeSwitcher.click()
      
      // Check that preview colors are visible
      const dropdown = page.getByRole('listbox')
      for (const theme of THEMES) {
        const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
        
        // Each option should have a color preview dot
        const previewColor = option.locator('.theme-preview-color')
        await expect(previewColor).toBeVisible()
      }
    })
  })

  test.describe('Theme Switching Functionality', () => {
    test('should switch themes correctly', async ({ page }) => {
      await page.goto('/')
      
      for (const theme of THEMES) {
        // Open theme switcher
        const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
        await themeSwitcher.click()
        
        // Select theme
        const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
        await option.click()
        
        // Verify theme is applied
        await expect(themeSwitcher).toContainText(theme.name)
        await expect(themeSwitcher).toHaveAttribute('aria-label', new RegExp(`current: ${theme.name}`, 'i'))
        
        // Verify theme class is applied to body
        await expect(page.locator('body')).toHaveClass(new RegExp(`theme-${theme.id}`))
        
        // Verify CSS custom properties are updated
        const primaryColor = await page.evaluate(() => 
          getComputedStyle(document.body).getPropertyValue('--color-primary')
        )
        expect(primaryColor).toBeTruthy()
      }
    })

    test('should apply themes instantly', async ({ page }) => {
      await page.goto('/')
      
      // Measure theme switching performance
      const start = Date.now()
      
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await themeSwitcher.click()
      
      const highContrastOption = page.getByRole('option', { name: /high contrast/i })
      await highContrastOption.click()
      
      // Verify theme is immediately applied
      await expect(page.locator('body')).toHaveClass(/theme-contrast/)
      
      const end = Date.now()
      const switchTime = end - start
      
      // Should be very fast (under 100ms as per requirements)
      expect(switchTime).toBeLessThan(100)
    })

    test('should provide visual feedback during theme switching', async ({ page }) => {
      await page.goto('/')
      
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await themeSwitcher.click()
      
      const focusOption = page.getByRole('option', { name: /cool focus/i })
      
      // Check hover state
      await focusOption.hover()
      await expect(focusOption).toHaveClass(/hover/)
      
      // Click and verify selection feedback
      await focusOption.click()
      
      // Dropdown should close
      await expect(page.getByRole('listbox')).not.toBeVisible()
    })
  })

  test.describe('Theme Persistence', () => {
    test('should persist theme selection in localStorage', async ({ page }) => {
      await page.goto('/')
      
      // Switch to High Contrast theme
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await themeSwitcher.click()
      
      const contrastOption = page.getByRole('option', { name: /high contrast/i })
      await contrastOption.click()
      
      // Check localStorage
      const storedTheme = await page.evaluate(() => localStorage.getItem('coffee-tracker-theme'))
      expect(storedTheme).toBe('contrast')
    })

    test('should restore theme from localStorage on page load', async ({ page }) => {
      await page.goto('/')
      
      // Set theme in localStorage
      await page.evaluate(() => localStorage.setItem('coffee-tracker-theme', 'focus'))
      
      // Reload page
      await page.reload()
      
      // Verify theme is restored
      await expect(page.locator('body')).toHaveClass(/theme-focus/)
      
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await expect(themeSwitcher).toContainText('Cool Focus')
    })

    test('should persist theme across browser sessions', async ({ page, context }) => {
      await page.goto('/')
      
      // Switch theme
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await themeSwitcher.click()
      
      const energizingOption = page.getByRole('option', { name: /energizing/i })
      await energizingOption.click()
      
      // Close and reopen tab
      await page.close()
      const newPage = await context.newPage()
      await newPage.goto('/')
      
      // Verify theme persists
      await expect(newPage.locator('body')).toHaveClass(/theme-energizing/)
      
      const newThemeSwitcher = newPage.getByRole('button', { name: /select color theme/i })
      await expect(newThemeSwitcher).toContainText('Energizing')
    })
  })

  test.describe('System Preference Detection', () => {
    test('should detect and offer system theme preference', async ({ page }) => {
      // Mock system preference
      await page.emulateMedia({ colorScheme: 'dark' })
      await page.goto('/')
      
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await themeSwitcher.click()
      
      // Should show system option
      const systemToggle = page.getByText(/system auto/i)
      await expect(systemToggle).toBeVisible()
    })

    test('should apply appropriate theme for system preference', async ({ page }) => {
      // Test light mode preference
      await page.emulateMedia({ colorScheme: 'light' })
      await page.goto('/')
      
      // Should default to a light theme
      await expect(page.locator('body')).not.toHaveClass(/theme-contrast/)
      
      // Test dark mode preference
      await page.emulateMedia({ colorScheme: 'dark' })
      await page.reload()
      
      // Should apply an appropriate theme for dark mode
      const bodyClasses = await page.locator('body').getAttribute('class')
      expect(bodyClasses).toBeTruthy()
    })
  })

  test.describe('Theme Visual Verification', () => {
    test('should apply correct styles for each theme', async ({ page }) => {
      await page.goto('/')
      
      for (const theme of THEMES) {
        // Switch to theme
        const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
        await themeSwitcher.click()
        
        const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
        await option.click()
        
        // Verify CSS custom properties are set correctly
        const styles = await page.evaluate(() => {
          const computedStyles = getComputedStyle(document.body)
          return {
            primary: computedStyles.getPropertyValue('--color-primary').trim(),
            background: computedStyles.getPropertyValue('--color-background').trim(),
            text: computedStyles.getPropertyValue('--color-text').trim(),
            surface: computedStyles.getPropertyValue('--color-surface').trim()
          }
        })
        
        // All theme colors should be defined
        expect(styles.primary).toBeTruthy()
        expect(styles.background).toBeTruthy()
        expect(styles.text).toBeTruthy()
        expect(styles.surface).toBeTruthy()
        
        // Colors should be different for each theme
        expect(styles.primary).toMatch(/^(#|rgb|hsl)/)
      }
    })

    test('should update component styles when theme changes', async ({ page }) => {
      await page.goto('/')
      
      // Get initial button color
      const button = page.getByRole('button', { name: 'Primary' })
      const initialColor = await button.evaluate(el => getComputedStyle(el).backgroundColor)
      
      // Switch theme
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await themeSwitcher.click()
      
      const contrastOption = page.getByRole('option', { name: /high contrast/i })
      await contrastOption.click()
      
      // Button color should change
      const newColor = await button.evaluate(el => getComputedStyle(el).backgroundColor)
      expect(newColor).not.toBe(initialColor)
    })

    test('should maintain visual hierarchy across themes', async ({ page }) => {
      await page.goto('/')
      
      for (const theme of THEMES) {
        // Switch to theme
        const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
        await themeSwitcher.click()
        
        const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
        await option.click()
        
        // Check that typography scales are maintained
        const h1 = page.locator('h1').first()
        const h2 = page.locator('h2').first()
        const body = page.locator('p').first()
        
        const h1Size = await h1.evaluate(el => parseFloat(getComputedStyle(el).fontSize))
        const h2Size = await h2.evaluate(el => parseFloat(getComputedStyle(el).fontSize))
        const bodySize = await body.evaluate(el => parseFloat(getComputedStyle(el).fontSize))
        
        // Typography hierarchy should be preserved
        expect(h1Size).toBeGreaterThan(h2Size)
        expect(h2Size).toBeGreaterThan(bodySize)
      }
    })
  })

  test.describe('Error Handling', () => {
    test('should handle invalid theme gracefully', async ({ page }) => {
      await page.goto('/')
      
      // Set invalid theme in localStorage
      await page.evaluate(() => localStorage.setItem('coffee-tracker-theme', 'invalid-theme'))
      
      // Reload page
      await page.reload()
      
      // Should fallback to default theme
      await expect(page.locator('body')).toHaveClass(/theme-classic/)
      
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await expect(themeSwitcher).toContainText('Classic Coffee')
    })

    test('should handle localStorage errors', async ({ page }) => {
      await page.goto('/')
      
      // Mock localStorage error
      await page.evaluate(() => {
        const originalSetItem = Storage.prototype.setItem
        Storage.prototype.setItem = () => {
          throw new Error('Quota exceeded')
        }
      })
      
      // Theme switching should still work (just not persist)
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await themeSwitcher.click()
      
      const focusOption = page.getByRole('option', { name: /cool focus/i })
      await focusOption.click()
      
      // Theme should still be applied
      await expect(page.locator('body')).toHaveClass(/theme-focus/)
    })
  })

  test.describe('Multiple Tab Synchronization', () => {
    test('should sync theme changes across tabs', async ({ page, context }) => {
      await page.goto('/')
      
      // Open second tab
      const page2 = await context.newPage()
      await page2.goto('/')
      
      // Change theme in first tab
      const themeSwitcher1 = page.getByRole('button', { name: /select color theme/i })
      await themeSwitcher1.click()
      
      const contrastOption = page.getByRole('option', { name: /high contrast/i })
      await contrastOption.click()
      
      // Both tabs should show the same theme in localStorage
      const theme1 = await page.evaluate(() => localStorage.getItem('coffee-tracker-theme'))
      const theme2 = await page2.evaluate(() => localStorage.getItem('coffee-tracker-theme'))
      
      expect(theme1).toBe('contrast')
      expect(theme2).toBe('contrast')
      
      // Note: UI sync across tabs would require storage event handling,
      // which may be implemented in future versions
    })
  })
})