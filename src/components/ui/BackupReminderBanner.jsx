import { Download, X } from 'lucide-react'
import { STORAGE_KEYS } from '../../services/storageService'

/**
 * Backup Reminder Banner Component
 * Shows when user hasn't backed up data recently
 */
function BackupReminderBanner({ onBackup, onDismiss, applicationCount }) {
  const lastBackup = localStorage.getItem(STORAGE_KEYS.LAST_BACKUP)
  const isFirstBackup = !lastBackup

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">
                {isFirstBackup
                  ? `You have ${applicationCount} applications - time to create your first backup!`
                  : `It's been a while since your last backup`
                }
              </p>
              <p className="text-sm text-amber-100">
                Your data is stored in your browser. Export a backup to keep it safe.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBackup}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-amber-600 font-medium rounded-lg hover:bg-amber-50 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Backup Now
            </button>
            <button
              onClick={onDismiss}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Remind me later"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BackupReminderBanner
