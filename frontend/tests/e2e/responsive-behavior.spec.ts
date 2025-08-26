/**
 * Coffee Roast Tracker - Responsive Behavior E2E Tests
 * 
 * Comprehensive responsive design testing across different devices,
 * screen sizes, and orientations using Playwright device emulation.
 */

import { test, expect } from '@playwright/test'

// Device configurations for testing
const DEVICES = [
  { name: 'iPhone 12', viewport: { width: 390, height: 844 }, isMobile: true },
  { name: 'iPhone SE', viewport: { width: 375, height: 667 }, isMobile: true },
  { name: 'Pixel 5', viewport: { width: 393, height: 851 }, isMobile: true },
  { name: 'iPad', viewport: { width: 768, height: 1024 }, isTablet: true },
  { name: 'iPad Pro', viewport: { width: 1024, height: 1366 }, isTablet: true },
  { name: 'Desktop Small', viewport: { width: 1024, height: 768 }, isDesktop: true },
  { name: 'Desktop Large', viewport: { width: 1440, height: 900 }, isDesktop: true },
  { name: 'Desktop XL', viewport: { width: 1920, height: 1080 }, isDesktop: true }
] as const

// Breakpoint definitions matching the design system
// Used in responsive design validation

const THEMES = [
  { id: 'classic', name: 'Classic Coffee' },
  { id: 'contrast', name: 'High Contrast' }, 
  { id: 'focus', name: 'Cool Focus' },
  { id: 'energizing', name: 'Energizing' }
] as const

