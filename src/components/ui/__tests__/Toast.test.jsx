import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import Toast from '../Toast'

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders message correctly', () => {
    const onClose = vi.fn()
    render(<Toast message="Test message" type="success" onClose={onClose} />)

    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('applies success styling for success type', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Toast message="Success!" type="success" onClose={onClose} />
    )

    const toast = container.firstChild
    expect(toast.className).toContain('bg-green-500')
  })

  it('applies error styling for error type', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Toast message="Error!" type="error" onClose={onClose} />
    )

    const toast = container.firstChild
    expect(toast.className).toContain('bg-red-500')
  })

  it('applies info styling for info type', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Toast message="Info!" type="info" onClose={onClose} />
    )

    const toast = container.firstChild
    expect(toast.className).toContain('bg-blue-500')
  })

  it('auto-dismisses after 3 seconds', async () => {
    const onClose = vi.fn()
    render(<Toast message="Test" onClose={onClose} />)

    expect(onClose).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('cleans up timer on unmount', () => {
    const onClose = vi.fn()
    const { unmount } = render(<Toast message="Test" onClose={onClose} />)

    unmount()

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    // Should not have been called because component was unmounted
    expect(onClose).not.toHaveBeenCalled()
  })
})
