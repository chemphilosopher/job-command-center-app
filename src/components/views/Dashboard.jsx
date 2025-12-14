import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Calendar, Clock, AlertCircle, XCircle, TrendingUp } from 'lucide-react'
import { REGION_OPTIONS, COMPANY_TYPE_OPTIONS, CHART_COLORS, REGION_CHART_COLORS } from '../../constants'
import { getStatusColor } from '../../utils/statusUtils'

export default function Dashboard({ applications, resumeVersions }) {
  // Calculate metrics
  const totalApps = applications.length
  const activeApps = applications.filter(a => !['Rejected', 'Withdrawn', 'Offer', 'Ghost'].includes(a.status)).length
  const responseRate = totalApps > 0
    ? Math.round((applications.filter(a => a.status !== 'Applied').length / totalApps) * 100)
    : 0

  // Average days to first response
  const appsWithResponse = applications.filter(a =>
    a.statusHistory && a.statusHistory.length > 1
  )
  const avgDaysToResponse = appsWithResponse.length > 0
    ? Math.round(appsWithResponse.reduce((sum, app) => {
        const applied = new Date(app.statusHistory[0].date)
        const firstResponse = new Date(app.statusHistory[1].date)
        return sum + (firstResponse - applied) / (1000 * 60 * 60 * 24)
      }, 0) / appsWithResponse.length)
    : 0

  // Interviews this week
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const interviewsThisWeek = applications.filter(a =>
    ['Phone Screen', 'Technical', 'Onsite'].includes(a.status) &&
    new Date(a.statusHistory?.[a.statusHistory.length - 1]?.date) >= weekAgo
  ).length

  // Phone screens count (current + completed)
  const phoneScreens = applications.filter(a =>
    a.status === 'Phone Screen' ||
    a.statusHistory?.some(h => h.status === 'Phone Screen')
  ).length

  // Onsite/Final interviews count (current + completed)
  const onsiteInterviews = applications.filter(a =>
    a.status === 'Onsite' ||
    a.status === 'Technical' ||
    a.statusHistory?.some(h => h.status === 'Onsite' || h.status === 'Technical')
  ).length

  // Status funnel data
  const statusOrder = ['Applied', 'Reviewed', 'Phone Screen', 'Technical', 'Onsite', 'Offer']
  const funnelData = statusOrder.map((status, idx) => {
    const count = applications.filter(a => {
      const statusIndex = statusOrder.indexOf(a.status)
      return statusIndex >= idx || (a.status === 'Rejected' && a.statusHistory?.some(h => h.status === status))
    }).length
    return { name: status, value: count, fill: CHART_COLORS[idx] }
  })

  // Geographic breakdown
  const regionData = REGION_OPTIONS.map(region => ({
    name: region,
    total: applications.filter(a => a.region === region).length,
    responded: applications.filter(a => a.region === region && a.status !== 'Applied').length
  })).filter(r => r.total > 0)

  const regionResponseRates = regionData.map(r => ({
    ...r,
    responseRate: r.total > 0 ? Math.round((r.responded / r.total) * 100) : 0
  }))

  // Weekly trend (last 8 weeks)
  const weeklyData = []
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000)
    const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
    const weekLabel = `Week ${8 - i}`

    const applied = applications.filter(a => {
      const date = new Date(a.dateApplied)
      return date >= weekStart && date < weekEnd
    }).length

    const responses = applications.filter(a => {
      if (!a.statusHistory || a.statusHistory.length < 2) return false
      const responseDate = new Date(a.statusHistory[1].date)
      return responseDate >= weekStart && responseDate < weekEnd
    }).length

    weeklyData.push({ week: weekLabel, applications: applied, responses })
  }

  // Resume version performance
  const resumePerformance = resumeVersions.map(version => {
    const usedApps = applications.filter(a => a.resumeVersion === version.id)
    const responded = usedApps.filter(a => a.status !== 'Applied').length
    return {
      name: version.name,
      timesUsed: usedApps.length,
      responseRate: usedApps.length > 0 ? Math.round((responded / usedApps.length) * 100) : 0
    }
  }).filter(r => r.timesUsed > 0)

  // Company type analysis
  const companyTypeData = COMPANY_TYPE_OPTIONS.map(type => {
    const typeApps = applications.filter(a => a.companyType === type)
    const responded = typeApps.filter(a => a.status !== 'Applied').length
    return {
      name: type,
      total: typeApps.length,
      responseRate: typeApps.length > 0 ? Math.round((responded / typeApps.length) * 100) : 0
    }
  }).filter(c => c.total > 0)

  // Action items
  const needsFollowUp = applications.filter(a => {
    if (['Rejected', 'Withdrawn', 'Offer', 'Ghost'].includes(a.status)) return false
    const lastContact = new Date(a.lastContactDate || a.dateApplied)
    const daysSinceContact = (now - lastContact) / (1000 * 60 * 60 * 24)
    return daysSinceContact >= 7
  })

  const recentlyRejected = applications.filter(a => {
    if (a.status !== 'Rejected') return false
    const lastStatus = a.statusHistory?.[a.statusHistory.length - 1]
    if (!lastStatus) return false
    const rejectedDate = new Date(lastStatus.date)
    return (now - rejectedDate) / (1000 * 60 * 60 * 24) <= 7
  })

  // Scheduled follow-ups
  const today = new Date().toISOString().split('T')[0]
  const scheduledFollowUps = applications
    .filter(a => a.nextFollowUpDate && !['Rejected', 'Withdrawn', 'Offer', 'Ghost'].includes(a.status))
    .map(a => ({
      ...a,
      isOverdue: a.nextFollowUpDate < today,
      isDueToday: a.nextFollowUpDate === today,
      daysUntilDue: Math.ceil((new Date(a.nextFollowUpDate) - now) / (1000 * 60 * 60 * 24))
    }))
    .sort((a, b) => new Date(a.nextFollowUpDate) - new Date(b.nextFollowUpDate))

  const overdueFollowUps = scheduledFollowUps.filter(a => a.isOverdue)
  const todayFollowUps = scheduledFollowUps.filter(a => a.isDueToday)
  const upcomingFollowUps = scheduledFollowUps.filter(a => !a.isOverdue && !a.isDueToday && a.daysUntilDue <= 7)

  // Ghost count
  const ghostCount = applications.filter(a => a.status === 'Ghost').length

  // Rejection Analytics
  const rejectedApps = applications.filter(a => a.status === 'Rejected')
  const rejectedWithData = rejectedApps.filter(a => a.rejection)

  // Rejection by stage
  const rejectionByStage = [
    'Resume Screen', 'Phone Screen', 'Technical Interview', 'Onsite Interview',
    'Final Round', 'Offer Stage', 'Unknown'
  ].map(stage => ({
    name: stage,
    count: rejectedWithData.filter(a => a.rejection?.stage === stage).length
  })).filter(s => s.count > 0)

  // Rejection by reason
  const rejectionByReason = [
    'Skills Gap', 'Experience Level', 'Culture Fit', 'Better Candidate',
    'Salary Expectations', 'Position Filled', 'Position Cancelled', 'Internal Candidate', 'Unknown'
  ].map(reason => ({
    name: reason,
    count: rejectedWithData.filter(a => a.rejection?.reason === reason).length
  })).filter(r => r.count > 0)

  // Aggregate learnings from rejections
  const allLearnings = rejectedWithData
    .flatMap(a => a.rejection?.learnings || [])
    .filter(Boolean)

  // Count learning frequency
  const learningCounts = allLearnings.reduce((acc, learning) => {
    const normalized = learning.toLowerCase().trim()
    acc[normalized] = (acc[normalized] || 0) + 1
    return acc
  }, {})

  const topLearnings = Object.entries(learningCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([learning, count]) => ({ learning, count }))

  // Quality metrics comparison
  const customizedApps = applications.filter(a => a.quality?.customResume || a.quality?.customCoverLetter)
  const quickApplyApps = applications.filter(a => !a.quality?.customResume && !a.quality?.customCoverLetter)
  const customizedResponseRate = customizedApps.length > 0
    ? Math.round((customizedApps.filter(a => a.status !== 'Applied').length / customizedApps.length) * 100)
    : 0
  const quickApplyResponseRate = quickApplyApps.length > 0
    ? Math.round((quickApplyApps.filter(a => a.status !== 'Applied').length / quickApplyApps.length) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Applications</p>
          <p className="text-2xl font-bold text-gray-900">{totalApps}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Response Rate</p>
          <p className="text-2xl font-bold text-indigo-600">{responseRate}%</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">{activeApps}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Phone Screens</p>
          <p className="text-2xl font-bold text-amber-600">{phoneScreens}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Onsite/Final</p>
          <p className="text-2xl font-bold text-pink-600">{onsiteInterviews}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Avg Days to Response</p>
          <p className="text-2xl font-bold text-blue-600">{avgDaysToResponse}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Interviews This Week</p>
          <p className="text-2xl font-bold text-purple-600">{interviewsThisWeek}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Ghosted</p>
          <p className="text-2xl font-bold text-gray-400">{ghostCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Funnel */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Funnel</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" radius={[0, 4, 4, 0]}>
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Geographic Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications by Region</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="total"
                nameKey="name"
                label={({ name, total }) => `${name}: ${total}`}
              >
                {regionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={REGION_CHART_COLORS[entry.name] || CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="applications" stroke="#4F46E5" strokeWidth={2} name="Applied" />
              <Line type="monotone" dataKey="responses" stroke="#10B981" strokeWidth={2} name="Responses" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Response Rate by Region */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Rate by Region</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={regionResponseRates}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
              <YAxis unit="%" />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="responseRate" fill="#10B981" radius={[4, 4, 0, 0]} name="Response Rate">
                {regionResponseRates.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={REGION_CHART_COLORS[entry.name] || CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Version Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Version Performance</h3>
          {resumePerformance.length > 0 ? (
            <div className="space-y-3">
              {resumePerformance.map((resume, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{resume.name}</p>
                    <p className="text-sm text-gray-500">Used {resume.timesUsed} times</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${resume.responseRate >= 30 ? 'text-green-600' : resume.responseRate >= 15 ? 'text-yellow-600' : 'text-gray-600'}`}>
                      {resume.responseRate}%
                    </p>
                    <p className="text-xs text-gray-500">response rate</p>
                  </div>
                </div>
              ))}
              {resumePerformance.length > 1 && (
                <p className="text-sm text-indigo-600 mt-2">
                  Best performing: {resumePerformance.sort((a, b) => b.responseRate - a.responseRate)[0]?.name}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No resume data yet</p>
          )}
        </div>

        {/* Company Type Analysis */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Rate by Company Type</h3>
          {companyTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={companyTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" unit="%" />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="responseRate" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="Response Rate" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No data yet</p>
          )}
        </div>
      </div>

      {/* Quality Metrics Comparison */}
      {(customizedApps.length > 0 || quickApplyApps.length > 0) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            What's Working: Application Quality
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <h4 className="text-sm font-medium text-green-800 mb-2">Customized Applications</h4>
              <p className="text-3xl font-bold text-green-600">{customizedResponseRate}%</p>
              <p className="text-sm text-gray-600 mt-1">response rate ({customizedApps.length} applications)</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Apply</h4>
              <p className="text-3xl font-bold text-gray-600">{quickApplyResponseRate}%</p>
              <p className="text-sm text-gray-600 mt-1">response rate ({quickApplyApps.length} applications)</p>
            </div>
          </div>
          {customizedResponseRate > quickApplyResponseRate && customizedApps.length >= 3 && (
            <p className="text-sm text-green-700 mt-4 p-3 bg-green-50 rounded-lg">
              Customized applications are outperforming quick-apply by {customizedResponseRate - quickApplyResponseRate}%!
            </p>
          )}
        </div>
      )}

      {/* Rejection Learning Analytics */}
      {rejectedApps.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            Rejection Patterns & Learnings
            <span className="text-sm font-normal text-gray-500">({rejectedApps.length} total, {rejectedWithData.length} with details)</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* By Stage */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Rejection Stage</h4>
              {rejectionByStage.length > 0 ? (
                <div className="space-y-2">
                  {rejectionByStage.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-red-400 h-full rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${Math.max(20, (item.count / rejectedWithData.length) * 100)}%` }}
                        >
                          <span className="text-xs text-white font-medium">{item.count}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 w-24 truncate" title={item.name}>{item.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No stage data logged</p>
              )}
            </div>

            {/* By Reason */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Rejection Reason</h4>
              {rejectionByReason.length > 0 ? (
                <div className="space-y-2">
                  {rejectionByReason.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-orange-400 h-full rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${Math.max(20, (item.count / rejectedWithData.length) * 100)}%` }}
                        >
                          <span className="text-xs text-white font-medium">{item.count}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 w-24 truncate" title={item.name}>{item.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No reason data logged</p>
              )}
            </div>

            {/* Learnings */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Top Learnings</h4>
              {topLearnings.length > 0 ? (
                <div className="space-y-2">
                  {topLearnings.map((item, idx) => (
                    <div key={idx} className="p-2 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-sm text-gray-800 capitalize">{item.learning}</p>
                      {item.count > 1 && (
                        <p className="text-xs text-yellow-700 mt-1">Mentioned {item.count} times</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No learnings logged yet. Add learnings when logging rejections!</p>
              )}
            </div>
          </div>

          {rejectedWithData.length < rejectedApps.length && (
            <p className="text-sm text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
              {rejectedApps.length - rejectedWithData.length} rejections don't have detailed data. Use "Update Status" to add rejection details and learnings.
            </p>
          )}
        </div>
      )}

      {/* Scheduled Follow-ups */}
      {(overdueFollowUps.length > 0 || todayFollowUps.length > 0 || upcomingFollowUps.length > 0) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Scheduled Follow-ups
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overdue */}
            <div className={`rounded-lg p-4 ${overdueFollowUps.length > 0 ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
              <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Overdue ({overdueFollowUps.length})
              </h4>
              {overdueFollowUps.length > 0 ? (
                <div className="space-y-2">
                  {overdueFollowUps.slice(0, 3).map(app => (
                    <div key={app.id} className="bg-white p-2 rounded border border-red-100">
                      <p className="font-medium text-gray-900 text-sm">{app.company}</p>
                      <p className="text-xs text-gray-500">{app.title}</p>
                      <p className="text-xs text-red-600 mt-1">
                        Due: {new Date(app.nextFollowUpDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {overdueFollowUps.length > 3 && (
                    <p className="text-xs text-red-600">+{overdueFollowUps.length - 3} more</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No overdue items</p>
              )}
            </div>

            {/* Today */}
            <div className={`rounded-lg p-4 ${todayFollowUps.length > 0 ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'}`}>
              <h4 className="text-sm font-medium text-orange-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Due Today ({todayFollowUps.length})
              </h4>
              {todayFollowUps.length > 0 ? (
                <div className="space-y-2">
                  {todayFollowUps.slice(0, 3).map(app => (
                    <div key={app.id} className="bg-white p-2 rounded border border-orange-100">
                      <p className="font-medium text-gray-900 text-sm">{app.company}</p>
                      <p className="text-xs text-gray-500">{app.title}</p>
                      {app.followUpNotes && (
                        <p className="text-xs text-gray-600 mt-1 truncate">{app.followUpNotes}</p>
                      )}
                    </div>
                  ))}
                  {todayFollowUps.length > 3 && (
                    <p className="text-xs text-orange-600">+{todayFollowUps.length - 3} more</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Nothing due today</p>
              )}
            </div>

            {/* Upcoming */}
            <div className="rounded-lg p-4 bg-blue-50 border border-blue-200">
              <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Next 7 Days ({upcomingFollowUps.length})
              </h4>
              {upcomingFollowUps.length > 0 ? (
                <div className="space-y-2">
                  {upcomingFollowUps.slice(0, 3).map(app => (
                    <div key={app.id} className="bg-white p-2 rounded border border-blue-100">
                      <p className="font-medium text-gray-900 text-sm">{app.company}</p>
                      <p className="text-xs text-gray-500">{app.title}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        In {app.daysUntilDue} day{app.daysUntilDue !== 1 ? 's' : ''}
                      </p>
                    </div>
                  ))}
                  {upcomingFollowUps.length > 3 && (
                    <p className="text-xs text-blue-600">+{upcomingFollowUps.length - 3} more</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No upcoming follow-ups</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Items */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Needs Follow-up */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              Needs Follow-up (7+ days)
            </h4>
            {needsFollowUp.length > 0 ? (
              <div className="space-y-2">
                {needsFollowUp.slice(0, 5).map(app => (
                  <div key={app.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-100">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{app.company}</p>
                      <p className="text-xs text-gray-500">{app.title}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
                {needsFollowUp.length > 5 && (
                  <p className="text-sm text-gray-500">+{needsFollowUp.length - 5} more</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-4">All applications are up to date!</p>
            )}
          </div>

          {/* Recently Rejected */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              Recently Rejected (Last 7 days)
            </h4>
            {recentlyRejected.length > 0 ? (
              <div className="space-y-2">
                {recentlyRejected.slice(0, 5).map(app => (
                  <div key={app.id} className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-100">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{app.company}</p>
                      <p className="text-xs text-gray-500">{app.title}</p>
                    </div>
                    {app.feedbackReceived && (
                      <span className="text-xs text-gray-500 max-w-32 truncate" title={app.feedbackReceived}>
                        {app.feedbackReceived}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-4">No recent rejections</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
