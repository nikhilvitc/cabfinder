import React, { useEffect } from 'react'
import moment from 'moment'

const PartnerModal = ({ isOpen, onClose, partners, selectedUser, isLoading }) => {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen || !selectedUser) return null

  const formatTime = (timeStr) => {
    if (!timeStr || timeStr.trim() === '') return 'Flexible'
    const m = moment(timeStr, ['HH:mm:ss', 'HH:mm'], true)
    return m.isValid() ? m.format('h:mm A') : timeStr
  }

  const calculateTimeDifference = (userTime, partnerTime) => {
    try {
      const user = moment(userTime, ['HH:mm:ss', 'HH:mm'], true)
      const partner = moment(partnerTime, ['HH:mm:ss', 'HH:mm'], true)

      if (!user.isValid() || !partner.isValid()) {
        return { label: 'Flexible', tone: 'muted' }
      }

      const diffMinutes = partner.diff(user, 'minutes')
      if (diffMinutes === 0) return { label: 'Same time', tone: 'same' }
      if (diffMinutes > 0) return { label: `+${diffMinutes} min`, tone: 'after' }
      return { label: `${diffMinutes} min`, tone: 'before' }
    } catch {
      return { label: 'Flexible', tone: 'muted' }
    }
  }

  const diffToneClass = (tone) => {
    if (tone === 'after') return 'text-amber-700'
    if (tone === 'before') return 'text-emerald-700'
    if (tone === 'same') return 'text-slate-800'
    return 'text-slate-500'
  }

  const handleCall = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self')
  }

  const handleWhatsApp = (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/[\s\-()]/g, '')
    const withCc = cleanNumber.startsWith('+') ? cleanNumber : `+91${cleanNumber}`
    const digits = withCc.replace(/\D/g, '')
    if (digits) window.open(`https://wa.me/${digits}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-panel animate-fade-in-up">
        <div className="modal-toolbar">
          <div>
            <h2 id="modal-title" className="font-display text-xl font-bold tracking-tight text-slate-900">
              Match results
            </h2>
            <p className="mt-1 text-sm text-slate-500">For {selectedUser.name}</p>
          </div>
          <div className="modal-toolbar-actions">
            <a
              href="https://docs.google.com/forms/d/1nKF-wn_QL6L_nJE3YvDmmG2JqTbHXx0a_r5A0vu_DfQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="modal-link-btn"
            >
              Add your trip
            </a>
            <button type="button" onClick={onClose} className="modal-close" aria-label="Close">
              ×
            </button>
          </div>
        </div>

        <div className="modal-user-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-900/80">Your trip</p>
          <ul className="mt-3 grid gap-1.5 text-sm text-cyan-950 sm:grid-cols-2">
            <li>
              <span className="text-cyan-800/80">To</span> {selectedUser.place}
            </li>
            <li>
              <span className="text-cyan-800/80">Date</span> {selectedUser.travelDate}
            </li>
            <li>
              <span className="text-cyan-800/80">Leave</span> {formatTime(selectedUser.departureTime)}
            </li>
            {selectedUser.flightTrainNumber ? (
              <li>
                <span className="text-cyan-800/80">#</span> {selectedUser.flightTrainNumber}
              </li>
            ) : null}
          </ul>
        </div>

        {isLoading ? (
          <div className="modal-loading">
            <div className="loading-spinner h-10 w-10 border-[3px]" />
            <p className="text-sm font-medium text-slate-600">Finding people on the same route…</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="modal-empty">
            <p className="font-display text-lg font-semibold text-slate-800">No matches yet</p>
            <p className="mt-2 max-w-sm text-center text-sm text-slate-500">
              No one else lists the same date and place in a compatible time window. Check back after more
              signups.
            </p>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-sm font-medium text-slate-600">
              {partners.length} compatible partner{partners.length !== 1 ? 's' : ''}
            </p>
            <ul className="flex max-h-[min(52vh,420px)] flex-col gap-3 overflow-y-auto pr-1 scrollbar-modern">
              {partners.map((partner, index) => {
                const diff = calculateTimeDifference(selectedUser.departureTime, partner.departureTime)
                return (
                  <li
                    key={partner.id ?? index}
                    className="partner-row flex flex-col gap-3 rounded-xl border border-slate-200/90 bg-white/90 p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-display font-semibold text-slate-900">{partner.name}</p>
                        <p className="mt-0.5 font-mono text-sm text-slate-600">{partner.contact}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-800">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-slate-500">Departs</span>
                        <p className="font-medium text-slate-800">{formatTime(partner.departureTime)}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Δ Time</span>
                        <p className={`font-semibold ${diffToneClass(diff.tone)}`}>{diff.label}</p>
                      </div>
                    </div>
                    {partner.flightTrainNumber ? (
                      <p className="text-sm text-violet-800">
                        <span className="text-slate-500">Ref </span>
                        <span className="font-mono font-medium">{partner.flightTrainNumber}</span>
                      </p>
                    ) : null}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleCall(partner.contact)}
                        className="flex-1 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                      >
                        Call
                      </button>
                      <button
                        type="button"
                        onClick={() => handleWhatsApp(partner.contact)}
                        className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
                      >
                        WhatsApp
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="mt-5 rounded-xl border border-cyan-200/80 bg-cyan-50/90 p-4 text-sm text-cyan-950">
              <p className="font-semibold text-cyan-900">How matching works</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-cyan-900/90">
                <li>Same destination (case-insensitive) and same travel date</li>
                <li>If both times are set: within −1 hour to +30 minutes</li>
                <li>If either time is empty: flexible match</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PartnerModal
