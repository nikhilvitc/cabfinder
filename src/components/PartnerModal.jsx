import React from 'react'
import moment from 'moment'

const PartnerModal = ({ isOpen, onClose, partners = [], selectedUser, matchWindow }) => {
  if (!isOpen || !selectedUser) return null

  const formatTime = (timeStr) => {
    if (!timeStr || timeStr.trim() === '') return 'Flexible'
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
      if (!user.isValid() || !partner.isValid()) return 'Flexible'
      const diffMinutes = partner.diff(user, 'minutes')
      if (diffMinutes === 0) return 'Same time'
      if (diffMinutes > 0) return `+${diffMinutes} min`
      return `${diffMinutes} min`
    } catch {
      return 'Flexible'
    }
  }

  const handleCall = (phoneNumber) => window.open(`tel:${phoneNumber}`, '_self')

  const handleWhatsApp = (phoneNumber) => {
    const cleanNumber = (phoneNumber || '').replace(/[\s\-()]/g, '')
    const formattedNumber = cleanNumber.startsWith('+') ? cleanNumber : `+91${cleanNumber}`
    window.open(`https://wa.me/${formattedNumber}`, '_blank')
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 24, maxWidth: 640, width: '92%', maxHeight: '80vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0 }}>V Help Cabpool</h2>
            <p style={{ margin: 0, color: '#6b7280' }}>Matching travelers for {selectedUser.name}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px',
              borderRadius: '4px'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: 12, marginBottom: 16 }}>
          <div><strong>Name:</strong> {selectedUser.name}</div>
          <div><strong>Destination:</strong> {selectedUser.place}</div>
          <div><strong>Date:</strong> {selectedUser.travelDate}</div>
          <div><strong>Time:</strong> {formatTime(selectedUser.departureTime)}</div>
          {selectedUser.flightTrainNumber && <div><strong>Flight/Train:</strong> {selectedUser.flightTrainNumber}</div>}
        </div>

        {partners.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 24, color: '#6b7280' }}>
            <div style={{ fontSize: 40 }}>😔</div>
            <div style={{ fontWeight: 600 }}>No partners found</div>
            <div>No one else is traveling to the same destination at a compatible time.</div>
          </div>
        ) : (
          <div>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Found {partners.length} compatible partner{partners.length !== 1 ? 's' : ''}</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {partners.map((partner, i) => (
                <div key={partner.id || i} style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 8, background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{partner.name}</div>
                      <div style={{ fontFamily: 'monospace', color: '#6b7280' }}>{partner.contact}</div>
                    </div>
                    <div style={{ background: '#10b981', color: 'white', padding: '4px 8px', borderRadius: 6 }}>Match #{i + 1}</div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div><div style={{ color: '#6b7280' }}>Departure</div><div style={{ fontWeight: 600 }}>{formatTime(partner.departureTime)}</div></div>
                    <div><div style={{ color: '#6b7280' }}>Time diff</div><div style={{ fontWeight: 600 }}>{calculateTimeDifference(selectedUser.departureTime, partner.departureTime)}</div></div>
                  </div>

                  {partner.flightTrainNumber && <div style={{ fontFamily: 'monospace', color: '#7c3aed' }}>{partner.flightTrainNumber}</div>}

                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => handleCall(partner.contact)} style={{ flex: 1, padding: 8, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6 }}>📞 Call</button>
                    <button onClick={() => handleWhatsApp(partner.contact)} style={{ flex: 1, padding: 8, background: '#10b981', color: 'white', border: 'none', borderRadius: 6 }}>💬 WhatsApp</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, padding: 12, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8 }}>
              <div style={{ fontWeight: 600 }}>💡 Matching Criteria:</div>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                <li>Same destination: {selectedUser.place}</li>
                <li>Same travel date: {selectedUser.travelDate}</li>
                <li>Departure time within {formatWindow(matchWindow)}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PartnerModal

function formatWindow(windowObj) {
  const before = windowObj?.before ?? 120
  const after = windowObj?.after ?? 60
  const fmt = (mins) => {
    if (Math.abs(mins) % 60 === 0) return `${Math.abs(mins) / 60} hour${Math.abs(mins) / 60 === 1 ? '' : 's'}`
    return `${mins} minute${mins === 1 ? '' : 's'}`
  }
  return `-${fmt(before)} to +${fmt(after)} of your time`
}
