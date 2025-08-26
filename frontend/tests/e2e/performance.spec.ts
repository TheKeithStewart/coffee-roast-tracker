/**
 * Coffee Roast Tracker - Performance E2E Tests
 * 
 * Comprehensive performance testing using Playwright to validate
 * bundle sizes, theme switching performance, and Core Web Vitals.
 */

import { test, expect } from '@playwright/test'

// Performance thresholds from technical requirements
const PERFORMANCE_THRESHOLDS = {
  THEME_SWITCH_TIME: 100, // milliseconds
  FIRST_LOAD_JS: 180 * 1024, // 180KB in bytes
  CSS_BUNDLE_SIZE: 20 * 1024, // 20KB in bytes
  FIRST_CONTENTFUL_PAINT: 1500, // milliseconds
  LARGEST_CONTENTFUL_PAINT: 2500, // milliseconds
  CUMULATIVE_LAYOUT_SHIFT: 0.1, // score
  FIRST_INPUT_DELAY: 100 // milliseconds
} as const

const THEMES = [
  { id: 'classic', name: 'Classic Coffee' },
  { id: 'contrast', name: 'High Contrast' }, 
  { id: 'focus', name: 'Cool Focus' },
  { id: 'energizing', name: 'Energizing' }
] as const

test.describe('Performance Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cache and localStorage for consistent testing
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })

  test.describe('Bundle Size Validation', () => {
    test('should meet JavaScript bundle size targets', async ({ page }) => {
      // Navigate and capture network requests
      const responses: Array<{url: string, size: number, type: string}> = []
      
      page.on('response', async (response) => {
        if (response.url().includes('.js') && response.status() === 200) {
          try {
            const contentLength = response.headers()['content-length']
            const url = response.url()
            
            responses.push({
              url,
              size: contentLength ? parseInt(contentLength) : 0,
              type: 'javascript'
            })
          } catch (error) {
            console.log('Error capturing response:', error)
          }
        }
      })
      
      await page.goto('/')
      
      // Wait for page to fully load
      await page.waitForLoadState('networkidle')
      
      // Calculate total JavaScript size
      const totalJSSize = responses
        .filter(r => r.type === 'javascript')
        .reduce((total, response) => total + response.size, 0)
      
      console.log(`📦 Total JavaScript bundle size: ${Math.round(totalJSSize / 1024)} KB`)
      console.log(`🎯 Target: ${Math.round(PERFORMANCE_THRESHOLDS.FIRST_LOAD_JS / 1024)} KB`)
      
      expect(totalJSSize).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.FIRST_LOAD_JS)
    })

    test('should meet CSS bundle size targets', async ({ page }) => {
      const responses: Array<{url: string, size: number, type: string}> = []
      
      page.on('response', async (response) => {
        if (response.url().includes('.css') && response.status() === 200) {
          try {
            const contentLength = response.headers()['content-length']
            const url = response.url()
            
            responses.push({
              url,
              size: contentLength ? parseInt(contentLength) : 0,
              type: 'stylesheet'
            })
          } catch (error) {
            console.log('Error capturing CSS response:', error)
          }
        }
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const totalCSSSize = responses
        .filter(r => r.type === 'stylesheet')
        .reduce((total, response) => total + response.size, 0)
      
      console.log(`🎨 Total CSS bundle size: ${Math.round(totalCSSSize / 1024)} KB`)
      console.log(`🎯 Target: ${Math.round(PERFORMANCE_THRESHOLDS.CSS_BUNDLE_SIZE / 1024)} KB`)
      
      expect(totalCSSSize).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.CSS_BUNDLE_SIZE)
    })

    test('should have efficient resource loading', async ({ page }) => {
      const resourceTimings: Array<{name: string, duration: number, size: number, type: string}> = []
      
      await page.goto('/')
      
      // Get resource timing data
      const timings = await page.evaluate(() => {
        return performance.getEntriesByType('resource').map(entry => ({
          name: entry.name,
          duration: entry.duration,
          size: (entry as PerformanceResourceTiming).transferSize || 0,
          type: entry.initiatorType || 'unknown'
        }))
      })
      
      resourceTimings.push(...timings)
      
      // Check that critical resources load quickly
      const criticalResources = resourceTimings.filter(timing => 
        timing.name.includes('globals.css') || 
        timing.name.includes('page.js') ||
        timing.name.includes('layout.js')
      )
      
      for (const resource of criticalResources) {
        console.log(`⚡ ${resource.name}: ${Math.round(resource.duration)}ms`)
        expect(resource.duration).toBeLessThan(1000) // Should load within 1 second
      }
    })
  })

  test.describe('Theme Switching Performance', () => {
    test('should switch themes within performance target', async ({ page }) => {
      await page.goto('/')
      
      // Test each theme switching performance
      for (const theme of THEMES) {
        // Theme switching performance test
        
        // Open theme switcher
        const themeSwitcher = page.getByRole('button', { name: /select color theme/i })
        await themeSwitcher.click()
        
        // Select theme
        const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
        const switchStart = Date.now()
        
        await option.click()
        
        // Wait for theme to be applied
        await expect(page.locator('body')).toHaveClass(new RegExp(`theme-${theme.id}`))
        
        const switchEnd = Date.now()
        const switchTime = switchEnd - switchStart
        
        console.log(`🎨 Theme switch to ${theme.name}: ${switchTime}ms`)
        
        expect(switchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.THEME_SWITCH_TIME)
      }
    })

    test('should use CSS custom properties for instant switching', async ({ page }) => {
      await page.goto('/')
      
      // Verify CSS custom properties are being used
      const cssVariables = await page.evaluate(() => {
        const styles = getComputedStyle(document.body)
        return {
          primary: styles.getPropertyValue('--color-primary'),
          background: styles.getPropertyValue('--color-background'),
          text: styles.getPropertyValue('--color-text'),
          surface: styles.getPropertyValue('--color-surface')
        }
      })
      
      // All theme variables should be defined
      expect(cssVariables.primary).toBeTruthy()
      expect(cssVariables.background).toBeTruthy()
      expect(cssVariables.text).toBeTruthy()
      expect(cssVariables.surface).toBeTruthy()
      
      // Switch theme and verify variables change
      const themeSwitcher = page.getByRole('button', { name: /select color theme/i })
      await themeSwitcher.click()
      
      const contrastOption = page.getByRole('option', { name: /high contrast/i })
      await contrastOption.click()
      
      const newCssVariables = await page.evaluate(() => {
        const styles = getComputedStyle(document.body)
        return {
          primary: styles.getPropertyValue('--color-primary'),
          background: styles.getPropertyValue('--color-background'),
          text: styles.getPropertyValue('--color-text'),
          surface: styles.getPropertyValue('--color-surface')
        }
      })
      
      // At least one variable should have changed
      const changed = 
        newCssVariables.primary !== cssVariables.primary ||
        newCssVariables.background !== cssVariables.background ||
        newCssVariables.text !== cssVariables.text ||
        newCssVariables.surface !== cssVariables.surface
      
      expect(changed).toBeTruthy()
    })

    test('should not cause layout shifts during theme switching', async ({ page }) => {
      await page.goto('/')
      
      // Measure layout shifts
      await page.evaluate(() => {
        interface WindowWithLayoutShifts extends Window {
          layoutShifts: number[]
        }
        const win = window as unknown as WindowWithLayoutShifts;
        win.layoutShifts = []
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if ('value' in entry) {
              win.layoutShifts.push((entry as any).value)
            }
          }
        }).observe({ entryTypes: ['layout-shift'] })
      })
      
      // Switch themes multiple times
      for (const theme of THEMES) {
        const themeSwitcher = page.getByRole('button', { name: /select color theme/i })
        await themeSwitcher.click()
        
        const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
        await option.click()
        
        // Small delay to allow for any shifts
        await page.waitForTimeout(50)
      }
      
      // Check cumulative layout shift
      const totalShift = await page.evaluate(() => {
        interface WindowWithLayoutShifts extends Window {
          layoutShifts: number[]
        }
        const win = window as unknown as WindowWithLayoutShifts;
        return win.layoutShifts.reduce((total: number, shift: number) => total + shift, 0)
      })
      
      console.log(`📐 Cumulative Layout Shift during theme switching: ${totalShift}`)
      
      expect(totalShift).toBeLessThan(PERFORMANCE_THRESHOLDS.CUMULATIVE_LAYOUT_SHIFT)
    })
  })

  test.describe('Core Web Vitals', () => {
    test('should meet First Contentful Paint targets', async ({ page }) => {
      // First Contentful Paint measurement
      
      await page.goto('/')
      
      // Wait for FCP
      await page.waitForFunction(() => {
        return performance.getEntriesByType('paint').some(
          entry => entry.name === 'first-contentful-paint'
        )
      })
      
      const paintTimings = await page.evaluate(() => {
        return performance.getEntriesByType('paint').map(entry => ({
          name: entry.name,
          startTime: entry.startTime
        }))
      })
      
      const fcp = paintTimings.find(timing => timing.name === 'first-contentful-paint')
      
      if (fcp) {
        console.log(`🎨 First Contentful Paint: ${Math.round(fcp.startTime)}ms`)
        expect(fcp.startTime).toBeLessThan(PERFORMANCE_THRESHOLDS.FIRST_CONTENTFUL_PAINT)
      }
    })

    test('should meet Largest Contentful Paint targets', async ({ page }) => {
      await page.goto('/')
      
      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle')
      
      const lcp = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries()
            const lastEntry = entries[entries.length - 1]
            resolve(lastEntry.startTime)
          }).observe({ entryTypes: ['largest-contentful-paint'] })
          
          // Fallback timeout
          setTimeout(() => resolve(0), 5000)
        })
      })
      
      if (lcp) {
        console.log(`🖼️ Largest Contentful Paint: ${Math.round(lcp as number)}ms`)
        expect(lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.LARGEST_CONTENTFUL_PAINT)
      }
    })

    test('should have good Time to Interactive', async ({ page }) => {
      // Time to Interactive measurement
      
      await page.goto('/')
      
      // Wait for the page to be fully interactive
      await page.waitForLoadState('networkidle')
      
      // Test that interactions work immediately
      const themeSwitcher = page.getByRole('button', { name: /select color theme/i })
      
      const interactionStart = Date.now()
      await themeSwitcher.click()
      const interactionEnd = Date.now()
      
      const interactionTime = interactionEnd - interactionStart
      console.log(`⚡ Interaction response time: ${interactionTime}ms`)
      
      expect(interactionTime).toBeLessThan(PERFORMANCE_THRESHOLDS.FIRST_INPUT_DELAY)
      
      // Dropdown should appear quickly
      const dropdown = page.getByRole('listbox')
      await expect(dropdown).toBeVisible()
    })

    test('should minimize Cumulative Layout Shift', async ({ page }) => {
      // Setup layout shift tracking
      await page.evaluate(() => {
        interface WindowWithCLS extends Window {
          cumulativeLayoutShift: number
        }
        const win = window as unknown as WindowWithCLS;
        win.cumulativeLayoutShift = 0
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const layoutShift = entry as any;
            if (!layoutShift.hadRecentInput) {
              win.cumulativeLayoutShift += layoutShift.value
            }
          }
        }).observe({ entryTypes: ['layout-shift'] })
      })
      
      await page.goto('/')
      
      // Wait for page to fully load
      await page.waitForLoadState('networkidle')
      
      // Interact with various components
      const primaryButton = page.getByRole('button', { name: 'Primary' }).first()
      await primaryButton.click()
      
      const card = page.locator('.card').first()
      await card.hover()
      
      // Switch themes (should not cause shifts)
      const themeSwitcher = page.getByRole('button', { name: /select color theme/i })
      await themeSwitcher.click()
      
      const focusOption = page.getByRole('option', { name: /cool focus/i })
      await focusOption.click()
      
      // Wait a bit for any delayed shifts
      await page.waitForTimeout(1000)
      
      const cls = await page.evaluate(() => {
        interface WindowWithCLS extends Window {
          cumulativeLayoutShift: number
        }
        const win = window as unknown as WindowWithCLS;
        return win.cumulativeLayoutShift
      })
      
      console.log(`📐 Cumulative Layout Shift: ${cls}`)
      
      expect(cls).toBeLessThan(PERFORMANCE_THRESHOLDS.CUMULATIVE_LAYOUT_SHIFT)
    })
  })

  test.describe('Memory and Resource Usage', () => {
    test('should not cause memory leaks during theme switching', async ({ page }) => {
      await page.goto('/')
      
      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        interface PerformanceWithMemory extends Performance {
          memory: {
            usedJSHeapSize: number
          }
        }
        if ('memory' in performance) {
          return (performance as PerformanceWithMemory).memory.usedJSHeapSize
        }
        return 0
      })
      
      // Switch themes multiple times
      for (let i = 0; i < 10; i++) {
        for (const theme of THEMES) {
          const themeSwitcher = page.getByRole('button', { name: /select color theme/i })
          await themeSwitcher.click()
          
          const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
          await option.click()
          
          await page.waitForTimeout(10)
        }
      }
      
      // Force garbage collection if available
      await page.evaluate(() => {
        interface WindowWithGC extends Window {
          gc?: () => void
        }
        if ('gc' in window) {
          (window as WindowWithGC).gc?.()
        }
      })
      
      await page.waitForTimeout(100)
      
      const finalMemory = await page.evaluate(() => {
        interface PerformanceWithMemory extends Performance {
          memory: {
            usedJSHeapSize: number
          }
        }
        if ('memory' in performance) {
          return (performance as PerformanceWithMemory).memory.usedJSHeapSize
        }
        return 0
      })
      
      if (initialMemory && finalMemory) {
        const memoryIncrease = finalMemory - initialMemory
        const increasePercentage = (memoryIncrease / initialMemory) * 100
        
        console.log(`🧠 Memory usage increase: ${Math.round(increasePercentage)}%`)
        
        // Memory should not increase significantly
        expect(increasePercentage).toBeLessThan(50) // Less than 50% increase
      }
    })

    test('should efficiently handle DOM updates', async ({ page }) => {
      await page.goto('/')
      
      // Count initial DOM nodes
      const initialNodeCount = await page.evaluate(() => 
        document.querySelectorAll('*').length
      )
      
      // Perform various interactions
      for (const theme of THEMES) {
        const themeSwitcher = page.getByRole('button', { name: /select color theme/i })
        await themeSwitcher.click()
        
        const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
        await option.click()
        
        // Interact with buttons
        const primaryButton = page.getByRole('button', { name: 'Primary' }).first()
        await primaryButton.click()
      }
      
      const finalNodeCount = await page.evaluate(() => 
        document.querySelectorAll('*').length
      )
      
      // DOM nodes should not significantly increase
      const nodeIncrease = finalNodeCount - initialNodeCount
      const increasePercentage = (nodeIncrease / initialNodeCount) * 100
      
      console.log(`🏗️ DOM node increase: ${increasePercentage.toFixed(1)}%`)
      
      expect(increasePercentage).toBeLessThan(10) // Less than 10% increase
    })
  })

  test.describe('Network Performance', () => {
    test('should minimize render-blocking resources', async ({ page }) => {
      const blockingResources: string[] = []
      
      page.on('response', async (response) => {
        const url = response.url()
        
        // Check for render-blocking CSS
        if (url.includes('.css') && !url.includes('async')) {
          blockingResources.push(url)
        }
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      console.log(`🚫 Render-blocking resources: ${blockingResources.length}`)
      
      // Should minimize render-blocking resources
      expect(blockingResources.length).toBeLessThan(5)
    })

    test('should compress resources effectively', async ({ page }) => {
      const compressedResources: Array<{url: string, encoding: string, size: number}> = []
      
      page.on('response', async (response) => {
        const contentEncoding = response.headers()['content-encoding']
        const contentLength = response.headers()['content-length']
        
        if (contentEncoding && contentLength) {
          compressedResources.push({
            url: response.url(),
            encoding: contentEncoding,
            size: parseInt(contentLength)
          })
        }
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Check that significant resources are compressed
      const significantResources = compressedResources.filter(resource => 
        resource.size > 1024 && // Larger than 1KB
        (resource.url.includes('.js') || resource.url.includes('.css'))
      )
      
      console.log(`📦 Compressed resources: ${significantResources.length}`)
      
      // Most significant resources should be compressed
      if (significantResources.length > 0) {
        const compressedCount = significantResources.filter(resource => 
          resource.encoding === 'gzip' || resource.encoding === 'br'
        ).length
        
        const compressionRate = compressedCount / significantResources.length
        expect(compressionRate).toBeGreaterThan(0.8) // At least 80% compressed
      }
    })
  })

  test.describe('Performance Regression Detection', () => {
    test('should maintain performance across theme switches', async ({ page }) => {
      await page.goto('/')
      
      const performanceMetrics: Array<{theme: string, switchTime: number, timestamp: number}> = []
      
      // Measure performance for each theme
      for (const theme of THEMES) {
        // Performance regression detection
        
        const themeSwitcher = page.getByRole('button', { name: /select color theme/i })
        await themeSwitcher.click()
        
        const switchStart = Date.now()
        
        const option = page.getByRole('option', { name: new RegExp(theme.name, 'i') })
        await option.click()
        
        await expect(page.locator('body')).toHaveClass(new RegExp(`theme-${theme.id}`))
        
        const switchEnd = Date.now()
        const switchTime = switchEnd - switchStart
        
        performanceMetrics.push({
          theme: theme.name,
          switchTime,
          timestamp: Date.now()
        })
        
        console.log(`⚡ ${theme.name} switch time: ${switchTime}ms`)
      }
      
      // All theme switches should be within acceptable range
      const maxSwitchTime = Math.max(...performanceMetrics.map(m => m.switchTime))
      const avgSwitchTime = performanceMetrics.reduce((sum, m) => sum + m.switchTime, 0) / performanceMetrics.length
      
      console.log(`📊 Average switch time: ${Math.round(avgSwitchTime)}ms`)
      console.log(`📊 Max switch time: ${maxSwitchTime}ms`)
      
      expect(maxSwitchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.THEME_SWITCH_TIME)
      expect(avgSwitchTime).toBeLessThan(PERFORMANCE_THRESHOLDS.THEME_SWITCH_TIME / 2)
    })
  })
})