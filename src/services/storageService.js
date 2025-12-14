// Storage service for localStorage operations
// Provides a centralized API for all data persistence

// Storage keys for different data types
export const STORAGE_KEYS = {
  APPLICATIONS: 'pharma_job_tracker_applications',
  RESUME_VERSIONS: 'pharma_job_tracker_resume_versions',
  TARGET_COMPANIES: 'pharma_job_tracker_target_companies',
  NETWORKING_TOUCHES: 'pharma_job_tracker_networking_touches',
  NETWORKING_STATS: 'pharma_job_tracker_networking_stats',
  OUTREACH_TEMPLATES: 'pharma_job_tracker_outreach_templates',
  LLM_SETTINGS: 'pharma_job_tracker_llm_settings',
  JOB_API_SETTINGS: 'pharma_job_tracker_job_api_settings',
  LAST_BACKUP: 'pharma_job_tracker_last_backup',
  WELCOME_DISMISSED: 'pharma_job_tracker_welcomed',
  BACKUP_DISMISSED: 'pharma_job_tracker_backup_dismissed',
  GETTING_STARTED: 'pharma_job_tracker_getting_started'
}

// Default values for various data types
const DEFAULTS = {
  networkingStats: {
    currentStreak: 0,
    longestStreak: 0,
    totalTouches: 0,
    lastTouchDate: null
  },
  gettingStarted: {
    resumeUploaded: false,
    applicationAdded: false,
    companyAdded: false,
    aiConfigured: false,
    backupCreated: false,
    dismissed: false
  }
}

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Parsed data or default value
 */
export function loadFromStorage(key, defaultValue = null) {
  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error(`Error loading from storage (${key}):`, error)
  }
  return defaultValue
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} value - Data to save
 * @returns {boolean} Success status
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error saving to storage (${key}):`, error)
    return false
  }
}

/**
 * Remove a single key from localStorage
 * @param {string} key - Storage key to remove
 */
export function clearStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error clearing storage (${key}):`, error)
  }
}

/**
 * Clear all app data from localStorage
 */
export function clearAllStorage() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}

/**
 * Clear only API keys while preserving other settings
 * This is a security feature for shared computers
 */
export function clearAPIKeys() {
  // Clear LLM settings API keys
  const llmSettings = loadFromStorage(STORAGE_KEYS.LLM_SETTINGS)
  if (llmSettings) {
    const clearedSettings = {
      ...llmSettings,
      apiKeys: {} // Clear all API keys
    }
    saveToStorage(STORAGE_KEYS.LLM_SETTINGS, clearedSettings)
  }

  // Clear job API settings keys
  const jobSettings = loadFromStorage(STORAGE_KEYS.JOB_API_SETTINGS)
  if (jobSettings) {
    const clearedJobSettings = {
      ...jobSettings,
      apiKeys: {} // Clear all API keys
    }
    saveToStorage(STORAGE_KEYS.JOB_API_SETTINGS, clearedJobSettings)
  }
}

// Specific data loaders with defaults
export function loadApplications() {
  return loadFromStorage(STORAGE_KEYS.APPLICATIONS)
}

export function saveApplications(apps) {
  return saveToStorage(STORAGE_KEYS.APPLICATIONS, apps)
}

export function loadResumeVersions() {
  return loadFromStorage(STORAGE_KEYS.RESUME_VERSIONS)
}

export function saveResumeVersions(versions) {
  return saveToStorage(STORAGE_KEYS.RESUME_VERSIONS, versions)
}

export function loadTargetCompanies() {
  return loadFromStorage(STORAGE_KEYS.TARGET_COMPANIES)
}

export function saveTargetCompanies(companies) {
  return saveToStorage(STORAGE_KEYS.TARGET_COMPANIES, companies)
}

export function loadNetworkingTouches() {
  return loadFromStorage(STORAGE_KEYS.NETWORKING_TOUCHES)
}

export function saveNetworkingTouches(touches) {
  return saveToStorage(STORAGE_KEYS.NETWORKING_TOUCHES, touches)
}

export function loadNetworkingStats() {
  return loadFromStorage(STORAGE_KEYS.NETWORKING_STATS, DEFAULTS.networkingStats)
}

export function saveNetworkingStats(stats) {
  return saveToStorage(STORAGE_KEYS.NETWORKING_STATS, stats)
}

export function loadOutreachTemplates() {
  return loadFromStorage(STORAGE_KEYS.OUTREACH_TEMPLATES)
}

export function saveOutreachTemplates(templates) {
  return saveToStorage(STORAGE_KEYS.OUTREACH_TEMPLATES, templates)
}

export function loadGettingStarted() {
  return loadFromStorage(STORAGE_KEYS.GETTING_STARTED, DEFAULTS.gettingStarted)
}

export function saveGettingStarted(progress) {
  return saveToStorage(STORAGE_KEYS.GETTING_STARTED, progress)
}

// Backup management
export function getLastBackupDate() {
  return localStorage.getItem(STORAGE_KEYS.LAST_BACKUP)
}

export function setLastBackupDate() {
  localStorage.setItem(STORAGE_KEYS.LAST_BACKUP, new Date().toISOString())
}

export function isWelcomeDismissed() {
  return localStorage.getItem(STORAGE_KEYS.WELCOME_DISMISSED) === 'true'
}

export function setWelcomeDismissed() {
  localStorage.setItem(STORAGE_KEYS.WELCOME_DISMISSED, 'true')
}

/**
 * Export all data to JSON for backup
 * @param {Object} data - Object containing all data to export
 * @returns {Object} Export data with metadata
 */
export function createExportData(data) {
  return {
    exportDate: new Date().toISOString(),
    version: '2.0', // Updated version for new features
    ...data
  }
}

/**
 * Migrate application data to include new fields
 * Called when loading applications to ensure backward compatibility
 * @param {Array} applications - Array of application objects
 * @returns {Array} Migrated applications with new fields
 */
export function migrateApplications(applications) {
  if (!applications) return null

  return applications.map(app => ({
    ...app,
    // New fields for interview prep (Phase 5)
    interviewPrep: app.interviewPrep || {
      companyResearch: '',
      roleQuestions: [],
      behavioralStories: [],
      technicalTopics: [],
      questionsToAsk: [],
      lastUpdated: null
    },
    // New fields for salary negotiation (Phase 5)
    salary: app.salary || null,
    // New fields for job description archiving (Phase 5)
    jobDescription: app.jobDescription || null
  }))
}

/**
 * Calculate total storage used by app data
 * @returns {Object} Storage info { used: KB, keys: details }
 */
export function getStorageInfo() {
  const keys = Object.entries(STORAGE_KEYS).map(([name, key]) => {
    const data = localStorage.getItem(key)
    const bytes = data ? data.length : 0
    return {
      name,
      key,
      bytes,
      kb: (bytes / 1024).toFixed(2)
    }
  })

  const totalBytes = keys.reduce((sum, k) => sum + k.bytes, 0)

  return {
    totalKB: (totalBytes / 1024).toFixed(1),
    keys
  }
}
