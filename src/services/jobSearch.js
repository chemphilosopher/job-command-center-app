// External Job Search API Integration
// Supports: JSearch (RapidAPI), Adzuna, USAJobs

export const JOB_API_PROVIDERS = {
  JSEARCH: 'jsearch',
  ADZUNA: 'adzuna',
  USAJOBS: 'usajobs'
}

export const JOB_API_CONFIG = {
  [JOB_API_PROVIDERS.JSEARCH]: {
    name: 'JSearch (RapidAPI)',
    description: 'Comprehensive job search API with good pharma coverage',
    requiresApiKey: true,
    apiKeyName: 'RAPIDAPI_KEY',
    freeQuota: '500 requests/month',
    signupUrl: 'https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch'
  },
  [JOB_API_PROVIDERS.ADZUNA]: {
    name: 'Adzuna',
    description: 'Global job search with detailed listings',
    requiresApiKey: true,
    apiKeyName: 'ADZUNA_APP_ID',
    apiKeyName2: 'ADZUNA_API_KEY',
    freeQuota: '250 requests/day',
    signupUrl: 'https://developer.adzuna.com/'
  },
  [JOB_API_PROVIDERS.USAJOBS]: {
    name: 'USAJobs',
    description: 'US Government jobs including FDA, NIH, CDC',
    requiresApiKey: true,
    apiKeyName: 'USAJOBS_API_KEY',
    apiKeyName2: 'USAJOBS_EMAIL',
    freeQuota: 'Unlimited',
    signupUrl: 'https://developer.usajobs.gov/'
  }
}

// Storage key for job API settings
const JOB_API_SETTINGS_KEY = 'pharma_job_tracker_job_api_settings'

