/**
 * Browser API Type Definitions
 * Extends browser APIs and Playwright types for testing
 */

declare global {
  // Layout Shift API types
  interface LayoutShift {
    value: number
    hadRecentInput: boolean
    lastInputTime: number
    sources: Array<{
      currentRect: DOMRectReadOnly
      previousRect: DOMRectReadOnly
    }>
  }

  // Window extensions for performance testing
  interface WindowWithCLS extends Window {
    cumulativeLayoutShift: number
    __layoutShifts: LayoutShift[]
    __onLayoutShift?: (entry: LayoutShift) => void
  }

  interface WindowWithLayoutShifts extends Window {
    layoutShifts: LayoutShift[]
    __cls?: number
    __onLayoutShift?: (entry: LayoutShift) => void
  }

  // Extended PerformanceEntry for resource timing
  interface PerformanceEntry {
    initiatorType?: string
    transferSize?: number
    encodedBodySize?: number
    decodedBodySize?: number
    nextHopProtocol?: string
    renderBlockingStatus?: string
    responseStatus?: number
  }
}

// Playwright Page extensions
declare module '@playwright/test' {
  interface Page {
    /**
     * Emulates network conditions for performance testing
     */
    emulateNetworkConditions(conditions: {
      offline?: boolean
      downloadThroughput?: number
      uploadThroughput?: number
      latency?: number
    }): Promise<void>
  }
}

// Device configuration types for responsive testing
export interface DeviceConfig {
  readonly name: string
  readonly viewport: {
    readonly width: number
    readonly height: number
  }
  readonly isMobile?: true
  readonly isTablet?: true
  readonly isDesktop?: true
}

// Theme color configuration
export interface ThemeColors {
  primary: string
  background: string
  text: string
}

export {}