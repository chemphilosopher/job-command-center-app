// LLM Provider Abstraction Layer
// Supports: OpenAI, Anthropic (Claude), Google Gemini, Ollama, Browser LLM

export const LLM_PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  GEMINI: 'gemini',
  OLLAMA: 'ollama',
  BROWSER: 'browser'
}

export const PROVIDER_CONFIG = {
  [LLM_PROVIDERS.OPENAI]: {
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-4o-mini',
    requiresApiKey: true,
    apiKeyName: 'OPENAI_API_KEY'
  },
  [LLM_PROVIDERS.ANTHROPIC]: {
    name: 'Anthropic (Claude)',
    models: ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
    defaultModel: 'claude-sonnet-4-20250514',
    requiresApiKey: true,
    apiKeyName: 'ANTHROPIC_API_KEY'
  },
  [LLM_PROVIDERS.GEMINI]: {
    name: 'Google Gemini',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'],
    defaultModel: 'gemini-1.5-flash',
    requiresApiKey: true,
    apiKeyName: 'GEMINI_API_KEY'
  },
  [LLM_PROVIDERS.OLLAMA]: {
    name: 'Ollama (Local)',
    models: ['llama3.1', 'llama3', 'mistral', 'codellama', 'phi3'],
    defaultModel: 'llama3.1',
    requiresApiKey: false,
    baseUrl: 'http://localhost:11434'
  },
  [LLM_PROVIDERS.BROWSER]: {
    name: 'Browser LLM',
    models: ['Phi-3-mini-4k-instruct'],
    defaultModel: 'Phi-3-mini-4k-instruct',
    requiresApiKey: false,
    note: 'Runs in browser - slower but no API costs'
  }
}

// Storage key for LLM settings
const LLM_SETTINGS_KEY = 'pharma_job_tracker_llm_settings'

export function loadLLMSettings() {
  try {
    const stored = localStorage.getItem(LLM_SETTINGS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading LLM settings:', error)
  }
  return {
    provider: LLM_PROVIDERS.OPENAI,
    model: PROVIDER_CONFIG[LLM_PROVIDERS.OPENAI].defaultModel,
    apiKeys: {}
  }
}

export function saveLLMSettings(settings) {
  try {
    localStorage.setItem(LLM_SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving LLM settings:', error)
  }
}

// OpenAI API call
async function callOpenAI(apiKey, model, messages) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'OpenAI API error')
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// Anthropic API call
async function callAnthropic(apiKey, model, messages) {
  // Convert messages format for Anthropic
  const systemMessage = messages.find(m => m.role === 'system')?.content || ''
  const userMessages = messages.filter(m => m.role !== 'system')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model,
      max_tokens: 2000,
      system: systemMessage,
      messages: userMessages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Anthropic API error')
  }

  const data = await response.json()
  return data.content[0].text
}

// Google Gemini API call
async function callGemini(apiKey, model, messages) {
  const systemMessage = messages.find(m => m.role === 'system')?.content || ''
  const userMessages = messages.filter(m => m.role !== 'system')

  // Build conversation for Gemini
  const contents = userMessages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }))

  // Prepend system message to first user message if exists
  if (systemMessage && contents.length > 0) {
    contents[0].parts[0].text = `${systemMessage}\n\n${contents[0].parts[0].text}`
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      })
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Gemini API error')
  }

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

// Ollama API call (local)
async function callOllama(model, messages, baseUrl = 'http://localhost:11434') {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false
    })
  })

  if (!response.ok) {
    throw new Error('Ollama API error - make sure Ollama is running locally')
  }

  const data = await response.json()
  return data.message.content
}

