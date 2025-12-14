// Application source and form constants

export const APPLICATION_SOURCE_OPTIONS = [
  'LinkedIn',
  'Indeed',
  'Company Website',
  'Recruiter',
  'Referral',
  'Other'
]

export const EMPTY_FORM = {
  company: '',
  title: '',
  location: '',
  region: '',
  requisitionId: '',
  jobUrl: '',
  salary: '',
  companyType: '',
  modality: [],
  seniorityMatch: 3,
  dateApplied: new Date().toISOString().split('T')[0],
  resumeVersion: '',
  coverLetter: false,
  referral: '',
  applicationSource: '',
  // New fields for job archiving
  jobDescription: null // { content: '', savedDate: null, source: '' }
}
