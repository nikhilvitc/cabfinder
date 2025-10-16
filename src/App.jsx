import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import TravelTable from './components/TravelTable'
import PartnerModal from './components/PartnerModal'
import ErrorBoundary from './components/ErrorBoundary'
import axios from 'axios'
import moment from 'moment'
import { Analytics } from '@vercel/analytics/react'

function App() {
  const [travelData, setTravelData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    destination: ''
  })
  const [selectedUser, setSelectedUser] = useState(null)
  const [partners, setPartners] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  // Fetch travel data
  const fetchTravelData = async () => {
    try {
      setLoading(true)
      setError(null)
      // Use deployed Render backend URL for production, localhost for development
      const apiUrl = import.meta.env.DEV ? 'http://localhost:3001' : 'https://cabfinder.onrender.com';
      const response = await axios.get(`${apiUrl}/api/travel-data`)
      
      // Ensure response.data is an array
      const data = Array.isArray(response.data?.data) ? response.data.data : []
      
      setTravelData(data)
      setFilteredData(data)
      setLastUpdate(new Date().toISOString())
    } catch (err) {
      console.error('Error fetching travel data:', err)
      
      // If backend is not running, use mock data for demo
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        const mockData = [
          {
            id: 1,
            name: 'John Doe',
            contact: '+1234567890',
            travelDate: '2024-01-15',
            departureTime: '10:30:00',
            place: 'New York',
            flightTrainNumber: 'AA123'
          },
          {
            id: 2,
            name: 'Jane Smith',
            contact: '+0987654321',
            travelDate: '2024-01-15',
            departureTime: '11:00:00',
            place: 'New York',
            flightTrainNumber: 'UA456'
          }
        ]
        setTravelData(mockData)
        setFilteredData(mockData)
        setError('Backend server not running. Showing demo data.')
      } else {
        setError('Failed to load travel data. Please check if the backend server is running.')
        setTravelData([])
        setFilteredData([])
      }
    } finally {
      setLoading(false)
    }
  }

  // Apply filters
  useEffect(() => {
    // Ensure travelData is an array
    const safeTravelData = Array.isArray(travelData) ? travelData : []
    
    // Remove duplicates based on name, date, and place
    const uniqueData = safeTravelData.reduce((acc, person) => {
      const key = `${person.name}-${person.travelDate}-${person.place}`
      if (!acc.find(p => `${p.name}-${p.travelDate}-${p.place}` === key)) {
        acc.push(person)
      }
      return acc
    }, [])
    
    let filtered = [...uniqueData] // Create a copy to avoid mutation

    // Apply search filter
    if (filters.search && filters.search.trim()) {
      const searchLower = filters.search.toLowerCase().trim()
      filtered = filtered.filter(person => {
        const name = (person.name || '').toLowerCase()
        const place = (person.place || '').toLowerCase()
        const contact = (person.contact || '').toLowerCase()
        const flightTrain = (person.flightTrainNumber || '').toLowerCase()
        
        return name.includes(searchLower) ||
               place.includes(searchLower) ||
               contact.includes(searchLower) ||
               flightTrain.includes(searchLower)
      })
    }

    // Apply date filter
    if (filters.date && filters.date.trim()) {
      filtered = filtered.filter(person => person.travelDate === filters.date)
    }

    // Apply destination filter
    if (filters.destination && filters.destination.trim()) {
      filtered = filtered.filter(person => person.place === filters.destination)
    }

    setFilteredData(filtered)
  }, [travelData, filters])

  // Find partners
  const findPartners = (user) => {
    setSelectedUser(user)
    
    // Ensure travelData is an array
    const safeTravelData = Array.isArray(travelData) ? travelData : []
    
    const userTime = user.departureTime
    const userDate = user.travelDate
    const userPlace = user.place

    // Helper function to check if time is empty/invalid
    const isEmptyTime = (time) => {
      return !time || time.trim() === '' || time === 'N/A' || time === 'Not specified'
    }

    const compatiblePartners = safeTravelData.filter(person => {
      // Don't include the user themselves
      if (person.id === user.id) return false
      
      // Must be same destination and date
      if (person.place !== userPlace || person.travelDate !== userDate) return false
      
      const userTimeEmpty = isEmptyTime(userTime)
      const partnerTimeEmpty = isEmptyTime(person.departureTime)
      
      // If both have no departure time, they're compatible (flexible matching)
      if (userTimeEmpty && partnerTimeEmpty) {
        return true
      }
      
      // If one has time and other doesn't, they're still compatible (flexible matching)
      if (userTimeEmpty || partnerTimeEmpty) {
        return true
      }
      
      // Time compatibility: within -2 hours to +1 hour (only if both have valid times)
      try {
        const userMoment = moment(userTime, 'HH:mm:ss')
        const partnerMoment = moment(person.departureTime, 'HH:mm:ss')
        
        // Check if moments are valid
        if (!userMoment.isValid() || !partnerMoment.isValid()) {
          return false // If time parsing fails, don't consider them compatible
        }
        
        const diffMinutes = partnerMoment.diff(userMoment, 'minutes')
        return diffMinutes >= -120 && diffMinutes <= 60
      } catch {
        return false // If any error occurs, don't consider them compatible
      }
    }).slice(0, 3) // Limit to first 3 partners for better UX

    setPartners(compatiblePartners)
    setIsModalOpen(true)
  }

  // Clear partner results
  const clearPartnerResults = () => {
    setSelectedUser(null)
    setPartners([])
    setIsModalOpen(false)
  }

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => {
      const updated = { ...prev }
      Object.keys(newFilters).forEach(key => {
        updated[key] = newFilters[key]
      })
      return updated
    })
  }

  // Refresh data
  const refreshData = () => {
    fetchTravelData()
  }

  // Initial load
  useEffect(() => {
    fetchTravelData()
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div className="loading">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading travel data...</div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div>
        <Header onRefresh={refreshData} lastUpdate={lastUpdate} dataCount={travelData.length} />
        
        <main className="main-content">
          {error && (
            <div className="error" style={{ gridColumn: '1 / -1' }}>
              <strong>Error:</strong> {error}
              <button 
                onClick={() => setError(null)}
                style={{ 
                  marginLeft: '1rem', 
                  background: 'none', 
                  border: 'none', 
                  color: '#dc2626', 
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* FILTERS - MATCHING WEBSITE THEME */}
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e5e7eb',
            maxWidth: '600px',
            margin: '16px auto'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '20px',
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              Search & Filter Travel Partners
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by name, place, or contact..."
                  value={filters?.search || ''}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '2px solid #d1d5db',
                    backgroundColor: 'white',
                    color: '#1f2937',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563eb'
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '140px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Travel Date
                  </label>
                  <select
                    value={filters?.date || ''}
                    onChange={(e) => handleFilterChange({ date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '2px solid #d1d5db',
                      backgroundColor: 'white',
                      color: '#1f2937',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">All Dates</option>
                    {[...new Set(travelData.map(item => item.travelDate))].sort().map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                </div>
                
                <div style={{ flex: '1', minWidth: '140px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Destination
                  </label>
                  <select
                    value={filters?.destination || ''}
                    onChange={(e) => handleFilterChange({ destination: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '2px solid #d1d5db',
                      backgroundColor: 'white',
                      color: '#1f2937',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">All Destinations</option>
                    {[...new Set(travelData.map(item => item.place))].sort().map(destination => (
                      <option key={destination} value={destination}>{destination}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                onClick={() => handleFilterChange({ search: '', date: '', destination: '' })}
                disabled={!filters?.search && !filters?.date && !filters?.destination}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: (!filters?.search && !filters?.date && !filters?.destination) ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (filters?.search || filters?.date || filters?.destination) {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.3)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = 'none'
                }}
              >
                Clear All Filters
              </button>
            </div>
          </div>

          <div>
            <TravelTable 
              data={filteredData}
              onFindPartners={findPartners}
              selectedUser={selectedUser}
            />
          </div>
        </main>

        <PartnerModal 
          isOpen={isModalOpen}
          onClose={clearPartnerResults}
          partners={partners}
          selectedUser={selectedUser}
        />
      </div>
      <Analytics />
    </ErrorBoundary>
  )
}

export default App