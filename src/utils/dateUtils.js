// Date formatting and calculation utilities

/**
 * Format a date string to a readable format
 * @param {string|null} dateString - ISO date string or null
 * @returns {string} Formatted date or '-' if null
 */
export function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Calculate how many days ago a date was
 * @param {string} dateString - ISO date string
 * @returns {number} Number of days since the date
 */
export function getDaysAgo(dateString) {
  if (!dateString) return null
  const date = new Date(dateString)
  const today = new Date()
  const diffTime = today.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Check if a follow-up date is overdue
 * @param {string} dateString - ISO date string for follow-up
 * @returns {boolean} True if the date is in the past
 */
export function isOverdue(dateString) {
  if (!dateString) return false
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 * @returns {string} Today's date
 */
export function getTodayISO() {
  return new Date().toISOString().split('T')[0]
}

/**
 * Format date for display with time
 * @param {string} dateString - ISO datetime string
 * @returns {string} Formatted date and time
 */
export function formatDateTime(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}
