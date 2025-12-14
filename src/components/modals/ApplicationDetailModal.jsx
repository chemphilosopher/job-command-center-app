import { useState } from 'react'
import {
  X, FileText, CheckCircle, Sparkles, Calendar, Building2, Clock,
  Printer, Plus, AlertCircle
} from 'lucide-react'
import {
  REGION_OPTIONS, COMPANY_TYPE_OPTIONS, MODALITY_OPTIONS,
  INTERVIEW_TYPES, INTERVIEW_OUTCOMES
} from '../../constants'
import { formatDate } from '../../utils'
import { getStatusColor } from '../../utils/statusUtils'

export default function ApplicationDetailModal({
  application,
  resumeVersions,
  onClose,
  onSave,
  llmSettings,
  onRunAIAnalysis
}) {
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
    // Salary negotiation (NEW)
    salaryNegotiation: application?.salaryNegotiation || {
      initialOffer: '',
      counterOffer: '',
      finalOffer: '',
      deadline: '',
      status: '',
      notes: ''
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

  const handleSalaryChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      salaryNegotiation: {
        ...prev.salaryNegotiation,
        [field]: value
      }
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

  // Add salary tab if status is Offer
  if (application.status === 'Offer') {
    tabs.splice(3, 0, { id: 'salary', label: 'Salary', icon: FileText })
  }

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

  const getQualStatusColor = (status) => {
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
          <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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

            {/* Salary Tab (only shows for Offer status) */}
            {activeTab === 'salary' && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2">Congratulations on your offer!</h3>
                  <p className="text-sm text-green-700">Track your salary negotiation details below.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Offer</label>
                    <input
                      type="text"
                      value={formData.salaryNegotiation?.initialOffer || ''}
                      onChange={(e) => handleSalaryChange('initialOffer', e.target.value)}
                      className={inputClasses}
                      placeholder="e.g., $180,000 base + 15% bonus"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Counter Offer</label>
                    <input
                      type="text"
                      value={formData.salaryNegotiation?.counterOffer || ''}
                      onChange={(e) => handleSalaryChange('counterOffer', e.target.value)}
                      className={inputClasses}
                      placeholder="e.g., $200,000 base + 20% bonus"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Final Offer</label>
                    <input
                      type="text"
                      value={formData.salaryNegotiation?.finalOffer || ''}
                      onChange={(e) => handleSalaryChange('finalOffer', e.target.value)}
                      className={inputClasses}
                      placeholder="e.g., $190,000 base + 18% bonus"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Decision Deadline</label>
                    <input
                      type="date"
                      value={formData.salaryNegotiation?.deadline || ''}
                      onChange={(e) => handleSalaryChange('deadline', e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Negotiation Status</label>
                  <select
                    value={formData.salaryNegotiation?.status || ''}
                    onChange={(e) => handleSalaryChange('status', e.target.value)}
                    className={inputClasses}
                  >
                    <option value="">Select status...</option>
                    <option value="pending">Pending Response</option>
                    <option value="negotiating">Actively Negotiating</option>
                    <option value="accepted">Accepted</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Negotiation Notes</label>
                  <textarea
                    value={formData.salaryNegotiation?.notes || ''}
                    onChange={(e) => handleSalaryChange('notes', e.target.value)}
                    className={textareaClasses}
                    rows={4}
                    placeholder="Notes about benefits, equity, signing bonus, start date flexibility..."
                  />
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
                              <span className={`px-2 py-1 text-xs font-medium rounded ${getQualStatusColor(qual.status)}`}>
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
