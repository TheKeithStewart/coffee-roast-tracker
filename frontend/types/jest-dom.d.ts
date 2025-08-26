import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeDisabled(): R
      toBeEnabled(): R
      toBeEmptyDOMElement(): R
      toBeInTheDocument(): R
      toBeInvalid(): R
      toBeRequired(): R
      toBeValid(): R
      toBeVisible(): R
      toContainElement(element: HTMLElement | null): R
      toContainHTML(htmlText: string): R
      toHaveAccessibleDescription(text?: string | RegExp): R
      toHaveAccessibleName(text?: string | RegExp): R
      toHaveAttribute(attr: string, value?: string | number | boolean): R
      toHaveClass(...classNames: string[]): R
      toHaveFocus(): R
      toHaveFormValues(expectedValues: Record<string, string | number | boolean>): R
      toHaveStyle(css: string | Record<string, string | number>): R
      toHaveTextContent(text: string | RegExp | null): R
      toHaveValue(value: string | string[] | number): R
      toHaveDisplayValue(value: string | RegExp | string[]): R
      toBeChecked(): R
      toBePartiallyChecked(): R
      toHaveDescription(text?: string | RegExp): R
    }
  }
}