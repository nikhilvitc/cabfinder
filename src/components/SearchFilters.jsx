import React, { useEffect, useState } from 'react'

export default function SearchFilters({
  filters,
  matchRange,
  travelData,
  filteredCount,
  onFilterChange,
  onMatchRangeChange,
  onClear,
}) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const hasFilters = Boolean(
    filters?.search?.trim() || filters?.date || filters?.destination
  )

  const dates = [...new Set((travelData || []).map((item) => item.travelDate).filter(Boolean))].sort()
  const destinations = [...new Set((travelData || []).map((item) => item.place).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })
  )

  useEffect(() => {
    const syncMobileState = () => {
      if (window.innerWidth > 768) {
        setIsMobileFiltersOpen(true)
      } else {
        setIsMobileFiltersOpen(false)
      }
    }

    syncMobileState()
    window.addEventListener('resize', syncMobileState)
    return () => window.removeEventListener('resize', syncMobileState)
  }, [])

  return (
    <section className="filters-panel animate-fade-in-up">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
            Find a ride
          </h2>
          <p className="text-sm text-slate-500">
            {filteredCount} listing{filteredCount !== 1 ? 's' : ''} match your filters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            disabled={!hasFilters}
            className="btn-clear-filter text-sm disabled:pointer-events-none disabled:opacity-40"
          >
            Reset filters
          </button>
          <button
            type="button"
            className="mobile-filter-toggle"
            onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
            aria-expanded={isMobileFiltersOpen}
          >
            {isMobileFiltersOpen ? 'Hide filters' : 'Show filters'}
          </button>
        </div>
      </div>

      <div className={`filters-content ${isMobileFiltersOpen ? 'expanded' : 'collapsed'}`}>
        <div className="filter-grid mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Search</span>
            <input
              type="search"
              placeholder="Name, place, contact…"
              value={filters?.search || ''}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="input-glass w-full"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Travel date</span>
            <select
              value={filters?.date || ''}
              onChange={(e) => onFilterChange({ date: e.target.value })}
              className="select-glass w-full"
            >
              <option value="">All dates</option>
              {dates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 sm:col-span-2 lg:col-span-2">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Destination</span>
            <select
              value={filters?.destination || ''}
              onChange={(e) => onFilterChange({ destination: e.target.value })}
              className="select-glass w-full"
            >
              <option value="">All destinations</option>
              {destinations.map((dest) => (
                <option key={dest} value={dest}>
                  {dest}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="matching-window-card mt-5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Matching window</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium text-slate-600">Minutes before your time</span>
              <input
                type="number"
                min="0"
                max="720"
                value={matchRange?.minutesBefore ?? 60}
                onChange={(e) => onMatchRangeChange({ minutesBefore: e.target.value })}
                className="input-glass w-full"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium text-slate-600">Minutes after your time</span>
              <input
                type="number"
                min="0"
                max="720"
                value={matchRange?.minutesAfter ?? 30}
                onChange={(e) => onMatchRangeChange({ minutesAfter: e.target.value })}
                className="input-glass w-full"
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  )
}
