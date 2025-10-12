import React, { useState } from 'react'

const Filters = ({ filters, onFilterChange, travelData = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Ensure travelData is always an array
  const safeTravelData = Array.isArray(travelData) ? travelData : []
  
  // Get unique dates and destinations for filter options
  const uniqueDates = [...new Set(safeTravelData.map(item => item.travelDate))].sort()
  const uniqueDestinations = [...new Set(safeTravelData.map(item => item.place))].sort()

  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value })
  }

  const handleDateChange = (e) => {
    onFilterChange({ date: e.target.value })
  }

  const handleDestinationChange = (e) => {
    onFilterChange({ destination: e.target.value })
  }

  const clearFilters = () => {
    onFilterChange({ search: '', date: '', destination: '' })
  }

  const hasActiveFilters = (filters?.search || filters?.date || filters?.destination) || false

  return (
    <div className="filters">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Filters</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={clearFilters} className="clear-btn" disabled={!hasActiveFilters}>
            Clear All
          </button>
          <button 
            onClick={() => setIsExpanded(false)} 
            className="close-btn"
            style={{ display: isExpanded ? 'block' : 'none' }}
          >
            ✕
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="mobile-toggle-btn"
            style={{ display: 'none' }}
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>
      </div>

      <div className={`filter-content ${isExpanded ? 'expanded' : ''}`}>
        <div className="filter-row">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search by name, place, or contact..."
              value={filters?.search || ''}
              onChange={handleSearchChange}
            />
          </div>

          <div className="filter-group">
            <label>Travel Date</label>
            <select value={filters?.date || ''} onChange={handleDateChange}>
              <option value="">All Dates</option>
              {uniqueDates.map(date => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Destination</label>
            <select value={filters?.destination || ''} onChange={handleDestinationChange}>
              <option value="">All Destinations</option>
              {uniqueDestinations.map(destination => (
                <option key={destination} value={destination}>
                  {destination}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.375rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Total Records:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#3b82f6' }}>{safeTravelData.length}</span>
          </div>
          {hasActiveFilters && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
              Filters active - showing refined results
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Filters