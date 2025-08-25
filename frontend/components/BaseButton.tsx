/**
 * Coffee Roast Tracker - BaseButton Component
 * Accessible, themeable button component with comprehensive variant support
 */

'use client'

import React, { forwardRef } from 'react'
import { useThemeData } from '@/lib/theme-context'

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'emergency' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'
export type IconPosition = 'left' | 'right'

export interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button visual variant */
  variant?: ButtonVariant
  /** Button size */
  size?: ButtonSize
  /** Show loading state */
  loading?: boolean
  /** Custom loading text */
  loadingText?: string
  /** Icon element */
  icon?: React.ReactNode
  /** Icon position relative to text */
  iconPosition?: IconPosition
  /** Icon-only button (hides text, requires aria-label) */
  iconOnly?: boolean
  /** Additional CSS classes */
  className?: string
  /** Button children (text content) */
  children?: React.ReactNode
}

/**
 * BaseButton Component
 * 
 * A comprehensive, accessible button component that adapts to all themes
 * and provides consistent interaction patterns across the application.
 * 
 * Features:
 * - WCAG 2.1 AA compliance
 * - Touch target optimization (minimum 44px, preferred 60px)
 * - Theme-aware styling
 * - Loading states with accessibility
 * - Icon support with flexible positioning
 * - Keyboard navigation
 * - Screen reader friendly
 * - Form integration
 */
export const BaseButton = forwardRef<HTMLButtonElement, BaseButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  icon,
  iconPosition = 'left',
  iconOnly = false,
  className = '',
  children,
  disabled,
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const { theme } = useThemeData()

  // Build CSS classes
  const baseClasses = ['btn']
  
  // Variant class
  baseClasses.push(`btn--${variant}`)
  
  // Size class mapping to match CSS classes
  const sizeMap: Record<ButtonSize, string | null> = {
    sm: 'btn--small',
    md: null,
    lg: 'btn--large', 
    xl: 'btn--xl'
  }
  
  const sizeClass = sizeMap[size]
  if (sizeClass) {
    baseClasses.push(sizeClass)
  }
  
  // Icon positioning
  if (icon && !iconOnly) {
    baseClasses.push(`btn--icon-${iconPosition}`)
  }
  
  // Icon-only button
  if (iconOnly) {
    baseClasses.push('btn--icon-only')
  }
  
  // Loading state
  if (loading) {
    baseClasses.push('btn--loading')
  }
  
  // Theme-specific classes (if needed for special styling)
  if (theme === 'contrast') {
    baseClasses.push('btn--high-contrast')
  }
  
  // Combine with custom classes
  const finalClassName = `${baseClasses.join(' ')} ${className}`.trim()

  // Determine if button should be disabled
  const isDisabled = disabled || loading

  // Determine accessible label
  const accessibleLabel = iconOnly ? ariaLabel : undefined
  if (iconOnly && !accessibleLabel) {
    console.warn('BaseButton: iconOnly buttons require an aria-label prop for accessibility')
  }

  // Loading content
  const loadingContent = loadingText || (typeof children === 'string' ? children : 'Loading...')

  // Button content
  const buttonContent = loading ? (
    <span className="btn__content btn__content--loading">
      <span className="btn__spinner" aria-hidden="true" />
      <span className="btn__loading-text">{loadingContent}</span>
    </span>
  ) : (
    <span className="btn__content">
      {icon && (iconPosition === 'left' || iconOnly) && (
        <span className="btn__icon btn__icon--left" aria-hidden="true">
          {icon}
        </span>
      )}
      {!iconOnly && (
        <span className="btn__text">
          {children}
        </span>
      )}
      {icon && iconPosition === 'right' && !iconOnly && (
        <span className="btn__icon btn__icon--right" aria-hidden="true">
          {icon}
        </span>
      )}
    </span>
  )

  return (
    <button
      ref={ref}
      className={finalClassName}
      disabled={isDisabled}
      type={type}
      aria-label={accessibleLabel}
      aria-busy={loading}
      tabIndex={0}
      role="button"
      {...props}
    >
      {buttonContent}
    </button>
  )
})

BaseButton.displayName = 'BaseButton'

// Default export
export default BaseButton

// CSS classes for the component (already implemented in component-library.css)
/*
Additional BaseButton-specific styles to add to component-library.css:

.btn__content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
}

.btn__text {
  line-height: 1;
  font-weight: inherit;
}

.btn__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn__icon--left {
  order: -1;
}

.btn__icon--right {
  order: 1;
}

.btn--icon-left .btn__icon--left {
  margin-right: var(--space-1);
}

.btn--icon-right .btn__icon--right {
  margin-left: var(--space-1);
}

.btn--icon-only {
  width: var(--touch-target-preferred);
  padding: 0;
}

.btn--icon-only.btn--small {
  width: var(--touch-target-min);
}

.btn--icon-only.btn--large {
  width: var(--touch-target-large);
}

.btn--icon-only.btn--xl {
  width: var(--touch-target-emergency);
}

.btn__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.btn__content--loading {
  opacity: 0.8;
}

.btn__loading-text {
  margin-left: var(--space-2);
}

.btn--loading {
  cursor: not-allowed;
  pointer-events: auto;
}

.btn--high-contrast {
  border-width: 3px;
  font-weight: var(--font-weight-bold);
}

@media (prefers-reduced-motion: reduce) {
  .btn__spinner {
    animation: none;
    border-right-color: currentColor;
  }
}

@media (prefers-contrast: high) {
  .btn {
    border-width: 3px;
    font-weight: var(--font-weight-bold);
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
*/