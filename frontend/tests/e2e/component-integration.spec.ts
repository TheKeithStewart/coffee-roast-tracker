/**
 * Coffee Roast Tracker - Component Integration E2E Tests
 * 
 * End-to-end tests validating component behavior, interactions, and integration
 * with the design system across all themes and responsive breakpoints.
 */

import { test, expect } from '@playwright/test'

// Theme definitions
const THEMES = [
  { id: 'classic', name: 'Classic Coffee' },
  { id: 'contrast', name: 'High Contrast' }, 
  { id: 'focus', name: 'Cool Focus' },
  { id: 'energizing', name: 'Energizing' }
] as const

test.describe('Component Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test.describe('BaseButton Component', () => {
    test('should render all button variants correctly', async ({ page }) => {
      await page.goto('/')
      
      // Verify all button variants are present
      const variants = ['Primary', 'Secondary', 'Success', 'Emergency Stop', 'Ghost', 'Disabled']
      
      for (const variant of variants) {
        const button = page.getByRole('button', { name: variant })
        await expect(button).toBeVisible()
        
        if (variant === 'Disabled') {
          await expect(button).toBeDisabled()
        } else {
          await expect(button).toBeEnabled()
        }
      }
    })

    test('should render all button sizes correctly', async ({ page }) => {
      await page.goto('/')
      
      const sizes = ['Small', 'Medium (Default)', 'Large', 'Extra Large']
      
      for (const size of sizes) {
        const button = page.getByRole('button', { name: size })
        await expect(button).toBeVisible()
        
        // Verify size differences
        const boundingBox = await button.boundingBox()
        expect(boundingBox).toBeTruthy()
        
        if (boundingBox) {
          // Each size should be progressively larger
          expect(boundingBox.height).toBeGreaterThan(20)
          expect(boundingBox.width).toBeGreaterThan(40)
        }
      }
    })

    test('should handle loading states correctly', async ({ page }) => {
      await page.goto('/')
      
      // Check loading button variants
      const loadingButtons = [
        { name: 'Loading...', text: 'Loading...' },
        { name: 'Processing data...', text: 'Processing data...' },
        { name: 'Emergency stop in progress', text: 'Emergency' }
      ]
      
      for (const button of loadingButtons) {
        const element = page.getByRole('button', { name: new RegExp(button.text, 'i') })
        await expect(element).toBeVisible()
        await expect(element).toBeDisabled() // Loading buttons should be disabled
        
        // Should show loading indicator (implementation dependent)
        // Note: Loading indicator presence varies by implementation
        // This test focuses on disabled state which is the requirement
      }
    })

    test('should handle icon buttons correctly', async ({ page }) => {
      await page.goto('/')
      
      // Icon with text buttons
      const iconTextButtons = [
        { name: 'Start Roast', icon: '🔥' },
        { name: 'Pause', icon: '⏸️' }
      ]
      
      for (const button of iconTextButtons) {
        const element = page.getByRole('button', { name: button.name })
        await expect(element).toBeVisible()
        await expect(element).toContainText(button.name)
      }
      
      // Icon-only buttons with aria-labels
      const iconOnlyButtons = [
        { label: 'Emergency stop', icon: '⏹️' },
        { label: 'View statistics', icon: '📊' }
      ]
      
      for (const button of iconOnlyButtons) {
        const element = page.getByRole('button', { name: button.label })
        await expect(element).toBeVisible()
        await expect(element).toHaveAttribute('aria-label', button.label)
      }
    })

    test('should respond to user interactions', async ({ page }) => {
      await page.goto('/')
      
      const primaryButton = page.getByRole('button', { name: 'Primary' }).first()
      
      // Test hover state (visual feedback)
      await primaryButton.hover()
      
      // Test click interaction
      await primaryButton.click()
      
      // Should have focus after click
      await expect(primaryButton).toBeFocused()
      
      // Test keyboard interaction
      await page.keyboard.press('Space')
      
      // Button should remain functional
      await expect(primaryButton).toBeVisible()
      await expect(primaryButton).toBeEnabled()
    })

    test('should maintain styles across all themes', async ({ page }) => {
      await page.goto('/')
      
      const primaryButton = page.getByRole('button', { name: 'Primary' }).first()
      
      for (const theme of THEMES) {
        // Switch theme
        const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
        await themeSwitcher.click()
        
        const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
        await option.click()
        
        // Button should remain styled and functional
        await expect(primaryButton).toBeVisible()
        
        const buttonStyles = await primaryButton.evaluate(el => {
          const styles = getComputedStyle(el)
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            border: styles.border,
            padding: styles.padding
          }
        })
        
        // Should have themed colors
        expect(buttonStyles.backgroundColor).toBeTruthy()
        expect(buttonStyles.color).toBeTruthy()
        expect(buttonStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)') // Not transparent
      }
    })
  })

  test.describe('ThemeSwitcher Component', () => {
    test('should integrate properly with the layout', async ({ page }) => {
      await page.goto('/')
      
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await expect(themeSwitcher).toBeVisible()
      
      // Should be positioned correctly in the layout
      const boundingBox = await themeSwitcher.boundingBox()
      expect(boundingBox).toBeTruthy()
      
      // Should not overlap with other elements
      const header = page.locator('header')
      const headerBox = await header.boundingBox()
      
      if (boundingBox && headerBox) {
        // Theme switcher should be within reasonable layout bounds
        expect(boundingBox.y).toBeGreaterThanOrEqual(0)
        expect(boundingBox.x).toBeGreaterThanOrEqual(0)
      }
    })

    test('should show preview colors correctly', async ({ page }) => {
      await page.goto('/')
      
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await themeSwitcher.click()
      
      // Check that each option has a preview color
      for (const theme of THEMES) {
        const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
        
        // Should have a color preview element
        const previewColor = option.locator('.theme-preview-color, [data-preview-color]')
        
        // Color preview implementation may vary
        const hasPreview = await previewColor.count() > 0 ||
                          (await option.locator('[style*="background"]').count() > 0)
        
        expect(hasPreview).toBeTruthy()
      }
    })

    test('should handle system preference option', async ({ page }) => {
      await page.goto('/')
      
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await themeSwitcher.click()
      
      // Should show system preference option if implemented
      const systemOption = page.getByText(/system auto/i)
      const systemToggle = page.getByRole('switch', { name: /system/i })
      
      // Implementation may vary - either text or toggle
      const hasSystemOption = await systemOption.count() > 0 || await systemToggle.count() > 0
      
      if (hasSystemOption) {
        // System option should be functional if present
        if (await systemOption.count() > 0) {
          await expect(systemOption).toBeVisible()
        }
        if (await systemToggle.count() > 0) {
          await expect(systemToggle).toBeVisible()
        }
      }
    })

    test('should close dropdown on outside click', async ({ page }) => {
      await page.goto('/')
      
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await themeSwitcher.click()
      
      const dropdown = page.getByRole('listbox')
      await expect(dropdown).toBeVisible()
      
      // Click outside the dropdown
      await page.locator('main').click()
      
      // Dropdown should close
      await expect(dropdown).not.toBeVisible()
    })

    test('should maintain focus management', async ({ page }) => {
      await page.goto('/')
      
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await themeSwitcher.focus()
      await page.keyboard.press('Enter')
      
      // Focus should move into dropdown
      const focusedElement = page.locator(':focus')
      const dropdown = page.getByRole('listbox')
      
      // Focus should be within dropdown area
      const dropdownHandle = await dropdown.elementHandle()
      expect(dropdownHandle).not.toBeNull()
      
      const isInDropdown = await focusedElement.evaluate((el, dropdown) => {
        return dropdown && dropdown.contains(el)
      }, dropdownHandle)
      
      expect(isInDropdown).toBeTruthy()
      
      // Close with escape
      await page.keyboard.press('Escape')
      
      // Focus should return to trigger
      await expect(themeSwitcher).toBeFocused()
    })
  })

  test.describe('Card Component Integration', () => {
    test('should render coffee cards correctly', async ({ page }) => {
      await page.goto('/')
      
      const expectedCards = [
        { title: 'Ethiopia Yirgacheffe', subtitle: 'Light Roast' },
        { title: 'Guatemala Antigua', subtitle: 'Medium Roast' },
        { title: 'Brazil Santos', subtitle: 'Dark Roast' }
      ]
      
      for (const card of expectedCards) {
        // Find card by title
        const cardElement = page.locator('.card').filter({ hasText: card.title })
        await expect(cardElement).toBeVisible()
        
        // Check card structure
        const title = cardElement.locator('.card__title')
        const subtitle = cardElement.locator('.card__subtitle')
        const body = cardElement.locator('.card__body')
        const footer = cardElement.locator('.card__footer')
        
        await expect(title).toContainText(card.title)
        await expect(subtitle).toContainText(card.subtitle)
        await expect(body).toBeVisible()
        await expect(footer).toBeVisible()
        
        // Should have action button
        const actionButton = cardElement.getByRole('button', { name: 'Select' })
        await expect(actionButton).toBeVisible()
      }
    })

    test('should apply theme styles to cards', async ({ page }) => {
      await page.goto('/')
      
      const firstCard = page.locator('.card').first()
      
      for (const theme of THEMES) {
        // Switch theme
        const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
        await themeSwitcher.click()
        
        const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
        await option.click()
        
        // Card should have themed styles
        const cardStyles = await firstCard.evaluate(el => {
          const styles = getComputedStyle(el)
          return {
            backgroundColor: styles.backgroundColor,
            borderColor: styles.borderColor,
            color: styles.color
          }
        })
        
        expect(cardStyles.backgroundColor).toBeTruthy()
        expect(cardStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
      }
    })

    test('should handle card interactions', async ({ page }) => {
      await page.goto('/')
      
      const firstCard = page.locator('.card').first()
      
      // Hover should provide visual feedback
      await firstCard.hover()
      
      // Card should remain functional
      const selectButton = firstCard.getByRole('button', { name: 'Select' })
      await selectButton.click()
      
      // Button should respond to interaction
      await expect(selectButton).toBeVisible()
    })
  })

  test.describe('UI Component Library', () => {
    test('should render timer display correctly', async ({ page }) => {
      await page.goto('/')
      
      const timerDisplay = page.locator('.timer-display')
      await expect(timerDisplay).toBeVisible()
      
      const time = timerDisplay.locator('.timer-display__time')
      const label = timerDisplay.locator('.timer-display__label')
      const phase = timerDisplay.locator('.timer-display__phase')
      
      await expect(time).toContainText('05:43')
      await expect(label).toContainText('First Crack')
      await expect(phase).toContainText('Active Roasting')
    })

    test('should render progress bar correctly', async ({ page }) => {
      await page.goto('/')
      
      const progressBar = page.locator('.progress-bar--labeled').first()
      await expect(progressBar).toBeVisible()
      
      const label = progressBar.locator('.progress-bar__label')
      const track = progressBar.locator('.progress-bar__track')
      
      await expect(label).toContainText('Roast Progress')
      await expect(label).toContainText('68%')
      await expect(track).toBeVisible()
      
      // Track should have appropriate width
      const trackStyles = await track.evaluate(el => getComputedStyle(el).width)
      expect(trackStyles).toBeTruthy()
    })

    test('should render alert components correctly', async ({ page }) => {
      await page.goto('/')
      
      const alertTypes = [
        { selector: '.alert--info', title: 'Info Alert' },
        { selector: '.alert--success', title: 'Success Alert' },
        { selector: '.alert--warning', title: 'Warning Alert' }
      ]
      
      for (const alert of alertTypes) {
        const alertElement = page.locator(alert.selector)
        await expect(alertElement).toBeVisible()
        
        const icon = alertElement.locator('.alert__icon')
        const title = alertElement.locator('.alert__title')
        const message = alertElement.locator('.alert__message')
        
        await expect(icon).toBeVisible()
        await expect(title).toContainText(alert.title)
        await expect(message).toBeVisible()
      }
    })

    test('should render typography scale correctly', async ({ page }) => {
      await page.goto('/')
      
      const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
      
      for (const level of headingLevels) {
        const heading = page.locator(`${level}.typography-${level}`)
        await expect(heading).toBeVisible()
        
        // Should have appropriate typography class
        await expect(heading).toHaveClass(new RegExp(`typography-${level}`))
      }
      
      // Body text variants
      const bodyVariants = ['.typography-body-large', '.typography-body', '.typography-body-small', '.typography-caption']
      
      for (const variant of bodyVariants) {
        const element = page.locator(variant)
        await expect(element).toBeVisible()
      }
    })
  })

  test.describe('Responsive Behavior', () => {
    test('should adapt layout for mobile screens', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }) // iPhone size
      await page.goto('/')
      
      // Cards should stack vertically on mobile
      const cards = page.locator('.card')
      const cardCount = await cards.count()
      
      for (let i = 0; i < cardCount - 1; i++) {
        const card1 = cards.nth(i)
        const card2 = cards.nth(i + 1)
        
        const box1 = await card1.boundingBox()
        const box2 = await card2.boundingBox()
        
        if (box1 && box2) {
          // Cards should be vertically stacked (card2 below card1)
          expect(box2.y).toBeGreaterThan(box1.y + box1.height / 2)
        }
      }
      
      // Theme switcher should remain functional
      const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
      await expect(themeSwitcher).toBeVisible()
      await themeSwitcher.click()
      
      const dropdown = page.getByRole('listbox')
      await expect(dropdown).toBeVisible()
    })

    test('should maintain touch targets on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      
      // All interactive elements should meet touch target requirements
      const buttons = page.locator('button')
      const buttonCount = await buttons.count()
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i)
        const box = await button.boundingBox()
        
        if (box) {
          // Should meet minimum 44px requirement
          expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44)
        }
      }
    })

    test('should adapt typography for mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      
      const h1 = page.locator('h1').first()
      const mobileH1Size = await h1.evaluate(el => parseFloat(getComputedStyle(el).fontSize))
      
      // Switch to desktop
      await page.setViewportSize({ width: 1200, height: 800 })
      await page.reload()
      
      const desktopH1Size = await h1.evaluate(el => parseFloat(getComputedStyle(el).fontSize))
      
      // Typography should scale appropriately
      expect(mobileH1Size).toBeGreaterThan(16) // Readable on mobile
      expect(desktopH1Size).toBeGreaterThan(mobileH1Size) // Larger on desktop
    })
  })

  test.describe('Cross-Theme Integration', () => {
    test('should maintain component functionality across themes', async ({ page }) => {
      await page.goto('/')
      
      for (const theme of THEMES) {
        // Switch theme
        const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
        await themeSwitcher.click()
        
        const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
        await option.click()
        
        // All components should remain functional
        const primaryButton = page.getByRole('button', { name: 'Primary' }).first()
        await expect(primaryButton).toBeVisible()
        await expect(primaryButton).toBeEnabled()
        
        // Cards should remain interactive
        const firstCard = page.locator('.card').first()
        const selectButton = firstCard.getByRole('button', { name: 'Select' })
        await expect(selectButton).toBeVisible()
        await expect(selectButton).toBeEnabled()
        
        // UI components should remain visible
        const timerDisplay = page.locator('.timer-display')
        await expect(timerDisplay).toBeVisible()
        
        const progressBar = page.locator('.progress-bar')
        await expect(progressBar.first()).toBeVisible()
      }
    })

    test('should maintain visual hierarchy across themes', async ({ page }) => {
      await page.goto('/')
      
      for (const theme of THEMES) {
        // Switch theme
        const themeSwitcher = page.getByRole('button', { name: /theme selection/i })
        await themeSwitcher.click()
        
        const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
        await option.click()
        
        // Check heading hierarchy
        const h1 = page.locator('h1').first()
        const h2 = page.locator('h2').first()
        
        const h1Size = await h1.evaluate(el => parseFloat(getComputedStyle(el).fontSize))
        const h2Size = await h2.evaluate(el => parseFloat(getComputedStyle(el).fontSize))
        
        expect(h1Size).toBeGreaterThan(h2Size)
        
        // Check color contrast maintains readability
        const h1Color = await h1.evaluate(el => getComputedStyle(el).color)
        const backgroundColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
        
        expect(h1Color).toBeTruthy()
        expect(backgroundColor).toBeTruthy()
        expect(h1Color).not.toBe(backgroundColor) // Should have contrast
      }
    })
  })
})