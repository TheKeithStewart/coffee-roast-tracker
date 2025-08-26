/**
 * Coffee Roast Tracker - Theme Switching Validation E2E Tests
 * 
 * Focused validation tests for theme switching functionality using keyboard navigation
 * to avoid click interception issues during testing.
 */

import { test, expect } from '@playwright/test'

// Theme definitions matching the implementation
const THEMES = [
  { id: 'classic', name: 'Classic Coffee' },
  { id: 'contrast', name: 'High Contrast' }, 
  { id: 'focus', name: 'Cool Focus' },
  { id: 'energizing', name: 'Energizing' }
] as const

test.describe('Theme Switching Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('should successfully switch between all themes using keyboard navigation', async ({ page }) => {
    // Start with default theme
    const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
    await expect(themeSwitcher).toContainText('Classic Coffee')
    
    // Test switching to each theme using keyboard navigation
    for (let i = 1; i < THEMES.length; i++) {
      const theme = THEMES[i]
      
      // Open theme switcher
      await themeSwitcher.focus()
      await page.keyboard.press('Enter')
      
      // Navigate to target theme (i arrow down presses from current position)
      for (let j = 0; j < i; j++) {
        await page.keyboard.press('ArrowDown')
      }
      
      // Select theme
      await page.keyboard.press('Enter')
      
      // Verify theme is applied
      await expect(themeSwitcher).toContainText(theme.name)
      
      // Verify CSS class is applied to body
      await expect(page.locator('body')).toHaveClass(new RegExp(`theme-${theme.id}`))
      
      console.log(`✅ Successfully switched to ${theme.name}`)
    }
  })

  test('should persist theme selection in localStorage', async ({ page }) => {
    const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
    
    // Switch to High Contrast theme
    await themeSwitcher.focus()
    await page.keyboard.press('Enter')
    await page.keyboard.press('ArrowDown') // Move to High Contrast
    await page.keyboard.press('Enter')
    
    // Check localStorage
    const storedTheme = await page.evaluate(() => localStorage.getItem('coffee-tracker-theme'))
    expect(storedTheme).toBe('contrast')
    
    console.log(`✅ Theme persisted in localStorage: ${storedTheme}`)
  })

  test('should restore theme from localStorage on page reload', async ({ page }) => {
    // Set theme in localStorage
    await page.evaluate(() => localStorage.setItem('coffee-tracker-theme', 'focus'))
    
    // Reload page
    await page.reload()
    
    // Verify theme is restored
    await expect(page.locator('body')).toHaveClass(/theme-focus/)
    
    const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
    await expect(themeSwitcher).toContainText('Cool Focus')
    
    console.log('✅ Theme restored from localStorage on page reload')
  })

  test('should update CSS custom properties when switching themes', async ({ page }) => {
    const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
    
    // Get initial CSS variables
    const initialColors = await page.evaluate(() => {
      const styles = getComputedStyle(document.body)
      return {
        primary: styles.getPropertyValue('--color-primary').trim(),
        background: styles.getPropertyValue('--color-background').trim(),
        text: styles.getPropertyValue('--color-text').trim()
      }
    })
    
    // Switch to High Contrast theme
    await themeSwitcher.focus()
    await page.keyboard.press('Enter')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    
    // Get new CSS variables
    const newColors = await page.evaluate(() => {
      const styles = getComputedStyle(document.body)
      return {
        primary: styles.getPropertyValue('--color-primary').trim(),
        background: styles.getPropertyValue('--color-background').trim(),
        text: styles.getPropertyValue('--color-text').trim()
      }
    })
    
    // At least one color should have changed
    const changed = 
      newColors.primary !== initialColors.primary ||
      newColors.background !== initialColors.background ||
      newColors.text !== initialColors.text
    
    expect(changed).toBeTruthy()
    
    console.log('✅ CSS custom properties updated when switching themes')
    console.log('Initial colors:', initialColors)
    console.log('New colors:', newColors)
  })

  test('should maintain theme switching performance under 100ms', async ({ page }) => {
    const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
    
    // Pre-focus and open dropdown
    await themeSwitcher.focus()
    await page.keyboard.press('Enter')
    await page.keyboard.press('ArrowDown') // Move to High Contrast
    
    // Measure theme switching time
    const start = Date.now()
    await page.keyboard.press('Enter')
    
    // Wait for theme to be applied
    await expect(page.locator('body')).toHaveClass(/theme-contrast/)
    const end = Date.now()
    
    const switchTime = end - start
    console.log(`⚡ Theme switch time: ${switchTime}ms`)
    
    // Should be very fast (under 100ms as per requirements)
    expect(switchTime).toBeLessThan(100)
  })

  test('should handle keyboard navigation correctly', async ({ page }) => {
    const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
    
    // Focus and open dropdown
    await themeSwitcher.focus()
    await page.keyboard.press('Enter')
    
    // Verify dropdown is open
    const dropdown = page.getByRole('listbox', { name: /color themes/i })
    await expect(dropdown).toBeVisible()
    
    // Navigate through options with arrow keys
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    
    // Select current option (should be Energizing)
    await page.keyboard.press('Enter')
    
    // Verify theme switched
    await expect(themeSwitcher).toContainText('Energizing')
    
    console.log('✅ Keyboard navigation works correctly')
  })

  test('should close dropdown on Escape key', async ({ page }) => {
    const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
    
    // Open dropdown
    await themeSwitcher.focus()
    await page.keyboard.press('Enter')
    
    const dropdown = page.getByRole('listbox', { name: /color themes/i })
    await expect(dropdown).toBeVisible()
    
    // Press Escape
    await page.keyboard.press('Escape')
    
    // Dropdown should close
    await expect(dropdown).not.toBeVisible()
    
    // Focus should return to trigger
    await expect(themeSwitcher).toBeFocused()
    
    console.log('✅ Escape key closes dropdown correctly')
  })

  test('should show all expected theme options', async ({ page }) => {
    const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
    
    // Open dropdown
    await themeSwitcher.click()
    
    const dropdown = page.getByRole('listbox', { name: /color themes/i })
    await expect(dropdown).toBeVisible()
    
    // Verify all themes are present
    for (const theme of THEMES) {
      const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
      await expect(option).toBeVisible()
    }
    
    // Verify system preference option is present
    const systemOption = page.getByRole('option', { name: /system preference/i })
    await expect(systemOption).toBeVisible()
    
    console.log('✅ All expected theme options are visible')
  })

  test('should update component styles when theme changes', async ({ page }) => {
    // Get initial button color
    const primaryButton = page.getByRole('button', { name: 'Primary' })
    const initialColor = await primaryButton.evaluate(el => getComputedStyle(el).backgroundColor)
    
    // Switch theme using keyboard
    const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
    await themeSwitcher.focus()
    await page.keyboard.press('Enter')
    await page.keyboard.press('ArrowDown') // High Contrast
    await page.keyboard.press('Enter')
    
    // Button color should change
    const newColor = await primaryButton.evaluate(el => getComputedStyle(el).backgroundColor)
    expect(newColor).not.toBe(initialColor)
    
    console.log('✅ Component styles update when theme changes')
    console.log(`Initial color: ${initialColor}`)
    console.log(`New color: ${newColor}`)
  })
})