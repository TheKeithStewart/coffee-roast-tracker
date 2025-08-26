/**
 * Coffee Roast Tracker - Theme Switcher Component
 * Accessible dropdown with keyboard navigation and WCAG 2.1 AA compliance
 */

'use client'

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useThemeData, useThemeActions, type Theme } from '@/lib/theme-context'

export interface ThemeSwitcherProps {
  /** Display variant */
  variant?: 'dropdown' | 'tabs' | 'cards'
  /** Component size */
  size?: 'sm' | 'md' | 'lg'
  /** Show theme color previews */
  showPreview?: boolean
  /** Show system preference option */
  showSystemOption?: boolean
  /** Position context for styling */
  position?: 'navigation' | 'modal' | 'page'
  /** Custom callback when theme changes */
  onThemeChange?: (theme: Theme) => void
  /** Additional CSS classes */
  className?: string
}

/**
 * ThemeSwitcher Component
 * 
 * Provides an accessible interface for users to switch between color themes.
 * Implements WCAG 2.1 AA guidelines with full keyboard navigation support.
 */
export function ThemeSwitcher({
  variant = 'dropdown',
  size = 'md',
  showPreview = false,
  showSystemOption = false,
  position = 'navigation',
  onThemeChange,
  className = ''
}: ThemeSwitcherProps) {
  const { theme: currentTheme, themes } = useThemeData()
  const { setTheme, resetToSystemPreference } = useThemeActions()
  
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)
  const optionRefs = useRef<(HTMLLIElement | null)[]>([])

  // Get current theme display info
  const currentThemeInfo = themes.find(t => t.id === currentTheme) || themes[0]

  // Build options list (themes + optional system preference)
  const options = useMemo(() => 
    showSystemOption 
      ? [...themes, { id: 'system' as Theme, name: 'System Preference', description: 'Follow system dark/light mode setting', colors: { primary: '', background: '', text: '' }, accessibility: { contrastRatio: 0, colorBlindFriendly: false, highContrastMode: false } }]
      : themes,
    [themes, showSystemOption]
  )

  // Handle theme selection
  const handleThemeSelect = useCallback((themeId: Theme | 'system') => {
    try {
      if (themeId === 'system') {
        resetToSystemPreference()
        onThemeChange?.(currentTheme) // Pass current effective theme
      } else {
        setTheme(themeId)
        onThemeChange?.(themeId)
      }
      setIsOpen(false)
      triggerRef.current?.focus()
    } catch (error) {
      console.error('Failed to switch theme:', error)
    }
  }, [setTheme, resetToSystemPreference, currentTheme, onThemeChange])

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault()
        setIsOpen(true)
        const currentIndex = options.findIndex(option => option.id === currentTheme)
        setFocusedIndex(currentIndex >= 0 ? currentIndex : 0)
      }
      return
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        setIsOpen(false)
        triggerRef.current?.focus()
        break
        
      case 'ArrowDown':
        event.preventDefault()
        const nextIndex = (focusedIndex + 1) % options.length
        setFocusedIndex(nextIndex)
        break
        
      case 'ArrowUp':
        event.preventDefault()
        const prevIndex = focusedIndex === 0 ? options.length - 1 : focusedIndex - 1
        setFocusedIndex(prevIndex)
        break
        
      case 'Home':
        event.preventDefault()
        setFocusedIndex(0)
        break
        
      case 'End':
        event.preventDefault()
        setFocusedIndex(options.length - 1)
        break
        
      case 'Enter':
      case ' ':
        event.preventDefault()
        const focusedOption = options[focusedIndex]
        if (focusedOption) {
          handleThemeSelect(focusedOption.id)
        }
        break
        
      case 'Tab':
        // Allow normal tab behavior within dropdown
        if (event.shiftKey && focusedIndex === 0) {
          setIsOpen(false)
          triggerRef.current?.focus()
        } else if (!event.shiftKey && focusedIndex === options.length - 1) {
          setIsOpen(false)
        }
        break
        
      default:
        // Handle letter navigation
        const letter = event.key.toLowerCase()
        const matchingIndex = options.findIndex(option => 
          option.name.toLowerCase().startsWith(letter)
        )
        if (matchingIndex >= 0) {
          setFocusedIndex(matchingIndex)
        }
    }
  }, [isOpen, focusedIndex, options, currentTheme, handleThemeSelect])

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!triggerRef.current?.contains(target) && !listboxRef.current?.contains(target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Focus management for options
  useEffect(() => {
    if (isOpen && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.focus()
    }
  }, [focusedIndex, isOpen])

  // Size classes
  const sizeClasses = {
    sm: 'btn--small',
    md: '',
    lg: 'btn--large'
  }

  // Position classes
  const positionClasses = {
    navigation: 'theme-switcher--navigation',
    modal: 'theme-switcher--modal', 
    page: 'theme-switcher--page'
  }

  const baseClassName = `theme-switcher ${sizeClasses[size]} ${positionClasses[position]} ${className}`.trim()

  if (variant === 'dropdown') {
    return (
      <div className={baseClassName} data-position={position}>
        {/* Trigger Button */}
        <button
          ref={triggerRef}
          className={`btn btn--secondary theme-switcher__trigger ${sizeClasses[size]}`}
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={`Theme selection, current: ${currentThemeInfo.name}`}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
        >
          <div className="theme-switcher__trigger-content">
            {showPreview && (
              <span 
                className="theme-switcher__preview"
                style={{ backgroundColor: currentThemeInfo.colors.primary }}
                aria-hidden="true"
              />
            )}
            <span className="theme-switcher__label">{currentThemeInfo.name}</span>
            <span 
              className={`theme-switcher__arrow ${isOpen ? 'theme-switcher__arrow--open' : ''}`}
              aria-hidden="true"
            >
              ▼
            </span>
          </div>
        </button>

        {/* Dropdown List */}
        {isOpen && (
          <ul
            ref={listboxRef}
            className="theme-switcher__listbox"
            role="listbox"
            aria-label="Color themes"
          >
            {options.map((option, index) => (
              <li
                key={option.id}
                ref={el => {
                  optionRefs.current[index] = el
                }}
                className={`theme-switcher__option ${
                  option.id === currentTheme ? 'theme-switcher__option--selected' : ''
                } ${
                  index === focusedIndex ? 'theme-switcher__option--focused' : ''
                }`}
                role="option"
                tabIndex={-1}
                aria-selected={option.id === currentTheme}
                aria-label={`${option.name} - ${option.description}`}
                onClick={() => handleThemeSelect(option.id)}
                onKeyDown={handleKeyDown}
              >
                <div className="theme-switcher__option-content">
                  {showPreview && option.colors.primary && (
                    <span 
                      className="theme-switcher__option-preview"
                      data-testid="theme-preview"
                      style={{ backgroundColor: option.colors.primary }}
                      aria-hidden="true"
                    />
                  )}
                  <div className="theme-switcher__option-text">
                    <span className="theme-switcher__option-name">{option.name}</span>
                    <span className="theme-switcher__option-description">
                      {option.description}
                    </span>
                  </div>
                  {option.id === currentTheme && (
                    <span className="theme-switcher__checkmark" aria-hidden="true">✓</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Screen reader announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {isOpen ? `Theme menu opened. ${options.length} options available. Use arrow keys to navigate.` : ''}
        </div>
      </div>
    )
  }

  // TODO: Implement tabs and cards variants
  return <div>Other variants not yet implemented</div>
}

// Default export
export default ThemeSwitcher

// CSS classes (will be applied via our design system CSS)
/*
.theme-switcher {
  position: relative;
  display: inline-block;
}

.theme-switcher__trigger {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.theme-switcher__trigger-content {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.theme-switcher__preview {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
}

.theme-switcher__arrow {
  transition: transform var(--duration-200) var(--ease-in-out);
  font-size: 12px;
}

.theme-switcher__arrow--open {
  transform: rotate(180deg);
}

.theme-switcher__listbox {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: var(--space-1);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
  max-height: 300px;
  overflow-y: auto;
  list-style: none;
  padding: var(--space-2);
}

.theme-switcher__option {
  border-radius: var(--radius-md);
  cursor: pointer;
  min-height: var(--touch-target-preferred);
}

.theme-switcher__option:hover,
.theme-switcher__option--focused {
  background-color: var(--color-surface-secondary);
}

.theme-switcher__option--selected {
  background-color: var(--color-primary-50);
  color: var(--color-primary-700);
}

.theme-switcher__option-content {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
}

.theme-switcher__option-preview {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}

.theme-switcher__option-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.theme-switcher__option-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.theme-switcher__option-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-tight);
}

.theme-switcher__checkmark {
  color: var(--color-success-500);
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
}
*/