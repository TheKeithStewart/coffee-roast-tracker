/**
 * Coffee Roast Tracker - Home Page
 * Testing design system integration and theme functionality
 */

import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { BaseButton } from '@/components/BaseButton'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Skip link for accessibility */}
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      {/* Header with brand logo */}
      <header style={{ 
        padding: 'var(--space-6)', 
        borderBottom: '2px solid var(--color-border)', 
        backgroundColor: 'var(--color-surface)' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="brand-logo brand-logo--horizontal">
            <div className="brand-logo__icon brand-logo__icon--md">
              ☕
            </div>
            <div className="brand-logo__text brand-logo__text--lg">
              Coffee Roast Tracker
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main id="main" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-8)' }}>
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <h1 className="typography-h1" style={{ marginBottom: 'var(--space-4)' }}>
            Design System Integration Test
          </h1>
          <p className="typography-body-large" style={{ marginBottom: 'var(--space-6)', color: 'var(--color-text-secondary)' }}>
            This page demonstrates the successful integration of our complete design system
            with TailwindCSS v4, featuring 4 color themes, accessibility compliance,
            and performance optimization.
          </p>
        </section>

        {/* Theme Testing Section */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <h2 className="typography-h2" style={{ marginBottom: 'var(--space-6)' }}>Theme System Test</h2>
          
          {/* Accessible theme switcher */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <p className="typography-body" style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
              Use this accessible theme switcher to switch between all 4 color themes. Supports keyboard navigation and screen readers.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
              <ThemeSwitcher 
                showPreview 
                showSystemOption 
                position="page"
              />
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                Try keyboard navigation: Tab to focus, Enter/Space to open, Arrow keys to navigate
              </span>
            </div>
          </div>
        </section>

        {/* Component Testing Section */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <h2 className="typography-h2" style={{ marginBottom: 'var(--space-6)' }}>Component Library Test</h2>
          
          {/* Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--space-6)', 
            marginBottom: 'var(--space-8)' 
          }}>
            <div className="card">
              <div className="card__header">
                <h3 className="card__title">Ethiopia Yirgacheffe</h3>
                <p className="card__subtitle">Light Roast</p>
              </div>
              <div className="card__body">
                <p className="typography-body" style={{ marginBottom: 'var(--space-4)' }}>
                  Bright, floral notes with citrus acidity. Perfect for pour-over methods.
                </p>
              </div>
              <div className="card__footer">
                <BaseButton size="sm" variant="primary">Select</BaseButton>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>In Stock</span>
              </div>
            </div>

            <div className="card">
              <div className="card__header">
                <h3 className="card__title">Guatemala Antigua</h3>
                <p className="card__subtitle">Medium Roast</p>
              </div>
              <div className="card__body">
                <p className="typography-body" style={{ marginBottom: 'var(--space-4)' }}>
                  Rich chocolate and spice notes with full body and smoky undertones.
                </p>
              </div>
              <div className="card__footer">
                <BaseButton size="sm" variant="primary">Select</BaseButton>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>In Stock</span>
              </div>
            </div>

            <div className="card">
              <div className="card__header">
                <h3 className="card__title">Brazil Santos</h3>
                <p className="card__subtitle">Dark Roast</p>
              </div>
              <div className="card__body">
                <p className="typography-body" style={{ marginBottom: 'var(--space-4)' }}>
                  Nutty, caramel flavors with low acidity and heavy body.
                </p>
              </div>
              <div className="card__footer">
                <button className="btn btn--small">Select</button>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>Low Stock</span>
              </div>
            </div>
          </div>

          {/* Button Variants with BaseButton */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h3 className="typography-h3" style={{ marginBottom: 'var(--space-4)' }}>Button Variants</h3>
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
              <BaseButton variant="primary">Primary</BaseButton>
              <BaseButton variant="secondary">Secondary</BaseButton>
              <BaseButton variant="success">Success</BaseButton>
              <BaseButton variant="emergency">Emergency Stop</BaseButton>
              <BaseButton variant="ghost">Ghost</BaseButton>
              <BaseButton variant="primary" disabled>Disabled</BaseButton>
            </div>
            
            <h4 className="typography-h4" style={{ marginBottom: 'var(--space-3)', marginTop: 'var(--space-6)' }}>Button Sizes</h4>
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
              <BaseButton size="sm">Small</BaseButton>
              <BaseButton size="md">Medium (Default)</BaseButton>
              <BaseButton size="lg">Large</BaseButton>
              <BaseButton size="xl">Extra Large</BaseButton>
            </div>
            
            <h4 className="typography-h4" style={{ marginBottom: 'var(--space-3)', marginTop: 'var(--space-6)' }}>Loading States</h4>
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
              <BaseButton loading>Loading...</BaseButton>
              <BaseButton loading loadingText="Processing data...">Process Data</BaseButton>
              <BaseButton variant="emergency" loading loadingText="Emergency stop in progress">Emergency</BaseButton>
            </div>
            
            <h4 className="typography-h4" style={{ marginBottom: 'var(--space-3)', marginTop: 'var(--space-6)' }}>Icon Buttons</h4>
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
              <BaseButton icon={<span>🔥</span>} iconPosition="left">Start Roast</BaseButton>
              <BaseButton icon={<span>⏸️</span>} iconPosition="right" variant="secondary">Pause</BaseButton>
              <BaseButton icon={<span>⏹️</span>} iconOnly variant="emergency" aria-label="Emergency stop" />
              <BaseButton icon={<span>📊</span>} iconOnly variant="ghost" aria-label="View statistics" />
            </div>
          </div>

          {/* Timer Display Test */}
          <div className="timer-display" style={{ marginBottom: 'var(--space-8)' }}>
            <div className="timer-display__time">05:43</div>
            <div className="timer-display__label">First Crack</div>
            <div className="timer-display__phase">
              Active Roasting
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar progress-bar--labeled" style={{ marginBottom: 'var(--space-8)' }}>
            <div className="progress-bar__label">
              <span>Roast Progress</span>
              <span>68%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar__track" style={{ width: '68%' }}></div>
            </div>
          </div>

          {/* Alerts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="alert alert--info">
              <div className="alert__icon">ℹ️</div>
              <div className="alert__content">
                <div className="alert__title">Info Alert</div>
                <div className="alert__message">
                  Design system successfully integrated with theme support.
                </div>
              </div>
            </div>
            
            <div className="alert alert--success">
              <div className="alert__icon">✅</div>
              <div className="alert__content">
                <div className="alert__title">Success Alert</div>
                <div className="alert__message">
                  CSS layers working correctly with TailwindCSS v4.
                </div>
              </div>
            </div>
            
            <div className="alert alert--warning">
              <div className="alert__icon">⚠️</div>
              <div className="alert__content">
                <div className="alert__title">Warning Alert</div>
                <div className="alert__message">
                  Temperature rising quickly - monitor roast closely.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Scale */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <h2 className="typography-h2" style={{ marginBottom: 'var(--space-6)' }}>Typography Scale</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <h1 className="typography-h1">Heading 1 - Main Page Title</h1>
            <h2 className="typography-h2">Heading 2 - Section Title</h2>
            <h3 className="typography-h3">Heading 3 - Subsection</h3>
            <h4 className="typography-h4">Heading 4 - Component Title</h4>
            <h5 className="typography-h5">Heading 5 - Small Section</h5>
            <h6 className="typography-h6">Heading 6 - Label</h6>
            <p className="typography-body-large">Large body text for important content</p>
            <p className="typography-body">Regular body text for standard content</p>
            <p className="typography-body-small">Small text for secondary information</p>
            <p className="typography-caption">Caption text for metadata</p>
          </div>
        </section>
      </main>

      {/* Live region for accessibility announcements */}
      <div id="live-region" className="sr-only" aria-live="polite" aria-atomic="true"></div>
    </div>
  );
}
