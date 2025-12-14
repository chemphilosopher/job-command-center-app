import { useState, useEffect } from 'react'
import {
  CheckCircle,
  Circle,
  FileText,
  Building2,
  Users,
  Sparkles,
  Download,
  X,
  ChevronRight
} from 'lucide-react'
import { loadGettingStarted, saveGettingStarted } from '../services/storageService'

/**
 * Getting Started Checklist for new users
 * Guides users through initial setup steps
 */
function GettingStartedChecklist({
  applications,
  resumeVersions,
  targetCompanies,
  llmSettings,
  onNavigate,
  onDismiss
}) {
  const [progress, setProgress] = useState(() => loadGettingStarted())
  const [isMinimized, setIsMinimized] = useState(false)

  // Check completion status
  useEffect(() => {
    const newProgress = {
      ...progress,
      resumeUploaded: resumeVersions.length > 0,
      applicationAdded: applications.length > 0,
      companyAdded: targetCompanies?.length > 0,
      aiConfigured: !!(llmSettings?.apiKeys && Object.values(llmSettings.apiKeys).some(k => k))
    }

    // Only update if something changed
    if (JSON.stringify(newProgress) !== JSON.stringify(progress)) {
      setProgress(newProgress)
      saveGettingStarted(newProgress)
    }
  }, [applications, resumeVersions, targetCompanies, llmSettings])

  const checklist = [
    {
      id: 'resume',
      label: 'Upload your first resume',
      description: 'Add a resume version to track which one you use for each application',
      completed: progress.resumeUploaded,
      action: () => onNavigate('resumes'),
      icon: FileText
    },
    {
      id: 'application',
      label: 'Track your first application',
      description: 'Start tracking job applications with status and notes',
      completed: progress.applicationAdded,
      action: () => onNavigate('table', { openAddModal: true }),
      icon: FileText
    },
    {
      id: 'company',
      label: 'Add a target company',
      description: 'Build your list of companies to research and target',
      completed: progress.companyAdded,
      action: () => onNavigate('companies'),
      icon: Building2
    },
    {
      id: 'ai',
      label: 'Configure AI features (optional)',
      description: 'Get AI-powered job matching and coaching',
      completed: progress.aiConfigured,
      action: () => onNavigate('aiMatch'),
      icon: Sparkles,
      optional: true
    },
    {
      id: 'backup',
      label: 'Create your first backup',
      description: 'Export your data to keep it safe',
      completed: progress.backupCreated,
      action: () => onNavigate('settings'),
      icon: Download
    }
  ]

  const completedCount = checklist.filter(item => item.completed).length
  const totalRequired = checklist.filter(item => !item.optional).length
  const completedRequired = checklist.filter(item => item.completed && !item.optional).length

  // Don't show if dismissed or all required items complete
  if (progress.dismissed || completedRequired >= totalRequired) {
    return null
  }

  const handleDismiss = () => {
    const newProgress = { ...progress, dismissed: true }
    setProgress(newProgress)
    saveGettingStarted(newProgress)
    if (onDismiss) onDismiss()
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 z-40"
      >
        <CheckCircle className="w-4 h-4" />
        Getting Started ({completedCount}/{checklist.length})
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-40">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Getting Started</h3>
            <p className="text-sm text-indigo-200">{completedCount} of {checklist.length} complete</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-white/20 rounded"
              title="Minimize"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 bg-white/20 rounded-full h-1.5">
          <div
            className="bg-white rounded-full h-1.5 transition-all duration-300"
            style={{ width: `${(completedCount / checklist.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="p-3 max-h-64 overflow-y-auto">
        <ul className="space-y-2">
          {checklist.map(item => (
            <li key={item.id}>
              <button
                onClick={item.action}
                disabled={item.completed}
                className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-colors ${
                  item.completed
                    ? 'bg-green-50 cursor-default'
                    : 'hover:bg-gray-50 cursor-pointer'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {item.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${item.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                    {item.label}
                    {item.optional && (
                      <span className="ml-1 text-xs text-gray-400">(optional)</span>
                    )}
                  </p>
                  {!item.completed && (
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  )}
                </div>
                {!item.completed && (
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default GettingStartedChecklist
