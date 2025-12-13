import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  Download,
  Upload,
  Briefcase,
  FileText,
  ChevronDown,
  ExternalLink,
  Plus,
  X,
  LayoutGrid,
  Table,
  BarChart3,
  Search,
  Filter,
  Clock,
  XCircle,
  MessageSquare,
  Calendar,
  Building2,
  User,
  MapPin,
  CheckCircle,
  AlertCircle,
  Printer,
  Settings,
  Trash2,
  Tag,
  Keyboard,
  HardDrive,
  Sparkles,
  Flame,
  Target,
  Send,
  Copy,
  Edit3,
  TrendingUp,
  Mail,
  Linkedin,
  Phone,
  Coffee,
  Users,
  Award
} from 'lucide-react'
import AIJobMatcher from './components/AIJobMatcher'
import {
  loadLLMSettings,
  callLLM,
  createQualificationChecklistPrompt,
  createCoachingPrompt,
  createJobParserPrompt
} from './services/llmProviders'
import './index.css'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  Funnel,
  FunnelChart,
  LabelList
} from 'recharts'

// Constants
const STATUS_OPTIONS = [
  'Applied',
  'Reviewed',
  'Phone Screen',
  'Technical',
  'Onsite',
  'Offer',
  'Rejected',
  'Withdrawn'
]

const REJECTION_STAGE_OPTIONS = [
  'Resume Screen',
  'Phone Screen',
  'Technical Interview',
  'Onsite Interview',
  'Final Round',
  'Offer Stage',
  'Unknown'
]

const REJECTION_REASON_OPTIONS = [
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

const REGION_OPTIONS = [
  'Boston/Cambridge',
  'RTP/Durham',
  'SF Bay Area',
  'San Diego',
  'Remote',
  'Other'
]

const COMPANY_TYPE_OPTIONS = [
  'Large Pharma',
  'Mid-size Biotech',
  'Startup',
  'CDMO/CRO',
  'Academic'
]

const MODALITY_OPTIONS = [
  'Small Molecule',
  'Protein Therapeutics',
  'mAb/Biologics',
  'Gene Therapy',
  'Vaccines',
  'Cell Therapy',
  'Broad Analytical'
]

const APPLICATION_SOURCE_OPTIONS = [
  'LinkedIn',
  'Indeed',
  'Company Website',
  'Recruiter',
  'Referral',
  'Other'
]

const TOUCH_TYPE_OPTIONS = [
  'Cold Intro',
  'Check-in',
  'Follow-up',
  'LinkedIn Comment',
  'Thank You',
  'Coffee Chat',
  'Informational Interview',
  'Event/Meetup'
]

const TEMPLATE_CATEGORY_OPTIONS = [
  'Hiring Manager',
  'Peer',
  'Recruiter',
  'Follow-up',
  'Thank You',
  'Cold Outreach'
]

const OUTREACH_CHANNEL_OPTIONS = [
  'LinkedIn',
  'Email',
  'Phone',
  'In Person'
]

// Sample Resume Versions
const SAMPLE_RESUME_VERSIONS = [
  {
    id: 'v3-vaccines-focused',
    name: 'Vaccines Focused',
    description: 'Emphasizes vaccine development, stability studies, and immunoassay experience',
    createdDate: '2025-11-15',
    targetRoles: 'Senior roles at vaccine-focused companies',
    keyHighlights: ['Vaccine stability expertise', 'Immunoassay development', 'Tech transfer experience']
  },
  {
    id: 'v2-broad-analytical',
    name: 'Broad Analytical',
    description: 'General analytical development focus, balanced across modalities',
    createdDate: '2025-10-01',
    targetRoles: 'General analytical development positions',
    keyHighlights: ['Method development', 'Validation expertise', 'Cross-functional leadership']
  }
]

// Sample Target Companies
const SAMPLE_TARGET_COMPANIES = [
  {
    id: 'tc-pfizer',
    name: 'Pfizer',
    category: 'Large Pharma',
    priority: 1,
    status: 'Applied',
    careersUrl: 'https://www.pfizer.com/careers',
    research: {
      overview: 'One of the world\'s largest pharmaceutical companies. Headquarters in New York. Strong presence in small molecules, biologics, and vaccines.',
      recentNews: [
        { date: '2025-11-20', headline: 'Expanding analytical sciences division', notes: 'Hiring across multiple sites' }
      ],
      keyPeople: [
        { name: 'Dr. Sarah Chen', title: 'VP, Analytical Development', linkedin: '', notes: 'Background in protein characterization' }
      ],
      painPoints: ['Scaling analytical methods across modalities', 'Supporting diverse pipeline from small molecule to gene therapy'],
      products: 'Extensive portfolio including Ibrance, Eliquis, Prevnar, and oncology pipeline',
      culture: 'Global scale, innovation-focused, strong scientific community',
      whyTheyWantMe: 'Broad analytical expertise, method development experience, leadership capabilities',
      lastResearched: '2025-11-25'
    },
    connections: [
      {
        name: 'Mike Rodriguez',
        title: 'Senior Director, CMC',
        linkedin: 'https://linkedin.com/in/example',
        mutualConnection: 'Jane Smith (former colleague)',
        introRequested: true,
        introRequestDate: '2025-11-20',
        introStatus: 'Intro Made',
        notes: 'Intro made, scheduled coffee chat for Dec 5'
      }
    ],
    notes: 'Top priority - world\'s largest pharma, diverse modalities',
    createdAt: '2025-11-01T10:00:00Z',
    updatedAt: '2025-11-25T14:00:00Z'
  },
  {
    id: 'tc-jnj',
    name: 'Johnson & Johnson',
    category: 'Large Pharma',
    priority: 2,
    status: 'Researching',
    careersUrl: 'https://www.careers.jnj.com',
    research: {
      overview: 'Diversified healthcare giant. Janssen Pharmaceuticals division focuses on immunology, oncology, neuroscience, and infectious diseases.',
      recentNews: [],
      keyPeople: [],
      painPoints: ['Gene therapy analytical development', 'Biologics characterization'],
      products: 'Stelara, Darzalex, Tremfya, Erleada, and extensive oncology/immunology pipeline',
      culture: 'Patient-focused, collaborative, strong R&D investment',
      whyTheyWantMe: 'Gene therapy experience, protein therapeutics background',
      lastResearched: '2025-11-15'
    },
    connections: [],
    notes: 'Strong gene therapy and biologics focus - research Janssen opportunities',
    createdAt: '2025-11-05T10:00:00Z',
    updatedAt: '2025-11-15T10:00:00Z'
  },
  {
    id: 'tc-novartis',
    name: 'Novartis',
    category: 'Large Pharma',
    priority: 2,
    status: 'Applied',
    careersUrl: 'https://www.novartis.com/careers',
    research: {
      overview: 'Swiss multinational, one of the largest pharma companies globally. Strong in small molecules, biologics, gene therapy, and cell therapy.',
      recentNews: [
        { date: '2025-11-10', headline: 'Expanding US analytical operations', notes: 'Multiple analytical roles posted' }
      ],
      keyPeople: [
        { name: 'John Martinez', title: 'Director, Analytical Sciences', linkedin: '', notes: '' }
      ],
      painPoints: ['Small molecule analytical innovation', 'Cell and gene therapy characterization'],
      products: 'Entresto, Cosentyx, Kisqali, Zolgensma (gene therapy), Kymriah (cell therapy)',
      culture: 'Global, science-driven, innovative',
      whyTheyWantMe: 'Broad analytical expertise, small molecule and biologics experience',
      lastResearched: '2025-11-20'
    },
    connections: [
      {
        name: 'Mike Johnson',
        title: 'Senior Director',
        linkedin: '',
        mutualConnection: 'Direct - former colleague',
        introRequested: false,
        introRequestDate: '',
        introStatus: 'Not Asked',
        notes: 'Strong referral connection'
      }
    ],
    notes: 'Great for broad analytical - covers small molecule to gene therapy',
    createdAt: '2025-11-08T10:00:00Z',
    updatedAt: '2025-11-20T10:00:00Z'
  }
]

// Sample Outreach Templates
const SAMPLE_OUTREACH_TEMPLATES = [
  {
    id: 'template-hm-intro',
    name: 'Hiring Manager Introduction',
    category: 'Hiring Manager',
    subject: '',
    body: `Hi {{contactName}},

I just applied for the {{roleTitle}} position ({{requisitionId}}) at {{companyName}}.

Quick intro: I'm an Associate Director in analytical development with ~10 years in biologics, currently leading a team doing cellular, molecular, and separations assays to support GMP manufacturing and CMC.

From the posting, I saw emphasis on {{keyRequirement}}. That's been my focus for the past several years – especially {{relevantAccomplishment}}.

If you're open to it, I'd love 15 minutes to understand what success looks like in this role and see if my background could help.

Either way, excited to see {{companyName}} building out this capability.

Best,
{{myName}}`,
    placeholders: ['contactName', 'roleTitle', 'requisitionId', 'companyName', 'keyRequirement', 'relevantAccomplishment', 'myName'],
    timesUsed: 3,
    responsesReceived: 1,
    createdAt: '2025-11-01T10:00:00Z',
    updatedAt: '2025-11-15T10:00:00Z'
  },
  {
    id: 'template-peer-connect',
    name: 'Peer Connection Request',
    category: 'Peer',
    subject: '',
    body: `Hi {{contactName}},

I came across your profile while researching {{companyName}} – I'm exploring opportunities in analytical development and noticed we have similar backgrounds in {{sharedExperience}}.

I'd love to connect and hear about your experience at {{companyName}}, particularly around {{topicOfInterest}}.

Would you be open to a brief 15-minute chat?

Thanks,
{{myName}}`,
    placeholders: ['contactName', 'companyName', 'sharedExperience', 'topicOfInterest', 'myName'],
    timesUsed: 5,
    responsesReceived: 2,
    createdAt: '2025-11-01T10:00:00Z',
    updatedAt: '2025-11-10T10:00:00Z'
  },
  {
    id: 'template-followup',
    name: 'Application Follow-up',
    category: 'Follow-up',
    subject: 'Following up: {{roleTitle}} application',
    body: `Hi {{contactName}},

I wanted to follow up on my application for the {{roleTitle}} position ({{requisitionId}}) that I submitted on {{applicationDate}}.

I remain very interested in this opportunity and believe my experience in {{relevantExperience}} aligns well with what you're looking for.

Is there any additional information I can provide to support my application?

Thank you,
{{myName}}`,
    placeholders: ['contactName', 'roleTitle', 'requisitionId', 'applicationDate', 'relevantExperience', 'myName'],
    timesUsed: 2,
    responsesReceived: 0,
    createdAt: '2025-11-05T10:00:00Z',
    updatedAt: '2025-11-05T10:00:00Z'
  }
]

// Sample Job Applications
const SAMPLE_APPLICATIONS = [
  {
    id: uuidv4(),
    company: 'Pfizer',
    title: 'Associate Director, Analytical Development',
    location: 'New York, NY',
    region: 'Other',
    requisitionId: 'PFE-2025-1234',
    jobUrl: 'https://www.pfizer.com/careers/jobs/12345',
    salary: '$180,000 - $220,000',
    companyType: 'Large Pharma',
    modality: ['Small Molecule', 'Protein Therapeutics'],
    seniorityMatch: 5,
    dateApplied: '2025-12-01',
    resumeVersion: 'v2-broad-analytical',
    coverLetter: true,
    referral: 'Jane Smith (LinkedIn connection)',
    applicationSource: 'Company Website',
    status: 'Phone Screen',
    statusHistory: [
      { status: 'Applied', date: '2025-12-01', notes: 'Applied via company portal' },
      { status: 'Phone Screen', date: '2025-12-03', notes: 'HR screen scheduled for 12/8' }
    ],
    interviewNotes: '',
    companyResearch: 'World\'s largest pharma, diverse pipeline across modalities',
    keyContacts: [],
    lastContactDate: '2025-12-03',
    nextFollowUpDate: '2025-12-10',
    followUpNotes: '',
    outcome: null,
    outcomeDate: null,
    feedbackReceived: '',
    tags: ['Dream Job', 'High Priority'],
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2025-12-03T14:30:00Z'
  },
  {
    id: uuidv4(),
    company: 'Johnson & Johnson',
    title: 'Senior Scientist, Gene Therapy Analytical',
    location: 'Spring House, PA',
    region: 'Other',
    requisitionId: 'JNJ-GT-2025-089',
    jobUrl: 'https://www.careers.jnj.com/jobs/89',
    salary: '$150,000 - $180,000',
    companyType: 'Large Pharma',
    modality: ['Gene Therapy'],
    seniorityMatch: 4,
    dateApplied: '2025-11-28',
    resumeVersion: 'v2-broad-analytical',
    coverLetter: false,
    referral: '',
    applicationSource: 'LinkedIn',
    status: 'Applied',
    statusHistory: [
      { status: 'Applied', date: '2025-11-28', notes: 'Easy Apply on LinkedIn' }
    ],
    interviewNotes: '',
    companyResearch: 'Janssen division, strong gene therapy and biologics focus',
    keyContacts: [],
    lastContactDate: '2025-11-28',
    nextFollowUpDate: '2025-12-05',
    followUpNotes: '',
    outcome: null,
    outcomeDate: null,
    feedbackReceived: '',
    tags: [],
    createdAt: '2025-11-28T09:15:00Z',
    updatedAt: '2025-11-28T09:15:00Z'
  },
  {
    id: uuidv4(),
    company: 'Novartis',
    title: 'Principal Scientist, Analytical Sciences',
    location: 'Cambridge, MA',
    region: 'Boston/Cambridge',
    requisitionId: 'NVS-2025-78542',
    jobUrl: 'https://www.novartis.com/careers/78542',
    salary: '$160,000 - $200,000',
    companyType: 'Large Pharma',
    modality: ['Small Molecule', 'Cell Therapy'],
    seniorityMatch: 4,
    dateApplied: '2025-11-25',
    resumeVersion: 'v2-broad-analytical',
    coverLetter: true,
    referral: 'Mike Johnson (former colleague)',
    applicationSource: 'Referral',
    status: 'Reviewed',
    statusHistory: [
      { status: 'Applied', date: '2025-11-25', notes: 'Referred by Mike' },
      { status: 'Reviewed', date: '2025-11-30', notes: 'Recruiter reached out for availability' }
    ],
    interviewNotes: '',
    companyResearch: 'Swiss multinational, strong in cell and gene therapy',
    keyContacts: [
      { name: 'Mike Johnson', title: 'Senior Director', linkedin: '', notes: 'Former colleague' }
    ],
    lastContactDate: '2025-11-30',
    nextFollowUpDate: '2025-12-07',
    followUpNotes: 'Wait for scheduling confirmation',
    outcome: null,
    outcomeDate: null,
    feedbackReceived: '',
    tags: ['Referral'],
    createdAt: '2025-11-25T11:30:00Z',
    updatedAt: '2025-11-30T16:45:00Z'
  }
]

// Local Storage Keys
const STORAGE_KEYS = {
  applications: 'pharma_job_tracker_applications',
  resumeVersions: 'pharma_job_tracker_resume_versions',
  settings: 'pharma_job_tracker_settings',
  targetCompanies: 'pharma_job_tracker_target_companies',
  networkingTouches: 'pharma_job_tracker_networking_touches',
  networkingStats: 'pharma_job_tracker_networking_stats',
  outreachTemplates: 'pharma_job_tracker_outreach_templates',
  followUpCadences: 'pharma_job_tracker_followup_cadences'
}

// Target Company Categories
const COMPANY_CATEGORY_OPTIONS = [
  'Large Pharma',
  'Mid-size Biotech',
  'Startup',
  'CDMO/CRO',
  'Academic'
]

const COMPANY_STATUS_OPTIONS = [
  'Researching',
  'Ready to Apply',
  'Applied',
  'Interviewing',
  'Dormant'
]

const COMPANY_PRIORITY_OPTIONS = [1, 2, 3, 4, 5]

const INTRO_STATUS_OPTIONS = [
  'Not Asked',
  'Asked',
  'Intro Made',
  'Declined'
]

// Data Management Functions
function generateId() {
  return uuidv4()
}

function loadApplications() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.applications)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading applications:', error)
  }
  return null
}

function saveApplications(apps) {
  try {
    localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(apps))
  } catch (error) {
    console.error('Error saving applications:', error)
  }
}

function loadResumeVersions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.resumeVersions)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading resume versions:', error)
  }
  return null
}

function saveResumeVersions(versions) {
  try {
    localStorage.setItem(STORAGE_KEYS.resumeVersions, JSON.stringify(versions))
  } catch (error) {
    console.error('Error saving resume versions:', error)
  }
}

function loadTargetCompanies() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.targetCompanies)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading target companies:', error)
  }
  return null
}

function saveTargetCompanies(companies) {
  try {
    localStorage.setItem(STORAGE_KEYS.targetCompanies, JSON.stringify(companies))
  } catch (error) {
    console.error('Error saving target companies:', error)
  }
}

function loadNetworkingTouches() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.networkingTouches)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading networking touches:', error)
  }
  return null
}

function saveNetworkingTouches(touches) {
  try {
    localStorage.setItem(STORAGE_KEYS.networkingTouches, JSON.stringify(touches))
  } catch (error) {
    console.error('Error saving networking touches:', error)
  }
}

function loadNetworkingStats() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.networkingStats)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading networking stats:', error)
  }
  return { currentStreak: 0, longestStreak: 0, totalTouches: 0, lastTouchDate: null }
}

function saveNetworkingStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEYS.networkingStats, JSON.stringify(stats))
  } catch (error) {
    console.error('Error saving networking stats:', error)
  }
}

function loadOutreachTemplates() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.outreachTemplates)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading outreach templates:', error)
  }
  return null
}

function saveOutreachTemplates(templates) {
  try {
    localStorage.setItem(STORAGE_KEYS.outreachTemplates, JSON.stringify(templates))
  } catch (error) {
    console.error('Error saving outreach templates:', error)
  }
}

