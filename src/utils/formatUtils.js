// Text and number formatting utilities

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD') {
  if (amount == null || isNaN(amount)) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Truncate text to a maximum length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Calculate storage used by data in KB
 * @param {...any} data - Data objects to measure
 * @returns {string} Size in KB with one decimal place
 */
export function calculateStorageSize(...data) {
  const totalBytes = data.reduce((sum, item) => {
    return sum + JSON.stringify(item).length
  }, 0)
  return (totalBytes / 1024).toFixed(1)
}

/**
 * Format a percentage
 * @param {number} value - The decimal value (0-1) or percentage
 * @param {boolean} isDecimal - Whether the value is a decimal (default: true)
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, isDecimal = true) {
  if (value == null || isNaN(value)) return '-'
  const percentage = isDecimal ? value * 100 : value
  return `${Math.round(percentage)}%`
}
