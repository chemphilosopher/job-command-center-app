import { useState } from 'react'
import { X, Download, Upload, Sparkles, Keyboard, HardDrive, Trash2, Shield } from 'lucide-react'
import { STORAGE_KEYS, clearAPIKeys } from '../services/storageService'

/**
 * Settings Panel Component
 * Handles data backup, AI info, keyboard shortcuts, and data management
 */
function SettingsPanel({
  applications,
  resumeVersions,
  targetCompanies = [],
  networkingTouches = [],
  outreachTemplates = [],
  onClearData,
  onClose,
  onExport,
  onImport,
  showToast
}) {
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showClearAPIKeysConfirm, setShowClearAPIKeysConfirm] = useState(false)
  const [lastBackup, setLastBackup] = useState(() => localStorage.getItem(STORAGE_KEYS.LAST_BACKUP))
  const [mountTime] = useState(() => Date.now())

  // Calculate storage used
  const storageUsed = () => {
    const appData = JSON.stringify(applications)
    const resumeData = JSON.stringify(resumeVersions)
    const companyData = JSON.stringify(targetCompanies)
    const touchData = JSON.stringify(networkingTouches)
    const templateData = JSON.stringify(outreachTemplates)
    const totalBytes = appData.length + resumeData.length + companyData.length + touchData.length + templateData.length
    return (totalBytes / 1024).toFixed(1)
  }

  // Calculate days since backup using mount time
  const daysSinceBackup = lastBackup
    ? Math.floor((mountTime - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24))
    : null

  const needsBackup = !lastBackup || daysSinceBackup > 7

  const handleClearAPIKeys = () => {
    clearAPIKeys()
    setShowClearAPIKeysConfirm(false)
    if (showToast) {
      showToast('API keys cleared successfully', 'success')
    }
  }

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
            {/* Data Backup Section */}
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
                    localStorage.setItem(STORAGE_KEYS.LAST_BACKUP, now)
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
                  <span className="text-gray-600">Save Form</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">Cmd/Ctrl + Enter</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Close Modal</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">Esc</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Switch Tabs</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">1-7</kbd>
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
                  <span className="text-gray-600">Target Companies</span>
                  <span className="font-medium">{targetCompanies.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage Used</span>
                  <span className="font-medium">{storageUsed()} KB</span>
                </div>
              </div>
            </div>

            {/* Security Section - NEW */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                Security
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                On shared computers, clear your API keys before leaving.
              </p>
              {!showClearAPIKeysConfirm ? (
                <button
                  onClick={() => setShowClearAPIKeysConfirm(true)}
                  className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Clear API Keys Only
                </button>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <p className="text-sm text-blue-800">
                    This will remove all stored API keys while keeping your application data.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowClearAPIKeysConfirm(false)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearAPIKeys}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Clear Keys
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Danger Zone */}
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

export default SettingsPanel