function exportToJSON(applications, resumeVersions) {
  const data = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    applications,
    resumeVersions
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pharma_job_tracker_backup_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getStatusColor(status) {
  const colors = {
    'Applied': 'bg-blue-100 text-blue-800',
    'Reviewed': 'bg-purple-100 text-purple-800',
    'Phone Screen': 'bg-yellow-100 text-yellow-800',
    'Technical': 'bg-orange-100 text-orange-800',
    'Onsite': 'bg-pink-100 text-pink-800',
    'Offer': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Withdrawn': 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function getRegionColor(region) {
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

// Toast Component
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2`}>
      {message}
    </div>
  )
}

// Modal Component
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// Welcome Modal for First-Time Users
function WelcomeModal({ onClose, onOpenSettings }) {
  const [step, setStep] = useState(1)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60" />
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Welcome to Job Command Center</h1>
                <p className="text-indigo-200">Your strategic job search companion</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">What You Can Do Here</h2>
                <div className="grid gap-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Track Applications</h3>
                      <p className="text-sm text-gray-600">Keep all your job applications organized in one place with status tracking and notes.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Research Companies</h3>
                      <p className="text-sm text-gray-600">Build your target company list and track research, contacts, and opportunities.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Network Effectively</h3>
                      <p className="text-sm text-gray-600">Track your daily networking touches and maintain relationships.</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">AI Features (Optional)</h2>
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-5">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">AI-Powered Analysis</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Get AI assistance with job matching, resume analysis, and strategic coaching.
                        <strong className="block mt-2 text-gray-900">This is completely optional!</strong>
                      </p>
                      <p className="text-sm text-gray-600">
                        The app works great without AI. You can add an API key later if you want these features.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Free AI Options:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>- <strong>Google Gemini</strong>: Free tier available</li>
                    <li>- <strong>Ollama</strong>: Run AI locally on your computer (free)</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Skip for Now
                  </button>
                  <button
                    onClick={() => {
                      onClose()
                      onOpenSettings()
                    }}
                    className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Configure AI
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Your Data is Safe</h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">100% Private</h3>
                      <p className="text-sm text-gray-600">
                        All your data stays in your browser. Nothing is sent to any server unless you use AI features (and even then, only the specific content being analyzed).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-900 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Important: Back Up Your Data
                  </h4>
                  <p className="text-sm text-amber-800 mt-2">
                    Since data is stored in your browser, use the <strong>Export</strong> button regularly to save backups. You can restore from backup using <strong>Import</strong>.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Step indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {[1, 2, 3].map(s => (
                <button
                  key={s}
                  onClick={() => setStep(s)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step === s ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// AI Status Badge Component
function AIStatusBadge({ llmSettings }) {
  const hasApiKey = llmSettings?.apiKeys?.[
    llmSettings?.provider === 'openai' ? 'OPENAI_API_KEY' :
    llmSettings?.provider === 'anthropic' ? 'ANTHROPIC_API_KEY' :
    llmSettings?.provider === 'gemini' ? 'GEMINI_API_KEY' : null
  ]
  const isOllama = llmSettings?.provider === 'ollama'
  const isConfigured = hasApiKey || isOllama

  if (isConfigured) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
        AI Ready
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full" title="AI features available with API key">
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
      No AI
    </span>
  )
}

// Backup Reminder Banner Component
function BackupReminderBanner({ onBackup, onDismiss, applicationCount }) {
  const lastBackup = localStorage.getItem('pharma_job_tracker_last_backup')
  const isFirstBackup = !lastBackup

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">
                {isFirstBackup
                  ? `You have ${applicationCount} applications - time to create your first backup!`
                  : `It's been a while since your last backup`
                }
              </p>
              <p className="text-sm text-amber-100">
                Your data is stored in your browser. Export a backup to keep it safe.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBackup}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-amber-600 font-medium rounded-lg hover:bg-amber-50 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Backup Now
            </button>
            <button
              onClick={onDismiss}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Remind me later"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Empty form state
const EMPTY_FORM = {
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
  // Quality Tracking fields
  quality: {
    customResume: false,
    customCoverLetter: false,
    atsOptimized: false,
    resumeFileName: '',
    resumeFileData: null,
    coverLetterFileName: '',
    coverLetterFileData: null
  },
  // Job Description for AI Analysis
  jobDescription: '',
  // AI Analysis results (populated after analysis)
  aiAnalysis: null
}

// Job Entry Form Component
function JobEntryForm({ resumeVersions, onSubmit, onCancel, initialData = null, llmSettings, onAutoFill }) {
  const [formData, setFormData] = useState(initialData || EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [autoFillText, setAutoFillText] = useState('')
  const [autoFillLoading, setAutoFillLoading] = useState(false)
  const [autoFillError, setAutoFillError] = useState('')

  const handleAutoFill = async () => {
    if (!autoFillText.trim()) return

    const apiKey = llmSettings?.apiKeys?.[
      llmSettings.provider === 'openai' ? 'OPENAI_API_KEY' :
      llmSettings.provider === 'anthropic' ? 'ANTHROPIC_API_KEY' :
      llmSettings.provider === 'gemini' ? 'GEMINI_API_KEY' : null
    ]

    if (!apiKey && llmSettings?.provider !== 'ollama') {
      setAutoFillError('Configure an API key in Settings → AI Match to use auto-fill')
      return
    }

    setAutoFillLoading(true)
    setAutoFillError('')

    try {
      const messages = createJobParserPrompt(autoFillText)
      const response = await callLLM(llmSettings, messages)

      // Parse the JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])

        // Update form with parsed data
        setFormData(prev => ({
          ...prev,
          company: parsed.company || prev.company,
          title: parsed.title || prev.title,
          location: parsed.location || prev.location,
          region: parsed.region || prev.region,
          companyType: parsed.companyType || prev.companyType,
          salaryRange: parsed.salaryRange || prev.salaryRange,
          jobUrl: parsed.jobUrl || prev.jobUrl,
          modality: parsed.modality?.length > 0 ? parsed.modality : prev.modality,
          applicationSource: parsed.applicationSource || prev.applicationSource,
          jobDescription: autoFillText,
          notes: parsed.keyRequirements?.length > 0
            ? `Key Requirements:\n• ${parsed.keyRequirements.join('\n• ')}`
            : prev.notes
        }))

        setAutoFillText('')
      } else {
        throw new Error('Could not parse AI response')
      }
    } catch (error) {
      setAutoFillError(error.message)
    } finally {
      setAutoFillLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleModalityChange = (modality) => {
    setFormData(prev => ({
      ...prev,
      modality: prev.modality.includes(modality)
        ? prev.modality.filter(m => m !== modality)
        : [...prev.modality, modality]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    const newErrors = {}
    if (!formData.company.trim()) newErrors.company = 'Company is required'
    if (!formData.title.trim()) newErrors.title = 'Job title is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  const inputClasses = (fieldName) => `
    w-full px-3 py-2 border rounded-lg text-sm
    ${errors[fieldName]
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}
    focus:outline-none focus:ring-2
  `

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* AI Auto-Fill Section */}
      {llmSettings && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-semibold text-purple-900">AI Auto-Fill</h3>
            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Beta</span>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Paste a job description below and let AI extract the details automatically.
          </p>
          <textarea
            value={autoFillText}
            onChange={(e) => setAutoFillText(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full h-24 p-3 text-sm border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            disabled={autoFillLoading}
          />
          <div className="flex items-center justify-between mt-2">
            <div>
              {autoFillError && (
                <p className="text-xs text-red-600">{autoFillError}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              disabled={autoFillLoading || !autoFillText.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {autoFillLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Parsing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Auto-Fill Form
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Basic Info Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={inputClasses('company')}
              placeholder="e.g., Genentech"
            />
            {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputClasses('title')}
              placeholder="e.g., Associate Director, Analytical Development"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputClasses('location')}
              placeholder="e.g., Cambridge, MA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className={inputClasses('region')}
            >
              <option value="">Select a region...</option>
              {REGION_OPTIONS.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requisition ID</label>
            <input
              type="text"
              name="requisitionId"
              value={formData.requisitionId}
              onChange={handleChange}
              className={inputClasses('requisitionId')}
              placeholder="e.g., REQ-2025-1234"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job URL</label>
            <input
              type="url"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              className={inputClasses('jobUrl')}
              placeholder="https://..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className={inputClasses('salary')}
              placeholder="e.g., $180,000 - $220,000"
            />
          </div>
        </div>
      </div>

      {/* Classification Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Classification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
            <select
              name="companyType"
              value={formData.companyType}
              onChange={handleChange}
              className={inputClasses('companyType')}
            >
              <option value="">Select company type...</option>
              {COMPANY_TYPE_OPTIONS.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seniority Match</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                name="seniorityMatch"
                min="1"
                max="5"
                value={formData.seniorityMatch}
                onChange={handleChange}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 w-8 text-center">{formData.seniorityMatch}/5</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">How well does the seniority level match your experience?</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Modality (select all that apply)</label>
            <div className="flex flex-wrap gap-2">
              {MODALITY_OPTIONS.map(modality => (
                <button
                  key={modality}
                  type="button"
                  onClick={() => handleModalityChange(modality)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    formData.modality.includes(modality)
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {modality}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Application Details Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Application Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Applied</label>
            <input
              type="date"
              name="dateApplied"
              value={formData.dateApplied}
              onChange={handleChange}
              className={inputClasses('dateApplied')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume Version</label>
            <select
              name="resumeVersion"
              value={formData.resumeVersion}
              onChange={handleChange}
              className={inputClasses('resumeVersion')}
            >
              <option value="">Select resume version...</option>
              {resumeVersions.map(version => (
                <option key={version.id} value={version.id}>{version.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application Source</label>
            <select
              name="applicationSource"
              value={formData.applicationSource}
              onChange={handleChange}
              className={inputClasses('applicationSource')}
            >
              <option value="">Select source...</option>
              {APPLICATION_SOURCE_OPTIONS.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referral Contact</label>
            <input
              type="text"
              name="referral"
              value={formData.referral}
              onChange={handleChange}
              className={inputClasses('referral')}
              placeholder="e.g., Jane Smith (LinkedIn)"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="coverLetter"
                checked={formData.coverLetter}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Cover letter included</span>
            </label>
          </div>
        </div>
      </div>

      {/* Quality Tracking Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Application Quality</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.quality?.customResume || false}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  quality: { ...prev.quality, customResume: e.target.checked }
                }))}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Customized Resume</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.quality?.customCoverLetter || false}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  quality: { ...prev.quality, customCoverLetter: e.target.checked }
                }))}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Custom Cover Letter</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.quality?.atsOptimized || false}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  quality: { ...prev.quality, atsOptimized: e.target.checked }
                }))}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">ATS Optimized</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume File Used</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = () => {
                        setFormData(prev => ({
                          ...prev,
                          quality: {
                            ...prev.quality,
                            resumeFileName: file.name,
                            resumeFileData: reader.result
                          }
                        }))
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {formData.quality?.resumeFileName && (
                  <span className="text-xs text-gray-500">{formData.quality.resumeFileName}</span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter File</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = () => {
                        setFormData(prev => ({
                          ...prev,
                          quality: {
                            ...prev.quality,
                            coverLetterFileName: file.name,
                            coverLetterFileData: reader.result
                          }
                        }))
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {formData.quality?.coverLetterFileName && (
                  <span className="text-xs text-gray-500">{formData.quality.coverLetterFileName}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Description for AI Analysis */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          Job Description
          <span className="font-normal text-gray-500 ml-2">(for AI qualification analysis)</span>
        </h3>
        <textarea
          value={formData.jobDescription || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={6}
          placeholder="Paste the full job description here. This allows AI to analyze your fit for the role..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: Paste the complete job posting to get the most accurate AI qualification analysis.
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {initialData ? 'Update Application' : 'Add Application'}
        </button>
      </div>
    </form>
  )
}

// Pipeline Status Columns
const PIPELINE_STATUSES = ['Applied', 'Reviewed', 'Phone Screen', 'Technical', 'Onsite', 'Offer', 'Rejected']

// Status Update Modal Component
function StatusUpdateModal({ application, onClose, onUpdate }) {
  const [newStatus, setNewStatus] = useState(application?.status || '')
  const [notes, setNotes] = useState('')
  const [rejection, setRejection] = useState({
    stage: application?.rejection?.stage || '',
    reason: application?.rejection?.reason || '',
    feedbackVerbatim: application?.rejection?.feedbackVerbatim || '',
    learnings: application?.rejection?.learnings || [],
    actionItems: application?.rejection?.actionItems || []
  })
  const [newLearning, setNewLearning] = useState('')
  const [newActionItem, setNewActionItem] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newStatus && newStatus !== application.status) {
      const rejectionData = newStatus === 'Rejected' ? rejection : null
      onUpdate(application.id, newStatus, notes, rejectionData)
    }
    onClose()
  }

  const addLearning = () => {
    if (newLearning.trim()) {
      setRejection(prev => ({ ...prev, learnings: [...prev.learnings, newLearning.trim()] }))
      setNewLearning('')
    }
  }

  const addActionItem = () => {
    if (newActionItem.trim()) {
      setRejection(prev => ({ ...prev, actionItems: [...prev.actionItems, newActionItem.trim()] }))
      setNewActionItem('')
    }
  }

  if (!application) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className={`relative bg-white rounded-xl shadow-2xl w-full ${newStatus === 'Rejected' ? 'max-w-xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto`}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Update Status</h2>
            <p className="text-sm text-gray-500">{application.company} - {application.title}</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setNewStatus(status)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      newStatus === status
                        ? status === 'Rejected' ? 'bg-red-100 border-red-300 text-red-700' : 'bg-indigo-100 border-indigo-300 text-indigo-700'
                        : status === application.status
                        ? 'bg-gray-100 border-gray-300 text-gray-500'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Rejection Details - only shown when Rejected is selected */}
            {newStatus === 'Rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-red-900">Rejection Learning Log</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stage Rejected</label>
                    <select
                      value={rejection.stage}
                      onChange={(e) => setRejection(prev => ({ ...prev, stage: e.target.value }))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select stage...</option>
                      {REJECTION_STAGE_OPTIONS.map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <select
                      value={rejection.reason}
                      onChange={(e) => setRejection(prev => ({ ...prev, reason: e.target.value }))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select reason...</option>
                      {REJECTION_REASON_OPTIONS.map(reason => (
                        <option key={reason} value={reason}>{reason}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Received (verbatim)</label>
                  <textarea
                    value={rejection.feedbackVerbatim}
                    onChange={(e) => setRejection(prev => ({ ...prev, feedbackVerbatim: e.target.value }))}
                    rows={2}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Copy any feedback from the rejection email..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Learnings</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newLearning}
                      onChange={(e) => setNewLearning(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLearning())}
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="What did you learn from this rejection?"
                    />
                    <button
                      type="button"
                      onClick={addLearning}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                    >
                      Add
                    </button>
                  </div>
                  {rejection.learnings.length > 0 && (
                    <ul className="space-y-1">
                      {rejection.learnings.map((learning, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-white p-2 rounded">
                          <span className="flex-1">{learning}</span>
                          <button
                            type="button"
                            onClick={() => setRejection(prev => ({
                              ...prev,
                              learnings: prev.learnings.filter((_, i) => i !== idx)
                            }))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action Items</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newActionItem}
                      onChange={(e) => setNewActionItem(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addActionItem())}
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="What will you do differently?"
                    />
                    <button
                      type="button"
                      onClick={addActionItem}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                    >
                      Add
                    </button>
                  </div>
                  {rejection.actionItems.length > 0 && (
                    <ul className="space-y-1">
                      {rejection.actionItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-white p-2 rounded">
                          <span className="flex-1">{item}</span>
                          <button
                            type="button"
                            onClick={() => setRejection(prev => ({
                              ...prev,
                              actionItems: prev.actionItems.filter((_, i) => i !== idx)
                            }))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add notes about this status change..."
              />
            </div>

            {/* Status History */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status History</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {application.statusHistory?.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">{entry.status}</span>
                      <span className="text-gray-500 ml-2">{formatDate(entry.date)}</span>
                      {entry.notes && <p className="text-gray-500 text-xs">{entry.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newStatus || newStatus === application.status}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Status
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Pipeline Card Component
function PipelineCard({ app, onStatusUpdate, onEdit, getRegionColor }) {
  const daysInStatus = () => {
    const lastStatusChange = app.statusHistory?.[app.statusHistory.length - 1]
    if (!lastStatusChange) return 0
    const diffTime = Math.abs(new Date() - new Date(lastStatusChange.date))
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-gray-900 text-sm leading-tight">{app.company}</h4>
        {app.jobUrl && (
          <a
            href={app.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-indigo-600 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{app.title}</p>
      {app.region && (
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${getRegionColor(app.region)}`}>
          {app.region}
        </span>
      )}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {daysInStatus()}d
        </span>
        <div className="flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onStatusUpdate(app); }}
            className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
            title="Update status"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(app); }}
            className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
            title="Edit"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Pipeline View Component
function PipelineView({ applications, onStatusUpdate, onEdit, getRegionColor, getStatusColor }) {
  const getApplicationsByStatus = (status) => {
    return applications.filter(app => app.status === status)
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {PIPELINE_STATUSES.map(status => {
          const statusApps = getApplicationsByStatus(status)
          return (
            <div key={status} className="w-64 flex-shrink-0">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-700 text-sm">{status}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {statusApps.length}
                  </span>
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {statusApps.map(app => (
                    <PipelineCard
                      key={app.id}
                      app={app}
                      onStatusUpdate={onStatusUpdate}
                      onEdit={onEdit}
                      getRegionColor={getRegionColor}
                    />
                  ))}
                  {statusApps.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No applications
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Filter Bar Component
function FilterBar({ filters, setFilters, applications, searchInputRef }) {
  const [showFilters, setShowFilters] = useState(false)

  const uniqueRegions = [...new Set(applications.map(a => a.region).filter(Boolean))]
  const uniqueStatuses = [...new Set(applications.map(a => a.status))]

  const activeFilterCount = [
    filters.search,
    filters.status.length > 0,
    filters.region.length > 0
  ].filter(Boolean).length

  const clearFilters = () => {
    setFilters({ search: '', status: [], region: [] })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Search company, title..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
            showFilters || activeFilterCount > 0
              ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {uniqueStatuses.map(status => (
                <button
                  key={status}
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      status: prev.status.includes(status)
                        ? prev.status.filter(s => s !== status)
                        : [...prev.status, status]
                    }))
                  }}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filters.status.includes(status)
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <div className="flex flex-wrap gap-2">
              {uniqueRegions.map(region => (
                <button
                  key={region}
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      region: prev.region.includes(region)
                        ? prev.region.filter(r => r !== region)
                        : [...prev.region, region]
                    }))
                  }}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filters.region.includes(region)
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Interview Types
const INTERVIEW_TYPES = ['Phone Screen', 'Video Technical', 'Onsite', 'Panel', 'HR Interview', 'Hiring Manager']

// Interview Outcome Options
const INTERVIEW_OUTCOMES = ['Positive', 'Neutral', 'Negative', 'Awaiting Feedback']

// Application Detail Modal with Tabs
function ApplicationDetailModal({ application, resumeVersions, onClose, onSave, llmSettings, onRunAIAnalysis }) {
  const [activeTab, setActiveTab] = useState('details')
  const [formData, setFormData] = useState({
    // Basic details
    company: application?.company || '',
    title: application?.title || '',
    location: application?.location || '',
    region: application?.region || '',
    requisitionId: application?.requisitionId || '',
    jobUrl: application?.jobUrl || '',
    salary: application?.salary || '',
    companyType: application?.companyType || '',
    modality: application?.modality || [],
    seniorityMatch: application?.seniorityMatch || 3,
    dateApplied: application?.dateApplied || '',
    resumeVersion: application?.resumeVersion || '',
    coverLetter: application?.coverLetter || false,
    referral: application?.referral || '',
    applicationSource: application?.applicationSource || '',
    // Interview prep
    interviewDate: application?.interviewDate || '',
    interviewTime: application?.interviewTime || '',
    interviewType: application?.interviewType || '',
    interviewerNames: application?.interviewerNames || '',
    keyTopicsToPrep: application?.keyTopicsToPrep || '',
    questionsToAsk: application?.questionsToAsk || '',
    postInterviewNotes: application?.postInterviewNotes || '',
    interviewOutcome: application?.interviewOutcome || '',
    thankYouSent: application?.thankYouSent || false,
    // Company research
    companyResearch: application?.companyResearch || '',
    recentNews: application?.recentNews || '',
    pipelineProducts: application?.pipelineProducts || '',
    cultureNotes: application?.cultureNotes || '',
    potentialConcerns: application?.potentialConcerns || '',
    keyContacts: application?.keyContacts || [],
    // Follow-up
    nextFollowUpDate: application?.nextFollowUpDate || '',
    followUpNotes: application?.followUpNotes || '',
    // Quality tracking
    quality: application?.quality || {
      customResume: false,
      customCoverLetter: false,
      atsOptimized: false,
      resumeFileName: '',
      resumeFileData: null,
      coverLetterFileName: '',
      coverLetterFileData: null
    },
    // Job Description and AI Analysis
    jobDescription: application?.jobDescription || '',
    aiAnalysis: application?.aiAnalysis || null
  })
  const [newContact, setNewContact] = useState({ name: '', title: '', linkedin: '', notes: '' })
  const [showPrepSummary, setShowPrepSummary] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState(null)

  if (!application) return null

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleModalityChange = (modality) => {
    setFormData(prev => ({
      ...prev,
      modality: prev.modality.includes(modality)
        ? prev.modality.filter(m => m !== modality)
        : [...prev.modality, modality]
    }))
  }

  const handleAddContact = () => {
    if (newContact.name.trim()) {
      setFormData(prev => ({
        ...prev,
        keyContacts: [...prev.keyContacts, { ...newContact }]
      }))
      setNewContact({ name: '', title: '', linkedin: '', notes: '' })
    }
  }

  const handleRemoveContact = (index) => {
    setFormData(prev => ({
      ...prev,
      keyContacts: prev.keyContacts.filter((_, i) => i !== index)
    }))
  }

  const handleSave = () => {
    onSave({
      ...application,
      ...formData,
      updatedAt: new Date().toISOString()
    })
  }

  const tabs = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'quality', label: 'Quality', icon: CheckCircle },
    { id: 'aiAnalysis', label: 'AI Analysis', icon: Sparkles },
    { id: 'interview', label: 'Interview Prep', icon: Calendar },
    { id: 'research', label: 'Company Research', icon: Building2 },
    { id: 'timeline', label: 'Timeline', icon: Clock }
  ]

  // Handle AI Analysis
  const handleRunAnalysis = async () => {
    if (!formData.jobDescription) {
      setAnalysisError('Please add a job description first')
      return
    }
    if (!onRunAIAnalysis) {
      setAnalysisError('AI analysis not available. Configure API keys in Settings.')
      return
    }

    setIsAnalyzing(true)
    setAnalysisError(null)

    try {
      const result = await onRunAIAnalysis(formData.jobDescription)
      setFormData(prev => ({
        ...prev,
        aiAnalysis: {
          ...result,
          analyzedAt: new Date().toISOString()
        }
      }))
    } catch (error) {
      setAnalysisError(error.message || 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Get fit score color
  const getFitScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-blue-600 bg-blue-100'
    if (score >= 40) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusColor = (status) => {
    if (status === 'Met') return 'text-green-700 bg-green-100'
    if (status === 'Partial') return 'text-yellow-700 bg-yellow-100'
    return 'text-red-700 bg-red-100'
  }

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
  const textareaClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"

  // Prep Summary Modal
  const PrepSummary = () => (
    <div className="fixed inset-0 z-60 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={() => setShowPrepSummary(false)} />
        <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto print:shadow-none print:max-w-none">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between print:hidden">
            <h2 className="text-xl font-semibold text-gray-900">Interview Prep Summary</h2>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowPrepSummary(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center border-b pb-4">
              <h1 className="text-2xl font-bold text-gray-900">{formData.company}</h1>
              <p className="text-lg text-gray-600">{formData.title}</p>
              {formData.interviewDate && (
                <p className="text-indigo-600 font-medium mt-2">
                  {formData.interviewType} - {formatDate(formData.interviewDate)} {formData.interviewTime && `at ${formData.interviewTime}`}
                </p>
              )}
            </div>

            {/* Key Contacts */}
            {formData.keyContacts.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Key Contacts</h3>
                <div className="space-y-2">
                  {formData.keyContacts.map((contact, idx) => (
                    <div key={idx} className="bg-gray-50 p-2 rounded">
                      <p className="font-medium">{contact.name}</p>
                      {contact.title && <p className="text-sm text-gray-600">{contact.title}</p>}
                      {contact.notes && <p className="text-sm text-gray-500">{contact.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interviewers */}
            {formData.interviewerNames && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Interviewers</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{formData.interviewerNames}</p>
              </div>
            )}

            {/* Key Topics */}
            {formData.keyTopicsToPrep && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Key Topics to Prepare</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{formData.keyTopicsToPrep}</p>
              </div>
            )}

            {/* Company Research */}
            {formData.companyResearch && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Company Overview</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{formData.companyResearch}</p>
              </div>
            )}

            {/* Questions to Ask */}
            {formData.questionsToAsk && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Questions to Ask</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{formData.questionsToAsk}</p>
              </div>
            )}

            {/* Potential Concerns */}
            {formData.potentialConcerns && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Potential Concerns/Questions</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{formData.potentialConcerns}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{application.company}</h2>
              <p className="text-sm text-gray-500">{application.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPrepSummary(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
              >
                <Printer className="w-4 h-4" />
                Prep Summary
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                    <select name="region" value={formData.region} onChange={handleChange} className={inputClasses}>
                      <option value="">Select...</option>
                      {REGION_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job URL</label>
                    <input type="url" name="jobUrl" value={formData.jobUrl} onChange={handleChange} className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                    <input type="text" name="salary" value={formData.salary} onChange={handleChange} className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
                    <select name="companyType" value={formData.companyType} onChange={handleChange} className={inputClasses}>
                      <option value="">Select...</option>
                      {COMPANY_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume Version</label>
                    <select name="resumeVersion" value={formData.resumeVersion} onChange={handleChange} className={inputClasses}>
                      <option value="">Select...</option>
                      {resumeVersions.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modality</label>
                  <div className="flex flex-wrap gap-2">
                    {MODALITY_OPTIONS.map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleModalityChange(m)}
                        className={`px-3 py-1.5 text-sm rounded-full border ${
                          formData.modality.includes(m)
                            ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quality Tab */}
            {activeTab === 'quality' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">Application Quality Checklist</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:border-green-300">
                      <input
                        type="checkbox"
                        checked={formData.quality?.customResume || false}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          quality: { ...prev.quality, customResume: e.target.checked }
                        }))}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Customized Resume</p>
                        <p className="text-xs text-gray-500">Tailored for this role</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:border-green-300">
                      <input
                        type="checkbox"
                        checked={formData.quality?.customCoverLetter || false}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          quality: { ...prev.quality, customCoverLetter: e.target.checked }
                        }))}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Custom Cover Letter</p>
                        <p className="text-xs text-gray-500">Written for this role</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:border-green-300">
                      <input
                        type="checkbox"
                        checked={formData.quality?.atsOptimized || false}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          quality: { ...prev.quality, atsOptimized: e.target.checked }
                        }))}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">ATS Optimized</p>
                        <p className="text-xs text-gray-500">Keywords matched</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg border p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Resume Used</h4>
                    {formData.quality?.resumeFileName ? (
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <span className="text-sm text-gray-700">{formData.quality.resumeFileName}</span>
                        <button
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            quality: { ...prev.quality, resumeFileName: '', resumeFileData: null }
                          }))}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = () => {
                              setFormData(prev => ({
                                ...prev,
                                quality: {
                                  ...prev.quality,
                                  resumeFileName: file.name,
                                  resumeFileData: reader.result
                                }
                              }))
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    )}
                  </div>
                  <div className="bg-white rounded-lg border p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Cover Letter Used</h4>
                    {formData.quality?.coverLetterFileName ? (
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <span className="text-sm text-gray-700">{formData.quality.coverLetterFileName}</span>
                        <button
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            quality: { ...prev.quality, coverLetterFileName: '', coverLetterFileData: null }
                          }))}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = () => {
                              setFormData(prev => ({
                                ...prev,
                                quality: {
                                  ...prev.quality,
                                  coverLetterFileName: file.name,
                                  coverLetterFileData: reader.result
                                }
                              }))
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* AI Analysis Tab */}
            {activeTab === 'aiAnalysis' && (
              <div className="space-y-6">
                {/* Job Description Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                    <span className="font-normal text-gray-500 ml-2">(paste full posting for AI analysis)</span>
                  </label>
                  <textarea
                    value={formData.jobDescription || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                    className={textareaClasses}
                    rows={6}
                    placeholder="Paste the full job description here..."
                  />
                </div>

                {/* Analyze Button */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing || !formData.jobDescription}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Analyze Fit
                      </>
                    )}
                  </button>
                  {analysisError && (
                    <p className="text-sm text-red-600">{analysisError}</p>
                  )}
                  {formData.aiAnalysis?.analyzedAt && (
                    <p className="text-sm text-gray-500">
                      Last analyzed: {new Date(formData.aiAnalysis.analyzedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* AI Analysis Results */}
                {formData.aiAnalysis && (
                  <div className="space-y-6">
                    {/* Score Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className={`rounded-lg p-4 text-center ${getFitScoreColor(formData.aiAnalysis.fitScore)}`}>
                        <p className="text-3xl font-bold">{formData.aiAnalysis.fitScore}</p>
                        <p className="text-sm font-medium">Fit Score</p>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-4 text-center">
                        <p className="text-lg font-bold text-gray-900">{formData.aiAnalysis.fitTier}</p>
                        <p className="text-sm text-gray-600">Fit Tier</p>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-4 text-center">
                        <p className="text-lg font-bold text-gray-900">{formData.aiAnalysis.levelFit}</p>
                        <p className="text-sm text-gray-600">Level Fit</p>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-4 text-center">
                        <p className="text-lg font-bold text-gray-900">{formData.aiAnalysis.laneFit}</p>
                        <p className="text-sm text-gray-600">Lane Fit</p>
                      </div>
                    </div>

                    {/* Summary */}
                    {formData.aiAnalysis.summary && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-900">{formData.aiAnalysis.summary}</p>
                      </div>
                    )}

                    {/* Requirements Breakdown */}
                    <div className="bg-white border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Requirements Analysis ({formData.aiAnalysis.requirementsMet}/{formData.aiAnalysis.requirementsTotal} met)
                      </h4>
                      <div className="space-y-3">
                        {formData.aiAnalysis.qualifications?.map((qual, idx) => (
                          <div key={idx} className="border-b border-gray-100 pb-3 last:border-0">
                            <div className="flex items-start gap-3">
                              <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(qual.status)}`}>
                                {qual.status}
                              </span>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{qual.requirement}</p>
                                <p className="text-sm text-gray-600 mt-1">{qual.evidence}</p>
                                {qual.suggestion && qual.status !== 'Met' && (
                                  <p className="text-sm text-indigo-600 mt-1">Tip: {qual.suggestion}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strengths & Gaps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-2">Strengths</h4>
                        <ul className="space-y-1">
                          {formData.aiAnalysis.strengths?.map((s, idx) => (
                            <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-medium text-red-900 mb-2">Gaps</h4>
                        <ul className="space-y-1">
                          {formData.aiAnalysis.gaps?.map((g, idx) => (
                            <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              {g}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Recommendations */}
                    {formData.aiAnalysis.recommendations?.length > 0 && (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <h4 className="font-medium text-indigo-900 mb-2">Recommendations</h4>
                        <ul className="space-y-2">
                          {formData.aiAnalysis.recommendations.map((r, idx) => (
                            <li key={idx} className="text-sm text-indigo-800 flex items-start gap-2">
                              <span className="font-bold">{idx + 1}.</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* No Analysis Yet */}
                {!formData.aiAnalysis && !isAnalyzing && (
                  <div className="text-center py-8 text-gray-500">
                    <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>No AI analysis yet</p>
                    <p className="text-sm">Paste a job description and click "Analyze Fit" to get started</p>
                  </div>
                )}
              </div>
            )}

            {/* Interview Prep Tab */}
            {activeTab === 'interview' && (
              <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                  <h3 className="font-medium text-indigo-900 mb-3">Scheduled Interview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input type="date" name="interviewDate" value={formData.interviewDate} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input type="time" name="interviewTime" value={formData.interviewTime} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select name="interviewType" value={formData.interviewType} onChange={handleChange} className={inputClasses}>
                        <option value="">Select...</option>
                        {INTERVIEW_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer Names (one per line)</label>
                  <textarea
                    name="interviewerNames"
                    value={formData.interviewerNames}
                    onChange={handleChange}
                    rows={3}
                    className={textareaClasses}
                    placeholder="Dr. Jane Smith - VP Analytical&#10;John Doe - Director CMC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Topics to Prepare</label>
                  <textarea
                    name="keyTopicsToPrep"
                    value={formData.keyTopicsToPrep}
                    onChange={handleChange}
                    rows={4}
                    className={textareaClasses}
                    placeholder="- Why this company?&#10;- Leadership examples&#10;- Technical deep-dive: stability studies&#10;- Method validation experience"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Questions to Ask Them</label>
                  <textarea
                    name="questionsToAsk"
                    value={formData.questionsToAsk}
                    onChange={handleChange}
                    rows={4}
                    className={textareaClasses}
                    placeholder="- What does success look like in this role?&#10;- Team structure and growth plans?&#10;- Current analytical challenges?"
                  />
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Post-Interview</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Post-Interview Notes</label>
                      <textarea
                        name="postInterviewNotes"
                        value={formData.postInterviewNotes}
                        onChange={handleChange}
                        rows={4}
                        className={textareaClasses}
                        placeholder="Key discussion points, impressions, next steps..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                        <select name="interviewOutcome" value={formData.interviewOutcome} onChange={handleChange} className={inputClasses}>
                          <option value="">Select...</option>
                          {INTERVIEW_OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer mt-6">
                          <input
                            type="checkbox"
                            name="thankYouSent"
                            checked={formData.thankYouSent}
                            onChange={handleChange}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Thank you email sent</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow-up Date</label>
                    <input type="date" name="nextFollowUpDate" value={formData.nextFollowUpDate} onChange={handleChange} className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Notes</label>
                    <input type="text" name="followUpNotes" value={formData.followUpNotes} onChange={handleChange} className={inputClasses} />
                  </div>
                </div>
              </div>
            )}

            {/* Company Research Tab */}
            {activeTab === 'research' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Overview</label>
                  <textarea
                    name="companyResearch"
                    value={formData.companyResearch}
                    onChange={handleChange}
                    rows={4}
                    className={textareaClasses}
                    placeholder="Mission, size, founding year, key therapeutic areas..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recent News</label>
                  <textarea
                    name="recentNews"
                    value={formData.recentNews}
                    onChange={handleChange}
                    rows={3}
                    className={textareaClasses}
                    placeholder="Recent announcements, FDA approvals, partnerships..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pipeline/Products</label>
                  <textarea
                    name="pipelineProducts"
                    value={formData.pipelineProducts}
                    onChange={handleChange}
                    rows={3}
                    className={textareaClasses}
                    placeholder="Key products, pipeline candidates, development stages..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Culture Notes</label>
                  <textarea
                    name="cultureNotes"
                    value={formData.cultureNotes}
                    onChange={handleChange}
                    rows={3}
                    className={textareaClasses}
                    placeholder="Glassdoor insights, values, work environment..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Potential Concerns/Questions</label>
                  <textarea
                    name="potentialConcerns"
                    value={formData.potentialConcerns}
                    onChange={handleChange}
                    rows={3}
                    className={textareaClasses}
                    placeholder="Areas to clarify, potential red flags, questions about role..."
                  />
                </div>

                {/* Key Contacts */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Contacts</label>
                  <div className="space-y-3">
                    {formData.keyContacts.map((contact, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{contact.name}</p>
                          {contact.title && <p className="text-sm text-gray-600">{contact.title}</p>}
                          {contact.linkedin && (
                            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline">
                              LinkedIn
                            </a>
                          )}
                          {contact.notes && <p className="text-sm text-gray-500 mt-1">{contact.notes}</p>}
                        </div>
                        <button
                          onClick={() => handleRemoveContact(idx)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Name"
                          value={newContact.name}
                          onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                          className={inputClasses}
                        />
                        <input
                          type="text"
                          placeholder="Title"
                          value={newContact.title}
                          onChange={(e) => setNewContact(prev => ({ ...prev, title: e.target.value }))}
                          className={inputClasses}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="LinkedIn URL"
                          value={newContact.linkedin}
                          onChange={(e) => setNewContact(prev => ({ ...prev, linkedin: e.target.value }))}
                          className={inputClasses}
                        />
                        <input
                          type="text"
                          placeholder="Notes"
                          value={newContact.notes}
                          onChange={(e) => setNewContact(prev => ({ ...prev, notes: e.target.value }))}
                          className={inputClasses}
                        />
                      </div>
                      <button
                        onClick={handleAddContact}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded"
                      >
                        <Plus className="w-4 h-4" /> Add Contact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Status History</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div className="space-y-4">
                    {application.statusHistory?.map((entry, idx) => (
                      <div key={idx} className="relative flex gap-4 pl-10">
                        <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                          idx === application.statusHistory.length - 1
                            ? 'bg-indigo-600 border-indigo-600'
                            : 'bg-white border-gray-300'
                        }`} />
                        <div className="flex-1 bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                              {entry.status}
                            </span>
                            <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
                          </div>
                          {entry.notes && (
                            <p className="text-sm text-gray-600 mt-2">{entry.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {(!application.statusHistory || application.statusHistory.length === 0) && (
                      <p className="text-gray-500 text-center py-8">No status history yet</p>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">Application Details</h3>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-gray-500">Applied</dt>
                      <dd className="font-medium text-gray-900">{formatDate(application.dateApplied)}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Last Updated</dt>
                      <dd className="font-medium text-gray-900">{formatDate(application.updatedAt)}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Source</dt>
                      <dd className="font-medium text-gray-900">{application.applicationSource || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Referral</dt>
                      <dd className="font-medium text-gray-900">{application.referral || '-'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Prep Summary Modal */}
      {showPrepSummary && <PrepSummary />}
    </div>
  )
}

// Resume Version Manager Component
function ResumeVersionManager({ resumeVersions, applications, onAddVersion, onEditVersion, onDeleteVersion }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingVersion, setEditingVersion] = useState(null)

  // Calculate stats for each resume version
  const getVersionStats = (versionId) => {
    const usedApps = applications.filter(a => a.resumeVersion === versionId)
    const responded = usedApps.filter(a => a.status !== 'Applied').length
    const responseRate = usedApps.length > 0 ? Math.round((responded / usedApps.length) * 100) : 0

    // Best performing region
    const regionCounts = {}
    usedApps.forEach(app => {
      if (app.region) {
        if (!regionCounts[app.region]) regionCounts[app.region] = { total: 0, responded: 0 }
        regionCounts[app.region].total++
        if (app.status !== 'Applied') regionCounts[app.region].responded++
      }
    })
    let bestRegion = null
    let bestRegionRate = 0
    Object.entries(regionCounts).forEach(([region, counts]) => {
      const rate = counts.total > 0 ? counts.responded / counts.total : 0
      if (rate > bestRegionRate && counts.total >= 2) {
        bestRegionRate = rate
        bestRegion = region
      }
    })

    return { timesUsed: usedApps.length, responseRate, bestRegion }
  }

  const ResumeVersionModal = ({ version, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      id: version?.id || '',
      name: version?.name || '',
      description: version?.description || '',
      createdDate: version?.createdDate || new Date().toISOString().split('T')[0],
      targetRoles: version?.targetRoles || '',
      keyHighlights: version?.keyHighlights?.join('\n') || ''
    })
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
      const { name, value } = e.target
      setFormData(prev => ({ ...prev, [name]: value }))
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      const newErrors = {}
      if (!formData.name.trim()) newErrors.name = 'Name is required'
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }

      const versionData = {
        ...formData,
        id: formData.id || `v${Date.now()}-${formData.name.toLowerCase().replace(/\s+/g, '-')}`,
        keyHighlights: formData.keyHighlights.split('\n').filter(h => h.trim())
      }
      onSave(versionData)
    }

    const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {version ? 'Edit Resume Version' : 'Add Resume Version'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Version Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="e.g., Vaccines Focused"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={inputClasses}
                  placeholder="What's emphasized in this version..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                <input
                  type="date"
                  name="createdDate"
                  value={formData.createdDate}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Roles</label>
                <input
                  type="text"
                  name="targetRoles"
                  value={formData.targetRoles}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="What types of jobs is this for..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Highlights (one per line)</label>
                <textarea
                  name="keyHighlights"
                  value={formData.keyHighlights}
                  onChange={handleChange}
                  rows={4}
                  className={inputClasses}
                  placeholder="Method development expertise&#10;Protein characterization&#10;Tech transfer experience"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  {version ? 'Save Changes' : 'Add Version'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Find best performing version
  const versionsWithStats = resumeVersions.map(v => ({
    ...v,
    stats: getVersionStats(v.id)
  }))
  const bestVersion = versionsWithStats.reduce((best, v) =>
    v.stats.timesUsed >= 2 && v.stats.responseRate > (best?.stats?.responseRate || 0) ? v : best
  , null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Resume Versions</h2>
          <p className="text-sm text-gray-500">Manage and track performance of different resume versions</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Add Version
        </button>
      </div>

      {/* Recommendation */}
      {bestVersion && bestVersion.stats.timesUsed >= 2 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">Best Performing Resume</p>
              <p className="text-sm text-green-700">
                Your "{bestVersion.name}" resume has a {bestVersion.stats.responseRate}% response rate
                {bestVersion.stats.bestRegion && ` and performs best in ${bestVersion.stats.bestRegion}`}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Resume Versions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Times Used</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response Rate</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {versionsWithStats.map((version) => (
              <tr key={version.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">{version.name}</div>
                  {version.targetRoles && (
                    <p className="text-xs text-gray-500 mt-0.5">{version.targetRoles}</p>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">
                  {version.description || '-'}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {formatDate(version.createdDate)}
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-gray-900">{version.stats.timesUsed}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    version.stats.responseRate >= 30 ? 'bg-green-100 text-green-800' :
                    version.stats.responseRate >= 15 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {version.stats.responseRate}%
                  </span>
                  {version.stats.bestRegion && version.stats.timesUsed >= 2 && (
                    <p className="text-xs text-gray-500 mt-1">Best: {version.stats.bestRegion}</p>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingVersion(version)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    {version.stats.timesUsed === 0 && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${version.name}"?`)) {
                            onDeleteVersion(version.id)
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {resumeVersions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No resume versions yet</p>
                  <p className="text-gray-400 text-sm mt-1">Add your first resume version to start tracking performance</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Resume Analytics */}
      {versionsWithStats.filter(v => v.stats.timesUsed > 0).length > 1 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={versionsWithStats.filter(v => v.stats.timesUsed > 0)}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" unit="%" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="stats.responseRate" fill="#4F46E5" radius={[0, 4, 4, 0]} name="Response Rate" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Key Highlights for each version */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resumeVersions.filter(v => v.keyHighlights && v.keyHighlights.length > 0).map(version => (
          <div key={version.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-2">{version.name}</h4>
            <ul className="space-y-1">
              {version.keyHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-indigo-500 mt-1">•</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <ResumeVersionModal
          version={null}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(versionData) => {
            onAddVersion(versionData)
            setIsAddModalOpen(false)
          }}
        />
      )}

      {/* Edit Modal */}
      {editingVersion && (
        <ResumeVersionModal
          version={editingVersion}
          onClose={() => setEditingVersion(null)}
          onSave={(versionData) => {
            onEditVersion(versionData)
            setEditingVersion(null)
          }}
        />
      )}
    </div>
  )
}

// Common Tag Options
const TAG_OPTIONS = ['Dream Job', 'High Priority', 'Backup', 'Referral', 'Remote OK', 'Top Choice', 'Follow Up']

// Settings Component
function SettingsPanel({ applications, resumeVersions, onClearData, onClose, onExport, onImport }) {
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [lastBackup, setLastBackup] = useState(() => localStorage.getItem('pharma_job_tracker_last_backup'))
  const [mountTime] = useState(() => Date.now()) // Capture time once on mount

  // Calculate storage used
  const storageUsed = () => {
    const appData = JSON.stringify(applications)
    const resumeData = JSON.stringify(resumeVersions)
    const totalBytes = appData.length + resumeData.length
    return (totalBytes / 1024).toFixed(1)
  }

  // Calculate days since backup using mount time (not Date.now() during render)
  const daysSinceBackup = lastBackup
    ? Math.floor((mountTime - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24))
    : null

  // Check if backup is needed (more than 7 days old or never done)
  const needsBackup = !lastBackup || daysSinceBackup > 7

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Data Backup Section - Most Important */}
            <div className={`rounded-lg p-4 ${needsBackup ? 'bg-amber-50 border-2 border-amber-300' : 'bg-green-50 border border-green-200'}`}>
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Back Up Your Data
                {needsBackup && <span className="text-xs px-2 py-0.5 bg-amber-200 text-amber-800 rounded-full">Recommended</span>}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Your data is stored in your browser. Export regularly to avoid losing your job search progress.
              </p>
              {lastBackup && daysSinceBackup !== null && (
                <p className="text-xs text-gray-500 mb-3">
                  Last backup: {new Date(lastBackup).toLocaleDateString()} ({daysSinceBackup} days ago)
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (onExport) onExport()
                    const now = new Date().toISOString()
                    localStorage.setItem('pharma_job_tracker_last_backup', now)
                    setLastBackup(now)
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export Backup
                </button>
                <button
                  onClick={onImport}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Restore
                </button>
              </div>
            </div>

            {/* AI Features Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                AI Features
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                AI features are <strong>optional</strong>. Configure in the AI Match tab for job analysis and coaching.
              </p>
              <p className="text-xs text-gray-500">
                Free options: Google Gemini (free tier) or Ollama (run locally)
              </p>
            </div>

            {/* Keyboard Shortcuts */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                Keyboard Shortcuts
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">New Application</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">n</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Search</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">/</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Table View</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">1</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pipeline View</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">2</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dashboard</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">3</kbd>
                </div>
              </div>
            </div>

            {/* Data Stats */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                Data Storage
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Applications</span>
                  <span className="font-medium">{applications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resume Versions</span>
                  <span className="font-medium">{resumeVersions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage Used</span>
                  <span className="font-medium">{storageUsed()} KB</span>
                </div>
              </div>
            </div>

            {/* Clear Data */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                Danger Zone
              </h3>
              {!showClearConfirm ? (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Clear All Data
                </button>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                  <p className="text-sm text-red-800">
                    Are you sure? This will permanently delete {applications.length} applications and {resumeVersions.length} resume versions.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onClearData()
                        onClose()
                      }}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      Yes, Delete Everything
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Tag Manager for Applications
function TagSelector({ tags, onChange, availableTags = TAG_OPTIONS }) {
  const [isOpen, setIsOpen] = useState(false)
  const [customTag, setCustomTag] = useState('')

  const handleAddCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      onChange([...tags, customTag.trim()])
      setCustomTag('')
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <Tag className="w-4 h-4" />
        Tags ({tags.length})
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <div className="space-y-2">
            {availableTags.map(tag => (
              <label key={tag} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tags.includes(tag)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...tags, tag])
                    } else {
                      onChange(tags.filter(t => t !== tag))
                    }
                  }}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{tag}</span>
              </label>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
                placeholder="Custom tag..."
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="px-2 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
              >
                Add
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="mt-2 w-full px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Done
          </button>
        </div>
      )}
    </div>
  )
}

// Chart Colors
const CHART_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4']
const REGION_CHART_COLORS = {
  'Boston/Cambridge': '#3B82F6',
  'RTP/Durham': '#10B981',
  'SF Bay Area': '#F97316',
  'San Diego': '#8B5CF6',
  'Remote': '#6B7280',
  'Other': '#9CA3AF'
}

// Dashboard Component
function Dashboard({ applications, resumeVersions }) {
  // Calculate metrics
  const totalApps = applications.length
  const activeApps = applications.filter(a => !['Rejected', 'Withdrawn', 'Offer'].includes(a.status)).length
  const responseRate = totalApps > 0
    ? Math.round((applications.filter(a => a.status !== 'Applied').length / totalApps) * 100)
    : 0

  // Average days to first response
  const appsWithResponse = applications.filter(a =>
    a.statusHistory && a.statusHistory.length > 1
  )
  const avgDaysToResponse = appsWithResponse.length > 0
    ? Math.round(appsWithResponse.reduce((sum, app) => {
        const applied = new Date(app.statusHistory[0].date)
        const firstResponse = new Date(app.statusHistory[1].date)
        return sum + (firstResponse - applied) / (1000 * 60 * 60 * 24)
      }, 0) / appsWithResponse.length)
    : 0

  // Interviews this week
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const interviewsThisWeek = applications.filter(a =>
    ['Phone Screen', 'Technical', 'Onsite'].includes(a.status) &&
    new Date(a.statusHistory?.[a.statusHistory.length - 1]?.date) >= weekAgo
  ).length

  // Phone screens count (current + completed)
  const phoneScreens = applications.filter(a =>
    a.status === 'Phone Screen' ||
    a.statusHistory?.some(h => h.status === 'Phone Screen')
  ).length

  // Onsite/Final interviews count (current + completed)
  const onsiteInterviews = applications.filter(a =>
    a.status === 'Onsite' ||
    a.status === 'Technical' ||
    a.statusHistory?.some(h => h.status === 'Onsite' || h.status === 'Technical')
  ).length

  // Status funnel data
  const statusOrder = ['Applied', 'Reviewed', 'Phone Screen', 'Technical', 'Onsite', 'Offer']
  const funnelData = statusOrder.map((status, idx) => {
    const count = applications.filter(a => {
      const statusIndex = statusOrder.indexOf(a.status)
      return statusIndex >= idx || (a.status === 'Rejected' && a.statusHistory?.some(h => h.status === status))
    }).length
    return { name: status, value: count, fill: CHART_COLORS[idx] }
  })

  // Geographic breakdown
  const regionData = REGION_OPTIONS.map(region => ({
    name: region,
    total: applications.filter(a => a.region === region).length,
    responded: applications.filter(a => a.region === region && a.status !== 'Applied').length
  })).filter(r => r.total > 0)

  const regionResponseRates = regionData.map(r => ({
    ...r,
    responseRate: r.total > 0 ? Math.round((r.responded / r.total) * 100) : 0
  }))

  // Weekly trend (last 8 weeks)
  const weeklyData = []
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000)
    const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
    const weekLabel = `Week ${8 - i}`

    const applied = applications.filter(a => {
      const date = new Date(a.dateApplied)
      return date >= weekStart && date < weekEnd
    }).length

    const responses = applications.filter(a => {
      if (!a.statusHistory || a.statusHistory.length < 2) return false
      const responseDate = new Date(a.statusHistory[1].date)
      return responseDate >= weekStart && responseDate < weekEnd
    }).length

    weeklyData.push({ week: weekLabel, applications: applied, responses })
  }

  // Resume version performance
  const resumePerformance = resumeVersions.map(version => {
    const usedApps = applications.filter(a => a.resumeVersion === version.id)
    const responded = usedApps.filter(a => a.status !== 'Applied').length
    return {
      name: version.name,
      timesUsed: usedApps.length,
      responseRate: usedApps.length > 0 ? Math.round((responded / usedApps.length) * 100) : 0
    }
  }).filter(r => r.timesUsed > 0)

  // Company type analysis
  const companyTypeData = COMPANY_TYPE_OPTIONS.map(type => {
    const typeApps = applications.filter(a => a.companyType === type)
    const responded = typeApps.filter(a => a.status !== 'Applied').length
    return {
      name: type,
      total: typeApps.length,
      responseRate: typeApps.length > 0 ? Math.round((responded / typeApps.length) * 100) : 0
    }
  }).filter(c => c.total > 0)

  // Action items
  const needsFollowUp = applications.filter(a => {
    if (['Rejected', 'Withdrawn', 'Offer'].includes(a.status)) return false
    const lastContact = new Date(a.lastContactDate || a.dateApplied)
    const daysSinceContact = (now - lastContact) / (1000 * 60 * 60 * 24)
    return daysSinceContact >= 7
  })

  const recentlyRejected = applications.filter(a => {
    if (a.status !== 'Rejected') return false
    const lastStatus = a.statusHistory?.[a.statusHistory.length - 1]
    if (!lastStatus) return false
    const rejectedDate = new Date(lastStatus.date)
    return (now - rejectedDate) / (1000 * 60 * 60 * 24) <= 7
  })

  // Scheduled follow-ups
  const today = new Date().toISOString().split('T')[0]
  const scheduledFollowUps = applications
    .filter(a => a.nextFollowUpDate && !['Rejected', 'Withdrawn', 'Offer'].includes(a.status))
    .map(a => ({
      ...a,
      isOverdue: a.nextFollowUpDate < today,
      isDueToday: a.nextFollowUpDate === today,
      daysUntilDue: Math.ceil((new Date(a.nextFollowUpDate) - now) / (1000 * 60 * 60 * 24))
    }))
    .sort((a, b) => new Date(a.nextFollowUpDate) - new Date(b.nextFollowUpDate))

  const overdueFollowUps = scheduledFollowUps.filter(a => a.isOverdue)
  const todayFollowUps = scheduledFollowUps.filter(a => a.isDueToday)
  const upcomingFollowUps = scheduledFollowUps.filter(a => !a.isOverdue && !a.isDueToday && a.daysUntilDue <= 7)

  // Rejection Analytics
  const rejectedApps = applications.filter(a => a.status === 'Rejected')
  const rejectedWithData = rejectedApps.filter(a => a.rejection)

  // Rejection by stage
  const rejectionByStage = [
    'Resume Screen', 'Phone Screen', 'Technical Interview', 'Onsite Interview',
    'Final Round', 'Offer Stage', 'Unknown'
  ].map(stage => ({
    name: stage,
    count: rejectedWithData.filter(a => a.rejection?.stage === stage).length
  })).filter(s => s.count > 0)

  // Rejection by reason
  const rejectionByReason = [
    'Skills Gap', 'Experience Level', 'Culture Fit', 'Better Candidate',
    'Salary Expectations', 'Position Filled', 'Position Cancelled', 'Internal Candidate', 'Unknown'
  ].map(reason => ({
    name: reason,
    count: rejectedWithData.filter(a => a.rejection?.reason === reason).length
  })).filter(r => r.count > 0)

  // Aggregate learnings from rejections
  const allLearnings = rejectedWithData
    .flatMap(a => a.rejection?.learnings || [])
    .filter(Boolean)

  // Count learning frequency
  const learningCounts = allLearnings.reduce((acc, learning) => {
    const normalized = learning.toLowerCase().trim()
    acc[normalized] = (acc[normalized] || 0) + 1
    return acc
  }, {})

  const topLearnings = Object.entries(learningCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([learning, count]) => ({ learning, count }))

  // Quality metrics comparison
  const customizedApps = applications.filter(a => a.quality?.customResume || a.quality?.customCoverLetter)
  const quickApplyApps = applications.filter(a => !a.quality?.customResume && !a.quality?.customCoverLetter)
  const customizedResponseRate = customizedApps.length > 0
    ? Math.round((customizedApps.filter(a => a.status !== 'Applied').length / customizedApps.length) * 100)
    : 0
  const quickApplyResponseRate = quickApplyApps.length > 0
    ? Math.round((quickApplyApps.filter(a => a.status !== 'Applied').length / quickApplyApps.length) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Applications</p>
          <p className="text-2xl font-bold text-gray-900">{totalApps}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Response Rate</p>
          <p className="text-2xl font-bold text-indigo-600">{responseRate}%</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">{activeApps}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Phone Screens</p>
          <p className="text-2xl font-bold text-amber-600">{phoneScreens}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Onsite/Final</p>
          <p className="text-2xl font-bold text-pink-600">{onsiteInterviews}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Avg Days to Response</p>
          <p className="text-2xl font-bold text-blue-600">{avgDaysToResponse}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Interviews This Week</p>
          <p className="text-2xl font-bold text-purple-600">{interviewsThisWeek}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Funnel */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Funnel</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" radius={[0, 4, 4, 0]}>
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Geographic Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications by Region</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="total"
                nameKey="name"
                label={({ name, total }) => `${name}: ${total}`}
              >
                {regionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={REGION_CHART_COLORS[entry.name] || CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="applications" stroke="#4F46E5" strokeWidth={2} name="Applied" />
              <Line type="monotone" dataKey="responses" stroke="#10B981" strokeWidth={2} name="Responses" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Response Rate by Region */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Rate by Region</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={regionResponseRates}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
              <YAxis unit="%" />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="responseRate" fill="#10B981" radius={[4, 4, 0, 0]} name="Response Rate">
                {regionResponseRates.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={REGION_CHART_COLORS[entry.name] || CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Version Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Version Performance</h3>
          {resumePerformance.length > 0 ? (
            <div className="space-y-3">
              {resumePerformance.map((resume, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{resume.name}</p>
                    <p className="text-sm text-gray-500">Used {resume.timesUsed} times</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${resume.responseRate >= 30 ? 'text-green-600' : resume.responseRate >= 15 ? 'text-yellow-600' : 'text-gray-600'}`}>
                      {resume.responseRate}%
                    </p>
                    <p className="text-xs text-gray-500">response rate</p>
                  </div>
                </div>
              ))}
              {resumePerformance.length > 1 && (
                <p className="text-sm text-indigo-600 mt-2">
                  Best performing: {resumePerformance.sort((a, b) => b.responseRate - a.responseRate)[0]?.name}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No resume data yet</p>
          )}
        </div>

        {/* Company Type Analysis */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Rate by Company Type</h3>
          {companyTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={companyTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" unit="%" />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="responseRate" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="Response Rate" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No data yet</p>
          )}
        </div>
      </div>

      {/* Quality Metrics Comparison */}
      {(customizedApps.length > 0 || quickApplyApps.length > 0) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            What's Working: Application Quality
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <h4 className="text-sm font-medium text-green-800 mb-2">Customized Applications</h4>
              <p className="text-3xl font-bold text-green-600">{customizedResponseRate}%</p>
              <p className="text-sm text-gray-600 mt-1">response rate ({customizedApps.length} applications)</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Apply</h4>
              <p className="text-3xl font-bold text-gray-600">{quickApplyResponseRate}%</p>
              <p className="text-sm text-gray-600 mt-1">response rate ({quickApplyApps.length} applications)</p>
            </div>
          </div>
          {customizedResponseRate > quickApplyResponseRate && customizedApps.length >= 3 && (
            <p className="text-sm text-green-700 mt-4 p-3 bg-green-50 rounded-lg">
              💡 Customized applications are outperforming quick-apply by {customizedResponseRate - quickApplyResponseRate}%!
            </p>
          )}
        </div>
      )}

      {/* Rejection Learning Analytics */}
      {rejectedApps.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            Rejection Patterns & Learnings
            <span className="text-sm font-normal text-gray-500">({rejectedApps.length} total, {rejectedWithData.length} with details)</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* By Stage */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Rejection Stage</h4>
              {rejectionByStage.length > 0 ? (
                <div className="space-y-2">
                  {rejectionByStage.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-red-400 h-full rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${Math.max(20, (item.count / rejectedWithData.length) * 100)}%` }}
                        >
                          <span className="text-xs text-white font-medium">{item.count}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 w-24 truncate" title={item.name}>{item.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No stage data logged</p>
              )}
            </div>

            {/* By Reason */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Rejection Reason</h4>
              {rejectionByReason.length > 0 ? (
                <div className="space-y-2">
                  {rejectionByReason.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-orange-400 h-full rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${Math.max(20, (item.count / rejectedWithData.length) * 100)}%` }}
                        >
                          <span className="text-xs text-white font-medium">{item.count}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 w-24 truncate" title={item.name}>{item.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No reason data logged</p>
              )}
            </div>

            {/* Learnings */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Top Learnings</h4>
              {topLearnings.length > 0 ? (
                <div className="space-y-2">
                  {topLearnings.map((item, idx) => (
                    <div key={idx} className="p-2 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-sm text-gray-800 capitalize">{item.learning}</p>
                      {item.count > 1 && (
                        <p className="text-xs text-yellow-700 mt-1">Mentioned {item.count} times</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No learnings logged yet. Add learnings when logging rejections!</p>
              )}
            </div>
          </div>

          {rejectedWithData.length < rejectedApps.length && (
            <p className="text-sm text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
              💡 {rejectedApps.length - rejectedWithData.length} rejections don't have detailed data. Use "Update Status" to add rejection details and learnings.
            </p>
          )}
        </div>
      )}

      {/* Scheduled Follow-ups */}
      {(overdueFollowUps.length > 0 || todayFollowUps.length > 0 || upcomingFollowUps.length > 0) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Scheduled Follow-ups
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overdue */}
            <div className={`rounded-lg p-4 ${overdueFollowUps.length > 0 ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
              <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Overdue ({overdueFollowUps.length})
              </h4>
              {overdueFollowUps.length > 0 ? (
                <div className="space-y-2">
                  {overdueFollowUps.slice(0, 3).map(app => (
                    <div key={app.id} className="bg-white p-2 rounded border border-red-100">
                      <p className="font-medium text-gray-900 text-sm">{app.company}</p>
                      <p className="text-xs text-gray-500">{app.title}</p>
                      <p className="text-xs text-red-600 mt-1">
                        Due: {new Date(app.nextFollowUpDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {overdueFollowUps.length > 3 && (
                    <p className="text-xs text-red-600">+{overdueFollowUps.length - 3} more</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No overdue items</p>
              )}
            </div>

            {/* Today */}
            <div className={`rounded-lg p-4 ${todayFollowUps.length > 0 ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'}`}>
              <h4 className="text-sm font-medium text-orange-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Due Today ({todayFollowUps.length})
              </h4>
              {todayFollowUps.length > 0 ? (
                <div className="space-y-2">
                  {todayFollowUps.slice(0, 3).map(app => (
                    <div key={app.id} className="bg-white p-2 rounded border border-orange-100">
                      <p className="font-medium text-gray-900 text-sm">{app.company}</p>
                      <p className="text-xs text-gray-500">{app.title}</p>
                      {app.followUpNotes && (
                        <p className="text-xs text-gray-600 mt-1 truncate">{app.followUpNotes}</p>
                      )}
                    </div>
                  ))}
                  {todayFollowUps.length > 3 && (
                    <p className="text-xs text-orange-600">+{todayFollowUps.length - 3} more</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Nothing due today</p>
              )}
            </div>

            {/* Upcoming */}
            <div className="rounded-lg p-4 bg-blue-50 border border-blue-200">
              <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Next 7 Days ({upcomingFollowUps.length})
              </h4>
              {upcomingFollowUps.length > 0 ? (
                <div className="space-y-2">
                  {upcomingFollowUps.slice(0, 3).map(app => (
                    <div key={app.id} className="bg-white p-2 rounded border border-blue-100">
                      <p className="font-medium text-gray-900 text-sm">{app.company}</p>
                      <p className="text-xs text-gray-500">{app.title}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        In {app.daysUntilDue} day{app.daysUntilDue !== 1 ? 's' : ''}
                      </p>
                    </div>
                  ))}
                  {upcomingFollowUps.length > 3 && (
                    <p className="text-xs text-blue-600">+{upcomingFollowUps.length - 3} more</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No upcoming follow-ups</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Items */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Needs Follow-up */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              Needs Follow-up (7+ days)
            </h4>
            {needsFollowUp.length > 0 ? (
              <div className="space-y-2">
                {needsFollowUp.slice(0, 5).map(app => (
                  <div key={app.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-100">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{app.company}</p>
                      <p className="text-xs text-gray-500">{app.title}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
                {needsFollowUp.length > 5 && (
                  <p className="text-sm text-gray-500">+{needsFollowUp.length - 5} more</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-4">All applications are up to date!</p>
            )}
          </div>

          {/* Recently Rejected */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              Recently Rejected (Last 7 days)
            </h4>
            {recentlyRejected.length > 0 ? (
              <div className="space-y-2">
                {recentlyRejected.slice(0, 5).map(app => (
                  <div key={app.id} className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-100">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{app.company}</p>
                      <p className="text-xs text-gray-500">{app.title}</p>
                    </div>
                    {app.feedbackReceived && (
                      <span className="text-xs text-gray-500 max-w-32 truncate" title={app.feedbackReceived}>
                        {app.feedbackReceived}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-4">No recent rejections</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Target Companies View Component
function TargetCompaniesView({
  companies,
  applications,
  onAddCompany,
  onEditCompany,
  onDeleteCompany,
  onAddConnection,
  onUpdateConnection,
  onDeleteConnection,
  getCompanyApplications
}) {
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('priority')

  // Filter and sort companies
  const filteredCompanies = companies
    .filter(c => filterStatus === 'all' || c.status === filterStatus)
    .filter(c => filterCategory === 'all' || c.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'priority') return a.priority - b.priority
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'status') return a.status.localeCompare(b.status)
      return 0
    })

  const getStatusColor = (status) => {
    const colors = {
      'Researching': 'bg-blue-100 text-blue-800',
      'Ready to Apply': 'bg-yellow-100 text-yellow-800',
      'Applied': 'bg-purple-100 text-purple-800',
      'Interviewing': 'bg-green-100 text-green-800',
      'Dormant': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      1: 'text-red-600',
      2: 'text-orange-600',
      3: 'text-yellow-600',
      4: 'text-blue-600',
      5: 'text-gray-600'
    }
    return colors[priority] || 'text-gray-600'
  }

  // Stats
  const stats = {
    total: companies.length,
    researching: companies.filter(c => c.status === 'Researching').length,
    readyToApply: companies.filter(c => c.status === 'Ready to Apply').length,
    applied: companies.filter(c => c.status === 'Applied').length,
    interviewing: companies.filter(c => c.status === 'Interviewing').length,
    withConnections: companies.filter(c => c.connections && c.connections.length > 0).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" />
            Target Companies
          </h2>
          <p className="text-sm text-gray-500">
            Track and research your target company list for strategic job applications
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Researching</p>
          <p className="text-2xl font-bold text-blue-600">{stats.researching}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Ready</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.readyToApply}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Applied</p>
          <p className="text-2xl font-bold text-purple-600">{stats.applied}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Interviewing</p>
          <p className="text-2xl font-bold text-green-600">{stats.interviewing}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">With Connections</p>
          <p className="text-2xl font-bold text-indigo-600">{stats.withConnections}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Filters:</span>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5"
        >
          <option value="all">All Statuses</option>
          {COMPANY_STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5"
        >
          <option value="all">All Categories</option>
          {COMPANY_CATEGORY_OPTIONS.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5"
        >
          <option value="priority">Sort by Priority</option>
          <option value="name">Sort by Name</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {/* Company List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Connections</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCompanies.map(company => {
              const companyApps = getCompanyApplications(company.name)
              return (
                <tr key={company.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedCompany(company)}>
                  <td className="px-4 py-4">
                    <span className={`font-bold ${getPriorityColor(company.priority)}`}>
                      P{company.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{company.name}</span>
                      {company.careersUrl && (
                        <a
                          href={company.careersUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-indigo-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    {company.notes && (
                      <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">{company.notes}</p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-600">{company.category}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(company.status)}`}>
                      {company.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-600">
                      {company.connections?.length || 0}
                      {company.connections?.some(c => c.introStatus === 'Intro Made') && (
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 inline ml-1" />
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-600">{companyApps.length}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onEditCompany(company)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteCompany(company.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No companies found</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              Add your first target company
            </button>
          </div>
        )}
      </div>

      {/* Add Company Modal */}
      {isAddModalOpen && (
        <CompanyFormModal
          onSubmit={(data) => {
            onAddCompany(data)
            setIsAddModalOpen(false)
          }}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* Company Detail Modal */}
      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          applications={getCompanyApplications(selectedCompany.name)}
          onClose={() => setSelectedCompany(null)}
          onSave={(data) => {
            onEditCompany({ ...selectedCompany, ...data })
            setSelectedCompany(null)
          }}
          onAddConnection={(data) => onAddConnection(selectedCompany.id, data)}
          onUpdateConnection={(connId, data) => onUpdateConnection(selectedCompany.id, connId, data)}
          onDeleteConnection={(connId) => onDeleteConnection(selectedCompany.id, connId)}
        />
      )}
    </div>
  )
}

// Company Form Modal Component
function CompanyFormModal({ company, onSubmit, onClose }) {
  const [formData, setFormData] = useState(company || {
    name: '',
    category: '',
    priority: 3,
    status: 'Researching',
    careersUrl: '',
    notes: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === 'priority' ? parseInt(value) : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {company ? 'Edit Company' : 'Add Target Company'}
            </h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Genentech"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select...</option>
                  {COMPANY_CATEGORY_OPTIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {COMPANY_PRIORITY_OPTIONS.map(p => (
                    <option key={p} value={p}>P{p} {p === 1 ? '(Highest)' : p === 5 ? '(Lowest)' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {COMPANY_STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Careers URL</label>
              <input
                type="url"
                name="careersUrl"
                value={formData.careersUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://company.com/careers"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Why is this company a target? Any initial notes..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                {company ? 'Save Changes' : 'Add Company'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Company Detail Modal Component
function CompanyDetailModal({
  company,
  applications,
  onClose,
  onSave,
  onAddConnection,
  onUpdateConnection,
  onDeleteConnection
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [formData, setFormData] = useState({
    ...company,
    research: company.research || {
      overview: '',
      recentNews: [],
      keyPeople: [],
      painPoints: [],
      products: '',
      culture: '',
      whyTheyWantMe: '',
      lastResearched: null
    }
  })
  const [newConnection, setNewConnection] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === 'priority' ? parseInt(value) : value }))
  }

  const handleResearchChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      research: { ...prev.research, [field]: value, lastResearched: new Date().toISOString().split('T')[0] }
    }))
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'research', label: 'Research', icon: Search },
    { id: 'connections', label: 'Connections', icon: User },
    { id: 'applications', label: 'Applications', icon: Briefcase }
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
              <p className="text-sm text-gray-500">{company.category} · Priority {company.priority}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'connections' && company.connections?.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-200 rounded-full">{company.connections.length}</span>
                )}
                {tab.id === 'applications' && applications.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-200 rounded-full">{applications.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {COMPANY_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {COMPANY_PRIORITY_OPTIONS.map(p => <option key={p} value={p}>P{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Careers URL</label>
                  <input
                    type="url"
                    name="careersUrl"
                    value={formData.careersUrl || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  />
                </div>
              </div>
            )}

            {/* Research Tab */}
            {activeTab === 'research' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Overview</label>
                  <textarea
                    value={formData.research.overview || ''}
                    onChange={(e) => handleResearchChange('overview', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                    placeholder="What does this company do? Key products, mission, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Products / Pipeline</label>
                  <textarea
                    value={formData.research.products || ''}
                    onChange={(e) => handleResearchChange('products', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                    placeholder="Key products, pipeline programs, therapeutic areas..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pain Points / Challenges</label>
                  <textarea
                    value={(formData.research.painPoints || []).join('\n')}
                    onChange={(e) => handleResearchChange('painPoints', e.target.value.split('\n').filter(s => s.trim()))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                    placeholder="One pain point per line - what problems can you solve for them?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Culture Notes</label>
                  <textarea
                    value={formData.research.culture || ''}
                    onChange={(e) => handleResearchChange('culture', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                    placeholder="Work culture, values, team dynamics..."
                  />
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-green-800 mb-1">Why They Would Want ME</label>
                  <textarea
                    value={formData.research.whyTheyWantMe || ''}
                    onChange={(e) => handleResearchChange('whyTheyWantMe', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-green-300 rounded-lg text-sm resize-none bg-white"
                    placeholder="What specific value can YOU bring to this company? How does your experience align?"
                  />
                </div>
                {formData.research.lastResearched && (
                  <p className="text-xs text-gray-500">Last researched: {formData.research.lastResearched}</p>
                )}
              </div>
            )}

            {/* Connections Tab */}
            {activeTab === 'connections' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Track your 2nd-degree connections and intro requests</p>
                  <button
                    onClick={() => setNewConnection({ name: '', title: '', linkedin: '', mutualConnection: '', introStatus: 'Not Asked', notes: '' })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                  >
                    <Plus className="w-4 h-4" />
                    Add Connection
                  </button>
                </div>

                {newConnection && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Name"
                        value={newConnection.name}
                        onChange={(e) => setNewConnection({ ...newConnection, name: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Title"
                        value={newConnection.title}
                        onChange={(e) => setNewConnection({ ...newConnection, title: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Mutual Connection (who knows them?)"
                      value={newConnection.mutualConnection}
                      onChange={(e) => setNewConnection({ ...newConnection, mutualConnection: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="url"
                      placeholder="LinkedIn URL"
                      value={newConnection.linkedin}
                      onChange={(e) => setNewConnection({ ...newConnection, linkedin: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onAddConnection(newConnection)
                          setNewConnection(null)
                        }}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                      >
                        Save Connection
                      </button>
                      <button
                        onClick={() => setNewConnection(null)}
                        className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {company.connections && company.connections.length > 0 ? (
                  <div className="space-y-3">
                    {company.connections.map((conn, idx) => (
                      <div key={conn.id || idx} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{conn.name}</span>
                              {conn.linkedin && (
                                <a href={conn.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                            {conn.title && <p className="text-sm text-gray-600">{conn.title}</p>}
                            {conn.mutualConnection && (
                              <p className="text-xs text-gray-500 mt-1">Via: {conn.mutualConnection}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={conn.introStatus}
                              onChange={(e) => onUpdateConnection(conn.id, { ...conn, introStatus: e.target.value })}
                              className={`text-xs px-2 py-1 rounded-full border ${
                                conn.introStatus === 'Intro Made' ? 'bg-green-100 border-green-300 text-green-800' :
                                conn.introStatus === 'Asked' ? 'bg-yellow-100 border-yellow-300 text-yellow-800' :
                                'bg-gray-100 border-gray-300 text-gray-600'
                              }`}
                            >
                              {INTRO_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <button
                              onClick={() => onDeleteConnection(conn.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {conn.notes && <p className="text-sm text-gray-500 mt-2">{conn.notes}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p>No connections tracked yet</p>
                    <p className="text-sm">Add people at this company you want to connect with</p>
                  </div>
                )}
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div>
                {applications.length > 0 ? (
                  <div className="space-y-3">
                    {applications.map(app => (
                      <div key={app.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{app.title}</p>
                            <p className="text-sm text-gray-500">{app.location}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            app.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                            app.status === 'Phone Screen' ? 'bg-yellow-100 text-yellow-800' :
                            app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Applied: {formatDate(app.dateApplied)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p>No applications to {company.name} yet</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Networking View Component
function NetworkingView({
  networkingTouches,
  networkingStats,
  outreachTemplates,
  targetCompanies,
  applications,
  setNetworkingTouches,
  setNetworkingStats,
  setOutreachTemplates,
  showToast
}) {
  const DAILY_GOAL = 5
  const [activeSection, setActiveSection] = useState('touches') // 'touches' or 'templates'
  const [isAddTouchOpen, setIsAddTouchOpen] = useState(false)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [previewTemplate, setPreviewTemplate] = useState(null)

  // Get today's date string
  const today = new Date().toISOString().split('T')[0]

  // Get today's touches
  const todayRecord = networkingTouches.find(t => t.date === today)
  const todayTouches = todayRecord?.touches || []
  const todayCount = todayTouches.length
  const goalProgress = Math.min((todayCount / DAILY_GOAL) * 100, 100)
  const goalMet = todayCount >= DAILY_GOAL

  // Calculate response rate for templates
  const getTemplateResponseRate = (template) => {
    if (template.timesUsed === 0) return 0
    return Math.round((template.responsesReceived / template.timesUsed) * 100)
  }

  // Get recent touches (last 7 days)
  const recentTouches = networkingTouches
    .filter(t => {
      const touchDate = new Date(t.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return touchDate >= weekAgo
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  // Log a new touch
  const handleAddTouch = (touchData) => {
    const newTouch = {
      id: uuidv4(),
      ...touchData,
      createdAt: new Date().toISOString()
    }

    const existingDayIndex = networkingTouches.findIndex(t => t.date === today)
    let updatedTouches

    if (existingDayIndex >= 0) {
      updatedTouches = networkingTouches.map((t, i) =>
        i === existingDayIndex
          ? { ...t, touches: [...t.touches, newTouch], goalMet: t.touches.length + 1 >= DAILY_GOAL }
          : t
      )
    } else {
      updatedTouches = [
        ...networkingTouches,
        {
          id: uuidv4(),
          date: today,
          touches: [newTouch],
          goalMet: 1 >= DAILY_GOAL
        }
      ]
    }

    setNetworkingTouches(updatedTouches)

    // Update stats
    const newTotalTouches = networkingStats.totalTouches + 1
    const wasGoalMetBefore = todayCount >= DAILY_GOAL
    const isGoalMetNow = todayCount + 1 >= DAILY_GOAL

    let newCurrentStreak = networkingStats.currentStreak
    let newLongestStreak = networkingStats.longestStreak

    // If we just hit the goal for today, increment streak
    if (!wasGoalMetBefore && isGoalMetNow) {
      // Check if yesterday's goal was met
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      const yesterdayRecord = networkingTouches.find(t => t.date === yesterdayStr)

      if (yesterdayRecord?.goalMet || networkingStats.currentStreak === 0) {
        newCurrentStreak = networkingStats.currentStreak + 1
        if (newCurrentStreak > newLongestStreak) {
          newLongestStreak = newCurrentStreak
        }
      } else {
        newCurrentStreak = 1
      }
    }

    setNetworkingStats({
      ...networkingStats,
      totalTouches: newTotalTouches,
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastTouchDate: today
    })

    setIsAddTouchOpen(false)
    showToast('Touch logged successfully!')
  }

  // Delete a touch
  const handleDeleteTouch = (date, touchId) => {
    const updatedTouches = networkingTouches.map(t => {
      if (t.date === date) {
        const filteredTouches = t.touches.filter(touch => touch.id !== touchId)
        return { ...t, touches: filteredTouches, goalMet: filteredTouches.length >= DAILY_GOAL }
      }
      return t
    }).filter(t => t.touches.length > 0)

    setNetworkingTouches(updatedTouches)
    setNetworkingStats({
      ...networkingStats,
      totalTouches: Math.max(0, networkingStats.totalTouches - 1)
    })
    showToast('Touch deleted')
  }

  // Template handlers
  const handleSaveTemplate = (templateData) => {
    if (editingTemplate) {
      const updated = outreachTemplates.map(t =>
        t.id === editingTemplate.id
          ? { ...t, ...templateData, updatedAt: new Date().toISOString() }
          : t
      )
      setOutreachTemplates(updated)
      showToast('Template updated!')
    } else {
      const newTemplate = {
        id: uuidv4(),
        ...templateData,
        timesUsed: 0,
        responsesReceived: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setOutreachTemplates([...outreachTemplates, newTemplate])
      showToast('Template created!')
    }
    setIsTemplateModalOpen(false)
    setEditingTemplate(null)
  }

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Delete this template?')) {
      setOutreachTemplates(outreachTemplates.filter(t => t.id !== templateId))
      showToast('Template deleted')
    }
  }

  const handleCopyTemplate = (template) => {
    navigator.clipboard.writeText(template.body)
    showToast('Template copied to clipboard!')
  }

  const handleMarkTemplateUsed = (templateId, gotResponse = false) => {
    const updated = outreachTemplates.map(t =>
      t.id === templateId
        ? {
            ...t,
            timesUsed: t.timesUsed + 1,
            responsesReceived: gotResponse ? t.responsesReceived + 1 : t.responsesReceived,
            updatedAt: new Date().toISOString()
          }
        : t
    )
    setOutreachTemplates(updated)
    showToast('Template usage recorded')
  }

  // Get icon for touch type
  const getTouchTypeIcon = (type) => {
    switch (type) {
      case 'Cold Intro': return <Send className="w-4 h-4" />
      case 'Coffee Chat': return <Coffee className="w-4 h-4" />
      case 'LinkedIn Comment': return <Linkedin className="w-4 h-4" />
      case 'Follow-up': return <Mail className="w-4 h-4" />
      case 'Thank You': return <Award className="w-4 h-4" />
      case 'Check-in': return <MessageSquare className="w-4 h-4" />
      case 'Informational Interview': return <Users className="w-4 h-4" />
      case 'Event/Meetup': return <Calendar className="w-4 h-4" />
      default: return <MessageSquare className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Networking Dashboard
          </h2>
          <p className="text-sm text-gray-500">
            Track your daily networking touches and outreach effectiveness
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSection('touches')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === 'touches'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Daily Touches
          </button>
          <button
            onClick={() => setActiveSection('templates')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === 'templates'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Templates
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Target className="w-4 h-4" />
            Today's Progress
          </div>
          <p className="text-2xl font-bold text-indigo-600">{todayCount}/{DAILY_GOAL}</p>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${goalMet ? 'bg-green-500' : 'bg-indigo-500'}`}
              style={{ width: `${goalProgress}%` }}
            />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Flame className="w-4 h-4 text-orange-500" />
            Current Streak
          </div>
          <p className="text-2xl font-bold text-orange-600">{networkingStats.currentStreak} days</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Award className="w-4 h-4 text-yellow-500" />
            Best Streak
          </div>
          <p className="text-2xl font-bold text-yellow-600">{networkingStats.longestStreak} days</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Total Touches
          </div>
          <p className="text-2xl font-bold text-green-600">{networkingStats.totalTouches}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileText className="w-4 h-4 text-purple-500" />
            Templates
          </div>
          <p className="text-2xl font-bold text-purple-600">{outreachTemplates.length}</p>
        </div>
      </div>

      {/* Daily Touches Section */}
      {activeSection === 'touches' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Touches */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Today's Touches
                {goalMet && <span className="text-green-500 text-sm">Goal Met!</span>}
              </h3>
              <button
                onClick={() => setIsAddTouchOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4" />
                Log Touch
              </button>
            </div>

            {todayTouches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No touches logged today</p>
                <p className="text-sm">Hit your daily goal of {DAILY_GOAL} touches!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayTouches.map((touch, index) => (
                  <div key={touch.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full">
                      {getTouchTypeIcon(touch.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{touch.personName}</p>
                      <p className="text-sm text-gray-600">{touch.company}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-200 rounded">
                          {touch.type}
                        </span>
                        {touch.notes && <span className="ml-2">{touch.notes}</span>}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteTouch(today, touch.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent History */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-indigo-600" />
              Last 7 Days
            </h3>

            {recentTouches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTouches.map(dayRecord => (
                  <div key={dayRecord.id} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">
                        {dayRecord.date === today ? 'Today' : new Date(dayRecord.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <span className={`text-sm font-medium ${dayRecord.touches.length >= DAILY_GOAL ? 'text-green-600' : 'text-gray-500'}`}>
                        {dayRecord.touches.length}/{DAILY_GOAL} {dayRecord.touches.length >= DAILY_GOAL && '✓'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {dayRecord.touches.map(touch => (
                        <span
                          key={touch.id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          title={`${touch.personName} at ${touch.company}`}
                        >
                          {getTouchTypeIcon(touch.type)}
                          {touch.personName}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Templates Section */}
      {activeSection === 'templates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Outreach Templates</h3>
            <button
              onClick={() => {
                setEditingTemplate(null)
                setIsTemplateModalOpen(true)
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              New Template
            </button>
          </div>

          {outreachTemplates.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500">No templates yet</p>
              <p className="text-sm text-gray-400">Create templates for common outreach messages</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {outreachTemplates.map(template => (
                <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded mt-1">
                        {template.category}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleCopyTemplate(template)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingTemplate(template)
                          setIsTemplateModalOpen(true)
                        }}
                        className="p-1.5 text-gray-400 hover:text-indigo-600"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {template.body.substring(0, 150)}...
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <span>Used {template.timesUsed}x</span>
                    <span className={getTemplateResponseRate(template) >= 30 ? 'text-green-600 font-medium' : ''}>
                      {getTemplateResponseRate(template)}% response rate
                    </span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="flex-1 px-2 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleMarkTemplateUsed(template.id, false)}
                      className="flex-1 px-2 py-1.5 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                    >
                      Mark Used
                    </button>
                    <button
                      onClick={() => handleMarkTemplateUsed(template.id, true)}
                      className="flex-1 px-2 py-1.5 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      Got Response
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Touch Modal */}
      {isAddTouchOpen && (
        <AddTouchModal
          onClose={() => setIsAddTouchOpen(false)}
          onSave={handleAddTouch}
          targetCompanies={targetCompanies}
          applications={applications}
        />
      )}

      {/* Template Edit Modal */}
      {isTemplateModalOpen && (
        <TemplateModal
          template={editingTemplate}
          onClose={() => {
            setIsTemplateModalOpen(false)
            setEditingTemplate(null)
          }}
          onSave={handleSaveTemplate}
        />
      )}

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{previewTemplate.name}</h3>
                <span className="text-sm text-gray-500">{previewTemplate.category}</span>
              </div>
              <button onClick={() => setPreviewTemplate(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {previewTemplate.subject && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">Subject:</p>
                  <p className="text-gray-900">{previewTemplate.subject}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Body:</p>
                <pre className="whitespace-pre-wrap font-sans text-gray-900 bg-gray-50 p-4 rounded-lg">
                  {previewTemplate.body}
                </pre>
              </div>
              {previewTemplate.placeholders && previewTemplate.placeholders.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-2">Placeholders to fill:</p>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.placeholders.map(p => (
                      <span key={p} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                        {`{{${p}}}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  handleCopyTemplate(previewTemplate)
                  setPreviewTemplate(null)
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Add Touch Modal Component
function AddTouchModal({ onClose, onSave, targetCompanies, applications }) {
  const [formData, setFormData] = useState({
    type: 'Cold Intro',
    personName: '',
    company: '',
    linkedCompanyId: '',
    linkedApplicationId: '',
    channel: 'LinkedIn',
    notes: '',
    outcome: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.personName.trim()) return
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Log Networking Touch</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Touch Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {TOUCH_TYPE_OPTIONS.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
              <select
                value={formData.channel}
                onChange={(e) => setFormData({...formData, channel: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {OUTREACH_CHANNEL_OPTIONS.map(ch => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Person Name *</label>
            <input
              type="text"
              value={formData.personName}
              onChange={(e) => setFormData({...formData, personName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="John Smith"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Genentech"
              list="companies-list"
            />
            <datalist id="companies-list">
              {targetCompanies.map(c => (
                <option key={c.id} value={c.name} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link to Application (optional)</label>
            <select
              value={formData.linkedApplicationId}
              onChange={(e) => setFormData({...formData, linkedApplicationId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- None --</option>
              {applications.map(app => (
                <option key={app.id} value={app.id}>{app.company} - {app.roleTitle}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={2}
              placeholder="What was discussed, next steps..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Log Touch
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Template Modal Component
function TemplateModal({ template, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    category: template?.category || 'Hiring Manager',
    subject: template?.subject || '',
    body: template?.body || ''
  })

  // Extract placeholders from body
  const extractPlaceholders = (text) => {
    const matches = text.match(/\{\{(\w+)\}\}/g) || []
    return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))]
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.body.trim()) return
    onSave({
      ...formData,
      placeholders: extractPlaceholders(formData.body)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {template ? 'Edit Template' : 'New Template'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Template Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Hiring Manager Introduction"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {TEMPLATE_CATEGORY_OPTIONS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line (for emails)</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Following up: {{roleTitle}} application"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message Body *
              <span className="font-normal text-gray-500 ml-2">Use {"{{placeholder}}"} for variables</span>
            </label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData({...formData, body: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              rows={12}
              placeholder={`Hi {{contactName}},

I just applied for the {{roleTitle}} position at {{companyName}}...`}
              required
            />
          </div>

          {extractPlaceholders(formData.body).length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm font-medium text-yellow-800 mb-2">Detected Placeholders:</p>
              <div className="flex flex-wrap gap-2">
                {extractPlaceholders(formData.body).map(p => (
                  <span key={p} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                    {`{{${p}}}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {template ? 'Save Changes' : 'Create Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const [applications, setApplications] = useState([])
  const [resumeVersions, setResumeVersions] = useState([])
  const [targetCompanies, setTargetCompanies] = useState([])
  const [outreachTemplates, setOutreachTemplates] = useState([])
  const [networkingTouches, setNetworkingTouches] = useState([])
  const [networkingStats, setNetworkingStats] = useState({ currentStreak: 0, longestStreak: 0, totalTouches: 0, lastTouchDate: null })
  const [toast, setToast] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: 'dateApplied', direction: 'desc' })
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingApplication, setEditingApplication] = useState(null)
  const [activeTab, setActiveTab] = useState('table')
  const [filters, setFilters] = useState({ search: '', status: [], region: [] })
  const [statusUpdateApp, setStatusUpdateApp] = useState(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false)
  const [llmSettings, setLlmSettings] = useState(() => loadLLMSettings())
  const [isCoachOpen, setIsCoachOpen] = useState(false)
  const [coachResponse, setCoachResponse] = useState('')
  const [coachLoading, setCoachLoading] = useState(false)
  const [coachQuestion, setCoachQuestion] = useState('')
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('pharma_job_tracker_welcomed')
  })
  const [showBackupReminder, setShowBackupReminder] = useState(false)
  const [dismissedBackupReminder, setDismissedBackupReminder] = useState(() => {
    const dismissed = localStorage.getItem('pharma_job_tracker_backup_dismissed')
    if (!dismissed) return false
    // Only dismiss for 24 hours
    const dismissedTime = new Date(dismissed).getTime()
    return (Date.now() - dismissedTime) < 24 * 60 * 60 * 1000
  })
  const fileInputRef = useRef(null)
  const searchInputRef = useRef(null)

  // Handle welcome modal close
  const handleWelcomeClose = () => {
    localStorage.setItem('pharma_job_tracker_welcomed', 'true')
    setShowWelcome(false)
  }

  // Check if backup reminder should show
  useEffect(() => {
    const lastBackup = localStorage.getItem('pharma_job_tracker_last_backup')
    const hasData = applications.length > 0

    if (!hasData || dismissedBackupReminder) {
      setShowBackupReminder(false)
      return
    }

    // Show reminder if: never backed up and have 3+ apps, OR haven't backed up in 7+ days
    if (!lastBackup && applications.length >= 3) {
      setShowBackupReminder(true)
    } else if (lastBackup) {
      const daysSinceBackup = (Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24)
      setShowBackupReminder(daysSinceBackup > 7)
    }
  }, [applications.length, dismissedBackupReminder])

  // Handle backup reminder dismiss (temporary - comes back after 24 hours)
  const handleDismissBackupReminder = () => {
    localStorage.setItem('pharma_job_tracker_backup_dismissed', new Date().toISOString())
    setDismissedBackupReminder(true)
    setShowBackupReminder(false)
  }

  // Handle successful backup
  const handleBackupComplete = () => {
    localStorage.setItem('pharma_job_tracker_last_backup', new Date().toISOString())
    localStorage.removeItem('pharma_job_tracker_backup_dismissed')
    setShowBackupReminder(false)
    setDismissedBackupReminder(false)
  }

  // Simple markdown renderer for coach responses
  const renderMarkdown = (text) => {
    if (!text) return null

    const lines = text.split('\n')
    const elements = []
    let currentList = []
    let listType = null
    let keyIndex = 0

    const flushList = () => {
      if (currentList.length > 0) {
        if (listType === 'ul') {
          elements.push(
            <ul key={`list-${keyIndex++}`} className="list-disc list-inside space-y-1 my-2 ml-2">
              {currentList.map((item, i) => <li key={i} className="text-gray-700">{item}</li>)}
            </ul>
          )
        } else {
          elements.push(
            <ol key={`list-${keyIndex++}`} className="list-decimal list-inside space-y-1 my-2 ml-2">
              {currentList.map((item, i) => <li key={i} className="text-gray-700">{item}</li>)}
            </ol>
          )
        }
        currentList = []
        listType = null
      }
    }

    const formatInline = (line) => {
      // Handle **bold** and *italic*
      const parts = []
      let remaining = line
      let partKey = 0

      while (remaining.length > 0) {
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
        if (boldMatch && boldMatch.index !== undefined) {
          if (boldMatch.index > 0) {
            parts.push(<span key={partKey++}>{remaining.slice(0, boldMatch.index)}</span>)
          }
          parts.push(<strong key={partKey++} className="font-semibold text-gray-900">{boldMatch[1]}</strong>)
          remaining = remaining.slice(boldMatch.index + boldMatch[0].length)
        } else {
          parts.push(<span key={partKey++}>{remaining}</span>)
          break
        }
      }
      return parts
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Handle headers
      if (line.startsWith('## ')) {
        flushList()
        elements.push(
          <h3 key={`h3-${keyIndex++}`} className="text-lg font-bold text-gray-900 mt-4 mb-2 pb-1 border-b border-gray-200">
            {formatInline(line.slice(3))}
          </h3>
        )
        continue
      }

      if (line.startsWith('### ')) {
        flushList()
        elements.push(
          <h4 key={`h4-${keyIndex++}`} className="text-base font-semibold text-gray-800 mt-3 mb-1">
            {formatInline(line.slice(4))}
          </h4>
        )
        continue
      }

      // Handle bullet points
      if (line.match(/^[-*]\s+/)) {
        if (listType !== 'ul') {
          flushList()
          listType = 'ul'
        }
        currentList.push(formatInline(line.replace(/^[-*]\s+/, '')))
        continue
      }

      // Handle numbered lists
      if (line.match(/^\d+\.\s+/)) {
        if (listType !== 'ol') {
          flushList()
          listType = 'ol'
        }
        currentList.push(formatInline(line.replace(/^\d+\.\s+/, '')))
        continue
      }

      // Handle empty lines
      if (line.trim() === '') {
        flushList()
        elements.push(<div key={`br-${keyIndex++}`} className="h-2" />)
        continue
      }

      // Regular paragraph
      flushList()
      elements.push(
        <p key={`p-${keyIndex++}`} className="text-gray-700 leading-relaxed my-1">
          {formatInline(line)}
        </p>
      )
    }

    flushList()
    return elements
  }

  // Aggregate job search data for AI Coach
  const aggregateSearchData = () => {
    const now = new Date()
    const rejectedApps = applications.filter(a => a.status === 'Rejected')
    const activeApps = applications.filter(a => !['Rejected', 'Withdrawn', 'Offer'].includes(a.status))

    return {
      summary: {
        totalApplications: applications.length,
        activeApplications: activeApps.length,
        responseRate: applications.length > 0
          ? Math.round((applications.filter(a => a.status !== 'Applied').length / applications.length) * 100)
          : 0,
        interviewRate: applications.length > 0
          ? Math.round((applications.filter(a => ['Phone Screen', 'Technical', 'Onsite', 'Offer'].includes(a.status)).length / applications.length) * 100)
          : 0,
        rejectionCount: rejectedApps.length
      },
      applicationBreakdown: {
        byStatus: STATUS_OPTIONS.reduce((acc, status) => {
          acc[status] = applications.filter(a => a.status === status).length
          return acc
        }, {}),
        byCompanyType: COMPANY_TYPE_OPTIONS.reduce((acc, type) => {
          acc[type] = applications.filter(a => a.companyType === type).length
          return acc
        }, {}),
        byRegion: REGION_OPTIONS.reduce((acc, region) => {
          acc[region] = applications.filter(a => a.region === region).length
          return acc
        }, {})
      },
      qualityMetrics: {
        customizedApplications: applications.filter(a => a.quality?.customResume).length,
        withCoverLetter: applications.filter(a => a.quality?.customCoverLetter).length,
        atsOptimized: applications.filter(a => a.quality?.atsOptimized).length,
        customizedResponseRate: (() => {
          const customized = applications.filter(a => a.quality?.customResume)
          return customized.length > 0
            ? Math.round((customized.filter(a => a.status !== 'Applied').length / customized.length) * 100)
            : 0
        })()
      },
      rejectionPatterns: {
        total: rejectedApps.length,
        byStage: rejectedApps.reduce((acc, app) => {
          const stage = app.rejection?.stage || 'Unknown'
          acc[stage] = (acc[stage] || 0) + 1
          return acc
        }, {}),
        byReason: rejectedApps.reduce((acc, app) => {
          const reason = app.rejection?.reason || 'Unknown'
          acc[reason] = (acc[reason] || 0) + 1
          return acc
        }, {}),
        learnings: rejectedApps.flatMap(a => a.rejection?.learnings || []).slice(0, 10)
      },
      targetCompanies: {
        total: targetCompanies.length,
        byStatus: {
          researching: targetCompanies.filter(c => c.status === 'Researching').length,
          readyToApply: targetCompanies.filter(c => c.status === 'Ready to Apply').length,
          applied: targetCompanies.filter(c => c.status === 'Applied').length,
          interviewing: targetCompanies.filter(c => c.status === 'Interviewing').length
        },
        withConnections: targetCompanies.filter(c => c.connections?.length > 0).length,
        highPriority: targetCompanies.filter(c => c.priority <= 2).map(c => c.name).slice(0, 5)
      },
      networking: {
        dailyTouches: networkingTouches,
        templates: outreachTemplates.length,
        topTemplatePerformance: outreachTemplates
          .filter(t => t.timesUsed > 0)
          .sort((a, b) => (b.responsesReceived / b.timesUsed) - (a.responsesReceived / a.timesUsed))
          .slice(0, 3)
          .map(t => ({ name: t.name, responseRate: Math.round((t.responsesReceived / t.timesUsed) * 100) }))
      },
      recentActivity: applications
        .sort((a, b) => new Date(b.updatedAt || b.dateApplied) - new Date(a.updatedAt || a.dateApplied))
        .slice(0, 5)
        .map(a => ({
          company: a.company,
          title: a.title,
          status: a.status,
          date: a.updatedAt || a.dateApplied
        })),
      needsAttention: {
        overdueFollowUps: applications.filter(a => {
          if (['Rejected', 'Withdrawn', 'Offer'].includes(a.status)) return false
          if (!a.nextFollowUpDate) return false
          return a.nextFollowUpDate < now.toISOString().split('T')[0]
        }).length,
        staleApplications: applications.filter(a => {
          if (['Rejected', 'Withdrawn', 'Offer'].includes(a.status)) return false
          const lastContact = new Date(a.lastContactDate || a.dateApplied)
          return (now - lastContact) / (1000 * 60 * 60 * 24) > 14
        }).length
      }
    }
  }

  // AI Coach Handler
  const handleAskCoach = async (question = null) => {
    const apiKey = llmSettings.apiKeys?.[
      llmSettings.provider === 'openai' ? 'OPENAI_API_KEY' :
      llmSettings.provider === 'anthropic' ? 'ANTHROPIC_API_KEY' :
      llmSettings.provider === 'gemini' ? 'GEMINI_API_KEY' : null
    ]

    if (!apiKey && llmSettings.provider !== 'ollama') {
      setCoachResponse('❌ **API Key Required**\n\nPlease configure an API key in Settings → AI Match tab to use the AI Coach feature.\n\nSupported providers: OpenAI, Anthropic (Claude), Google Gemini, or Ollama (local).')
      return
    }

    setCoachLoading(true)
    setCoachResponse('')

    try {
      const searchData = aggregateSearchData()
      const messages = createCoachingPrompt(searchData, question)
      const response = await callLLM(llmSettings, messages)
      setCoachResponse(response)
    } catch (error) {
      setCoachResponse(`❌ **Error**\n\n${error.message}`)
    } finally {
      setCoachLoading(false)
    }
  }

  // AI Analysis Handler
  const handleRunAIAnalysis = async (jobDescription) => {
    // Check if LLM is configured
    const apiKey = llmSettings.apiKeys?.[
      llmSettings.provider === 'openai' ? 'OPENAI_API_KEY' :
      llmSettings.provider === 'anthropic' ? 'ANTHROPIC_API_KEY' :
      llmSettings.provider === 'gemini' ? 'GEMINI_API_KEY' : null
    ]

    if (!apiKey && llmSettings.provider !== 'ollama') {
      throw new Error('Please configure API keys in Settings (AI Match tab) to use AI analysis')
    }

    // Get resume text - for now we'll use a placeholder
    // In a real implementation, you'd get this from the selected resume version or uploaded file
    const resumeText = resumeVersions.length > 0
      ? `Resume: ${resumeVersions[0].name}\n${resumeVersions[0].description}\nKey highlights: ${resumeVersions[0].keyHighlights?.join(', ')}`
      : 'No resume loaded'

    const messages = createQualificationChecklistPrompt(resumeText, jobDescription)

    try {
      const response = await callLLM(llmSettings, messages)
      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      throw new Error('Could not parse AI response')
    } catch (error) {
      console.error('AI Analysis error:', error)
      throw error
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if in input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return
      }

      switch (e.key) {
        case 'n':
          e.preventDefault()
          setIsAddModalOpen(true)
          break
        case '/':
          e.preventDefault()
          setActiveTab('table')
          setTimeout(() => searchInputRef.current?.focus(), 100)
          break
        case '1':
          e.preventDefault()
          setActiveTab('table')
          break
        case '2':
          e.preventDefault()
          setActiveTab('pipeline')
          break
        case '3':
          e.preventDefault()
          setActiveTab('dashboard')
          break
        case '4':
          e.preventDefault()
          setActiveTab('resumes')
          break
        case '5':
          e.preventDefault()
          setActiveTab('ai-match')
          break
        case '6':
          e.preventDefault()
          setActiveTab('companies')
          break
        case '7':
          e.preventDefault()
          setActiveTab('networking')
          break
        case 'Escape':
          setIsSettingsOpen(false)
          setIsAddModalOpen(false)
          setEditingApplication(null)
          setStatusUpdateApp(null)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Initialize data from localStorage or use sample data
  useEffect(() => {
    const storedApps = loadApplications()
    const storedResumes = loadResumeVersions()
    const storedCompanies = loadTargetCompanies()
    const storedTemplates = loadOutreachTemplates()
    const storedTouches = loadNetworkingTouches()
    const storedStats = loadNetworkingStats()

    if (storedApps && storedApps.length > 0) {
      setApplications(storedApps)
    } else {
      setApplications(SAMPLE_APPLICATIONS)
      saveApplications(SAMPLE_APPLICATIONS)
    }

    if (storedResumes && storedResumes.length > 0) {
      setResumeVersions(storedResumes)
    } else {
      setResumeVersions(SAMPLE_RESUME_VERSIONS)
      saveResumeVersions(SAMPLE_RESUME_VERSIONS)
    }

    if (storedCompanies && storedCompanies.length > 0) {
      setTargetCompanies(storedCompanies)
    } else {
      setTargetCompanies(SAMPLE_TARGET_COMPANIES)
      saveTargetCompanies(SAMPLE_TARGET_COMPANIES)
    }

    if (storedTemplates && storedTemplates.length > 0) {
      setOutreachTemplates(storedTemplates)
    } else {
      setOutreachTemplates(SAMPLE_OUTREACH_TEMPLATES)
      saveOutreachTemplates(SAMPLE_OUTREACH_TEMPLATES)
    }

    if (storedTouches && storedTouches.length > 0) {
      setNetworkingTouches(storedTouches)
    }

    if (storedStats) {
      setNetworkingStats(storedStats)
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (applications.length > 0) {
      saveApplications(applications)
    }
  }, [applications])

  useEffect(() => {
    if (resumeVersions.length > 0) {
      saveResumeVersions(resumeVersions)
    }
  }, [resumeVersions])

  useEffect(() => {
    if (targetCompanies.length > 0) {
      saveTargetCompanies(targetCompanies)
    }
  }, [targetCompanies])

  useEffect(() => {
    if (outreachTemplates.length > 0) {
      saveOutreachTemplates(outreachTemplates)
    }
  }, [outreachTemplates])

  useEffect(() => {
    if (networkingTouches.length > 0) {
      saveNetworkingTouches(networkingTouches)
    }
  }, [networkingTouches])

  useEffect(() => {
    saveNetworkingStats(networkingStats)
  }, [networkingStats])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const handleExport = () => {
    exportToJSON(applications, resumeVersions)
    handleBackupComplete()
    showToast('Data exported successfully! Your backup is saved.')
  }

  const handleClearData = () => {
    localStorage.removeItem(STORAGE_KEYS.applications)
    localStorage.removeItem(STORAGE_KEYS.resumeVersions)
    localStorage.removeItem(STORAGE_KEYS.settings)
    localStorage.removeItem(STORAGE_KEYS.targetCompanies)
    localStorage.removeItem(STORAGE_KEYS.outreachTemplates)
    localStorage.removeItem(STORAGE_KEYS.networkingTouches)
    localStorage.removeItem(STORAGE_KEYS.networkingStats)
    setApplications([])
    setResumeVersions([])
    setTargetCompanies([])
    setOutreachTemplates([])
    setNetworkingTouches([])
    setNetworkingStats({ currentStreak: 0, longestStreak: 0, totalTouches: 0, lastTouchDate: null })
    setIsSettingsOpen(false)
    showToast('All data cleared', 'info')
  }

  const handleAddApplication = (formData) => {
    const now = new Date().toISOString()
    const newApplication = {
      ...formData,
      id: generateId(),
      status: 'Applied',
      statusHistory: [
        { status: 'Applied', date: formData.dateApplied, notes: 'Initial application' }
      ],
      interviewNotes: '',
      companyResearch: '',
      keyContacts: [],
      lastContactDate: formData.dateApplied,
      nextFollowUpDate: null,
      followUpNotes: '',
      outcome: null,
      outcomeDate: null,
      feedbackReceived: '',
      tags: [],
      createdAt: now,
      updatedAt: now
    }
    setApplications(prev => [newApplication, ...prev])
    setIsAddModalOpen(false)
    showToast('Application added successfully!')
  }

  const handleEditApplication = (formData) => {
    setApplications(prev => prev.map(app => {
      if (app.id === editingApplication.id) {
        return {
          ...app,
          ...formData,
          updatedAt: new Date().toISOString()
        }
      }
      return app
    }))
    setEditingApplication(null)
    showToast('Application updated successfully!')
  }

  const openEditModal = (app) => {
    setEditingApplication(app)
  }

  const handleStatusUpdate = (appId, newStatus, notes, rejectionData = null) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const now = new Date().toISOString().split('T')[0]
        const updatedApp = {
          ...app,
          status: newStatus,
          statusHistory: [
            ...(app.statusHistory || []),
            { status: newStatus, date: now, notes: notes || '' }
          ],
          lastContactDate: now,
          updatedAt: new Date().toISOString()
        }
        // Save rejection data if status is Rejected
        if (newStatus === 'Rejected' && rejectionData) {
          updatedApp.rejection = {
            stage: rejectionData.stage || '',
            reason: rejectionData.reason || '',
            feedbackVerbatim: rejectionData.feedbackVerbatim || '',
            learnings: rejectionData.learnings || [],
            actionItems: rejectionData.actionItems || []
          }
          updatedApp.outcome = 'Rejected'
          updatedApp.outcomeDate = now
        }
        return updatedApp
      }
      return app
    }))
    setStatusUpdateApp(null)
    showToast(`Status updated to "${newStatus}"`)
  }

  const handleMarkRejected = (app) => {
    const feedback = prompt('Any feedback received? (optional)')
    setApplications(prev => prev.map(a => {
      if (a.id === app.id) {
        const now = new Date().toISOString().split('T')[0]
        return {
          ...a,
          status: 'Rejected',
          outcome: 'Rejected',
          outcomeDate: now,
          feedbackReceived: feedback || '',
          statusHistory: [
            ...(a.statusHistory || []),
            { status: 'Rejected', date: now, notes: feedback || 'Marked as rejected' }
          ],
          updatedAt: new Date().toISOString()
        }
      }
      return a
    }))
    showToast('Application marked as rejected')
  }

  // Target Company Handlers
  const handleAddCompany = (companyData) => {
    const now = new Date().toISOString()
    const newCompany = {
      ...companyData,
      id: generateId(),
      research: companyData.research || {
        overview: '',
        recentNews: [],
        keyPeople: [],
        painPoints: [],
        products: '',
        culture: '',
        whyTheyWantMe: '',
        lastResearched: null
      },
      connections: companyData.connections || [],
      createdAt: now,
      updatedAt: now
    }
    setTargetCompanies(prev => [newCompany, ...prev])
    setIsAddCompanyModalOpen(false)
    showToast('Target company added!')
  }

  const handleEditCompany = (companyData) => {
    setTargetCompanies(prev => prev.map(company => {
      if (company.id === editingCompany.id) {
        return {
          ...company,
          ...companyData,
          updatedAt: new Date().toISOString()
        }
      }
      return company
    }))
    setEditingCompany(null)
    showToast('Company updated!')
  }

  const handleDeleteCompany = (companyId) => {
    if (confirm('Are you sure you want to delete this company?')) {
      setTargetCompanies(prev => prev.filter(c => c.id !== companyId))
      showToast('Company deleted')
    }
  }

  const handleAddConnection = (companyId, connectionData) => {
    setTargetCompanies(prev => prev.map(company => {
      if (company.id === companyId) {
        return {
          ...company,
          connections: [...(company.connections || []), { ...connectionData, id: generateId() }],
          updatedAt: new Date().toISOString()
        }
      }
      return company
    }))
    showToast('Connection added!')
  }

  const handleUpdateConnection = (companyId, connectionId, connectionData) => {
    setTargetCompanies(prev => prev.map(company => {
      if (company.id === companyId) {
        return {
          ...company,
          connections: company.connections.map(conn =>
            conn.id === connectionId ? { ...conn, ...connectionData } : conn
          ),
          updatedAt: new Date().toISOString()
        }
      }
      return company
    }))
    showToast('Connection updated!')
  }

  const handleDeleteConnection = (companyId, connectionId) => {
    setTargetCompanies(prev => prev.map(company => {
      if (company.id === companyId) {
        return {
          ...company,
          connections: company.connections.filter(conn => conn.id !== connectionId),
          updatedAt: new Date().toISOString()
        }
      }
      return company
    }))
    showToast('Connection removed')
  }

  // Get applications linked to a target company
  const getCompanyApplications = (companyName) => {
    return applications.filter(app =>
      app.company.toLowerCase() === companyName.toLowerCase()
    )
  }

  // Filter applications
  const filteredApplications = applications.filter(app => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch =
        app.company.toLowerCase().includes(searchLower) ||
        app.title.toLowerCase().includes(searchLower) ||
        (app.location && app.location.toLowerCase().includes(searchLower))
      if (!matchesSearch) return false
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(app.status)) {
      return false
    }

    // Region filter
    if (filters.region.length > 0 && !filters.region.includes(app.region)) {
      return false
    }

    return true
  })

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result)

        if (data.applications && Array.isArray(data.applications)) {
          // Merge imported applications (avoid duplicates by ID)
          const existingIds = new Set(applications.map(a => a.id))
          const newApps = data.applications.filter(a => !existingIds.has(a.id))
          const mergedApps = [...applications, ...newApps]
          setApplications(mergedApps)
          showToast(`Imported ${newApps.length} new applications!`)
        }

        if (data.resumeVersions && Array.isArray(data.resumeVersions)) {
          const existingIds = new Set(resumeVersions.map(r => r.id))
          const newVersions = data.resumeVersions.filter(r => !existingIds.has(r.id))
          const mergedVersions = [...resumeVersions, ...newVersions]
          setResumeVersions(mergedVersions)
        }
      } catch (error) {
        console.error('Error importing file:', error)
        showToast('Error importing file. Please check the format.', 'error')
      }
    }
    reader.readAsText(file)
    e.target.value = '' // Reset file input
  }

  // Sorting functionality
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    const aValue = a[sortConfig.key] || ''
    const bValue = b[sortConfig.key] || ''

    if (sortConfig.key === 'dateApplied') {
      const aDate = new Date(aValue)
      const bDate = new Date(bValue)
      return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const getResumeName = (versionId) => {
    const version = resumeVersions.find(v => v.id === versionId)
    return version?.name || versionId || '-'
  }

  const SortHeader = ({ label, sortKey }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            sortConfig.key === sortKey
              ? sortConfig.direction === 'asc' ? 'rotate-180' : ''
              : 'opacity-30'
          }`}
        />
      </div>
    </th>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">Job Search Command Center</h1>
                  <AIStatusBadge llmSettings={llmSettings} />
                </div>
                <p className="text-xs text-gray-500">{applications.length} applications tracked</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
              <button
                onClick={handleImportClick}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => setIsCoachOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm"
                title="AI Coach"
              >
                <Sparkles className="w-4 h-4" />
                AI Coach
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Application
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Backup Reminder Banner */}
      {showBackupReminder && (
        <BackupReminderBanner
          onBackup={handleExport}
          onDismiss={handleDismissBackupReminder}
          applicationCount={applications.length}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('table')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'table'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Table className="w-4 h-4" />
            Table View
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'pipeline'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Pipeline View
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'dashboard'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('resumes')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'resumes'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            Resumes
          </button>
          <button
            onClick={() => setActiveTab('ai-match')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'ai-match'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Match
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'companies'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Companies
          </button>
          <button
            onClick={() => setActiveTab('networking')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'networking'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <User className="w-4 h-4" />
            Networking
          </button>
        </div>

        {/* Stats Bar - only show on table and pipeline views */}
        {(activeTab === 'table' || activeTab === 'pipeline') && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Applications</p>
            <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-indigo-600">
              {applications.filter(a => !['Rejected', 'Withdrawn', 'Offer'].includes(a.status)).length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Interviews</p>
            <p className="text-2xl font-bold text-green-600">
              {applications.filter(a => ['Phone Screen', 'Technical', 'Onsite'].includes(a.status)).length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Response Rate</p>
            <p className="text-2xl font-bold text-blue-600">
              {applications.length > 0
                ? Math.round((applications.filter(a => a.status !== 'Applied').length / applications.length) * 100)
                : 0}%
            </p>
          </div>
        </div>
        )}

        {/* Filter Bar */}
        {(activeTab === 'table' || activeTab === 'pipeline') && (
          <div className="mb-6">
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              applications={applications}
              searchInputRef={searchInputRef}
            />
          </div>
        )}

        {/* Pipeline View */}
        {activeTab === 'pipeline' && (
          <PipelineView
            applications={filteredApplications}
            onStatusUpdate={(app) => setStatusUpdateApp(app)}
            onEdit={openEditModal}
            getRegionColor={getRegionColor}
            getStatusColor={getStatusColor}
          />
        )}

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <Dashboard applications={applications} resumeVersions={resumeVersions} />
        )}

        {/* Resumes View */}
        {activeTab === 'resumes' && (
          <ResumeVersionManager
            resumeVersions={resumeVersions}
            applications={applications}
            onAddVersion={(version) => {
              setResumeVersions(prev => [...prev, version])
              showToast('Resume version added!')
            }}
            onEditVersion={(version) => {
              setResumeVersions(prev => prev.map(v => v.id === version.id ? version : v))
              showToast('Resume version updated!')
            }}
            onDeleteVersion={(versionId) => {
              setResumeVersions(prev => prev.filter(v => v.id !== versionId))
              showToast('Resume version deleted!')
            }}
          />
        )}

        {/* AI Job Matcher */}
        {activeTab === 'ai-match' && (
          <AIJobMatcher
            resumeVersions={resumeVersions}
            onAddApplication={(formData) => {
              const now = new Date().toISOString()
              const newApplication = {
                ...formData,
                id: generateId(),
                status: 'Applied',
                statusHistory: [
                  { status: 'Applied', date: formData.dateApplied, notes: 'Added from AI Job Matcher' }
                ],
                interviewNotes: '',
                companyResearch: '',
                keyContacts: [],
                lastContactDate: formData.dateApplied,
                nextFollowUpDate: null,
                followUpNotes: '',
                outcome: null,
                outcomeDate: null,
                feedbackReceived: '',
                tags: [],
                createdAt: now,
                updatedAt: now
              }
              setApplications(prev => [newApplication, ...prev])
              showToast('Job added to tracker!')
            }}
          />
        )}

        {/* Target Companies View */}
        {activeTab === 'companies' && (
          <TargetCompaniesView
            companies={targetCompanies}
            applications={applications}
            onAddCompany={handleAddCompany}
            onEditCompany={(company) => setEditingCompany(company)}
            onDeleteCompany={handleDeleteCompany}
            onAddConnection={handleAddConnection}
            onUpdateConnection={handleUpdateConnection}
            onDeleteConnection={handleDeleteConnection}
            getCompanyApplications={getCompanyApplications}
          />
        )}

        {/* Networking View */}
        {activeTab === 'networking' && (
          <NetworkingView
            networkingTouches={networkingTouches}
            networkingStats={networkingStats}
            outreachTemplates={outreachTemplates}
            targetCompanies={targetCompanies}
            applications={applications}
            setNetworkingTouches={setNetworkingTouches}
            setNetworkingStats={setNetworkingStats}
            setOutreachTemplates={setOutreachTemplates}
            showToast={showToast}
          />
        )}

        {/* Applications Table */}
        {activeTab === 'table' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Applications
                {filteredApplications.length !== applications.length && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({filteredApplications.length} of {applications.length})
                  </span>
                )}
              </h2>
              <span className="text-sm text-gray-500">
                Click column headers to sort
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <SortHeader label="Company" sortKey="company" />
                  <SortHeader label="Title" sortKey="title" />
                  <SortHeader label="Location" sortKey="location" />
                  <SortHeader label="Status" sortKey="status" />
                  <SortHeader label="Date Applied" sortKey="dateApplied" />
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resume
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-900">{app.company}</div>
                        {app.jobUrl && (
                          <a
                            href={app.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-indigo-600"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      {app.tags && app.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {app.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{app.title}</div>
                      <div className="text-xs text-gray-500">{app.companyType}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{app.location || '-'}</div>
                      {app.region && (
                        <span className={`inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium border ${getRegionColor(app.region)}`}>
                          {app.region}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {formatDate(app.dateApplied)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <FileText className="w-3.5 h-3.5" />
                        {getResumeName(app.resumeVersion)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setStatusUpdateApp(app)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Update status"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(app)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Edit"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        {app.status !== 'Rejected' && (
                          <button
                            onClick={() => handleMarkRejected(app)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Mark rejected"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedApplications.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No applications yet</p>
                      <p className="text-gray-400 text-sm mt-1">Start tracking your job search by adding your first application</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </main>

      {/* Status Update Modal */}
      {statusUpdateApp && (
        <StatusUpdateModal
          application={statusUpdateApp}
          onClose={() => setStatusUpdateApp(null)}
          onUpdate={handleStatusUpdate}
        />
      )}

      {/* Add Application Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Application"
      >
        <JobEntryForm
          resumeVersions={resumeVersions}
          onSubmit={handleAddApplication}
          onCancel={() => setIsAddModalOpen(false)}
          llmSettings={llmSettings}
        />
      </Modal>

      {/* Application Detail Modal */}
      {editingApplication && (
        <ApplicationDetailModal
          application={editingApplication}
          resumeVersions={resumeVersions}
          onClose={() => setEditingApplication(null)}
          onSave={(updatedApp) => {
            setApplications(prev => prev.map(app =>
              app.id === updatedApp.id ? updatedApp : app
            ))
            setEditingApplication(null)
            showToast('Application updated successfully!')
          }}
          llmSettings={llmSettings}
          onRunAIAnalysis={handleRunAIAnalysis}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* AI Coach Modal */}
      {isCoachOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">AI Job Search Coach</h2>
                    <p className="text-purple-200 text-sm">Powered by {llmSettings.provider === 'openai' ? 'OpenAI' : llmSettings.provider === 'anthropic' ? 'Claude' : llmSettings.provider === 'gemini' ? 'Gemini' : 'Ollama'}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsCoachOpen(false)
                    setCoachResponse('')
                    setCoachQuestion('')
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Quick Analysis Buttons */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Analysis</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleAskCoach()}
                    disabled={coachLoading}
                    className="p-3 text-left text-sm bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <TrendingUp className="w-4 h-4 text-purple-600 mb-1" />
                    <span className="block font-medium text-gray-900">Full Analysis</span>
                    <span className="text-xs text-gray-500">Complete strategy review</span>
                  </button>
                  <button
                    onClick={() => handleAskCoach("What should I focus on this week? Give me 3 specific, actionable priorities.")}
                    disabled={coachLoading}
                    className="p-3 text-left text-sm bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Target className="w-4 h-4 text-blue-600 mb-1" />
                    <span className="block font-medium text-gray-900">This Week</span>
                    <span className="text-xs text-gray-500">Top priorities</span>
                  </button>
                  <button
                    onClick={() => handleAskCoach("Analyze my rejection patterns. What am I doing wrong and how can I improve?")}
                    disabled={coachLoading}
                    className="p-3 text-left text-sm bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4 text-red-600 mb-1" />
                    <span className="block font-medium text-gray-900">Rejections</span>
                    <span className="text-xs text-gray-500">Pattern analysis</span>
                  </button>
                  <button
                    onClick={() => handleAskCoach("How effective is my networking? Am I reaching out enough? What channels work best?")}
                    disabled={coachLoading}
                    className="p-3 text-left text-sm bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Users className="w-4 h-4 text-green-600 mb-1" />
                    <span className="block font-medium text-gray-900">Networking</span>
                    <span className="text-xs text-gray-500">Effectiveness review</span>
                  </button>
                  <button
                    onClick={() => handleAskCoach("Which of my target companies should I prioritize? Help me rank them by likelihood of success.")}
                    disabled={coachLoading}
                    className="p-3 text-left text-sm bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Building2 className="w-4 h-4 text-yellow-600 mb-1" />
                    <span className="block font-medium text-gray-900">Companies</span>
                    <span className="text-xs text-gray-500">Priority ranking</span>
                  </button>
                  <button
                    onClick={() => handleAskCoach("Review my application quality metrics. Should I invest more time in customization?")}
                    disabled={coachLoading}
                    className="p-3 text-left text-sm bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Award className="w-4 h-4 text-indigo-600 mb-1" />
                    <span className="block font-medium text-gray-900">Quality</span>
                    <span className="text-xs text-gray-500">Application review</span>
                  </button>
                </div>
              </div>

              {/* Custom Question */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Ask a Question</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coachQuestion}
                    onChange={(e) => setCoachQuestion(e.target.value)}
                    placeholder="e.g., Why am I not getting callbacks from biotech companies?"
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && coachQuestion.trim() && !coachLoading) {
                        handleAskCoach(coachQuestion)
                        setCoachQuestion('')
                      }
                    }}
                    disabled={coachLoading}
                  />
                  <button
                    onClick={() => {
                      if (coachQuestion.trim()) {
                        handleAskCoach(coachQuestion)
                        setCoachQuestion('')
                      }
                    }}
                    disabled={coachLoading || !coachQuestion.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Response Area */}
              {(coachLoading || coachResponse) && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Coach's Advice
                  </h3>
                  {coachLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-500">Analyzing your job search data...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-4 border border-gray-100 max-h-[500px] overflow-y-auto">
                      {renderMarkdown(coachResponse)}
                    </div>
                  )}
                </div>
              )}

              {/* Data Summary */}
              {!coachLoading && !coachResponse && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Your Data at a Glance</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                      <p className="text-xs text-gray-500">Applications</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{targetCompanies.length}</p>
                      <p className="text-xs text-gray-500">Target Companies</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {applications.length > 0
                          ? Math.round((applications.filter(a => a.status !== 'Applied').length / applications.length) * 100)
                          : 0}%
                      </p>
                      <p className="text-xs text-gray-500">Response Rate</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">
                        {applications.filter(a => a.status === 'Rejected').length}
                      </p>
                      <p className="text-xs text-gray-500">Rejections</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Click any analysis button above to get AI-powered insights
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {isSettingsOpen && (
        <SettingsPanel
          applications={applications}
          resumeVersions={resumeVersions}
          onClearData={handleClearData}
          onClose={() => setIsSettingsOpen(false)}
          onExport={handleExport}
          onImport={handleImportClick}
        />
      )}

      {/* Welcome Modal for First-Time Users */}
      {showWelcome && (
        <WelcomeModal
          onClose={handleWelcomeClose}
          onOpenSettings={() => setActiveTab('aiMatch')}
        />
      )}
    </div>
  )
}

export default App

// Export constants for use in other components
export {
  STATUS_OPTIONS,
  REGION_OPTIONS,
  COMPANY_TYPE_OPTIONS,
  MODALITY_OPTIONS,
  APPLICATION_SOURCE_OPTIONS,
  STORAGE_KEYS,
  generateId,
  loadApplications,
  saveApplications,
  loadResumeVersions,
  saveResumeVersions,
  exportToJSON,
  formatDate,
  getStatusColor,
  getRegionColor
}
