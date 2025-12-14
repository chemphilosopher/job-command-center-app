// Re-export all utilities for clean imports

export { generateId } from './idUtils'

export {
  formatDate,
  getDaysAgo,
  isOverdue,
  getTodayISO,
  formatDateTime
} from './dateUtils'

export {
  formatCurrency,
  truncateText,
  calculateStorageSize,
  formatPercentage
} from './formatUtils'

export {
  getStatusColor,
  getRegionColor,
  getPriorityColor,
  getCompanyStatusColor,
  getIntroStatusColor
} from './statusUtils'
