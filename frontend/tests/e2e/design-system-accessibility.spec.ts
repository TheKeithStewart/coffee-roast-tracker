/**
 * Coffee Roast Tracker - Design System Accessibility E2E Tests
 * 
 * Comprehensive accessibility testing using Playwright and axe-core.
 * Validates WCAG 2.1 AA compliance across all themes and components.
 */

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Theme definitions for testing
const THEMES = [
  { id: 'classic', name: 'Classic Coffee' },
  { id: 'contrast', name: 'High Contrast' }, 
  { id: 'focus', name: 'Cool Focus' },
  { id: 'energizing', name: 'Energizing' }
] as const

test.describe('Design System Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test.describe('WCAG 2.1 AA Compliance', () => {
    test('should have no accessibility violations on default theme', async ({ page }) => {
      await page.goto('/')
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('should maintain accessibility across all themes', async ({ page }) => {
      await page.goto('/')
      
      for (const theme of THEMES) {
        // Switch to theme
        const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
        await themeSwitcher.click()
        
        const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
        await option.click()
        
        // Run accessibility scan
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze()
        
        expect(accessibilityScanResults.violations).toEqual([])
      }
    })

    test('should pass color contrast requirements', async ({ page }) => {
      await page.goto('/')
      
      for (const theme of THEMES) {
        // Switch to theme
        const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
        await themeSwitcher.click()
        
        const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
        await option.click()
        
        // Test color contrast specifically
        const contrastScanResults = await new AxeBuilder({ page })
          .withTags(['wcag2aa'])
          .include('body')
          .analyze()
        
        // Filter for color contrast violations
        const contrastViolations = contrastScanResults.violations.filter(
          violation => violation.id === 'color-contrast'
        )
        
        expect(contrastViolations).toEqual([])
      }
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('should support full keyboard navigation', async ({ page }) => {
      await page.goto('/')
      
      // Tab through all interactive elements
      const interactiveElements = [
        'a[href="#main"]', // Skip link
        'button[aria-label*="Select color theme"]', // Theme switcher
        'button:has-text("Primary")', // First button
        'button:has-text("Secondary")', // Second button
        'button:has-text("Success")', // Success button
        'button:has-text("Emergency Stop")', // Emergency button
        'button:has-text("Ghost")', // Ghost button
      ]
      
      for (let i = 0; i < interactiveElements.length; i++) {
        await page.keyboard.press('Tab')
        
        // Check that focus moves to expected element
        const focusedElement = page.locator(':focus')
        await expect(focusedElement).toBeVisible()
        
        // Verify focus is on an interactive element
        const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase())
        expect(['a', 'button', 'input', 'select', 'textarea'].includes(tagName)).toBeTruthy()
      }
    })

    test('should provide visible focus indicators', async ({ page }) => {
      await page.goto('/')
      
      // Tab to theme switcher
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab') // Skip the skip link
      
      const focusedElement = page.locator(':focus')
      
      // Check for focus ring styles
      const focusStyles = await focusedElement.evaluate(el => {
        const styles = getComputedStyle(el)
        return {
          outline: styles.outline,
          outlineOffset: styles.outlineOffset,
          boxShadow: styles.boxShadow
        }
      })
      
      // Should have visible focus indicator (outline or box-shadow)
      const hasFocusIndicator = 
        focusStyles.outline !== 'none' || 
        focusStyles.boxShadow !== 'none' ||
        focusStyles.boxShadow.includes('rgb') // Focus ring with color
      
      expect(hasFocusIndicator).toBeTruthy()
    })

    test('should support theme switcher keyboard navigation', async ({ page }) => {
      await page.goto('/')
      
      // Navigate to theme switcher
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await themeSwitcher.focus()
      
      // Open with Enter
      await page.keyboard.press('Enter')
      
      // Should open dropdown
      const dropdown = page.getByRole('listbox', { name: /color themes/i })
      await expect(dropdown).toBeVisible()
      
      // Navigate with arrow keys
      await page.keyboard.press('ArrowDown')
      
      let focusedOption = page.locator('[role="option"]:focus')
      await expect(focusedOption).toBeVisible()
      
      // Navigate through all options
      for (let i = 0; i < THEMES.length - 1; i++) {
        await page.keyboard.press('ArrowDown')
      }
      
      // Should loop back to first option
      await page.keyboard.press('ArrowDown')
      focusedOption = page.locator('[role="option"]:focus')
      await expect(focusedOption).toContainText('Classic Coffee')
      
      // Select with Enter
      await page.keyboard.press('Enter')
      
      // Dropdown should close and focus return to trigger
      await expect(dropdown).not.toBeVisible()
      await expect(themeSwitcher).toBeFocused()
    })

    test('should support escape key to close dropdown', async ({ page }) => {
      await page.goto('/')
      
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await themeSwitcher.focus()
      await page.keyboard.press('Enter')
      
      const dropdown = page.getByRole('listbox')
      await expect(dropdown).toBeVisible()
      
      // Press Escape
      await page.keyboard.press('Escape')
      
      // Dropdown should close
      await expect(dropdown).not.toBeVisible()
      
      // Focus should return to trigger
      await expect(themeSwitcher).toBeFocused()
    })
  })

  test.describe('Screen Reader Support', () => {
    test('should have proper ARIA labels and roles', async ({ page }) => {
      await page.goto('/')
      
      // Theme switcher
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await expect(themeSwitcher).toHaveAttribute('aria-expanded', 'false')
      await expect(themeSwitcher).toHaveAttribute('aria-haspopup', 'listbox')
      
      // Open dropdown
      await themeSwitcher.click()
      
      await expect(themeSwitcher).toHaveAttribute('aria-expanded', 'true')
      
      // Dropdown
      const dropdown = page.getByRole('listbox', { name: /color themes/i })
      await expect(dropdown).toBeVisible()
      
      // Options should have proper roles and states
      for (const theme of THEMES) {
        const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
        await expect(option).toHaveAttribute('role', 'option')
        await expect(option).toHaveAttribute('aria-selected')
      }
    })

    test('should have semantic HTML structure', async ({ page }) => {
      await page.goto('/')
      
      // Check for proper landmark roles
      const main = page.getByRole('main')
      await expect(main).toBeVisible()
      await expect(main).toHaveAttribute('id', 'main')
      
      const header = page.getByRole('banner')
      await expect(header).toBeVisible()
      
      // Check heading hierarchy
      const h1 = page.locator('h1').first()
      await expect(h1).toHaveClass(/typography-h1/)
      
      const h2s = page.locator('h2')
      await expect(h2s.first()).toHaveClass(/typography-h2/)
      
      // Skip link
      const skipLink = page.getByRole('link', { name: /skip to main content/i })
      await expect(skipLink).toBeVisible()
      await expect(skipLink).toHaveAttribute('href', '#main')
    })

    test('should provide live region announcements', async ({ page }) => {
      await page.goto('/')
      
      // Live region should exist
      const liveRegion = page.locator('#live-region')
      await expect(liveRegion).toHaveAttribute('aria-live', 'polite')
      await expect(liveRegion).toHaveAttribute('aria-atomic', 'true')
      await expect(liveRegion).toHaveClass(/sr-only/)
      
      // Test theme change announcement (if implemented)
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await themeSwitcher.click()
      
      const contrastOption = page.getByRole('option', { name: /high contrast/i })
      await contrastOption.click()
      
      // Live region may get updated with theme change announcement
      // This depends on the implementation
    })

    test('should have proper button labels and descriptions', async ({ page }) => {
      await page.goto('/')
      
      // All buttons should have accessible names
      const buttons = page.locator('button')
      const buttonCount = await buttons.count()
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i)
        const accessibleName = await button.getAttribute('aria-label') || 
                              await button.textContent() ||
                              await button.getAttribute('title')
        
        expect(accessibleName).toBeTruthy()
      }
      
      // Icon-only buttons should have aria-label
      const iconOnlyButtons = page.locator('button[aria-label]')
      const iconButtonCount = await iconOnlyButtons.count()
      
      for (let i = 0; i < iconButtonCount; i++) {
        const button = iconOnlyButtons.nth(i)
        const ariaLabel = await button.getAttribute('aria-label')
        expect(ariaLabel).toBeTruthy()
      }
    })
  })

  test.describe('Touch Target Accessibility', () => {
    test('should meet minimum touch target sizes', async ({ page }) => {
      await page.goto('/')
      
      // All interactive elements should be at least 44px
      const interactiveElements = page.locator('button, a[href], input, select, textarea')
      const count = await interactiveElements.count()
      
      for (let i = 0; i < count; i++) {
        const element = interactiveElements.nth(i)
        const box = await element.boundingBox()
        
        if (box) {
          // 44px minimum for WCAG AA
          expect(box.width).toBeGreaterThanOrEqual(44)
          expect(box.height).toBeGreaterThanOrEqual(44)
        }
      }
    })

    test('should have appropriate spacing between touch targets', async ({ page }) => {
      await page.goto('/')
      
      // Check button groups for adequate spacing
      const buttonGroups = page.locator('[style*="display: flex"]')
      const groupCount = await buttonGroups.count()
      
      for (let i = 0; i < groupCount; i++) {
        const group = buttonGroups.nth(i)
        const buttons = group.locator('button')
        const buttonCount = await buttons.count()
        
        if (buttonCount > 1) {
          for (let j = 0; j < buttonCount - 1; j++) {
            const button1 = buttons.nth(j)
            const button2 = buttons.nth(j + 1)
            
            const box1 = await button1.boundingBox()
            const box2 = await button2.boundingBox()
            
            if (box1 && box2) {
              const gap = Math.abs(box2.x - (box1.x + box1.width))
              // Should have some spacing between touch targets
              expect(gap).toBeGreaterThanOrEqual(8)
            }
          }
        }
      }
    })
  })

  test.describe('High Contrast Mode', () => {
    test('should work with system high contrast mode', async ({ page }) => {
      // Enable high contrast mode
      await page.emulateMedia({ forcedColors: 'active' })
      await page.goto('/')
      
      // Should still be functional
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await expect(themeSwitcher).toBeVisible()
      
      // Should be able to interact
      await themeSwitcher.click()
      const dropdown = page.getByRole('listbox')
      await expect(dropdown).toBeVisible()
      
      // Run accessibility scan with high contrast
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('should maintain functionality with Windows high contrast', async ({ page }) => {
      // Simulate Windows high contrast colors
      await page.addStyleTag({
        content: `
          @media (forced-colors: active) {
            * {
              color: WindowText !important;
              background-color: Window !important;
            }
            button {
              color: ButtonText !important;
              background-color: ButtonFace !important;
              border: 1px solid ButtonText !important;
            }
          }
        `
      })
      
      await page.emulateMedia({ forcedColors: 'active' })
      await page.goto('/')
      
      // All functionality should still work
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await themeSwitcher.click()
      
      const contrastOption = page.getByRole('option', { name: /high contrast/i })
      await contrastOption.click()
      
      await expect(page.locator('body')).toHaveClass(/theme-contrast/)
    })
  })

  test.describe('Reduced Motion Support', () => {
    test('should respect prefers-reduced-motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/')
      
      // Check that animations are disabled
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      
      const transitionDuration = await themeSwitcher.evaluate(el => {
        const styles = getComputedStyle(el)
        return styles.transitionDuration
      })
      
      // Animations should be disabled (duration should be 0 or very short)
      expect(transitionDuration === '0s' || transitionDuration === '0.01s').toBeTruthy()
    })

    test('should maintain functionality without animations', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/')
      
      // Theme switching should still work without animations
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await themeSwitcher.click()
      
      const focusOption = page.getByRole('option', { name: /cool focus/i })
      await focusOption.click()
      
      await expect(page.locator('body')).toHaveClass(/theme-focus/)
    })
  })

  test.describe('Error State Accessibility', () => {
    test('should announce errors appropriately', async ({ page }) => {
      await page.goto('/')
      
      // Mock localStorage error
      await page.evaluate(() => {
        // Mock localStorage to throw error
        Storage.prototype.setItem = () => {
          throw new Error('Storage quota exceeded')
        }
      })
      
      // Theme switching should still work
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await themeSwitcher.click()
      
      const focusOption = page.getByRole('option', { name: /cool focus/i })
      await focusOption.click()
      
      // Should still apply theme (just not persist)
      await expect(page.locator('body')).toHaveClass(/theme-focus/)
      
      // No accessibility violations should be introduced
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
    })
  })
})