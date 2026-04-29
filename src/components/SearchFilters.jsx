import React from 'react'

export default function SearchFilters({
  filters,
  travelData,
  filteredCount,
  onFilterChange,
  onClear,
}) {
  const hasFilters = Boolean(
    filters?.search?.trim() || filters?.date || filters?.destination
  )

  const dates = [...new Set((travelData || []).map((item) => item.travelDate).filter(Boolean))].sort()
  const destinations = [...new Set((travelData || []).map((item) => item.place).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })
  )

  return (
    <section className="filters-panel animate-fade-in-up">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
            Find a ride
          </h2>
          <p className="text-sm text-slate-500">
            {filteredCount} listing{filteredCount !== 1 ? 's' : ''} match your filters
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={!hasFilters}
          className="btn-clear-filter text-sm disabled:pointer-events-none disabled:opacity-40"
        >
          Reset filters
        </button>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
    </section>
  )
}
