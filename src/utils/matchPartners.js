import moment from 'moment'

function parseTime(timeStr) {
  if (timeStr == null || typeof timeStr !== 'string') return null
  const time = timeStr.trim()
  if (!time || time === 'N/A' || time === 'Not specified' || time === '-') return null
  const m = moment(time, ['HH:mm:ss', 'HH:mm', 'H:mm'], true)
  return m.isValid() ? m : null
}

/** Same rules as backend: same date & place (case-insensitive), configurable range when both times known; flexible if either time missing. */
export function matchPartnersLocal(user, allData, options = {}) {
  const list = Array.isArray(allData) ? allData : []
  const userPlace = (user.place || '').toLowerCase().trim()
  const userTime = parseTime(user.departureTime)
  const minutesBefore = Number.isFinite(Number(options.minutesBefore))
    ? Math.max(0, Number(options.minutesBefore))
    : 60
  const minutesAfter = Number.isFinite(Number(options.minutesAfter))
    ? Math.max(0, Number(options.minutesAfter))
    : 30

  return list.filter((person) => {
    if (person.id === user.id) return false
    if ((person.place || '').toLowerCase().trim() !== userPlace) return false
    if (person.travelDate !== user.travelDate) return false

    const personTime = parseTime(person.departureTime)
    if (!userTime && !personTime) return true
    if (!userTime || !personTime) return true

    const diff = personTime.diff(userTime, 'minutes')
    return diff >= -minutesBefore && diff <= minutesAfter
  })
}
