import { useEffect, useCallback } from 'react'

/**
 * Custom hook for managing keyboard shortcuts
 * Provides consistent keyboard navigation across the app
 */
export function useKeyboardShortcuts(shortcuts) {
  const handleKeyDown = useCallback((e) => {
    // Cmd/Ctrl+Enter to save in modals
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (shortcuts.onSave) {
        e.preventDefault()
        shortcuts.onSave()
      }
      return
    }

    // Escape to close modals (consistent across all modals)
    if (e.key === 'Escape') {
      if (shortcuts.onClose) {
        e.preventDefault()
        shortcuts.onClose()
      }
      return
    }

    // Don't trigger shortcuts when typing in inputs
    if (
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'TEXTAREA' ||
      e.target.tagName === 'SELECT' ||
      e.target.isContentEditable
    ) {
      return
    }

    // Navigation shortcuts
    switch (e.key) {
      case 'n':
        if (shortcuts.onNew) {
          e.preventDefault()
          shortcuts.onNew()
        }
        break
      case '/':
        if (shortcuts.onSearch) {
          e.preventDefault()
          shortcuts.onSearch()
        }
        break
      case '?':
        if (shortcuts.onHelp) {
          e.preventDefault()
          shortcuts.onHelp()
        }
        break
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
        if (shortcuts.onTabChange) {
          e.preventDefault()
          shortcuts.onTabChange(parseInt(e.key) - 1)
        }
        break
      default:
        break
    }
  }, [shortcuts])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

/**
 * Hook for modal-specific keyboard shortcuts
 */
export function useModalShortcuts({ onClose, onSave }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        e.preventDefault()
        onClose()
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && onSave) {
        e.preventDefault()
        onSave()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onSave])
}

export default useKeyboardShortcuts