// Main LLM call function
export async function callLLM(settings, messages) {
  const { provider, model, apiKeys } = settings
  const apiKey = apiKeys[PROVIDER_CONFIG[provider]?.apiKeyName]

  switch (provider) {
    case LLM_PROVIDERS.OPENAI:
      if (!apiKey) throw new Error('OpenAI API key not configured')
      return await callOpenAI(apiKey, model, messages)

    case LLM_PROVIDERS.ANTHROPIC:
      if (!apiKey) throw new Error('Anthropic API key not configured')
      return await callAnthropic(apiKey, model, messages)

    case LLM_PROVIDERS.GEMINI:
      if (!apiKey) throw new Error('Gemini API key not configured')
      return await callGemini(apiKey, model, messages)

    case LLM_PROVIDERS.OLLAMA:
      return await callOllama(model, messages)

    case LLM_PROVIDERS.BROWSER:
      throw new Error('Browser LLM not yet implemented - please use another provider')

    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}

// Job matching prompt
export function createJobMatchPrompt(resumeText, jobDescriptions) {
  return [
    {
      role: 'system',
      content: `You are an expert career advisor specializing in pharmaceutical and biotech industries.
Your task is to analyze a resume and match it against job listings, providing detailed compatibility scores and insights.

For each job, provide:
1. A match score from 0-100
2. Key matching qualifications
3. Gaps or missing requirements
4. Specific recommendations to improve fit
5. Overall assessment

Format your response as JSON with this structure:
{
  "matches": [
    {
      "jobId": "string",
      "score": number,
      "matchingSkills": ["string"],
      "gaps": ["string"],
      "recommendations": ["string"],
      "assessment": "string"
    }
  ],
  "overallInsights": "string",
  "topRecommendation": "string"
}`
    },
    {
      role: 'user',
      content: `Please analyze my resume against these job listings and provide match scores and insights.

## MY RESUME:
${resumeText}

## JOB LISTINGS:
${jobDescriptions.map((job, idx) => `
### Job ${idx + 1} (ID: ${job.id})
**Title:** ${job.title}
**Company:** ${job.company}
**Location:** ${job.location}
**Description:** ${job.description}
`).join('\n')}`
    }
  ]
}

// Resume analysis prompt
export function createResumeAnalysisPrompt(resumeText) {
  return [
    {
      role: 'system',
      content: `You are an expert career advisor specializing in pharmaceutical and biotech industries.
Analyze the resume and extract key information.

Return JSON with this structure:
{
  "summary": "Brief professional summary",
  "yearsExperience": number,
  "currentRole": "string",
  "skills": ["string"],
  "modalities": ["string"], // e.g., mRNA, AAV, mAb, etc.
  "techniques": ["string"], // e.g., HPLC, Mass Spec, etc.
  "industries": ["string"],
  "education": [{"degree": "string", "field": "string", "institution": "string"}],
  "suggestedJobTitles": ["string"],
  "suggestedCompanies": ["string"],
  "searchKeywords": ["string"]
}`
    },
    {
      role: 'user',
      content: `Please analyze this resume and extract key information for job searching:\n\n${resumeText}`
    }
  ]
}

// Qualification Checklist Prompt - Analyzes resume against job posting
export function createQualificationChecklistPrompt(resumeText, jobDescription) {
  return [
    {
      role: 'system',
      content: `You are an expert career advisor specializing in pharmaceutical and biotech industries.
Your task is to analyze a candidate's resume against a specific job posting and provide a detailed qualification assessment.

Be honest and objective - the candidate needs to know their real chances, not false encouragement.
Focus on concrete requirements from the job posting and specific evidence from the resume.

Return a JSON object with this EXACT structure:
{
  "fitScore": <number 0-100>,
  "fitTier": "<Strong Fit|Good Fit|Stretch|Long Shot>",
  "levelFit": "<Under-qualified|Right Level|Over-qualified>",
  "laneFit": "<In Lane|Adjacent|Out of Lane>",
  "requirementsMet": <number>,
  "requirementsTotal": <number>,
  "qualifications": [
    {
      "requirement": "<specific requirement from job posting>",
      "status": "<Met|Partial|Gap>",
      "evidence": "<specific evidence from resume or 'Not found'>",
      "suggestion": "<actionable tip to address if gap/partial>"
    }
  ],
  "strengths": ["<specific strength relevant to this role>"],
  "gaps": ["<specific gap or missing qualification>"],
  "recommendations": ["<actionable recommendation to improve chances>"],
  "summary": "<2-3 sentence honest assessment>"
}

Scoring Guide:
- 80-100 = Strong Fit: Meets 80%+ of requirements, clear evidence of success in similar roles
- 60-79 = Good Fit: Meets most requirements, some gaps but transferable skills present
- 40-59 = Stretch: Meets ~50% of requirements, significant gaps but potential to grow
- 0-39 = Long Shot: Major gaps, recommend focusing on other opportunities

Level Fit:
- Under-qualified: Role requires more experience/seniority than candidate has
- Right Level: Role matches candidate's experience level
- Over-qualified: Candidate has significantly more experience than role requires

Lane Fit:
- In Lane: Role is directly aligned with candidate's background/expertise
- Adjacent: Related field but would require pivot or skill development
- Out of Lane: Completely different domain`
    },
    {
      role: 'user',
      content: `Please analyze my resume against this job posting and provide a detailed qualification assessment.

## MY RESUME:
${resumeText}

## JOB POSTING:
${jobDescription}

Provide your analysis as JSON following the exact structure specified.`
    }
  ]
}

// AI Coach Strategic Analysis Prompt
export function createCoachingPrompt(searchData, userQuestion = null) {
  return [
    {
      role: 'system',
      content: `You are an expert job search coach specializing in pharmaceutical and biotech careers.
You have access to the candidate's complete job search data and should provide strategic, actionable advice.

Your coaching style:
- Be direct and honest, not overly encouraging
- Provide specific, actionable recommendations
- Back up observations with data from their search
- Identify patterns and suggest course corrections
- Focus on high-impact activities

When analyzing their data:
- Look at response rates by different factors
- Identify what's working vs not working
- Suggest prioritization of target companies
- Recommend networking strategies
- Flag any concerning patterns`
    },
    {
      role: 'user',
      content: userQuestion
        ? `Here's my job search data:\n\n${JSON.stringify(searchData, null, 2)}\n\nMy question: ${userQuestion}`
        : `Please analyze my job search data and provide strategic coaching advice:\n\n${JSON.stringify(searchData, null, 2)}\n\nProvide:\n1. Overall assessment of my job search\n2. What's working and what isn't\n3. Top 3 actionable recommendations for next week\n4. Any patterns or red flags you notice\n5. Which target companies I should prioritize and why`
    }
  ]
}

// Job Description Parser Prompt - Extracts structured data from job posting
export function createJobParserPrompt(jobDescription) {
  return [
    {
      role: 'system',
      content: `You are an expert at parsing job postings. Extract structured information from the job description provided.

Return a JSON object with this EXACT structure (use empty string "" for fields not found):
{
  "company": "<company name>",
  "title": "<job title>",
  "location": "<city, state or location>",
  "region": "<one of: Boston/Cambridge, San Francisco Bay Area, San Diego, New Jersey, Philadelphia/Delaware Valley, Midwest, Southeast, Remote, International, Other>",
  "companyType": "<one of: Large Pharma, Mid-size Biotech, Small Biotech/Startup, CDMO/CMO, CRO, Academic/Research, Medical Device, Consulting, Other>",
  "salaryRange": "<salary range if mentioned>",
  "jobUrl": "<URL if present in the text>",
  "modality": [<array of relevant modalities from: mRNA, AAV/Gene Therapy, Cell Therapy, Monoclonal Antibodies, Small Molecules, Oligonucleotides, Vaccines, Biosimilars>],
  "applicationSource": "<one of: LinkedIn, Indeed, Company Website, Recruiter, Referral, Job Board, Other>",
  "description": "<brief 1-2 sentence summary of the role>",
  "keyRequirements": [<array of 3-5 key requirements/qualifications>]
}

Be precise with the region mapping:
- Boston area, Cambridge, MA → "Boston/Cambridge"
- SF, South San Francisco, Bay Area → "San Francisco Bay Area"
- NJ, New Brunswick, Princeton → "New Jersey"
- Philly, Wilmington, DE → "Philadelphia/Delaware Valley"
- Chicago, Indianapolis, etc. → "Midwest"

For company type:
- Pfizer, Merck, J&J, Novartis, Roche, AstraZeneca, etc. → "Large Pharma"
- Moderna, Regeneron, BioMarin, Vertex, etc. → "Mid-size Biotech"
- Early stage, Series A/B/C companies → "Small Biotech/Startup"

Only return valid JSON, no other text.`
    },
    {
      role: 'user',
      content: `Parse this job posting and extract structured data:\n\n${jobDescription}`
    }
  ]
}
