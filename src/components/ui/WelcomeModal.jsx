import { useState } from 'react'
import {
  Briefcase,
  FileText,
  Target,
  Users,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

/**
 * Welcome modal for first-time users
 * Three-step onboarding flow with AI setup options
 */
function WelcomeModal({ onClose, onOpenSettings, onOpenSetupGuide }) {
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
                <h2 className="text-xl font-semibold text-gray-900">Enable AI Features (Optional)</h2>
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-5">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">AI-Powered Analysis</h3>
                      <p className="text-sm text-gray-600">
                        Get AI assistance with job matching, resume analysis, and interview prep.
                        <strong className="block mt-2 text-purple-700">Free options available!</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Two path options */}
                <div className="grid gap-4">
                  <button
                    onClick={() => {
                      onClose()
                      if (onOpenSetupGuide) onOpenSetupGuide()
                    }}
                    className="flex items-center gap-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-100 transition-all text-left group"
                  >
                    <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">I need to set up an API key</h3>
                      <p className="text-sm text-gray-600">Step-by-step guide to get a free API key from Google, OpenAI, or others</p>
                    </div>
                    <span className="text-blue-600 font-medium">Guide →</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose()
                      onOpenSettings()
                    }}
                    className="flex items-center gap-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-100 transition-all text-left group"
                  >
                    <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">I have an API key</h3>
                      <p className="text-sm text-gray-600">Go straight to settings and enter your API key</p>
                    </div>
                    <span className="text-green-600 font-medium">Settings →</span>
                  </button>
                </div>

                <button
                  onClick={() => setStep(3)}
                  className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  Skip for now - I'll set this up later
                </button>
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

export default WelcomeModal
