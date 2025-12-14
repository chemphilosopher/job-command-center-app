/**
 * AI Status Badge Component
 * Shows whether AI features are configured and ready
 */
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

export default AIStatusBadge
