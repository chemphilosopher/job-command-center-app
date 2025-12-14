// Export service for generating CSV and JSON exports
import { saveAs } from 'file-saver'
import { formatDate } from '../utils'

/**
 * Export applications to CSV format
 * Opens in Excel, Google Sheets, etc.
 */
export function exportToCSV(applications) {
  const headers = [
    'Company',
    'Title',
    'Status',
    'Date Applied',
    'Location',
    'Region',
    'Company Type',
    'Resume Version',
    'Application Source',
    'Referral',
    'Tags',
    'Last Contact',
    'Next Follow-up',
    'Notes'
  ]

  const rows = applications.map(app => [
    app.company || '',
    app.title || '',
    app.status || '',
    app.dateApplied || '',
    app.location || '',
    app.region || '',
    app.companyType || '',
    app.resumeVersion || '',
    app.applicationSource || '',
    app.referral || '',
    (app.tags || []).join('; '),
    app.lastContactDate || '',
    app.nextFollowUpDate || '',
    (app.interviewNotes || '').replace(/\n/g, ' ').replace(/"/g, '""')
  ])

  // Build CSV content with proper escaping
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => {
      const cellStr = String(cell || '')
      // Escape cells that contain commas, quotes, or newlines
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`
      }
      return cellStr
    }).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  const filename = `job-applications-${new Date().toISOString().split('T')[0]}.csv`
  saveAs(blob, filename)

  return filename
}

/**
 * Export all data to JSON for backup
 */
export function exportToJSON(data) {
  const exportData = {
    exportDate: new Date().toISOString(),
    version: '2.0',
    ...data
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const filename = `pharma_job_tracker_backup_${new Date().toISOString().split('T')[0]}.json`
  saveAs(blob, filename)

  return filename
}

/**
 * Generate summary statistics for export
 */
export function generateSummaryStats(applications) {
  const total = applications.length
  const byStatus = {}
  const byRegion = {}
  const byCompanyType = {}

  applications.forEach(app => {
    byStatus[app.status] = (byStatus[app.status] || 0) + 1
    if (app.region) byRegion[app.region] = (byRegion[app.region] || 0) + 1
    if (app.companyType) byCompanyType[app.companyType] = (byCompanyType[app.companyType] || 0) + 1
  })

  const activeApps = applications.filter(a =>
    !['Rejected', 'Withdrawn', 'Ghost'].includes(a.status)
  ).length

  const responseRate = total > 0
    ? Math.round((applications.filter(a => a.status !== 'Applied').length / total) * 100)
    : 0

  return {
    total,
    activeApps,
    responseRate,
    byStatus,
    byRegion,
    byCompanyType,
    generatedAt: new Date().toISOString()
  }
}

/**
 * Export target companies to CSV
 */
export function exportCompaniesToCSV(companies) {
  const headers = [
    'Company',
    'Category',
    'Priority',
    'Status',
    'Careers URL',
    'Connections',
    'Notes'
  ]

  const rows = companies.map(company => [
    company.name || '',
    company.category || '',
    company.priority || '',
    company.status || '',
    company.careersUrl || '',
    (company.connections || []).length,
    (company.notes || '').replace(/\n/g, ' ').replace(/"/g, '""')
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => {
      const cellStr = String(cell || '')
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`
      }
      return cellStr
    }).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  const filename = `target-companies-${new Date().toISOString().split('T')[0]}.csv`
  saveAs(blob, filename)

  return filename
}
