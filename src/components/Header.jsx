import React from 'react'
import logo from '../assets/logo.png'

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
            <a 
              href="https://www.vhelpcc.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <img
                src={logo}
                alt="V Help Cabpool Banner Logo"
                style={{
                  height: '50px',
                  width: 'auto',
                  objectFit: 'contain',
                  padding: '0',
                  margin: '0',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              />
              <h1 style={{ 
                fontSize: '2.2rem', 
                fontWeight: '700', 
                margin: 0,
                background: 'linear-gradient(45deg, #fff, #f0f9ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease'
              }}>
                V Help Cabpool
              </h1>
            </a>
          </div>
          <p style={{ 
            margin: 0, 
            fontSize: '0.9rem', 
            color: 'white',
            fontWeight: '300',
            opacity: 0.9
          }}>
            Find your perfect travel companion for shared rides • 
            <a 
              href="https://www.vhelpcc.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#fbbf24', 
                textDecoration: 'none', 
                fontWeight: '600',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#fcd34d'}
              onMouseLeave={(e) => e.target.style.color = '#fbbf24'}
            >
              Visit Main V Help Site
            </a>
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ 
            textAlign: 'center', 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '0.75rem 1rem', 
            borderRadius: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fbbf24' }}>{dataCount || 0}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: '500' }}>Records</div>
          </div>
          <div style={{ 
            textAlign: 'center', 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '0.75rem 1rem', 
            borderRadius: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#10b981' }}>{formatLastUpdate(lastUpdate)}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: '500' }}>Last Update</div>
          </div>
          <a
            href="https://forms.gle/jZpA5Ej2QwCkMxD36"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '0.75rem 1.25rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '0.875rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)'
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
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