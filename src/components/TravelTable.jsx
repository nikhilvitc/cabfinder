import React from 'react'

const TravelTable = ({ data = [], onFindPartners, selectedUser }) => {
  if (data.length === 0) {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2>Travel Records</h2>
          <p>No travel records found. Try adjusting your filters or refresh the data.</p>
        </div>
        <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚗</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
            No records found
          </h3>
          <p>Try adjusting your filters or refresh the data to see available travel options</p>
        </div>
      </div>
    )
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Travel Records ({data.length})</h2>
        <p>Click "Find Partner" to discover people traveling to the same destination</p>
      </div>
      
      <div style={{ 
        overflowX: 'auto', 
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 #f1f5f9'
      }}>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Date</th>
              <th>Time</th>
              <th>Destination</th>
              <th>Flight/Train</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((person, index) => (
              <tr 
                key={person.id || index}
              >
                <td>
                  <div style={{ fontWeight: '500' }}>{person.name}</div>
                </td>
                <td>
                  <div style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '0.875rem',
                    wordBreak: 'break-all',
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>{person.contact}</div>
                </td>
                <td>
                  <span style={{ 
                    background: '#dbeafe', 
                    color: '#1e40af', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem', 
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    display: 'inline-block'
                  }}>
                    {person.travelDate}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: '500' }}>
                    {person.departureTime && person.departureTime.trim() !== '' ? (
                      <span style={{ 
                        background: '#f0f9ff', 
                        color: '#0369a1', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem', 
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        display: 'inline-block'
                      }}>
                        {person.departureTime}
                      </span>
                    ) : (
                      <span style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.875rem' }}>
                        Flexible
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {person.place}
                  </div>
                </td>
                <td>
                  {person.flightTrainNumber ? (
                    <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: '500', color: '#7c3aed' }}>
                      {person.flightTrainNumber}
                    </div>
                  ) : (
                    <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Not specified</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => onFindPartners(person)}
                    className="find-btn"
                  >
                    Find Partner
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