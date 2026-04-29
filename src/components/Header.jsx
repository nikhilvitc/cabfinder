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
        <div className="header-brand-block">
          <a
            href="https://www.vhelpcc.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="header-brand-link"
          >
            <img src={logo} alt="" className="header-logo" />
            <div>
              <h1 className="site-title">V Help Cabpool</h1>
              <p className="site-tagline">
                Shared rides from your campus community.{' '}
                <a href="https://www.vhelpcc.com/" target="_blank" rel="noopener noreferrer">
                  Visit V Help
                </a>{' '}
                •{' '}
                <a href="https://www.linkedin.com/company/vhelpcc/" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </p>
            </div>
          </a>
        </div>

        <div className="header-stats-and-actions">
          <div className="header-stats">
            <div className="stat-card">
              <div className="stat-number">{dataCount || 0}</div>
              <div className="stat-label">Trips listed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{formatLastUpdate(lastUpdate)}</div>
              <div className="stat-label">Data synced</div>
            </div>
          </div>

          <div className="header-actions">
            <a
              href="https://docs.google.com/forms/d/1nKF-wn_QL6L_nJE3YvDmmG2JqTbHXx0a_r5A0vu_DfQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="add-travel-btn"
            >
              Add trip
            </a>
            <button type="button" onClick={onRefresh} className="refresh-btn">
              Refresh
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
