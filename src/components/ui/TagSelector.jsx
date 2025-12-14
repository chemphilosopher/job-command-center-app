import { useState } from 'react'
import { Tag } from 'lucide-react'
import { TAG_OPTIONS } from '../../constants'

/**
 * Tag selector component with multi-select and custom tag support
 */
function TagSelector({ tags = [], onChange, availableTags = TAG_OPTIONS }) {
  const [isOpen, setIsOpen] = useState(false)
  const [customTag, setCustomTag] = useState('')

  const handleAddCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      onChange([...tags, customTag.trim()])
      setCustomTag('')
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <Tag className="w-4 h-4" />
        Tags ({tags.length})
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <div className="space-y-2">
            {availableTags.map(tag => (
              <label key={tag} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tags.includes(tag)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...tags, tag])
                    } else {
                      onChange(tags.filter(t => t !== tag))
                    }
                  }}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{tag}</span>
              </label>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
                placeholder="Custom tag..."
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="px-2 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
              >
                Add
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="mt-2 w-full px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Done
          </button>
        </div>
      )}
    </div>
  )
}

export default TagSelector
