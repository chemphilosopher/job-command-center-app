// Status-related constants for job applications

export const STATUS_OPTIONS = [
  'Applied',
  'Reviewed',
  'Phone Screen',
  'Technical',
  'Onsite',
  'Offer',
  'Rejected',
  'Ghost', // NEW: For companies that never respond
  'Withdrawn'
]

export const PIPELINE_STATUSES = ['Applied', 'Reviewed', 'Phone Screen', 'Technical', 'Onsite', 'Offer', 'Rejected']

export const REJECTION_STAGE_OPTIONS = [
  'Resume Screen',
  'Phone Screen',
  'Technical Interview',
  'Onsite Interview',
  'Final Round',
  'Offer Stage',
  'Unknown'
]

export const REJECTION_REASON_OPTIONS = [
  'Skills Gap',
  'Experience Level',
  'Culture Fit',
  'Better Candidate',
  'Salary Expectations',
  'Position Filled',
  'Position Cancelled',
  'Internal Candidate',
  'Unknown'
]

export const INTERVIEW_TYPES = ['Phone Screen', 'Video Technical', 'Onsite', 'Panel', 'HR Interview', 'Hiring Manager']

export const INTERVIEW_OUTCOMES = ['Positive', 'Neutral', 'Negative', 'Awaiting Feedback']
