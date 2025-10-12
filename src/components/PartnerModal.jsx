import React from 'react'
import moment from 'moment'

const PartnerModal = ({ isOpen, onClose, partners, selectedUser }) => {
  if (!isOpen || !selectedUser) return null

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
      const diffMinutes = partner.diff(user, 'minutes')
      
      if (diffMinutes === 0) return 'Same time'
      if (diffMinutes > 0) return `+${diffMinutes} min`
      return `${diffMinutes} min`
    } catch {
      return 'N/A'
    }
  }

  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self')
  }

  const handleWhatsApp = (phoneNumber) => {
    // Clean phone number (remove spaces, special characters)
    const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '')
    // Add country code if not present (assuming India +91)
    const formattedNumber = cleanNumber.startsWith('+') ? cleanNumber : `+91${cleanNumber}`
    const whatsappUrl = `https://wa.me/${formattedNumber}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              margin: 0,
              color: '#1f2937'
            }}>
              🤲 U Help Cabpool - Travel Partners Found
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '4px 0 0 0'
            }}>
              Matching travelers for {selectedUser.name}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href="https://forms.gle/jZpA5Ej2QwCkMxD36"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              📝 Add Your Travel
            </a>
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
        </div>

        {/* Selected User Info */}
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            margin: '0 0 8px 0',
            color: '#0c4a6e'
          }}>
            Your Travel Details
          </h3>
          <div style={{ fontSize: '14px', color: '#0c4a6e' }}>
            <div><strong>Name:</strong> {selectedUser.name}</div>
            <div><strong>Destination:</strong> {selectedUser.place}</div>
            <div><strong>Date:</strong> {selectedUser.travelDate}</div>
            <div><strong>Time:</strong> {formatTime(selectedUser.departureTime)}</div>
            {selectedUser.flightTrainNumber && (
              <div><strong>Flight/Train:</strong> {selectedUser.flightTrainNumber}</div>
            )}
          </div>
        </div>

        {/* Partners List */}
        {partners.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>😔</div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              color: '#374151'
            }}>
              No partners found
            </h3>
            <p style={{ margin: 0 }}>
              No one else is traveling to the same destination at a compatible time.
            </p>
          </div>
        ) : (
          <div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#374151'
            }}>
              Found {partners.length} compatible partner{partners.length !== 1 ? 's' : ''}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {partners.map((partner, index) => (
                <div
                  key={partner.id || index}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    backgroundColor: '#fafafa'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        margin: '0 0 4px 0',
                        color: '#1f2937'
                      }}>
                        {partner.name}
                      </h4>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        fontFamily: 'monospace'
                      }}>
                        {partner.contact}
                      </div>
                    </div>
                    <span style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      Match #{index + 1}
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    fontSize: '14px',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <span style={{ color: '#6b7280' }}>Departure:</span>
                      <div style={{ fontWeight: '500' }}>{formatTime(partner.departureTime)}</div>
                    </div>
                    <div>
                      <span style={{ color: '#6b7280' }}>Time Diff:</span>
                      <div style={{
                        fontWeight: '500',
                        color: calculateTimeDifference(selectedUser.departureTime, partner.departureTime).includes('+') 
                          ? '#ea580c' 
                          : '#059669'
                      }}>
                        {calculateTimeDifference(selectedUser.departureTime, partner.departureTime)}
                      </div>
                    </div>
                  </div>

                  {partner.flightTrainNumber && (
                    <div style={{
                      fontSize: '14px',
                      marginBottom: '12px'
                    }}>
                      <span style={{ color: '#6b7280' }}>Flight/Train:</span>
                      <div style={{
                        fontWeight: '500',
                        fontFamily: 'monospace',
                        color: '#7c3aed'
                      }}>
                        {partner.flightTrainNumber}
                      </div>
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button 
                      onClick={() => handleCall(partner.contact)}
                      style={{
                        flex: 1,
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      📞 Call
                    </button>
                    <button 
                      onClick={() => handleWhatsApp(partner.contact)}
                      style={{
                        flex: 1,
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      💬 WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Matching Criteria Info */}
            <div style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              border: '1px solid #bae6fd'
            }}>
              <h5 style={{
                fontWeight: '600',
                marginBottom: '8px',
                color: '#0c4a6e',
                fontSize: '14px'
              }}>
                💡 Matching Criteria:
              </h5>
              <ul style={{
                fontSize: '13px',
                color: '#0c4a6e',
                margin: 0,
                paddingLeft: '16px'
              }}>
                <li>Same destination: {selectedUser.place}</li>
                <li>Same travel date: {selectedUser.travelDate}</li>
                <li>Departure time within -2 hours to +1 hour of your time</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PartnerModal
