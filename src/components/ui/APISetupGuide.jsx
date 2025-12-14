import { useState } from 'react'
import { X, ExternalLink, Copy, Check, Sparkles, Zap, Shield, Server } from 'lucide-react'

const PROVIDERS = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    tagline: 'Free & Easy',
    color: 'blue',
    icon: Zap,
    free: true,
    recommended: true,
    steps: [
      {
        title: 'Go to Google AI Studio',
        content: 'Open your browser and go to:',
        link: 'https://aistudio.google.com',
        linkText: 'aistudio.google.com'
      },
      {
        title: 'Sign in with Google',
        content: 'Click "Sign in with Google" and use your Gmail account. Accept the terms if prompted.'
      },
      {
        title: 'Get your API Key',
        content: 'In the left sidebar, click "Get API key", then click "Create API key in new project".'
      },
      {
        title: 'Copy your key',
        content: 'Your key will appear (starts with "AIza"). Click the copy button next to it.'
      }
    ],
    keyPrefix: 'AIza'
  },
  {
    id: 'openai',
    name: 'OpenAI (GPT-4)',
    tagline: 'Best Quality',
    color: 'green',
    icon: Sparkles,
    free: false,
    steps: [
      {
        title: 'Go to OpenAI Platform',
        content: 'Open your browser and go to:',
        link: 'https://platform.openai.com',
        linkText: 'platform.openai.com'
      },
      {
        title: 'Create account & add payment',
        content: 'Sign up, then go to Settings → Billing to add a payment method. Set a $10 monthly limit.'
      },
      {
        title: 'Generate API Key',
        content: 'Go to API Keys in the sidebar (or platform.openai.com/api-keys). Click "+ Create new secret key".'
      },
      {
        title: 'Copy your key immediately',
        content: 'Copy the key NOW - you won\'t see it again! It starts with "sk-".'
      }
    ],
    keyPrefix: 'sk-'
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    tagline: 'Thoughtful Analysis',
    color: 'orange',
    icon: Sparkles,
    free: false,
    steps: [
      {
        title: 'Go to Anthropic Console',
        content: 'Open your browser and go to:',
        link: 'https://console.anthropic.com',
        linkText: 'console.anthropic.com'
      },
      {
        title: 'Create account & add credits',
        content: 'Sign up and verify email. Go to Settings → Billing and add credits (minimum $5).'
      },
      {
        title: 'Generate API Key',
        content: 'Click "API Keys" in the sidebar, then "Create Key". Name it "Job Command Center".'
      },
      {
        title: 'Copy your key immediately',
        content: 'Copy the key NOW! It starts with "sk-ant-".'
      }
    ],
    keyPrefix: 'sk-ant-'
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    tagline: '100% Private',
    color: 'purple',
    icon: Server,
    free: true,
    steps: [
      {
        title: 'Download Ollama',
        content: 'Go to the Ollama website and download for your OS:',
        link: 'https://ollama.com/download',
        linkText: 'ollama.com/download'
      },
      {
        title: 'Install Ollama',
        content: 'Run the installer. On Mac, drag to Applications. On Windows, run the .exe.'
      },
      {
        title: 'Download a model',
        content: 'Open Terminal/Command Prompt and run: ollama pull llama3.1'
      },
      {
        title: 'No API key needed!',
        content: 'Just select "Ollama (Local)" in settings. Make sure Ollama is running (look for the llama icon).'
      }
    ],
    keyPrefix: null
  }
]

export default function APISetupGuide({ onClose, onOpenSettings }) {
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [copied, setCopied] = useState(false)

  const provider = PROVIDERS.find(p => p.id === selectedProvider)

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getColorClasses = (color, type = 'bg') => {
    const colors = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:border-blue-400' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200', hover: 'hover:border-green-400' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200', hover: 'hover:border-orange-400' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:border-purple-400' }
    }
    return colors[color]?.[type] || colors.blue[type]
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">API Key Setup Guide</h1>
              <p className="text-blue-200 text-sm">Get a free API key in minutes</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {!selectedProvider ? (
              /* Provider Selection */
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose a provider:</h2>

                {PROVIDERS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProvider(p.id)
                      setCurrentStep(0)
                    }}
                    className={`w-full flex items-center gap-4 p-4 border-2 ${getColorClasses(p.color, 'border')} ${getColorClasses(p.color, 'hover')} rounded-xl transition-all text-left group hover:shadow-md`}
                  >
                    <div className={`${getColorClasses(p.color, 'bg')} p-3 rounded-lg`}>
                      <p.icon className={`w-6 h-6 ${getColorClasses(p.color, 'text')}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{p.name}</h3>
                        {p.recommended && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Recommended
                          </span>
                        )}
                        {p.free && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            Free
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{p.tagline}</p>
                    </div>
                    <span className={`${getColorClasses(p.color, 'text')} font-medium`}>→</span>
                  </button>
                ))}

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-600" />
                    Privacy Note
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Your API key is stored only in your browser. We never see or store your keys on any server.
                  </p>
                </div>
              </div>
            ) : (
              /* Step-by-step guide */
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  ← Back to providers
                </button>

                <div className="flex items-center gap-3">
                  <div className={`${getColorClasses(provider.color, 'bg')} p-2 rounded-lg`}>
                    <provider.icon className={`w-5 h-5 ${getColorClasses(provider.color, 'text')}`} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{provider.name}</h2>
                    <p className="text-sm text-gray-500">{provider.tagline}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex gap-2">
                  {provider.steps.map((_, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 h-2 rounded-full transition-colors ${
                        idx <= currentStep ? getColorClasses(provider.color, 'bg').replace('100', '500') : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Current step */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`w-8 h-8 rounded-full ${getColorClasses(provider.color, 'bg')} ${getColorClasses(provider.color, 'text')} flex items-center justify-center font-bold`}>
                      {currentStep + 1}
                    </span>
                    <h3 className="font-semibold text-gray-900">{provider.steps[currentStep].title}</h3>
                  </div>

                  <p className="text-gray-700 mb-4">{provider.steps[currentStep].content}</p>

                  {provider.steps[currentStep].link && (
                    <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                      <a
                        href={provider.steps[currentStep].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${getColorClasses(provider.color, 'text')} hover:underline font-medium flex items-center gap-1`}
                      >
                        {provider.steps[currentStep].linkText}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleCopyLink(provider.steps[currentStep].link)}
                        className="ml-auto p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        title="Copy link"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  {currentStep > 0 && (
                    <button
                      onClick={() => setCurrentStep(s => s - 1)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                  )}

                  {currentStep < provider.steps.length - 1 ? (
                    <button
                      onClick={() => setCurrentStep(s => s + 1)}
                      className={`flex-1 py-2 ${getColorClasses(provider.color, 'bg').replace('100', '600')} text-white rounded-lg font-medium hover:opacity-90`}
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onClose()
                        if (onOpenSettings) onOpenSettings()
                      }}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                    >
                      Done - Enter My API Key →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
