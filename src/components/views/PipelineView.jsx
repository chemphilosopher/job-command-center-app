import PipelineCard from './PipelineCard'
import { PIPELINE_STATUSES } from '../../constants'

/**
 * Pipeline View Component
 * Kanban-style board showing applications organized by status
 */
function PipelineView({ applications, onStatusUpdate, onEdit, getRegionColor, getStatusColor }) {
  const getApplicationsByStatus = (status) => {
    return applications.filter(app => app.status === status)
  }

  return (
    <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-4 min-w-max">
        {PIPELINE_STATUSES.map(status => {
          const statusApps = getApplicationsByStatus(status)
          return (
            <div key={status} className="w-64 flex-shrink-0">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-700 text-sm">{status}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {statusApps.length}
                  </span>
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {statusApps.map(app => (
                    <PipelineCard
                      key={app.id}
                      app={app}
                      onStatusUpdate={onStatusUpdate}
                      onEdit={onEdit}
                      getRegionColor={getRegionColor}
                    />
                  ))}
                  {statusApps.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No applications
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PipelineView
