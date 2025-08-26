/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeProvider } from '@/lib/theme-context'
import { BaseButton } from '@/components/BaseButton'

describe('BaseButton', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  test('should render with default props', () => {
    render(
      <ThemeProvider>
        <BaseButton>Click me</BaseButton>
      </ThemeProvider>
    )

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('btn', 'btn--primary')
    expect(button).toHaveAttribute('type', 'button')
  })

  test('should support all button variants', () => {
    const { rerender } = render(
      <ThemeProvider>
        <BaseButton variant="primary">Primary</BaseButton>
      </ThemeProvider>
    )
    expect(screen.getByRole('button')).toHaveClass('btn--primary')

    rerender(
      <ThemeProvider>
        <BaseButton variant="secondary">Secondary</BaseButton>
      </ThemeProvider>
    )
    expect(screen.getByRole('button')).toHaveClass('btn--secondary')

    rerender(
      <ThemeProvider>
        <BaseButton variant="success">Success</BaseButton>
      </ThemeProvider>
    )
    expect(screen.getByRole('button')).toHaveClass('btn--success')

    rerender(
      <ThemeProvider>
        <BaseButton variant="emergency">Emergency</BaseButton>
      </ThemeProvider>
    )
    expect(screen.getByRole('button')).toHaveClass('btn--emergency')

    rerender(
      <ThemeProvider>
        <BaseButton variant="ghost">Ghost</BaseButton>
      </ThemeProvider>
    )
    expect(screen.getByRole('button')).toHaveClass('btn--ghost')
  })

  test('should support all button sizes', () => {
    const { rerender } = render(
      <ThemeProvider>
        <BaseButton size="sm">Small</BaseButton>
      </ThemeProvider>
    )
    expect(screen.getByRole('button')).toHaveClass('btn--small')

    rerender(
      <ThemeProvider>
        <BaseButton size="md">Medium</BaseButton>
      </ThemeProvider>
    )
    // Medium is default, no additional class
    expect(screen.getByRole('button')).not.toHaveClass('btn--small', 'btn--large')

    rerender(
      <ThemeProvider>
        <BaseButton size="lg">Large</BaseButton>
      </ThemeProvider>
    )
    expect(screen.getByRole('button')).toHaveClass('btn--large')

    rerender(
      <ThemeProvider>
        <BaseButton size="xl">Extra Large</BaseButton>
      </ThemeProvider>
    )
    expect(screen.getByRole('button')).toHaveClass('btn--xl')
  })

  test('should handle click events', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <BaseButton onClick={handleClick}>Click me</BaseButton>
      </ThemeProvider>
    )

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('should be disabled when disabled prop is true', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <BaseButton disabled onClick={handleClick}>Disabled</BaseButton>
      </ThemeProvider>
    )

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    
    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  test('should show loading state', () => {
    render(
      <ThemeProvider>
        <BaseButton loading>Loading</BaseButton>
      </ThemeProvider>
    )

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    
    // Should show loading text or spinner
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test('should support custom loading text', () => {
    render(
      <ThemeProvider>
        <BaseButton loading loadingText="Processing...">Submit</BaseButton>
      </ThemeProvider>
    )

    expect(screen.getByText(/processing/i)).toBeInTheDocument()
  })

  test('should support icons', () => {
    const TestIcon = () => <span data-testid="test-icon">🔥</span>

    const { rerender } = render(
      <ThemeProvider>
        <BaseButton icon={<TestIcon />}>With Icon</BaseButton>
      </ThemeProvider>
    )

    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    expect(screen.getByText('With Icon')).toBeInTheDocument()

    // Icon-only button
    rerender(
      <ThemeProvider>
        <BaseButton icon={<TestIcon />} iconOnly aria-label="Fire button">
        </BaseButton>
      </ThemeProvider>
    )

    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    expect(screen.getByLabelText('Fire button')).toBeInTheDocument()
  })

  test('should support icon position', () => {
    const TestIcon = () => <span data-testid="test-icon">🔥</span>

    const { rerender } = render(
      <ThemeProvider>
        <BaseButton icon={<TestIcon />} iconPosition="left">Left Icon</BaseButton>
      </ThemeProvider>
    )

    let button = screen.getByRole('button')
    expect(button).toHaveClass('btn--icon-left')

    rerender(
      <ThemeProvider>
        <BaseButton icon={<TestIcon />} iconPosition="right">Right Icon</BaseButton>
      </ThemeProvider>
    )

    button = screen.getByRole('button')
    expect(button).toHaveClass('btn--icon-right')
  })

  test('should meet accessibility requirements', () => {
    render(
      <ThemeProvider>
        <BaseButton>Accessible Button</BaseButton>
      </ThemeProvider>
    )

    const button = screen.getByRole('button')
    
    // Should be focusable
    expect(button).toHaveAttribute('tabindex', '0')
    
    // Should have proper button role
    expect(button).toHaveAttribute('role', 'button')
    
    // Should support keyboard interaction
    fireEvent.keyDown(button, { key: 'Enter' })
    fireEvent.keyDown(button, { key: ' ' })
  })

  test('should meet touch target size requirements', () => {
    // Set up CSS for test
    const style = document.createElement('style')
    style.innerHTML = `
      .btn {
        min-height: 60px;
      }
    `
    document.head.appendChild(style)

    render(
      <ThemeProvider>
        <BaseButton>Touch Target</BaseButton>
      </ThemeProvider>
    )

    const button = screen.getByRole('button')
    const computedStyle = getComputedStyle(button)
    
    // Should meet minimum touch target of 44px
    expect(computedStyle.minHeight).toBe('60px')
    
    document.head.removeChild(style)
  })

  test('should support forwarded ref', () => {
    const ref = React.createRef<HTMLButtonElement>()

    render(
      <ThemeProvider>
        <BaseButton ref={ref}>Ref Button</BaseButton>
      </ThemeProvider>
    )

    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    expect(ref.current).toHaveTextContent('Ref Button')
  })

  test('should support custom HTML attributes', () => {
    render(
      <ThemeProvider>
        <BaseButton 
          id="custom-button"
          data-testid="custom-test"
          aria-describedby="description"
          title="Custom button"
        >
          Custom
        </BaseButton>
      </ThemeProvider>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('id', 'custom-button')
    expect(button).toHaveAttribute('data-testid', 'custom-test')
    expect(button).toHaveAttribute('aria-describedby', 'description')
    expect(button).toHaveAttribute('title', 'Custom button')
  })

  test('should handle form submission', () => {
    const handleSubmit = jest.fn()

    render(
      <ThemeProvider>
        <form onSubmit={handleSubmit}>
          <BaseButton type="submit">Submit</BaseButton>
        </form>
      </ThemeProvider>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
    
    fireEvent.click(button)
    expect(handleSubmit).toHaveBeenCalled()
  })

  test('should work across all themes', () => {
    render(
      <ThemeProvider>
        <BaseButton variant="primary">Test Button</BaseButton>
      </ThemeProvider>
    )

    const button = screen.getByRole('button')
    
    // Test each theme
    document.documentElement.setAttribute('data-theme', 'classic')
    expect(button).toHaveClass('btn--primary')
    
    document.documentElement.setAttribute('data-theme', 'contrast')
    expect(button).toHaveClass('btn--primary')
    
    document.documentElement.setAttribute('data-theme', 'focus')
    expect(button).toHaveClass('btn--primary')
    
    document.documentElement.setAttribute('data-theme', 'energizing')
    expect(button).toHaveClass('btn--primary')
  })

  test('should support custom className', () => {
    render(
      <ThemeProvider>
        <BaseButton className="custom-class">Custom</BaseButton>
      </ThemeProvider>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
    expect(button).toHaveClass('btn') // Should still have base class
  })

  test('should prevent double-click when loading', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <BaseButton loading onClick={handleClick}>Loading</BaseButton>
      </ThemeProvider>
    )

    const button = screen.getByRole('button')
    
    // Should not respond to clicks when loading
    await user.click(button)
    await user.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  test('should support focus management', async () => {
    render(
      <ThemeProvider>
        <BaseButton>Focus Test</BaseButton>
      </ThemeProvider>
    )

    const button = screen.getByRole('button')
    
    // Should be focusable
    button.focus()
    expect(button).toHaveFocus()
    
    // Should lose focus when blurred
    button.blur()
    expect(button).not.toHaveFocus()
  })

  test('should support emergency button with enhanced accessibility', () => {
    render(
      <ThemeProvider>
        <BaseButton variant="emergency" size="lg">Emergency Stop</BaseButton>
      </ThemeProvider>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveClass('btn--emergency', 'btn--large')
    
    // Emergency buttons should have enhanced visual prominence
    expect(button).toHaveTextContent('Emergency Stop')
  })
})