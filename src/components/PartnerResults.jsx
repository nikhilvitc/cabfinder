import React from 'react'
import moment from 'moment'

const PartnerResults = ({ partners = [], selectedUser, onClear }) => {
  if (!selectedUser) return null

  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A'
    try {
      return moment(timeStr, 'HH:mm:ss').format('h:mm A')
    } catch {
      return timeStr
    }
  }

  const calculateTimeDifference = (userTime, partnerTime) => {
    try {
      const user = moment(userTime, 'HH:mm:ss')
      const partner = moment(partnerTime, 'HH:mm:ss')
      const diff = partner.diff(user, 'minutes')
      
      if (diff === 0) return 'Same time'
      if (diff > 0) return `+${diff} min`
      return `${diff} min`
    } catch {
      return 'N/A'
    }
  }

  return (
    <div className="partner-results">
      <div className="partner-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>🎯 Partners Found for {selectedUser.name}</h3>
            <p>Traveling to {selectedUser.place} on {selectedUser.travelDate} at {formatTime(selectedUser.departureTime)}</p>
          </div>
          <button
            onClick={onClear}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Clear Results
          </button>
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {partners.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😔</div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
              No partners found yet
            </h4>
            <p>No one else is traveling to the same destination at a compatible time.</p>
          </div>
        ) : (
          <div className="partner-grid">
            {partners.map((partner, index) => (
              <div key={partner.id || index} className="partner-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4>{partner.name}</h4>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{partner.contact}</p>
                  </div>
                  <span style={{ 
                    background: '#dcfce7', 
                    color: '#166534', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem', 
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    Match #{index + 1}
                  </span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Departure Time:</span>
                    <span style={{ fontWeight: '500' }}>{formatTime(partner.departureTime)}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Time Difference:</span>
                    <span style={{ 
                      fontWeight: '500',
                      color: calculateTimeDifference(selectedUser.departureTime, partner.departureTime).includes('+') 
                        ? '#ea580c' 
                        : '#059669'
                    }}>
                      {calculateTimeDifference(selectedUser.departureTime, partner.departureTime)}
                    </span>
                  </div>

                  {partner.flightTrainNumber && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Flight/Train:</span>
                      <span style={{ fontWeight: '500', fontFamily: 'monospace', color: '#7c3aed' }}>
                        {partner.flightTrainNumber}
                      </span>
                    </div>
                  )}
                </div>

                <div className="partner-actions">
                  <button className="contact-btn">📞 Contact</button>
                  <button className="chat-btn">💬 Chat</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {partners.length > 0 && (
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: '#f0f9ff', 
            borderRadius: '0.5rem',
            border: '1px solid #bae6fd'
          }}>
            <h5 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#0c4a6e' }}>💡 Matching Criteria:</h5>
            <ul style={{ fontSize: '0.875rem', color: '#0c4a6e', margin: 0, paddingLeft: '1rem' }}>
              <li>Same destination: {selectedUser.place}</li>
              <li>Same travel date: {selectedUser.travelDate}</li>
              <li>Departure time within -1 hour to +30 minutes of your time</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default PartnerResults