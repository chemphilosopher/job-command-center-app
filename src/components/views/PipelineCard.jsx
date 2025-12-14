import { Clock, ChevronDown, FileText, ExternalLink } from 'lucide-react'

/**
 * Pipeline Card Component
 * Individual application card for the Kanban-style pipeline view
 */
function PipelineCard({ app, onStatusUpdate, onEdit, getRegionColor }) {
  const daysInStatus = () => {
    const lastStatusChange = app.statusHistory?.[app.statusHistory.length - 1]
    if (!lastStatusChange) return 0
    const diffTime = Math.abs(new Date() - new Date(lastStatusChange.date))
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-gray-900 text-sm leading-tight">{app.company}</h4>
        {app.jobUrl && (
          <a
            href={app.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-indigo-600 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{app.title}</p>
      {app.region && (
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${getRegionColor(app.region)}`}>
          {app.region}
        </span>
      )}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {daysInStatus()}d
        </span>
        <div className="flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onStatusUpdate(app); }}
            className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
            title="Update status"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(app); }}
            className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
            title="Edit"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PipelineCard
