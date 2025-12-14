// Report generation service for PDF exports
// Uses dynamic imports for jsPDF to enable code splitting
import { formatDate } from '../utils'

// Lazy load jsPDF only when needed
let jsPDFModule = null
async function getJsPDF() {
  if (!jsPDFModule) {
    jsPDFModule = await import('jspdf')
  }
  return jsPDFModule.jsPDF
}

/**
 * Generate Interview Preparation PDF Summary
 * Useful for printing before interviews
 */
export async function generateInterviewPrepPDF(application, resumeVersion) {
  const jsPDF = await getJsPDF()
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  // Header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Interview Preparation', pageWidth / 2, y, { align: 'center' })
  y += 15

  // Company and Role
  doc.setFontSize(16)
  doc.text(`${application.company}`, pageWidth / 2, y, { align: 'center' })
  y += 8
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`${application.title}`, pageWidth / 2, y, { align: 'center' })
  y += 15

  // Quick Info
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Quick Info', 20, y)
  y += 7
  doc.setFont('helvetica', 'normal')

  const infoLines = [
    `Location: ${application.location || 'Not specified'}`,
    `Applied: ${formatDate(application.dateApplied)}`,
    `Current Status: ${application.status}`,
    `Resume Version: ${resumeVersion?.name || 'Not specified'}`,
    application.referral ? `Referral: ${application.referral}` : null
  ].filter(Boolean)

  infoLines.forEach(line => {
    doc.text(line, 25, y)
    y += 6
  })
  y += 10

  // Status Timeline
  if (application.statusHistory && application.statusHistory.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.text('Timeline', 20, y)
    y += 7
    doc.setFont('helvetica', 'normal')

    application.statusHistory.forEach(entry => {
      const timelineText = `${formatDate(entry.date)} - ${entry.status}${entry.notes ? `: ${entry.notes}` : ''}`
      const lines = doc.splitTextToSize(timelineText, pageWidth - 50)
      lines.forEach(line => {
        doc.text(`• ${line}`, 25, y)
        y += 6
      })
    })
    y += 10
  }

  // Interview Prep Notes
  if (application.interviewPrep) {
    const prep = application.interviewPrep

    if (prep.companyResearch) {
      doc.setFont('helvetica', 'bold')
      doc.text('Company Research', 20, y)
      y += 7
      doc.setFont('helvetica', 'normal')
      const researchLines = doc.splitTextToSize(prep.companyResearch, pageWidth - 50)
      researchLines.slice(0, 10).forEach(line => {
        doc.text(line, 25, y)
        y += 6
      })
      y += 5
    }

    if (prep.questionsToAsk && prep.questionsToAsk.length > 0) {
      doc.setFont('helvetica', 'bold')
      doc.text('Questions to Ask', 20, y)
      y += 7
      doc.setFont('helvetica', 'normal')
      prep.questionsToAsk.slice(0, 5).forEach(q => {
        doc.text(`• ${q}`, 25, y)
        y += 6
      })
      y += 5
    }

    if (prep.technicalTopics && prep.technicalTopics.length > 0) {
      doc.setFont('helvetica', 'bold')
      doc.text('Technical Topics to Review', 20, y)
      y += 7
      doc.setFont('helvetica', 'normal')
      prep.technicalTopics.slice(0, 5).forEach(topic => {
        doc.text(`• ${topic}`, 25, y)
        y += 6
      })
      y += 5
    }
  }

  // Archived Job Description (if available)
  if (application.jobDescription?.content) {
    // Add new page if needed
    if (y > 250) {
      doc.addPage()
      y = 20
    }

    doc.setFont('helvetica', 'bold')
    doc.text('Job Description', 20, y)
    y += 7
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    const descLines = doc.splitTextToSize(application.jobDescription.content, pageWidth - 50)
    descLines.slice(0, 40).forEach(line => {
      if (y > 280) {
        doc.addPage()
        y = 20
      }
      doc.text(line, 25, y)
      y += 5
    })
  }

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(128)
  doc.text(
    `Generated ${new Date().toLocaleDateString()} | Job Command Center`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  )

  // Save
  const filename = `interview-prep-${application.company.replace(/\s+/g, '-').toLowerCase()}.pdf`
  doc.save(filename)

  return filename
}

/**
 * Generate Job Search Summary Report PDF
 */
export async function generateSearchSummaryPDF(applications, stats) {
  const jsPDF = await getJsPDF()
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  // Header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Job Search Summary', pageWidth / 2, y, { align: 'center' })
  y += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, y, { align: 'center' })
  y += 20

  // Key Metrics
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Key Metrics', 20, y)
  y += 10

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')

  const metrics = [
    `Total Applications: ${stats.total}`,
    `Active Applications: ${stats.activeApps}`,
    `Response Rate: ${stats.responseRate}%`,
  ]

  metrics.forEach(metric => {
    doc.text(metric, 25, y)
    y += 8
  })
  y += 10

  // Status Breakdown
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('By Status', 20, y)
  y += 10

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')

  Object.entries(stats.byStatus).forEach(([status, count]) => {
    doc.text(`${status}: ${count}`, 25, y)
    y += 7
  })
  y += 10

  // Active Applications List
  const activeApps = applications.filter(a =>
    !['Rejected', 'Withdrawn', 'Ghost'].includes(a.status)
  ).slice(0, 15)

  if (activeApps.length > 0) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Active Applications', 20, y)
    y += 10

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')

    activeApps.forEach(app => {
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      doc.text(`• ${app.company} - ${app.title} (${app.status})`, 25, y)
      y += 6
    })
  }

  // Save
  const filename = `job-search-summary-${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)

  return filename
}
