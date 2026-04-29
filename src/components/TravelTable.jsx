import React from 'react'

const TravelTable = ({ data = [], onFindPartners }) => {
  if (data.length === 0) {
    return (
      <div className="table-shell">
        <div className="table-shell-head">
          <h3 className="font-display text-base font-semibold text-slate-900">Travelers</h3>
          <p className="mt-1 text-sm text-slate-500">No rows match your filters right now.</p>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden>
            <svg className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.25}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <p className="font-display text-lg font-semibold text-slate-700">Nothing to show</p>
          <p className="mt-2 max-w-md text-center text-sm text-slate-500">
            Try clearing filters or refreshing — new trips appear as students add them to the sheet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="table-shell">
      <div className="table-shell-head">
        <div>
          <h3 className="font-display text-base font-semibold text-slate-900">Travelers</h3>
          <p className="mt-1 text-sm text-slate-500">
            Pick someone going your way, then match on time window (−1h to +30 min).
          </p>
        </div>
      </div>

      <div className="table-scroll-container scrollbar-modern">
        <table className="table table-modern">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Date</th>
              <th>Time</th>
              <th>Destination</th>
              <th>Flight / train</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {data.map((person, index) => (
              <tr key={person.id ?? index}>
                <td>
                  <span className="font-medium text-slate-900">{person.name}</span>
                </td>
                <td>
                  <span className="cell-mono text-slate-600">{person.contact}</span>
                </td>
                <td>
                  <span className="badge-date">{person.travelDate}</span>
                </td>
                <td>
                  {person.departureTime && person.departureTime.trim() !== '' ? (
                    <span className="badge-time">{person.departureTime}</span>
                  ) : (
                    <span className="text-sm italic text-slate-400">Flexible</span>
                  )}
                </td>
                <td>
                  <span className="line-clamp-2 text-sm text-slate-700" title={person.place}>
                    {person.place}
                  </span>
                </td>
                <td>
                  {person.flightTrainNumber ? (
                    <span className="cell-mono text-sm font-medium text-violet-700">{person.flightTrainNumber}</span>
                  ) : (
                    <span className="text-sm text-slate-400">—</span>
                  )}
                </td>
                <td className="text-right">
                  <button type="button" onClick={() => onFindPartners(person)} className="find-btn">
                    Match
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TravelTable