test.describe('Responsive Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test.describe('Viewport Adaptation', () => {
    test('should adapt layout for different screen sizes', async ({ page }) => {
      for (const device of DEVICES) {
        await page.setViewportSize(device.viewport)
        await page.reload()
        
        console.log(`📱 Testing ${device.name} (${device.viewport.width}x${device.viewport.height})`)
        
        // All core elements should be visible
        await expect(page.locator('header')).toBeVisible()
        await expect(page.getByRole('main')).toBeVisible()
        
        // Theme switcher should be accessible
        const themeSwitcher = page.getByRole('button', { name: /select color theme/i })
        await expect(themeSwitcher).toBeVisible()
        
        // Content should not overflow horizontally
        const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth)
        const viewportWidth = device.viewport.width
        
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1) // Allow 1px tolerance
      }
    })

    test('should handle orientation changes on mobile', async ({ page }) => {
      const mobileDevices = DEVICES.filter(d => d.isMobile)
      
      for (const device of mobileDevices) {
        // Test portrait orientation
        await page.setViewportSize(device.viewport)
        await page.reload()
        
        await expect(page.getByRole('main')).toBeVisible()
        
        // Test landscape orientation
        await page.setViewportSize({ 
          width: device.viewport.height, 
          height: device.viewport.width 
        })
        await page.reload()
        
        await expect(page.getByRole('main')).toBeVisible()
        
        // Theme switcher should remain functional in landscape
        const themeSwitcher = page.getByRole('button', { name: /select color theme/i })
        await expect(themeSwitcher).toBeVisible()
        await themeSwitcher.click()
        
        const dropdown = page.getByRole('listbox')
        await expect(dropdown).toBeVisible()
      }
    })
  })

  test.describe('Touch Target Optimization', () => {
    test('should meet touch target requirements on mobile', async ({ page }) => {
      const mobileDevice = DEVICES.find(d => d.name === 'iPhone 12')!
      await page.setViewportSize(mobileDevice.viewport)
      await page.reload()
      
      // All interactive elements should meet minimum touch target size
      const interactiveElements = page.locator('button, a[href], input, select, textarea')
      const count = await interactiveElements.count()
      
      for (let i = 0; i < count; i++) {
        const element = interactiveElements.nth(i)
        const box = await element.boundingBox()
        
        if (box) {
          const minDimension = Math.min(box.width, box.height)
          
          // WCAG AA: 44px minimum, but design system prefers 60px
          expect(minDimension).toBeGreaterThanOrEqual(44)
          
          console.log(`👆 Touch target ${i}: ${Math.round(box.width)}x${Math.round(box.height)}px`)
          
          if (minDimension < 60) {
            console.warn(`⚠️ Touch target below preferred 60px: ${minDimension}px`)
          }
        }
      }
    })

    test('should provide adequate spacing between touch targets', async ({ page }) => {
      const mobileDevice = DEVICES.find(d => d.name === 'iPhone 12')!
      await page.setViewportSize(mobileDevice.viewport)
      await page.reload()
      
      // Check button groups for spacing
      const buttonContainer = page.locator('[style*="display: flex"]').first()
      const buttons = buttonContainer.locator('button')
      const buttonCount = await buttons.count()
      
      for (let i = 0; i < buttonCount - 1; i++) {
        const button1 = buttons.nth(i)
        const button2 = buttons.nth(i + 1)
        
        const box1 = await button1.boundingBox()
        const box2 = await button2.boundingBox()
        
        if (box1 && box2) {
          const horizontalGap = Math.abs(box2.x - (box1.x + box1.width))
          const verticalGap = Math.abs(box2.y - (box1.y + box1.height))
          
          // Should have at least 8px spacing
          const hasAdequateSpacing = horizontalGap >= 8 || verticalGap >= 8
          
          expect(hasAdequateSpacing).toBeTruthy()
          
          console.log(`📏 Button spacing: H=${horizontalGap}px, V=${verticalGap}px`)
        }
      }
    })
  })

  test.describe('Component Responsive Behavior', () => {
    test('should adapt theme switcher for different screens', async ({ page }) => {
      for (const device of DEVICES) {
        await page.setViewportSize(device.viewport)
        await page.reload()
        
        const themeSwitcher = page.getByRole('button', { name: /select color theme/i })
        await expect(themeSwitcher).toBeVisible()
        
        // Open dropdown
        await themeSwitcher.click()
        const dropdown = page.getByRole('listbox')
        await expect(dropdown).toBeVisible()
        
        // Dropdown should fit within viewport
        const dropdownBox = await dropdown.boundingBox()
        if (dropdownBox) {
          expect(dropdownBox.x + dropdownBox.width).toBeLessThanOrEqual(device.viewport.width)
          expect(dropdownBox.y + dropdownBox.height).toBeLessThanOrEqual(device.viewport.height)
        }
        
        // Close dropdown
        await page.keyboard.press('Escape')
        await expect(dropdown).not.toBeVisible()
        
        console.log(`✅ Theme switcher responsive on ${device.name}`)
      }
    })

    test('should adapt card layout for different screens', async ({ page }) => {
      await page.goto('/')
      
      // Desktop: Cards should be in a grid
      const desktopDevice = DEVICES.find(d => d.name === 'Desktop Large')!
      await page.setViewportSize(desktopDevice.viewport)
      await page.reload()
      
      const cards = page.locator('.card')
      const cardCount = await cards.count()
      
      if (cardCount >= 2) {
        const card1Box = await cards.nth(0).boundingBox()
        const card2Box = await cards.nth(1).boundingBox()
        
        if (card1Box && card2Box) {
          // On desktop, cards should be side by side
          const isHorizontalLayout = Math.abs(card1Box.y - card2Box.y) < 50
          expect(isHorizontalLayout).toBeTruthy()
          
          console.log(`🖥️ Desktop: Cards in horizontal layout`)
        }
      }
      
      // Mobile: Cards should be stacked vertically
      const mobileDevice = DEVICES.find(d => d.name === 'iPhone 12')!
      await page.setViewportSize(mobileDevice.viewport)
      await page.reload()
      
      if (cardCount >= 2) {
        const card1Box = await cards.nth(0).boundingBox()
        const card2Box = await cards.nth(1).boundingBox()
        
        if (card1Box && card2Box) {
          // On mobile, cards should be stacked vertically
          const isVerticalLayout = card2Box.y > card1Box.y + card1Box.height / 2
          expect(isVerticalLayout).toBeTruthy()
          
          console.log(`📱 Mobile: Cards in vertical layout`)
        }
      }
    })

    test('should adapt button layout for mobile', async ({ page }) => {
      const mobileDevice = DEVICES.find(d => d.name === 'iPhone 12')!
      await page.setViewportSize(mobileDevice.viewport)
      await page.reload()
      
      // Button groups should wrap appropriately on mobile
      const buttonContainer = page.locator('[style*="display: flex"]').first()
      const buttons = buttonContainer.locator('button')
      const buttonCount = await buttons.count()
      
      // Check if buttons wrap when necessary
      if (buttonCount > 2) {
        const containerWidth = await buttonContainer.evaluate(el => el.clientWidth)
        let totalButtonWidth = 0
        
        for (let i = 0; i < buttonCount; i++) {
          const button = buttons.nth(i)
          const box = await button.boundingBox()
          if (box) {
            totalButtonWidth += box.width
          }
        }
        
        // If total width exceeds container, wrapping should occur
        if (totalButtonWidth > containerWidth * 1.2) {
          const firstButton = await buttons.nth(0).boundingBox()
          const lastButton = await buttons.nth(buttonCount - 1).boundingBox()
          
          if (firstButton && lastButton) {
            const hasWrapped = Math.abs(lastButton.y - firstButton.y) > 20
            expect(hasWrapped).toBeTruthy()
            console.log(`📱 Buttons wrapped on mobile`)
          }
        }
      }
    })
  })

  test.describe('Typography Responsive Scaling', () => {
    test('should scale typography appropriately across devices', async ({ page }) => {
      const typographyElements = [
        { selector: 'h1', class: 'typography-h1' },
        { selector: 'h2', class: 'typography-h2' },
        { selector: 'h3', class: 'typography-h3' },
        { selector: '.typography-body', class: 'typography-body' }
      ]
      
      const fontSizes: Record<string, Record<string, number>> = {}
      
      for (const device of DEVICES) {
        await page.setViewportSize(device.viewport)
        await page.reload()
        
        fontSizes[device.name] = {}
        
        for (const element of typographyElements) {
          const el = page.locator(element.selector).first()
          if (await el.count() > 0) {
            const fontSize = await el.evaluate(el => parseFloat(getComputedStyle(el).fontSize))
            fontSizes[device.name][element.class] = fontSize
            
            // Font size should be readable on all devices (minimum 14px for body text)
            if (element.class === 'typography-body') {
              expect(fontSize).toBeGreaterThanOrEqual(14)
            }
          }
        }
        
        console.log(`📝 ${device.name} typography scales:`, fontSizes[device.name])
      }
      
      // Typography should scale appropriately
      const mobile = fontSizes['iPhone 12']
      const desktop = fontSizes['Desktop Large']
      
      if (mobile && desktop) {
        // Desktop should generally have larger typography
        expect(desktop['typography-h1']).toBeGreaterThanOrEqual(mobile['typography-h1'])
        expect(desktop['typography-body']).toBeGreaterThanOrEqual(mobile['typography-body'] * 0.9) // Allow some flexibility
      }
    })

    test('should maintain readability on all screen sizes', async ({ page }) => {
      for (const device of DEVICES) {
        await page.setViewportSize(device.viewport)
        await page.reload()
        
        // Check line height and spacing for readability
        const bodyText = page.locator('.typography-body').first()
        if (await bodyText.count() > 0) {
          const styles = await bodyText.evaluate(el => {
            const computed = getComputedStyle(el)
            return {
              fontSize: parseFloat(computed.fontSize),
              lineHeight: parseFloat(computed.lineHeight),
              letterSpacing: computed.letterSpacing
            }
          })
          
          // Line height should be appropriate for readability (1.4-1.6 is good)
          const lineHeightRatio = styles.lineHeight / styles.fontSize
          expect(lineHeightRatio).toBeGreaterThan(1.2)
          expect(lineHeightRatio).toBeLessThan(2.0)
          
          console.log(`📖 ${device.name} readability: Line height ratio ${lineHeightRatio.toFixed(2)}`)
        }
      }
    })
  })

  test.describe('Content Adaptation', () => {
    test('should handle content overflow gracefully', async ({ page }) => {
      for (const device of DEVICES) {
        await page.setViewportSize(device.viewport)
        await page.reload()
        
        // Check for horizontal scroll (should not exist)
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.body.scrollWidth > window.innerWidth
        })
        
        expect(hasHorizontalScroll).toBeFalsy()
        
        // Long text should wrap appropriately
        const longTextElements = page.locator('p, .card__body')
        const count = await longTextElements.count()
        
        for (let i = 0; i < count; i++) {
          const element = longTextElements.nth(i)
          const box = await element.boundingBox()
          
          if (box) {
            expect(box.width).toBeLessThanOrEqual(device.viewport.width)
          }
        }
        
        console.log(`📄 Content fits properly on ${device.name}`)
      }
    })

    test('should maintain information hierarchy on small screens', async ({ page }) => {
      const mobileDevice = DEVICES.find(d => d.name === 'iPhone 12')!
      await page.setViewportSize(mobileDevice.viewport)
      await page.reload()
      
      // Important content should remain visible and prioritized
      const mainHeading = page.locator('h1').first()
      const themeSwitch = page.getByRole('button', { name: /select color theme/i })
      // Primary button is tested elsewhere
      
      // All should be visible without scrolling (or minimal scrolling)
      await expect(mainHeading).toBeVisible()
      await expect(themeSwitch).toBeVisible()
      
      // Check vertical positioning
      const headingBox = await mainHeading.boundingBox()
      const themeSwitchBox = await themeSwitch.boundingBox()
      
      if (headingBox && themeSwitchBox) {
        // Theme switch should be accessible near the top
        expect(themeSwitchBox.y).toBeLessThan(mobileDevice.viewport.height / 2)
        
        console.log(`📱 Key elements positioned appropriately on mobile`)
      }
    })
  })

  test.describe('Cross-Device Theme Consistency', () => {
    test('should maintain theme appearance across devices', async ({ page }) => {
      for (const theme of THEMES) {
        const themeColors: Record<string, string> = {}
        
        for (const device of DEVICES.slice(0, 3)) { // Test subset for performance
          await page.setViewportSize(device.viewport)
          await page.reload()
          
          // Switch to theme
          const themeSwitcher = page.getByRole('button', { name: /select color theme/i })
          await themeSwitcher.click()
          
          const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
          await option.click()
          
          // Capture theme colors
          const colors = await page.evaluate(() => {
            const styles = getComputedStyle(document.body)
            return {
              primary: styles.getPropertyValue('--color-primary').trim(),
              background: styles.getPropertyValue('--color-background').trim(),
              text: styles.getPropertyValue('--color-text').trim()
            }
          })
          
          themeColors[device.name] = colors
          
          console.log(`🎨 ${theme.name} on ${device.name}:`, colors)
        }
        
        // Colors should be consistent across devices
        const deviceNames = Object.keys(themeColors)
        if (deviceNames.length > 1) {
          const firstDevice = themeColors[deviceNames[0]]
          
          for (let i = 1; i < deviceNames.length; i++) {
            const currentDevice = themeColors[deviceNames[i]]
            
            expect(currentDevice.primary).toBe(firstDevice.primary)
            expect(currentDevice.background).toBe(firstDevice.background)
            expect(currentDevice.text).toBe(firstDevice.text)
          }
        }
      }
    })
  })

  test.describe('Performance on Different Devices', () => {
    test('should maintain performance on mobile devices', async ({ page }) => {
      const mobileDevice = DEVICES.find(d => d.name === 'iPhone 12')!
      await page.setViewportSize(mobileDevice.viewport)
      
      // Simulate slower mobile performance
      await page.emulateNetworkConditions({
        offline: false,
        downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
        uploadThroughput: 750 * 1024 / 8, // 750 Kbps
        latency: 40 // 40ms latency
      })
      
      const startTime = Date.now()
      await page.goto('/')
      
      // Page should load reasonably quickly even on slower connections
      await page.waitForLoadState('networkidle')
      const loadTime = Date.now() - startTime
      
      console.log(`📱 Mobile load time: ${loadTime}ms`)
      expect(loadTime).toBeLessThan(5000) // Should load within 5 seconds
      
      // Theme switching should remain fast
      const themeSwitcher = page.getByRole('button', { name: /select color theme/i })
      await themeSwitcher.click()
      
      const switchStart = Date.now()
      const focusOption = page.getByRole('option', { name: /cool focus/i })
      await focusOption.click()
      
      await expect(page.locator('body')).toHaveClass(/theme-focus/)
      const switchTime = Date.now() - switchStart
      
      console.log(`📱 Mobile theme switch time: ${switchTime}ms`)
      expect(switchTime).toBeLessThan(200) // Allow slightly more time on mobile
    })
  })

  test.describe('Accessibility on Different Devices', () => {
    test('should maintain accessibility features across devices', async ({ page }) => {
      for (const device of DEVICES.slice(0, 3)) { // Test subset
        await page.setViewportSize(device.viewport)
        await page.reload()
        
        // Skip link should always be accessible
        const skipLink = page.getByRole('link', { name: /skip to main content/i })
        await expect(skipLink).toBeVisible()
        
        // Focus management should work on all devices
        await page.keyboard.press('Tab')
        const focusedElement = page.locator(':focus')
        await expect(focusedElement).toBeVisible()
        
        // Theme switcher should be keyboard accessible
        const themeSwitcher = page.getByRole('button', { name: /select color theme/i })
        await themeSwitcher.focus()
        await page.keyboard.press('Enter')
        
        const dropdown = page.getByRole('listbox')
        await expect(dropdown).toBeVisible()
        
        await page.keyboard.press('Escape')
        await expect(dropdown).not.toBeVisible()
        
        console.log(`♿ Accessibility maintained on ${device.name}`)
      }
    })

    test('should handle touch and mouse interactions appropriately', async ({ page }) => {
      // Test touch interactions on mobile
      const mobileDevice = DEVICES.find(d => d.name === 'iPhone 12')!
      await page.setViewportSize(mobileDevice.viewport)
      await page.reload()
      
      const themeSwitcher = page.getByRole('button', { name: /select color theme/i })
      
      // Touch interaction
      await themeSwitcher.tap()
      const dropdown = page.getByRole('listbox')
      await expect(dropdown).toBeVisible()
      
      const option = page.getByRole('option', { name: /high contrast/i })
      await option.tap()
      
      await expect(page.locator('body')).toHaveClass(/theme-contrast/)
      
      // Test mouse interactions on desktop
      const desktopDevice = DEVICES.find(d => d.name === 'Desktop Large')!
      await page.setViewportSize(desktopDevice.viewport)
      await page.reload()
      
      const desktopThemeSwitcher = page.getByRole('button', { name: /select color theme/i })
      
      // Hover should work on desktop
      await desktopThemeSwitcher.hover()
      // Click should work
      await desktopThemeSwitcher.click()
      
      const desktopDropdown = page.getByRole('listbox')
      await expect(desktopDropdown).toBeVisible()
      
      console.log(`🖱️ Touch and mouse interactions working properly`)
    })
  })
})