export function loadJobAPISettings() {
  try {
    const stored = localStorage.getItem(JOB_API_SETTINGS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading job API settings:', error)
  }
  return {
    provider: JOB_API_PROVIDERS.JSEARCH,
    apiKeys: {}
  }
}

export function saveJobAPISettings(settings) {
  try {
    localStorage.setItem(JOB_API_SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving job API settings:', error)
  }
}

// Pharma/Biotech specific search terms
export const PHARMA_KEYWORDS = [
  'pharmaceutical',
  'biotech',
  'biotechnology',
  'drug development',
  'clinical research',
  'analytical development',
  'formulation',
  'regulatory affairs',
  'quality assurance',
  'GMP',
  'mRNA',
  'gene therapy',
  'biologics',
  'vaccines',
  'cell therapy'
]

// JSearch API (RapidAPI)
async function searchJSearch(apiKey, query, location = '', page = 1) {
  const params = new URLSearchParams({
    query: query,
    page: page.toString(),
    num_pages: '1'
  })

  if (location) {
    params.append('location', location)
  }

  const response = await fetch(
    `https://jsearch.p.rapidapi.com/search?${params}`,
    {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`JSearch API error: ${error}`)
  }

  const data = await response.json()

  return (data.data || []).map(job => ({
    id: job.job_id,
    title: job.job_title,
    company: job.employer_name,
    location: job.job_city ? `${job.job_city}, ${job.job_state}` : job.job_country,
    description: job.job_description,
    salary: job.job_min_salary && job.job_max_salary
      ? `$${job.job_min_salary.toLocaleString()} - $${job.job_max_salary.toLocaleString()}`
      : null,
    jobType: job.job_employment_type,
    postedDate: job.job_posted_at_datetime_utc,
    applyUrl: job.job_apply_link,
    companyLogo: job.employer_logo,
    source: 'JSearch'
  }))
}

// Adzuna API
async function searchAdzuna(appId, apiKey, query, location = 'us', page = 1) {
  const params = new URLSearchParams({
    app_id: appId,
    app_key: apiKey,
    results_per_page: '20',
    what: query,
    content_type: 'application/json'
  })

  const response = await fetch(
    `https://api.adzuna.com/v1/api/jobs/${location}/search/${page}?${params}`,
    {
      method: 'GET'
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Adzuna API error: ${error}`)
  }

  const data = await response.json()

  return (data.results || []).map(job => ({
    id: job.id,
    title: job.title,
    company: job.company?.display_name || 'Unknown Company',
    location: job.location?.display_name || '',
    description: job.description,
    salary: job.salary_min && job.salary_max
      ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
      : null,
    jobType: job.contract_type,
    postedDate: job.created,
    applyUrl: job.redirect_url,
    source: 'Adzuna'
  }))
}

// USAJobs API
async function searchUSAJobs(apiKey, email, query, location = '', page = 1) {
  const params = new URLSearchParams({
    Keyword: query,
    ResultsPerPage: '25',
    Page: page.toString()
  })

  if (location) {
    params.append('LocationName', location)
  }

  const response = await fetch(
    `https://data.usajobs.gov/api/Search?${params}`,
    {
      method: 'GET',
      headers: {
        'Authorization-Key': apiKey,
        'User-Agent': email,
        'Host': 'data.usajobs.gov'
      }
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`USAJobs API error: ${error}`)
  }

  const data = await response.json()
  const results = data.SearchResult?.SearchResultItems || []

  return results.map(item => {
    const job = item.MatchedObjectDescriptor
    return {
      id: job.PositionID,
      title: job.PositionTitle,
      company: job.OrganizationName,
      location: job.PositionLocation?.[0]?.LocationName || '',
      description: job.UserArea?.Details?.JobSummary || job.QualificationSummary,
      salary: job.PositionRemuneration?.[0]
        ? `$${job.PositionRemuneration[0].MinimumRange} - $${job.PositionRemuneration[0].MaximumRange}`
        : null,
      jobType: job.PositionSchedule?.[0]?.Name,
      postedDate: job.PositionStartDate,
      applyUrl: job.ApplyURI?.[0] || job.PositionURI,
      source: 'USAJobs'
    }
  })
}

// Main search function
export async function searchJobs(settings, query, location = '', page = 1) {
  const { provider, apiKeys } = settings
  const config = JOB_API_CONFIG[provider]

  switch (provider) {
    case JOB_API_PROVIDERS.JSEARCH: {
      const apiKey = apiKeys[config.apiKeyName]
      if (!apiKey) throw new Error('RapidAPI key not configured')
      return await searchJSearch(apiKey, query, location, page)
    }

    case JOB_API_PROVIDERS.ADZUNA: {
      const appId = apiKeys[config.apiKeyName]
      const apiKey = apiKeys[config.apiKeyName2]
      if (!appId || !apiKey) throw new Error('Adzuna credentials not configured')
      return await searchAdzuna(appId, apiKey, query, location, page)
    }

    case JOB_API_PROVIDERS.USAJOBS: {
      const apiKey = apiKeys[config.apiKeyName]
      const email = apiKeys[config.apiKeyName2]
      if (!apiKey || !email) throw new Error('USAJobs credentials not configured')
      return await searchUSAJobs(apiKey, email, query, location, page)
    }

    default:
      throw new Error(`Unknown job API provider: ${provider}`)
  }
}

// Search for pharma-specific jobs
export async function searchPharmaJobs(settings, keywords = [], location = '') {
  const baseKeywords = keywords.length > 0 ? keywords : ['pharmaceutical scientist', 'biotech']
  const allJobs = []

  for (const keyword of baseKeywords.slice(0, 3)) { // Limit to 3 searches to save API quota
    try {
      const jobs = await searchJobs(settings, keyword, location, 1)
      allJobs.push(...jobs)
    } catch (error) {
      console.error(`Error searching for "${keyword}":`, error)
    }
  }

  // Deduplicate by job ID
  const uniqueJobs = Array.from(
    new Map(allJobs.map(job => [job.id, job])).values()
  )

  return uniqueJobs
}
