// Resume Parser Service
// Supports: PDF, DOCX, TXT files

import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

// Configure PDF.js worker for Vite
// Use the worker from node_modules with proper URL handling
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

// Storage key for parsed resumes
const PARSED_RESUMES_KEY = 'pharma_job_tracker_parsed_resumes'

export function loadParsedResumes() {
  try {
    const stored = localStorage.getItem(PARSED_RESUMES_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading parsed resumes:', error)
  }
  return []
}

export function saveParsedResumes(resumes) {
  try {
    localStorage.setItem(PARSED_RESUMES_KEY, JSON.stringify(resumes))
  } catch (error) {
    console.error('Error saving parsed resumes:', error)
  }
}

// Parse PDF file
async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map(item => item.str)
      .join(' ')
    fullText += pageText + '\n'
  }

  return fullText.trim()
}

// Parse DOCX file
async function parseDOCX(file) {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value.trim()
}

// Parse TXT file
async function parseTXT(file) {
  return await file.text()
}

// Main parse function
export async function parseResume(file) {
  const fileName = file.name.toLowerCase()

  if (fileName.endsWith('.pdf')) {
    return await parsePDF(file)
  } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    return await parseDOCX(file)
  } else if (fileName.endsWith('.txt')) {
    return await parseTXT(file)
  } else {
    throw new Error('Unsupported file format. Please upload a PDF, DOCX, or TXT file.')
  }
}

// Extract basic info from resume text (without LLM)
export function extractBasicInfo(text) {
  const info = {
    email: null,
    phone: null,
    linkedin: null,
    skills: [],
    education: []
  }

  // Extract email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/i)
  if (emailMatch) {
    info.email = emailMatch[0]
  }

  // Extract phone
  const phoneMatch = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
  if (phoneMatch) {
    info.phone = phoneMatch[0]
  }

  // Extract LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i)
  if (linkedinMatch) {
    info.linkedin = linkedinMatch[0]
  }

  // Look for common pharma/biotech skills
  const pharmaSkills = [
    'HPLC', 'GC', 'Mass Spectrometry', 'LC-MS', 'GC-MS',
    'NMR', 'UV-Vis', 'FTIR', 'DSC', 'TGA',
    'Method Development', 'Method Validation', 'ICH Guidelines',
    'GMP', 'GLP', 'FDA', 'EMA', 'cGMP',
    'Stability Studies', 'Dissolution', 'Karl Fischer',
    'SDS-PAGE', 'Western Blot', 'ELISA', 'PCR', 'qPCR',
    'Cell Culture', 'Protein Purification', 'Chromatography',
    'Formulation', 'Drug Product', 'Drug Substance',
    'Analytical Development', 'Quality Control', 'Quality Assurance',
    'Regulatory Affairs', 'IND', 'NDA', 'BLA',
    'mRNA', 'LNP', 'AAV', 'Gene Therapy', 'Cell Therapy',
    'Biologics', 'Vaccines', 'Monoclonal Antibodies',
    'Python', 'R', 'LIMS', 'Empower', 'Chromeleon',
    'Statistics', 'DOE', 'Six Sigma'
  ]

  const textLower = text.toLowerCase()
  info.skills = pharmaSkills.filter(skill =>
    textLower.includes(skill.toLowerCase())
  )

  // Look for degrees
  const degreePatterns = [
    /Ph\.?D\.?/i,
    /M\.?S\.?/i,
    /Master'?s?/i,
    /B\.?S\.?/i,
    /Bachelor'?s?/i,
    /MBA/i
  ]

  info.education = degreePatterns
    .filter(pattern => pattern.test(text))
    .map(pattern => {
      const match = text.match(pattern)
      return match ? match[0] : null
    })
    .filter(Boolean)

  return info
}
