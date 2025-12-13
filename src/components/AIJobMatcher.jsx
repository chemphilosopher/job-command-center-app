import { useState, useEffect, useRef } from 'react'
import {
  Upload,
  Search,
  Settings,
  Briefcase,
  MapPin,
  DollarSign,
  ExternalLink,
  Sparkles,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
  Brain,
  Building2,
  Key,
  Zap,
  Target,
  TrendingUp,
  Clock,
  Star,
  Award,
  Flame,
  RefreshCw,
  Calendar,
  Filter,
  ArrowRight,
  Lightbulb,
  BookOpen,
  MessageSquare
} from 'lucide-react'

import {
  LLM_PROVIDERS,
  PROVIDER_CONFIG,
  loadLLMSettings,
  saveLLMSettings,
  callLLM,
  createJobMatchPrompt,
  createResumeAnalysisPrompt
} from '../services/llmProviders'

import {
  JOB_API_PROVIDERS,
  JOB_API_CONFIG,
  loadJobAPISettings,
  saveJobAPISettings,
  searchJobs
} from '../services/jobSearch'

import {
  parseResume,
  extractBasicInfo,
  loadParsedResumes,
  saveParsedResumes
} from '../services/resumeParser'

import {
  performDeepResearch,
  findNewJobs,
  getResearchStats,
  loadResearchHistory
} from '../services/deepResearch'

