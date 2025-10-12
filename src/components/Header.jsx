import React from 'react'

const Header = ({ onRefresh, lastUpdate, dataCount }) => {
  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return 'Never'
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <header className="header">
      <div className="header-content">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.3)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              overflow: 'hidden'
            }}>
              <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="48" fill="white" stroke="none" style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'}} />
                <circle cx="50" cy="2" r="1" fill="black" opacity="0.1" />
                <circle cx="50" cy="98" r="1" fill="black" opacity="0.1" />
                <circle cx="2" cy="50" r="1" fill="black" opacity="0.1" />
                <circle cx="98" cy="50" r="1" fill="black" opacity="0.1" />
                <circle cx="35" cy="15" r="0.8" fill="black" opacity="0.08" />
                <circle cx="65" cy="15" r="0.8" fill="black" opacity="0.08" />
                <circle cx="35" cy="85" r="0.8" fill="black" opacity="0.08" />
                <circle cx="65" cy="85" r="0.8" fill="black" opacity="0.08" />
                <circle cx="15" cy="35" r="0.8" fill="black" opacity="0.08" />
                <circle cx="15" cy="65" r="0.8" fill="black" opacity="0.08" />
                <circle cx="85" cy="35" r="0.8" fill="black" opacity="0.08" />
                <circle cx="85" cy="65" r="0.8" fill="black" opacity="0.08" />
                <circle cx="50" cy="50" r="35" fill="black" stroke="none" />
                <g transform="translate(50, 40)">
                  <path d="M -8 -2 Q -12 -6 -8 -10 Q -4 -14 0 -10 Q 4 -14 8 -10 Q 12 -6 8 -2 Q 4 2 0 -2 Q -4 2 -8 -2 Z" fill="#CD7F32" stroke="#B8860B" strokeWidth="0.5" style={{filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'}} />
                  <path d="M 8 -2 Q 12 -6 8 -10 Q 4 -14 0 -10 Q -4 -14 -8 -10 Q -12 -6 -8 -2 Q -4 2 0 -2 Q 4 2 8 -2 Z" fill="#CD7F32" stroke="#B8860B" strokeWidth="0.5" style={{filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'}} />
                  <ellipse cx="0" cy="-6" rx="6" ry="4" fill="#CD7F32" stroke="#B8860B" strokeWidth="0.3" />
                </g>
                <text x="50" y="75" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="1">U HAND</text>
                <text x="50" y="15" textAnchor="middle" fill="black" fontSize="4" fontFamily="serif" opacity="0.3" transform="rotate(0 50 15)">✦</text>
                <text x="85" y="50" textAnchor="middle" fill="black" fontSize="4" fontFamily="serif" opacity="0.3" transform="rotate(90 85 50)">✦</text>
                <text x="50" y="85" textAnchor="middle" fill="black" fontSize="4" fontFamily="serif" opacity="0.3" transform="rotate(180 50 85)">✦</text>
                <text x="15" y="50" textAnchor="middle" fill="black" fontSize="4" fontFamily="serif" opacity="0.3" transform="rotate(270 15 50)">✦</text>
              </svg>
            </div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              margin: 0,
              background: 'linear-gradient(45deg, #fff, #f0f9ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              U Help Cabpool
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
            Find your perfect travel companion for shared rides
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{dataCount || 0}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Records</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: '600' }}>{formatLastUpdate(lastUpdate)}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Last Update</div>
          </div>
          <a
            href="https://forms.gle/jZpA5Ej2QwCkMxD36"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontWeight: '500',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            📝 Add Travel
          </a>
          <button onClick={onRefresh} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header