import { useState } from 'react'
import { X } from 'lucide-react'
import {
  STATUS_OPTIONS,
  REJECTION_STAGE_OPTIONS,
  REJECTION_REASON_OPTIONS
} from '../../constants'
import { formatDate } from '../../utils'

/**
 * Status Update Modal Component
 * Allows changing application status with optional rejection tracking
 */
function StatusUpdateModal({ application, onClose, onUpdate }) {
  const [newStatus, setNewStatus] = useState(application?.status || '')
  const [statusDate, setStatusDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [rejection, setRejection] = useState({
    stage: application?.rejection?.stage || '',
    reason: application?.rejection?.reason || '',
    feedbackVerbatim: application?.rejection?.feedbackVerbatim || '',
    learnings: application?.rejection?.learnings || [],
    actionItems: application?.rejection?.actionItems || []
  })
  const [newLearning, setNewLearning] = useState('')
  const [newActionItem, setNewActionItem] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newStatus && newStatus !== application.status) {
      const rejectionData = newStatus === 'Rejected' ? rejection : null
      onUpdate(application.id, newStatus, notes, rejectionData, statusDate)
    }
    onClose()
  }

  const addLearning = () => {
    if (newLearning.trim()) {
      setRejection(prev => ({ ...prev, learnings: [...prev.learnings, newLearning.trim()] }))
      setNewLearning('')
    }
  }

  const addActionItem = () => {
    if (newActionItem.trim()) {
      setRejection(prev => ({ ...prev, actionItems: [...prev.actionItems, newActionItem.trim()] }))
      setNewActionItem('')
    }
  }

  if (!application) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className={`relative bg-white rounded-xl shadow-2xl w-full ${newStatus === 'Rejected' ? 'max-w-xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto`}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Update Status</h2>
            <p className="text-sm text-gray-500">{application.company} - {application.title}</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setNewStatus(status)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      newStatus === status
                        ? status === 'Rejected' || status === 'Ghost'
                          ? 'bg-red-100 border-red-300 text-red-700'
                          : 'bg-indigo-100 border-indigo-300 text-indigo-700'
                        : status === application.status
                        ? 'bg-gray-100 border-gray-300 text-gray-500'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Status Change
              </label>
              <input
                type="date"
                value={statusDate}
                onChange={(e) => setStatusDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                When did this status change occur?
              </p>
            </div>

            {/* Rejection Details - only shown when Rejected is selected */}
            {newStatus === 'Rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-red-900">Rejection Learning Log</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stage Rejected</label>
                    <select
                      value={rejection.stage}
                      onChange={(e) => setRejection(prev => ({ ...prev, stage: e.target.value }))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select stage...</option>
                      {REJECTION_STAGE_OPTIONS.map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <select
                      value={rejection.reason}
                      onChange={(e) => setRejection(prev => ({ ...prev, reason: e.target.value }))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select reason...</option>
                      {REJECTION_REASON_OPTIONS.map(reason => (
                        <option key={reason} value={reason}>{reason}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Received (verbatim)</label>
                  <textarea
                    value={rejection.feedbackVerbatim}
                    onChange={(e) => setRejection(prev => ({ ...prev, feedbackVerbatim: e.target.value }))}
                    rows={2}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Copy any feedback from the rejection email..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Learnings</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newLearning}
                      onChange={(e) => setNewLearning(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLearning())}
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="What did you learn from this rejection?"
                    />
                    <button
                      type="button"
                      onClick={addLearning}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                    >
                      Add
                    </button>
                  </div>
                  {rejection.learnings.length > 0 && (
                    <ul className="space-y-1">
                      {rejection.learnings.map((learning, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-white p-2 rounded">
                          <span className="flex-1">{learning}</span>
                          <button
                            type="button"
                            onClick={() => setRejection(prev => ({
                              ...prev,
                              learnings: prev.learnings.filter((_, i) => i !== idx)
                            }))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action Items</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newActionItem}
                      onChange={(e) => setNewActionItem(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addActionItem())}
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="What will you do differently?"
                    />
                    <button
                      type="button"
                      onClick={addActionItem}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                    >
                      Add
                    </button>
                  </div>
                  {rejection.actionItems.length > 0 && (
                    <ul className="space-y-1">
                      {rejection.actionItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-white p-2 rounded">
                          <span className="flex-1">{item}</span>
                          <button
                            type="button"
                            onClick={() => setRejection(prev => ({
                              ...prev,
                              actionItems: prev.actionItems.filter((_, i) => i !== idx)
                            }))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add notes about this status change..."
              />
            </div>

            {/* Status History */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status History</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {application.statusHistory?.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">{entry.status}</span>
                      <span className="text-gray-500 ml-2">{formatDate(entry.date)}</span>
                      {entry.notes && <p className="text-gray-500 text-xs">{entry.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newStatus || newStatus === application.status}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Status
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default StatusUpdateModal
