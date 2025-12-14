import { useState } from 'react'
import { Search, Filter } from 'lucide-react'

/**
 * Filter bar component for searching and filtering applications
 */
function FilterBar({ filters, setFilters, applications, searchInputRef }) {
  const [showFilters, setShowFilters] = useState(false)

  const uniqueRegions = [...new Set(applications.map(a => a.region).filter(Boolean))]
  const uniqueStatuses = [...new Set(applications.map(a => a.status))]

  const activeFilterCount = [
    filters.search,
    filters.status.length > 0,
    filters.region.length > 0
  ].filter(Boolean).length

  const clearFilters = () => {
    setFilters({ search: '', status: [], region: [] })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Search company, title..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
            showFilters || activeFilterCount > 0
              ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {uniqueStatuses.map(status => (
                <button
                  key={status}
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      status: prev.status.includes(status)
                        ? prev.status.filter(s => s !== status)
                        : [...prev.status, status]
                    }))
                  }}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filters.status.includes(status)
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <div className="flex flex-wrap gap-2">
              {uniqueRegions.map(region => (
                <button
                  key={region}
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      region: prev.region.includes(region)
                        ? prev.region.filter(r => r !== region)
                        : [...prev.region, region]
                    }))
                  }}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filters.region.includes(region)
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterBar
