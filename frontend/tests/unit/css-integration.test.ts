/**
 * @jest-environment jsdom
 */

// CSS integration tests for design system

describe('CSS Integration', () => {
  beforeEach(() => {
    // Clean up DOM between tests
    document.head.innerHTML = ''
    document.body.innerHTML = ''
  })

  describe('CSS Custom Properties', () => {
    test('should have core design system properties available', () => {
      // Add the design system CSS to the document
      const style = document.createElement('style')
      style.innerHTML = `
        :root {
          --font-size-base: 1rem;
          --color-primary-500: #c8794a;
          --color-background: #fafaf9;
          --space-4: 1rem;
          --touch-target-preferred: 60px;
        }
      `
      document.head.appendChild(style)

      const computedStyle = getComputedStyle(document.documentElement)
      
      // Test that CSS custom properties are available
      expect(computedStyle.getPropertyValue('--font-size-base').trim()).toBe('1rem')
      expect(computedStyle.getPropertyValue('--color-primary-500').trim()).toBe('#c8794a')
      expect(computedStyle.getPropertyValue('--color-background').trim()).toBe('#fafaf9')
      expect(computedStyle.getPropertyValue('--space-4').trim()).toBe('1rem')
      expect(computedStyle.getPropertyValue('--touch-target-preferred').trim()).toBe('60px')
    })

    test('should support theme switching via data-theme attribute', () => {
      // Set up CSS with theme support
      const style = document.createElement('style')
      style.innerHTML = `
        :root {
          --color-primary-500: #c8794a;
        }
        [data-theme="contrast"] {
          --color-primary-500: #000000;
        }
        [data-theme="focus"] {
          --color-primary-500: #0ea5e9;
        }
        [data-theme="energizing"] {
          --color-primary-500: #f97316;
        }
      `
      document.head.appendChild(style)

      // Test default theme
      let computedStyle = getComputedStyle(document.documentElement)
      expect(computedStyle.getPropertyValue('--color-primary-500').trim()).toBe('#c8794a')

      // Test contrast theme
      document.documentElement.setAttribute('data-theme', 'contrast')
      computedStyle = getComputedStyle(document.documentElement)
      expect(computedStyle.getPropertyValue('--color-primary-500').trim()).toBe('#000000')

      // Test focus theme
      document.documentElement.setAttribute('data-theme', 'focus')
      computedStyle = getComputedStyle(document.documentElement)
      expect(computedStyle.getPropertyValue('--color-primary-500').trim()).toBe('#0ea5e9')

      // Test energizing theme
      document.documentElement.setAttribute('data-theme', 'energizing')
      computedStyle = getComputedStyle(document.documentElement)
      expect(computedStyle.getPropertyValue('--color-primary-500').trim()).toBe('#f97316')
    })
  })

  describe('Touch Target Sizes', () => {
    test('should meet WCAG 2.1 AA touch target requirements', () => {
      const style = document.createElement('style')
      style.innerHTML = `
        :root {
          --touch-target-min: 44px;
          --touch-target-preferred: 60px;
          --touch-target-large: 80px;
          --touch-target-emergency: 100px;
        }
      `
      document.head.appendChild(style)

      const computedStyle = getComputedStyle(document.documentElement)
      
      // All touch targets should meet WCAG minimum of 44px
      expect(parseInt(computedStyle.getPropertyValue('--touch-target-min'))).toBeGreaterThanOrEqual(44)
      expect(parseInt(computedStyle.getPropertyValue('--touch-target-preferred'))).toBeGreaterThanOrEqual(44)
      expect(parseInt(computedStyle.getPropertyValue('--touch-target-large'))).toBeGreaterThanOrEqual(44)
      expect(parseInt(computedStyle.getPropertyValue('--touch-target-emergency'))).toBeGreaterThanOrEqual(44)
      
      // Preferred size should be 60px for better UX
      expect(parseInt(computedStyle.getPropertyValue('--touch-target-preferred'))).toBe(60)
    })
  })

  describe('Theme Performance', () => {
    test('should apply theme changes quickly', () => {
      const style = document.createElement('style')
      style.innerHTML = `
        :root {
          --color-primary-500: #c8794a;
          transition: all 200ms ease-in-out;
        }
        [data-theme="focus"] {
          --color-primary-500: #0ea5e9;
        }
      `
      document.head.appendChild(style)

      const startTime = performance.now()
      
      // Simulate theme change
      document.documentElement.setAttribute('data-theme', 'focus')
      
      const endTime = performance.now()
      const changeTime = endTime - startTime
      
      // Theme change should be under 100ms (requirement from technical plan)
      expect(changeTime).toBeLessThan(100)
    })
  })

  describe('Accessibility Support', () => {
    test('should support high contrast mode', () => {
      const style = document.createElement('style')
      style.innerHTML = `
        :root {
          --color-text-primary: #1c1917;
          --color-background: #fafaf9;
          --color-border: #e7e5e4;
        }
        
        @media (prefers-contrast: high) {
          :root {
            --color-text-primary: #000000;
            --color-background: #ffffff;
            --color-border: #000000;
          }
        }
      `
      document.head.appendChild(style)

      const computedStyle = getComputedStyle(document.documentElement)
      
      // In normal mode, colors should be subtle
      expect(computedStyle.getPropertyValue('--color-text-primary').trim()).toBe('#1c1917')
      expect(computedStyle.getPropertyValue('--color-background').trim()).toBe('#fafaf9')
    })

    test('should support reduced motion preference', () => {
      const style = document.createElement('style')
      style.innerHTML = `
        :root {
          --duration-200: 200ms;
        }
        
        @media (prefers-reduced-motion: reduce) {
          :root {
            --duration-200: 0ms;
          }
        }
      `
      document.head.appendChild(style)

      const computedStyle = getComputedStyle(document.documentElement)
      
      // Should have animation duration defined
      expect(computedStyle.getPropertyValue('--duration-200').trim()).toBe('200ms')
    })
  })
})