// Settings Modal Component
function APISettingsModal({ isOpen, onClose }) {
  const [llmSettings, setLLMSettings] = useState(loadLLMSettings())
  const [jobAPISettings, setJobAPISettings] = useState(loadJobAPISettings())
  const [activeTab, setActiveTab] = useState('llm')

  if (!isOpen) return null

  const handleSave = () => {
    saveLLMSettings(llmSettings)
    saveJobAPISettings(jobAPISettings)
    onClose()
  }

  const updateLLMApiKey = (keyName, value) => {
    setLLMSettings(prev => ({
      ...prev,
      apiKeys: { ...prev.apiKeys, [keyName]: value }
    }))
  }

  const updateJobApiKey = (keyName, value) => {
    setJobAPISettings(prev => ({
      ...prev,
      apiKeys: { ...prev.apiKeys, [keyName]: value }
    }))
  }

  const currentLLMConfig = PROVIDER_CONFIG[llmSettings.provider]
  const currentJobConfig = JOB_API_CONFIG[jobAPISettings.provider]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">API Settings</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('llm')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'llm'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Brain className="w-4 h-4 inline mr-2" />
              LLM Provider
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'jobs'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Briefcase className="w-4 h-4 inline mr-2" />
              Job Search API
            </button>
          </div>

          <div className="p-6 space-y-6">
            {activeTab === 'llm' && (
              <>
                {/* LLM Provider Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LLM Provider</label>
                  <select
                    value={llmSettings.provider}
                    onChange={(e) => {
                      const newProvider = e.target.value
                      setLLMSettings(prev => ({
                        ...prev,
                        provider: newProvider,
                        model: PROVIDER_CONFIG[newProvider].defaultModel
                      }))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.entries(PROVIDER_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>{config.name}</option>
                    ))}
                  </select>
                </div>

                {/* Model Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <select
                    value={llmSettings.model}
                    onChange={(e) => setLLMSettings(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {currentLLMConfig.models.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>

                {/* API Key */}
                {currentLLMConfig.requiresApiKey && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                      <span className="text-gray-400 font-normal ml-2">({currentLLMConfig.apiKeyName})</span>
                    </label>
                    <input
                      type="password"
                      value={llmSettings.apiKeys[currentLLMConfig.apiKeyName] || ''}
                      onChange={(e) => updateLLMApiKey(currentLLMConfig.apiKeyName, e.target.value)}
                      placeholder="Enter your API key"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Your API key is stored locally in your browser.
                    </p>
                  </div>
                )}

                {currentLLMConfig.note && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">{currentLLMConfig.note}</p>
                  </div>
                )}

                {llmSettings.provider === LLM_PROVIDERS.OLLAMA && (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      Make sure Ollama is running locally at http://localhost:11434
                    </p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'jobs' && (
              <>
                {/* Job API Provider Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Search API</label>
                  <select
                    value={jobAPISettings.provider}
                    onChange={(e) => setJobAPISettings(prev => ({ ...prev, provider: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.entries(JOB_API_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>{config.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">{currentJobConfig.description}</p>
                </div>

                {/* Free Quota Info */}
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    Free tier: {currentJobConfig.freeQuota}
                  </p>
                </div>

                {/* API Keys */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currentJobConfig.apiKeyName}
                  </label>
                  <input
                    type="password"
                    value={jobAPISettings.apiKeys[currentJobConfig.apiKeyName] || ''}
                    onChange={(e) => updateJobApiKey(currentJobConfig.apiKeyName, e.target.value)}
                    placeholder="Enter API key"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {currentJobConfig.apiKeyName2 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentJobConfig.apiKeyName2}
                    </label>
                    <input
                      type="password"
                      value={jobAPISettings.apiKeys[currentJobConfig.apiKeyName2] || ''}
                      onChange={(e) => updateJobApiKey(currentJobConfig.apiKeyName2, e.target.value)}
                      placeholder="Enter value"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                <a
                  href={currentJobConfig.signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  <Key className="w-4 h-4" />
                  Get API key from {currentJobConfig.name}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Progress Indicator Component
function ResearchProgress({ progress }) {
  if (!progress) return null

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <Loader2 className="w-8 h-8 animate-spin" />
          <Sparkles className="w-4 h-4 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Deep Research in Progress</h3>
          <p className="text-indigo-100 text-sm">{progress.message}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step {progress.step} of {progress.total}</span>
          <span>{Math.round(progress.progress)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${progress.progress}%` }}
          />
        </div>
        {progress.detail && (
          <p className="text-xs text-indigo-200 mt-2">{progress.detail}</p>
        )}
      </div>
    </div>
  )
}

// Deep Job Card Component with enhanced details
function DeepJobCard({ job, matchData, onAddToTracker, isExpanded, onToggle, isNew }) {
  const getTierColor = (tier) => {
    switch (tier) {
      case 'Top Match': return 'bg-green-100 text-green-700 border-green-200'
      case 'Strong Match': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Good Match': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Stretch': return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getRecommendationColor = (rec) => {
    switch (rec) {
      case 'Apply Now': return 'text-green-600'
      case 'Apply with Modifications': return 'text-blue-600'
      case 'Consider': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className={`bg-white rounded-lg border ${isNew ? 'border-green-300 ring-2 ring-green-100' : 'border-gray-200'} overflow-hidden`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {isNew && (
                <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  NEW
                </span>
              )}
              <h3 className="font-semibold text-gray-900">{job.title}</h3>
              {matchData && (
                <>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getTierColor(matchData.tier)}`}>
                    {matchData.score}% - {matchData.tier}
                  </span>
                  {matchData.urgency === 'high' && (
                    <span className="flex items-center gap-1 text-xs text-red-600">
                      <Flame className="w-3 h-3" />
                      Hot
                    </span>
                  )}
                </>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" />
              {job.company}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {job.location || 'Location not specified'}
              </span>
              {job.salary && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  {job.salary}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {job.applyUrl && (
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="View job posting"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={() => onAddToTracker(job)}
              className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              Add to Tracker
            </button>
          </div>
        </div>

        {/* Recommendation */}
        {matchData?.recommendation && (
          <div className={`mt-3 flex items-center gap-2 text-sm font-medium ${getRecommendationColor(matchData.recommendation)}`}>
            <Target className="w-4 h-4" />
            {matchData.recommendation}
          </div>
        )}

        {/* Toggle for details */}
        <button
          onClick={onToggle}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mt-3"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {isExpanded ? 'Hide' : 'Show'} Details
        </button>

        {/* Expanded Details */}
        {isExpanded && matchData && (
          <div className="mt-4 space-y-4">
            {/* Reasoning */}
            {matchData.reasoning && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Brain className="w-3.5 h-3.5" />
                  AI Analysis
                </p>
                <p className="text-sm text-gray-600">{matchData.reasoning}</p>
              </div>
            )}

            {/* Skills Match */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matchData.matchingSkills?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    Matching Skills
                  </p>
                  <div className="space-y-1">
                    {matchData.matchingSkills.slice(0, 5).map((skill, i) => (
                      <div key={i} className="text-xs">
                        <span className="font-medium text-green-700">{skill.skill || skill}</span>
                        {skill.evidence && (
                          <span className="text-gray-500 ml-1">- {skill.evidence}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchData.missingSkills?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                    Skills to Address
                  </p>
                  <div className="space-y-1">
                    {matchData.missingSkills.slice(0, 5).map((skill, i) => (
                      <div key={i} className="text-xs">
                        <span className={`font-medium ${skill.criticality === 'must-have' ? 'text-red-700' : 'text-orange-700'}`}>
                          {skill.skill || skill}
                        </span>
                        {skill.bridgeStrategy && (
                          <span className="text-gray-500 ml-1">- {skill.bridgeStrategy}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fit Assessment */}
            {matchData.fitAssessment && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs font-medium text-blue-700 mb-2">Fit Assessment</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">Level:</span>
                    <span className="ml-1 font-medium">{matchData.fitAssessment.levelFit}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Culture:</span>
                    <span className="ml-1 font-medium">{matchData.fitAssessment.cultureFit}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Growth:</span>
                    <span className="ml-1 font-medium">{matchData.fitAssessment.growthPotential}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Application Strategy */}
            {matchData.applicationStrategy && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Application Strategy
                </p>
                {matchData.applicationStrategy.keyPoints?.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs text-gray-600">Key points to emphasize:</span>
                    <ul className="list-disc list-inside text-xs text-gray-700 mt-1">
                      {matchData.applicationStrategy.keyPoints.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Interview Prep Preview */}
            {matchData.interviewPrep && (
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs font-medium text-purple-700 mb-2 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Interview Prep Hints
                </p>
                {matchData.interviewPrep.technicalQuestions?.slice(0, 2).map((q, i) => (
                  <p key={i} className="text-xs text-gray-600 mb-1">• {q}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Basic description for jobs without match data */}
        {isExpanded && !matchData && job.description && (
          <p className="mt-3 text-sm text-gray-600">{job.description}</p>
        )}
      </div>
    </div>
  )
}

// Research Stats Component
function ResearchStats({ stats }) {
  if (!stats || stats.totalSearches === 0) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-gray-500 mb-1">
          <Search className="w-4 h-4" />
          <span className="text-xs">Total Searches</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{stats.totalSearches}</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-gray-500 mb-1">
          <Briefcase className="w-4 h-4" />
          <span className="text-xs">Avg Jobs/Search</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{stats.avgJobsPerSearch}</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-gray-500 mb-1">
          <Star className="w-4 h-4" />
          <span className="text-xs">Avg Top Matches</span>
        </div>
        <p className="text-2xl font-bold text-green-600">{stats.avgTopMatches}</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-gray-500 mb-1">
          <Flame className="w-4 h-4" />
          <span className="text-xs">Search Streak</span>
        </div>
        <p className="text-2xl font-bold text-orange-600">{stats.searchStreak} days</p>
      </div>
    </div>
  )
}

// Main AI Job Matcher Component
export default function AIJobMatcher({ onAddApplication, resumeVersions }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [resumeText, setResumeText] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Deep Research State
  const [isResearching, setIsResearching] = useState(false)
  const [researchProgress, setResearchProgress] = useState(null)
  const [researchResults, setResearchResults] = useState(null)
  const [expandedJobs, setExpandedJobs] = useState({})
  const [filterTier, setFilterTier] = useState('all')

  const fileInputRef = useRef(null)

  const llmSettings = loadLLMSettings()
  const jobAPISettings = loadJobAPISettings()
  const stats = getResearchStats()

  const hasLLMKey = llmSettings.provider === LLM_PROVIDERS.OLLAMA ||
                    llmSettings.provider === LLM_PROVIDERS.BROWSER ||
                    !!llmSettings.apiKeys[PROVIDER_CONFIG[llmSettings.provider]?.apiKeyName]

  const hasJobAPIKey = !!jobAPISettings.apiKeys[JOB_API_CONFIG[jobAPISettings.provider]?.apiKeyName]

  const isReady = hasLLMKey && hasJobAPIKey

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      const text = await parseResume(file)
      setResumeText(text)
      setUploadedFileName(file.name)
      setResearchResults(null) // Clear previous results
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Start Deep Research
  const handleDeepResearch = async () => {
    if (!resumeText) {
      setError('Please upload your resume first')
      return
    }

    if (!isReady) {
      setError('Please configure your API keys in settings')
      return
    }

    setIsResearching(true)
    setError(null)
    setResearchProgress({ step: 0, total: 5, message: 'Starting deep research...', progress: 0 })

    try {
      const results = await performDeepResearch(
        resumeText,
        llmSettings,
        jobAPISettings,
        (progress) => setResearchProgress(progress)
      )
      setResearchResults(results)

      // Find new jobs since last search
      if (results.allJobs) {
        const newJobs = findNewJobs(results.allJobs)
        results.newJobIds = new Set(newJobs.map(j => j.id))
      }
    } catch (err) {
      setError(`Research failed: ${err.message}`)
    } finally {
      setIsResearching(false)
      setResearchProgress(null)
    }
  }

  // Add job to tracker
  const handleAddToTracker = (job) => {
    const matchData = researchResults?.matchAnalysis?.matches?.find(m => m.jobId === job.id)

    const newApplication = {
      company: job.company,
      title: job.title,
      location: job.location || '',
      region: '',
      requisitionId: job.id || '',
      jobUrl: job.applyUrl || '',
      salary: job.salary || '',
      companyType: '',
      modality: [],
      seniorityMatch: matchData?.score ? Math.round(matchData.score / 20) : 3,
      dateApplied: new Date().toISOString().split('T')[0],
      resumeVersion: '',
      coverLetter: false,
      referral: '',
      applicationSource: `AI Match (${job.source || 'Deep Research'})`
    }
    onAddApplication(newApplication)
  }

  // Get filtered jobs
  const getFilteredJobs = () => {
    if (!researchResults?.allJobs) return []

    let jobs = [...researchResults.allJobs]

    // Sort by match score if available
    if (researchResults.matchAnalysis?.matches) {
      const matchMap = new Map(
        researchResults.matchAnalysis.matches.map(m => [m.jobId, m])
      )
      jobs.sort((a, b) => {
        const scoreA = matchMap.get(a.id)?.score || 0
        const scoreB = matchMap.get(b.id)?.score || 0
        return scoreB - scoreA
      })
    }

    // Filter by tier
    if (filterTier !== 'all' && researchResults.matchAnalysis?.matches) {
      const matchMap = new Map(
        researchResults.matchAnalysis.matches.map(m => [m.jobId, m])
      )
      jobs = jobs.filter(job => {
        const match = matchMap.get(job.id)
        if (!match) return filterTier === 'unanalyzed'
        return match.tier === filterTier
      })
    }

    return jobs
  }

  const filteredJobs = getFilteredJobs()
  const getMatchData = (jobId) => researchResults?.matchAnalysis?.matches?.find(m => m.jobId === jobId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            AI Deep Research
          </h2>
          <p className="text-sm text-gray-500">
            Upload your resume for comprehensive job matching powered by AI
          </p>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-4 h-4" />
          API Settings
        </button>
      </div>

      {/* Stats */}
      <ResearchStats stats={stats} />

      {/* API Status */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          {hasLLMKey ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-yellow-500" />
          )}
          <span className="text-sm text-gray-700">
            LLM: {PROVIDER_CONFIG[llmSettings.provider]?.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasJobAPIKey ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-yellow-500" />
          )}
          <span className="text-sm text-gray-700">
            Jobs: {JOB_API_CONFIG[jobAPISettings.provider]?.name}
          </span>
        </div>
        {!isReady && (
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Configure APIs →
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-sm text-red-600 hover:text-red-700 underline mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Research Progress */}
      {isResearching && <ResearchProgress progress={researchProgress} />}

      {/* Upload & Research Section */}
      {!isResearching && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {resumeText ? '✓ Resume Uploaded' : 'Upload Your Master Resume'}
              </h3>
              {uploadedFileName && (
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {uploadedFileName}
                </p>
              )}
              {!resumeText && (
                <p className="text-sm text-gray-500">
                  PDF, DOCX, or TXT supported
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {resumeText ? 'Change Resume' : 'Upload Resume'}
              </button>

              <button
                onClick={handleDeepResearch}
                disabled={!resumeText || !isReady || isResearching}
                className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <Zap className="w-4 h-4" />
                Start Deep Research
              </button>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Brain className="w-4 h-4 text-indigo-500" />
              Deep resume analysis
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Search className="w-4 h-4 text-indigo-500" />
              Multi-query search strategy
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target className="w-4 h-4 text-indigo-500" />
              AI-powered match scoring
            </div>
          </div>
        </div>
      )}

      {/* Research Results */}
      {researchResults && !isResearching && (
        <>
          {/* Resume Analysis Summary */}
          {researchResults.resumeAnalysis && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Your Profile Analysis
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    {researchResults.resumeAnalysis.summary}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 w-24">Experience:</span>
                      <span className="text-sm">{researchResults.resumeAnalysis.yearsExperience} years</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 w-24">Level:</span>
                      <span className="text-sm">{researchResults.resumeAnalysis.seniorityLevel}</span>
                    </div>
                    {researchResults.resumeAnalysis.salaryRange && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500 w-24">Salary Range:</span>
                        <span className="text-sm">
                          ${researchResults.resumeAnalysis.salaryRange.min?.toLocaleString()} - ${researchResults.resumeAnalysis.salaryRange.max?.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {researchResults.resumeAnalysis.uniqueValueProps?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Unique Value</p>
                      <div className="flex flex-wrap gap-1">
                        {researchResults.resumeAnalysis.uniqueValueProps.slice(0, 4).map((prop, i) => (
                          <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                            {prop}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {researchResults.resumeAnalysis.therapeuticModalities?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Modalities</p>
                      <div className="flex flex-wrap gap-1">
                        {researchResults.resumeAnalysis.therapeuticModalities.map((mod, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {researchResults.resumeAnalysis.careerInsights && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs font-medium text-yellow-800 mb-1 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Career Insight
                  </p>
                  <p className="text-sm text-yellow-700">{researchResults.resumeAnalysis.careerInsights}</p>
                </div>
              )}
            </div>
          )}

          {/* Market Insights */}
          {researchResults.matchAnalysis?.marketInsights && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm font-medium text-blue-900 mb-1 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Market Insights
              </p>
              <p className="text-sm text-blue-700">{researchResults.matchAnalysis.marketInsights}</p>
            </div>
          )}

          {/* Job Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                Found {researchResults.stats.uniqueJobs} Jobs
                {researchResults.newJobIds?.size > 0 && (
                  <span className="ml-2 text-green-600 text-sm font-normal">
                    ({researchResults.newJobIds.size} new since last search)
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-500">
                {researchResults.stats.topMatches} top matches (70%+)
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Results</option>
                <option value="Top Match">Top Matches</option>
                <option value="Strong Match">Strong Matches</option>
                <option value="Good Match">Good Matches</option>
                <option value="Stretch">Stretch Roles</option>
              </select>
            </div>
          </div>

          {/* Job Cards */}
          <div className="space-y-3">
            {filteredJobs.map(job => (
              <DeepJobCard
                key={job.id}
                job={job}
                matchData={getMatchData(job.id)}
                onAddToTracker={handleAddToTracker}
                isExpanded={expandedJobs[job.id]}
                onToggle={() => setExpandedJobs(prev => ({ ...prev, [job.id]: !prev[job.id] }))}
                isNew={researchResults.newJobIds?.has(job.id)}
              />
            ))}
          </div>

          {/* Errors during search */}
          {researchResults.errors?.length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 mb-2">Some searches encountered issues:</p>
              <ul className="text-sm text-yellow-700 list-disc list-inside">
                {researchResults.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!researchResults && !isResearching && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Ready for Deep Research</p>
          <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
            Upload your master resume and click "Start Deep Research" to find the best matching jobs using AI-powered analysis
          </p>
        </div>
      )}

      {/* Settings Modal */}
      <APISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
}
