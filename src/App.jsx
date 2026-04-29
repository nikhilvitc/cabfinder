import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import TravelTable from './components/TravelTable'
import PartnerModal from './components/PartnerModal'
import SearchFilters from './components/SearchFilters'
import ErrorBoundary from './components/ErrorBoundary'
import axios from 'axios'
import { Analytics } from '@vercel/analytics/react'
import { getApiBaseUrl } from './lib/api'
import { matchPartnersLocal } from './utils/matchPartners'

function App() {
  const [travelData, setTravelData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    destination: '',
  })
  const [selectedUser, setSelectedUser] = useState(null)
  const [partners, setPartners] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [partnerLoading, setPartnerLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [matchRange, setMatchRange] = useState({
    minutesBefore: 60,
    minutesAfter: 30,
  })

  const fetchTravelData = async () => {
    try {
      setLoading(true)
      setError(null)
      const apiUrl = getApiBaseUrl()
      const response = await axios.get(`${apiUrl}/api/travel-data`, { timeout: 25000 })

      const data = Array.isArray(response.data?.data) ? response.data.data : []

      setTravelData(data)
      setFilteredData(data)
      setLastUpdate(new Date().toISOString())
    } catch (err) {
      console.error('Error fetching travel data:', err)

      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        const mockData = [
          {
            id: 1,
            name: 'John Doe',
            contact: '+1234567890',
            travelDate: '15/01/2024',
            departureTime: '10:30:00',
            place: 'New York',
            flightTrainNumber: 'AA123',
          },
          {
            id: 2,
            name: 'Jane Smith',
            contact: '+0987654321',
            travelDate: '15/01/2024',
            departureTime: '11:00:00',
            place: 'New York',
            flightTrainNumber: 'UA456',
          },
        ]
        setTravelData(mockData)
        setFilteredData(mockData)
        setError('Backend unavailable — showing sample data for layout preview.')
      } else {
        setError('Could not load travel data. Please try again in a moment.')
        setTravelData([])
        setFilteredData([])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const safeTravelData = Array.isArray(travelData) ? travelData : []

    const uniqueData = safeTravelData.reduce((acc, person) => {
      const key = `${person.name}-${person.travelDate}-${person.place}`
      if (!acc.find((p) => `${p.name}-${p.travelDate}-${p.place}` === key)) {
        acc.push(person)
      }
      return acc
    }, [])

    let filtered = [...uniqueData]

    if (filters.search && filters.search.trim()) {
      const searchLower = filters.search.toLowerCase().trim()
      filtered = filtered.filter((person) => {
        const name = (person.name || '').toLowerCase()
        const place = (person.place || '').toLowerCase()
        const contact = (person.contact || '').toLowerCase()
        const flightTrain = (person.flightTrainNumber || '').toLowerCase()

        return (
          name.includes(searchLower) ||
          place.includes(searchLower) ||
          contact.includes(searchLower) ||
          flightTrain.includes(searchLower)
        )
      })
    }

    if (filters.date && filters.date.trim()) {
      filtered = filtered.filter((person) => person.travelDate === filters.date)
    }

    if (filters.destination && filters.destination.trim()) {
      const d = filters.destination.trim().toLowerCase()
      filtered = filtered.filter(
        (person) => (person.place || '').toLowerCase() === d
      )
    }

    setFilteredData(filtered)
  }, [travelData, filters])

  const findPartners = async (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
    setPartnerLoading(true)
    setPartners([])

    const apiUrl = getApiBaseUrl()
    const minutesBefore = Math.max(0, Number(matchRange.minutesBefore) || 0)
    const minutesAfter = Math.max(0, Number(matchRange.minutesAfter) || 0)
    try {
      const { data } = await axios.post(
        `${apiUrl}/api/find-partners`,
        {
          userId: user.id,
          name: user.name,
          travelDate: user.travelDate,
          departureTime: user.departureTime || '',
          place: user.place,
          minutesBefore,
          minutesAfter,
        },
        { timeout: 20000 }
      )
      setPartners(Array.isArray(data?.partners) ? data.partners : [])
    } catch (e) {
      console.warn('Partner API failed, using local match:', e)
      setPartners(matchPartnersLocal(user, travelData, { minutesBefore, minutesAfter }))
    } finally {
      setPartnerLoading(false)
    }
  }

  const clearPartnerResults = () => {
    setSelectedUser(null)
    setPartners([])
    setIsModalOpen(false)
    setPartnerLoading(false)
  }

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handleMatchRangeChange = (next) => {
    setMatchRange((prev) => ({
      ...prev,
      ...next,
    }))
  }

  useEffect(() => {
    fetchTravelData()
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-card animate-fade-in-up">
          <div className="loading-spinner h-12 w-12 border-[3px]" />
          <p className="mt-4 font-display text-lg font-semibold text-slate-800">Loading trips…</p>
          <p className="mt-1 text-sm text-slate-500">Syncing from the shared sheet</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Header onRefresh={fetchTravelData} lastUpdate={lastUpdate} dataCount={travelData.length} />

        <main className="main-content">
          {error ? (
            <div className="alert-banner animate-fade-in-up" role="alert">
              <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-amber-950">{error}</p>
                <button type="button" onClick={() => setError(null)} className="alert-dismiss">
                  Dismiss
                </button>
              </div>
            </div>
          ) : null}

          <SearchFilters
            filters={filters}
            matchRange={matchRange}
            travelData={travelData}
            filteredCount={filteredData.length}
            onFilterChange={handleFilterChange}
            onMatchRangeChange={handleMatchRangeChange}
            onClear={() => handleFilterChange({ search: '', date: '', destination: '' })}
          />

          <TravelTable data={filteredData} onFindPartners={findPartners} matchRange={matchRange} />
        </main>

        <PartnerModal
          isOpen={isModalOpen}
          onClose={clearPartnerResults}
          partners={partners}
          selectedUser={selectedUser}
          isLoading={partnerLoading}
          matchRange={matchRange}
        />
      </div>
      <Analytics />
    </ErrorBoundary>
  )
}

export default App
