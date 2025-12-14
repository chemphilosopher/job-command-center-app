import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { REGION_OPTIONS, COMPANY_TYPE_OPTIONS, MODALITY_OPTIONS, APPLICATION_SOURCE_OPTIONS, EMPTY_FORM } from '../../constants'
import { callLLM, createJobParserPrompt } from '../../services/llmService'

export default function JobEntryForm({ resumeVersions, onSubmit, onCancel, initialData = null, llmSettings, onAutoFill }) {
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

  // Keyboard shortcut: Cmd/Ctrl + Enter to submit
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const inputClasses = (fieldName) => `
    w-full px-3 py-2 border rounded-lg text-sm
    ${errors[fieldName]
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}
    focus:outline-none focus:ring-2
  `

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6">
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

      {/* Notes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Notes</h3>
        <textarea
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
          placeholder="Any additional notes about this application..."
        />
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

      {/* Keyboard shortcut hint */}
      <p className="text-xs text-gray-400 text-center">
        Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border text-gray-600">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border text-gray-600">Enter</kbd> to save
      </p>
    </form>
  )
}
