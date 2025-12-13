// Deep Research Service
// Implements comprehensive job search similar to Gemini Deep Research / ChatGPT Browse

import { callLLM } from './llmProviders'
import { searchJobs, JOB_API_PROVIDERS, JOB_API_CONFIG } from './jobSearch'

// Storage keys
const RESEARCH_HISTORY_KEY = 'pharma_job_tracker_research_history'
const LAST_SEARCH_KEY = 'pharma_job_tracker_last_search'

export function loadResearchHistory() {
  try {
    const stored = localStorage.getItem(RESEARCH_HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveResearchHistory(history) {
  try {
    // Keep only last 30 days of history
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    const filtered = history.filter(h => new Date(h.date).getTime() > thirtyDaysAgo)
    localStorage.setItem(RESEARCH_HISTORY_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error saving research history:', error)
  }
}

export function loadLastSearch() {
  try {
    const stored = localStorage.getItem(LAST_SEARCH_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function saveLastSearch(searchData) {
  try {
    localStorage.setItem(LAST_SEARCH_KEY, JSON.stringify(searchData))
  } catch (error) {
    console.error('Error saving last search:', error)
  }
}

// Deep Resume Analysis Prompt - More comprehensive than basic analysis
export function createDeepResumeAnalysisPrompt(resumeText) {
  return [
    {
      role: 'system',
      content: `You are an expert career strategist and executive recruiter specializing in pharmaceutical, biotechnology, and life sciences industries.

Perform a DEEP ANALYSIS of this resume to create a comprehensive job search strategy. Think step by step:

1. EXPERIENCE ANALYSIS
   - Total years of experience
   - Career progression pattern
   - Industry sectors worked in
   - Types of companies (startup, mid-size, large pharma)
   - Geographic experience

2. TECHNICAL COMPETENCIES
   - Core scientific/technical skills
   - Analytical methods and instrumentation
   - Therapeutic modalities (mRNA, AAV, mAb, small molecule, etc.)
   - Regulatory knowledge (FDA, EMA, ICH)
   - Software and systems

3. LEADERSHIP & SOFT SKILLS
   - Management experience
   - Cross-functional collaboration
   - Communication and presentation
   - Project management methodologies

4. UNIQUE VALUE PROPOSITION
   - What makes this candidate stand out?
   - Rare skill combinations
   - Notable achievements
   - Industry recognition

5. JOB SEARCH STRATEGY
   - Generate 15-20 highly specific search queries
   - Include variations (title variations, skill-based, company-type based)
   - Consider both obvious and non-obvious job titles
   - Include niche searches that might surface hidden opportunities

6. TARGET COMPANIES
   - List 20+ specific companies that would be good fits
   - Include large pharma, mid-size biotech, and promising startups
   - Consider geographic preferences if mentioned

7. SALARY EXPECTATIONS
   - Estimate appropriate salary range based on experience
   - Consider geographic adjustments

Return as JSON:
{
  "summary": "Executive summary of candidate profile",
  "yearsExperience": number,
  "seniorityLevel": "Entry|Mid|Senior|Director|VP|C-Suite",
  "coreCompetencies": ["string"],
  "technicalSkills": ["string"],
  "therapeuticModalities": ["string"],
  "regulatoryExpertise": ["string"],
  "leadershipSkills": ["string"],
  "uniqueValueProps": ["string"],
  "searchQueries": [
    {
      "query": "search string",
      "rationale": "why this search",
      "priority": "high|medium|low"
    }
  ],
  "targetCompanies": [
    {
      "name": "company name",
      "type": "Large Pharma|Mid-size Biotech|Startup|CDMO|CRO",
      "rationale": "why good fit"
    }
  ],
  "targetLocations": ["string"],
  "salaryRange": {
    "min": number,
    "max": number,
    "currency": "USD"
  },
  "careerInsights": "Strategic advice for job search",
  "potentialChallenges": ["Areas that might need addressing"],
  "recommendedImprovements": ["Suggestions for resume/profile"]
}`
    },
    {
      role: 'user',
      content: `Perform a deep analysis of this resume and create a comprehensive job search strategy:\n\n${resumeText}`
    }
  ]
}

// Iterative Search Refinement Prompt
export function createSearchRefinementPrompt(resumeAnalysis, currentResults, searchHistory) {
  return [
    {
      role: 'system',
      content: `You are a job search optimization expert. Based on the search results so far, suggest refinements to find better matches.

Analyze:
1. Which searches yielded good results?
2. Which searches had poor results?
3. What patterns do you see in successful matches?
4. What new search angles should we try?

Return as JSON:
{
  "analysis": "Brief analysis of current results",
  "refinedQueries": [
    {
      "query": "new search string",
      "rationale": "why this might work better"
    }
  ],
  "dropQueries": ["queries that aren't working"],
  "insights": "Key observations about the job market for this candidate"
}`
    },
    {
      role: 'user',
      content: `
## Candidate Profile:
${JSON.stringify(resumeAnalysis, null, 2)}

## Search History:
${JSON.stringify(searchHistory, null, 2)}

## Current Results Summary:
${currentResults.length} jobs found

## Sample Results:
${JSON.stringify(currentResults.slice(0, 10).map(j => ({ title: j.title, company: j.company })), null, 2)}

Please suggest search refinements.`
    }
  ]
}

// Deep Job Analysis Prompt - Detailed matching with reasoning
export function createDeepJobAnalysisPrompt(resumeText, resumeAnalysis, jobs) {
  return [
    {
      role: 'system',
      content: `You are an expert career advisor performing DEEP ANALYSIS of job matches. For each job, provide:

1. MATCH SCORE (0-100)
   - Based on skills alignment, experience level, and cultural fit

2. DETAILED REASONING
   - Walk through why this is or isn't a good match
   - Consider both hard skills and soft factors

3. SKILLS ANALYSIS
   - Matching skills with evidence from resume
   - Missing skills and how critical they are
   - Transferable skills that could bridge gaps

4. FIT ASSESSMENT
   - Role level fit (over/under qualified?)
   - Company culture indicators
   - Growth potential

5. APPLICATION STRATEGY
   - Key points to emphasize in application
   - Potential concerns to address proactively
   - Networking suggestions

6. INTERVIEW PREPARATION
   - Likely technical questions
   - Behavioral questions to prepare for
   - Questions to ask the interviewer

Return as JSON:
{
  "matches": [
    {
      "jobId": "string",
      "score": number,
      "tier": "Top Match|Strong Match|Good Match|Stretch|Long Shot",
      "reasoning": "Detailed explanation of match score",
      "matchingSkills": [{"skill": "string", "evidence": "from resume"}],
      "missingSkills": [{"skill": "string", "criticality": "must-have|nice-to-have|learnable", "bridgeStrategy": "how to address"}],
      "fitAssessment": {
        "levelFit": "Under-qualified|Just Right|Over-qualified",
        "cultureFit": "assessment",
        "growthPotential": "assessment"
      },
      "applicationStrategy": {
        "keyPoints": ["what to emphasize"],
        "addressConcerns": ["proactive responses"],
        "networkingTips": ["suggestions"]
      },
      "interviewPrep": {
        "technicalQuestions": ["likely questions"],
        "behavioralQuestions": ["likely questions"],
        "questionsToAsk": ["good questions to ask"]
      },
      "recommendation": "Apply Now|Apply with Modifications|Consider|Skip",
      "urgency": "high|medium|low"
    }
  ],
  "overallStrategy": "Summary of recommended approach",
  "topPicks": ["jobId1", "jobId2", "jobId3"],
  "hiddenGems": ["jobIds that might be overlooked but worth considering"],
  "marketInsights": "Observations about the current job market based on these listings"
}`
    },
    {
      role: 'user',
      content: `
## MY RESUME:
${resumeText}

## RESUME ANALYSIS:
${JSON.stringify(resumeAnalysis, null, 2)}

## JOBS TO ANALYZE:
${jobs.map((job, idx) => `
### Job ${idx + 1} (ID: ${job.id})
**Title:** ${job.title}
**Company:** ${job.company}
**Location:** ${job.location}
**Salary:** ${job.salary || 'Not specified'}
**Type:** ${job.jobType || 'Not specified'}
**Posted:** ${job.postedDate || 'Unknown'}
**Description:** ${job.description || 'No description available'}
`).join('\n')}

Perform deep analysis of each job match.`
    }
  ]
}

// Main Deep Research Function
export async function performDeepResearch(
  resumeText,
  llmSettings,
  jobAPISettings,
  onProgress
) {
  const results = {
    resumeAnalysis: null,
    allJobs: [],
    matchAnalysis: null,
    searchQueries: [],
    errors: [],
    stats: {
      totalSearches: 0,
      totalJobsFound: 0,
      uniqueJobs: 0,
      topMatches: 0
    }
  }

  try {
    // Step 1: Deep Resume Analysis
    onProgress({ step: 1, total: 5, message: 'Analyzing your resume in depth...', progress: 10 })

    const analysisPrompt = createDeepResumeAnalysisPrompt(resumeText)
    const analysisResponse = await callLLM(llmSettings, analysisPrompt)

    const analysisJson = analysisResponse.match(/\{[\s\S]*\}/)
    if (analysisJson) {
      results.resumeAnalysis = JSON.parse(analysisJson[0])
    } else {
      throw new Error('Failed to parse resume analysis')
    }

    // Step 2: Execute Search Strategy
    onProgress({ step: 2, total: 5, message: 'Executing multi-query search strategy...', progress: 30 })

    const searchQueries = results.resumeAnalysis.searchQueries || []
    const highPriorityQueries = searchQueries.filter(q => q.priority === 'high').slice(0, 5)
    const mediumPriorityQueries = searchQueries.filter(q => q.priority === 'medium').slice(0, 3)
    const queriesToRun = [...highPriorityQueries, ...mediumPriorityQueries]

    results.searchQueries = queriesToRun.map(q => q.query)

    // Run searches
    const allJobResults = []
    const targetLocations = results.resumeAnalysis.targetLocations || ['']

    for (let i = 0; i < queriesToRun.length; i++) {
      const query = queriesToRun[i]
      onProgress({
        step: 2,
        total: 5,
        message: `Searching: "${query.query.substring(0, 40)}..."`,
        progress: 30 + (i / queriesToRun.length) * 30,
        detail: `Query ${i + 1} of ${queriesToRun.length}`
      })

      try {
        const location = targetLocations[0] || ''
        const jobs = await searchJobs(jobAPISettings, query.query, location)
        allJobResults.push(...jobs)
        results.stats.totalSearches++
      } catch (error) {
        results.errors.push(`Search "${query.query}" failed: ${error.message}`)
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    results.stats.totalJobsFound = allJobResults.length

    // Step 3: Deduplicate and Rank
    onProgress({ step: 3, total: 5, message: 'Processing and deduplicating results...', progress: 65 })

    // Deduplicate by job ID and title+company combination
    const seen = new Set()
    const uniqueJobs = allJobResults.filter(job => {
      const key1 = job.id
      const key2 = `${job.title}|${job.company}`.toLowerCase()
      if (seen.has(key1) || seen.has(key2)) return false
      seen.add(key1)
      seen.add(key2)
      return true
    })

    results.allJobs = uniqueJobs
    results.stats.uniqueJobs = uniqueJobs.length

    // Step 4: Deep Job Analysis (top 15 jobs)
    onProgress({ step: 4, total: 5, message: 'Performing deep match analysis with AI...', progress: 75 })

    if (uniqueJobs.length > 0) {
      const jobsToAnalyze = uniqueJobs.slice(0, 15)
      const matchPrompt = createDeepJobAnalysisPrompt(resumeText, results.resumeAnalysis, jobsToAnalyze)
      const matchResponse = await callLLM(llmSettings, matchPrompt)

      const matchJson = matchResponse.match(/\{[\s\S]*\}/)
      if (matchJson) {
        results.matchAnalysis = JSON.parse(matchJson[0])
        results.stats.topMatches = results.matchAnalysis.matches?.filter(m => m.score >= 70).length || 0
      }
    }

    // Step 5: Save to history and finalize
    onProgress({ step: 5, total: 5, message: 'Finalizing research results...', progress: 95 })

    // Save to research history
    const historyEntry = {
      date: new Date().toISOString(),
      jobCount: results.stats.uniqueJobs,
      topMatches: results.stats.topMatches,
      queries: results.searchQueries.length
    }

    const history = loadResearchHistory()
    history.unshift(historyEntry)
    saveResearchHistory(history)

    // Save last search for comparison
    saveLastSearch({
      date: new Date().toISOString(),
      jobIds: results.allJobs.map(j => j.id)
    })

    onProgress({ step: 5, total: 5, message: 'Research complete!', progress: 100 })

  } catch (error) {
    results.errors.push(`Research failed: ${error.message}`)
    throw error
  }

  return results
}

// Find new jobs since last search
export function findNewJobs(currentJobs) {
  const lastSearch = loadLastSearch()
  if (!lastSearch) return currentJobs

  const previousIds = new Set(lastSearch.jobIds)
  return currentJobs.filter(job => !previousIds.has(job.id))
}

// Get research statistics
export function getResearchStats() {
  const history = loadResearchHistory()

  if (history.length === 0) {
    return {
      totalSearches: 0,
      avgJobsPerSearch: 0,
      avgTopMatches: 0,
      lastSearchDate: null,
      searchStreak: 0
    }
  }

  const totalJobs = history.reduce((sum, h) => sum + h.jobCount, 0)
  const totalMatches = history.reduce((sum, h) => sum + h.topMatches, 0)

  // Calculate search streak (consecutive days)
  let streak = 0
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

  for (const entry of history) {
    const entryDate = new Date(entry.date).toDateString()
    if (streak === 0 && (entryDate === today || entryDate === yesterday)) {
      streak = 1
    } else if (streak > 0) {
      const expectedDate = new Date(Date.now() - streak * 24 * 60 * 60 * 1000).toDateString()
      if (entryDate === expectedDate) {
        streak++
      } else {
        break
      }
    }
  }

  return {
    totalSearches: history.length,
    avgJobsPerSearch: Math.round(totalJobs / history.length),
    avgTopMatches: Math.round(totalMatches / history.length),
    lastSearchDate: history[0]?.date,
    searchStreak: streak
  }
}
