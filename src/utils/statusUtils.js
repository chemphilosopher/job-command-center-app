// Status and region color utilities

/**
 * Get Tailwind CSS classes for application status badge
 * @param {string} status - Application status
 * @returns {string} Tailwind CSS classes
 */
export function getStatusColor(status) {
  const colors = {
    'Applied': 'bg-blue-100 text-blue-800',
    'Reviewed': 'bg-purple-100 text-purple-800',
    'Phone Screen': 'bg-yellow-100 text-yellow-800',
    'Technical': 'bg-orange-100 text-orange-800',
    'Onsite': 'bg-pink-100 text-pink-800',
    'Offer': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Ghost': 'bg-gray-300 text-gray-600', // NEW: Ghost status
    'Withdrawn': 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

/**
 * Get Tailwind CSS classes for region badge
 * @param {string} region - Geographic region
 * @returns {string} Tailwind CSS classes with border
 */
export function getRegionColor(region) {
  const colors = {
    'Boston/Cambridge': 'bg-blue-50 text-blue-700 border-blue-200',
    'RTP/Durham': 'bg-green-50 text-green-700 border-green-200',
    'SF Bay Area': 'bg-orange-50 text-orange-700 border-orange-200',
    'San Diego': 'bg-purple-50 text-purple-700 border-purple-200',
    'Remote': 'bg-gray-50 text-gray-700 border-gray-200',
    'Other': 'bg-gray-50 text-gray-700 border-gray-200'
  }
  return colors[region] || 'bg-gray-50 text-gray-700 border-gray-200'
}

/**
 * Get Tailwind CSS classes for company priority
 * @param {number} priority - Priority level (1-5)
 * @returns {string} Tailwind CSS classes
 */
export function getPriorityColor(priority) {
  const colors = {
    1: 'bg-red-100 text-red-800 border-red-200',
    2: 'bg-orange-100 text-orange-800 border-orange-200',
    3: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    4: 'bg-blue-100 text-blue-800 border-blue-200',
    5: 'bg-gray-100 text-gray-800 border-gray-200'
  }
  return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200'
}

/**
 * Get Tailwind CSS classes for company status
 * @param {string} status - Company tracking status
 * @returns {string} Tailwind CSS classes
 */
export function getCompanyStatusColor(status) {
  const colors = {
    'Researching': 'bg-blue-100 text-blue-800',
    'Ready to Apply': 'bg-yellow-100 text-yellow-800',
    'Applied': 'bg-purple-100 text-purple-800',
    'Interviewing': 'bg-green-100 text-green-800',
    'Dormant': 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

/**
 * Get Tailwind CSS classes for intro status
 * @param {string} status - Introduction request status
 * @returns {string} Tailwind CSS classes
 */
export function getIntroStatusColor(status) {
  const colors = {
    'Not Asked': 'bg-gray-100 text-gray-600',
    'Asked': 'bg-yellow-100 text-yellow-800',
    'Intro Made': 'bg-green-100 text-green-800',
    'Declined': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-600'
}
