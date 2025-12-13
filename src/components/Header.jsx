import React from 'react'
import logo from '../assets/logo.png'
import perplxityImage from '../assets/perplxity.jpeg'

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
      {/* Perplexity Desktop Ad in Header */}
      <div className="perplexity-header-ad">
        <a href="https://pplx.ai/Vitcai" target="_blank" rel="noopener noreferrer">
          <img src={perplxityImage} alt="Perplexity Ad" />
          <div className="ad-label">Ad</div>
        </a>
      </div>
      
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
        
        <div className="header-stats-and-actions">
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-number">{dataCount || 0}</div>
              <div className="stat-label">Records</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{formatLastUpdate(lastUpdate)}</div>
              <div className="stat-label">Last Update</div>
            </div>
          </div>
          
          <div className="header-actions">
            <a
              href="https://forms.gle/ribwApJU9G4RA2Zh8"
              target="_blank"
              rel="noopener noreferrer"
              className="add-travel-btn"
            >
              📝 Add Travel
            </a>
            <button onClick={onRefresh} className="refresh-btn">
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
