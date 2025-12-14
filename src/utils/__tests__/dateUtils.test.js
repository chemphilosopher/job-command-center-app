import { describe, it, expect } from 'vitest'
import { formatDate, getDaysAgo, isOverdue, getTodayISO } from '../dateUtils'

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('formats ISO date correctly', () => {
      // Use a full ISO timestamp with timezone to avoid timezone offset issues
      const result = formatDate('2025-01-15T12:00:00')
      expect(result).toContain('Jan')
      expect(result).toContain('15')
      expect(result).toContain('2025')
    })

    it('returns "-" for null input', () => {
      expect(formatDate(null)).toBe('-')
    })

    it('returns "-" for undefined input', () => {
      expect(formatDate(undefined)).toBe('-')
    })

    it('returns "-" for empty string', () => {
      expect(formatDate('')).toBe('-')
    })
  })

  describe('getDaysAgo', () => {
    it('returns 0 for today', () => {
      const today = new Date().toISOString()
      expect(getDaysAgo(today)).toBe(0)
    })

    it('returns correct days for past date', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      expect(getDaysAgo(yesterday.toISOString())).toBe(1)
    })

    it('returns null for null input', () => {
      expect(getDaysAgo(null)).toBeNull()
    })
  })

  describe('isOverdue', () => {
    it('returns false for null input', () => {
      expect(isOverdue(null)).toBe(false)
    })

    it('returns true for past date', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)
      expect(isOverdue(pastDate.toISOString())).toBe(true)
    })

    it('returns false for future date', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1)
      expect(isOverdue(futureDate.toISOString())).toBe(false)
    })
  })

  describe('getTodayISO', () => {
    it('returns today in ISO format', () => {
      const result = getTodayISO()
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })
})
