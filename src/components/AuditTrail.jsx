import React, { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ChevronDown,
  ClipboardList,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react'

function relativeTime(timestamp, now) {
  const elapsedSeconds = Math.max(0, Math.floor((now - new Date(timestamp).getTime()) / 1000))
  if (elapsedSeconds < 60) return 'Just now'

  const elapsedMinutes = Math.floor(elapsedSeconds / 60)
  if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`

  const elapsedHours = Math.floor(elapsedMinutes / 60)
  if (elapsedHours < 24) return `${elapsedHours} hr${elapsedHours === 1 ? '' : 's'} ago`

  const elapsedDays = Math.floor(elapsedHours / 24)
  return `${elapsedDays} day${elapsedDays === 1 ? '' : 's'} ago`
}

function isToday(timestamp) {
  const date = new Date(timestamp)
  const today = new Date()
  return date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate()
}

function StatCard({ icon, label, value, detail }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/10 backdrop-blur-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-400">{label}</div>
          <div className="mt-2 text-3xl font-black text-white">{value}</div>
          {detail && <div className="mt-1 text-xs text-slate-500">{detail}</div>}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-300/10 text-teal-200">
          {icon}
        </div>
      </div>
    </section>
  )
}

export default function AuditTrail({ onNewPatient }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const response = await fetch('/api/logs')
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Audit trail could not be loaded')
        setLogs(Array.isArray(data) ? data : [])
      } catch (loadError) {
        console.error('Audit trail loading failed:', loadError)
        setError('The audit trail could not be loaded right now.')
      } finally {
        setLoading(false)
      }
    }

    loadLogs()
    const clock = window.setInterval(() => setNow(Date.now()), 60000)
    return () => window.clearInterval(clock)
  }, [])

  const todayLogs = useMemo(() => logs.filter((entry) => isToday(entry.timestamp)), [logs])
  const escalationCount = todayLogs.filter(
    (entry) => entry.escalationDecision === 'ESCALATE'
  ).length
  const escalationPercentage = todayLogs.length
    ? Math.round((escalationCount / todayLogs.length) * 100)
    : 0
  const districtsCovered = new Set(todayLogs.map((entry) => entry.district)).size

  return (
    <main className="min-h-screen bg-[#061725] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-teal-300">
              Decision accountability
            </div>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Decision Audit Trail</h1>
            <p className="mt-2 max-w-2xl text-slate-400">
              Every completed agent assessment is timestamped and reviewable.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-teal-100/60">
            <ShieldCheck size={17} />
            Logged, traceable, reviewable
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={<ClipboardList size={22} />}
            label="Total assessments today"
            value={todayLogs.length}
          />
          <StatCard
            icon={<AlertTriangle size={22} />}
            label="Escalations today"
            value={escalationCount}
            detail={`${escalationPercentage}% of today's assessments`}
          />
          <StatCard
            icon={<MapPin size={22} />}
            label="Districts covered"
            value={districtsCovered}
          />
        </div>

        <section className="mt-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Assessment log</h2>
            {!loading && !error && (
              <span className="text-sm text-slate-500">{logs.length} total records</span>
            )}
          </div>

          {loading && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md">
              <ClipboardList className="mx-auto animate-pulse text-teal-300" size={34} />
              <p className="mt-4 text-slate-300">Loading recorded decisions...</p>
            </div>
          )}

          {error && (
            <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-6 text-red-100">
              {error}
            </div>
          )}

          {!loading && !error && logs.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md">
              <Users className="mx-auto text-slate-500" size={42} />
              <h3 className="mt-4 text-xl font-bold">No assessments recorded yet.</h3>
              <p className="mt-2 text-slate-400">Start a new patient consultation.</p>
              <button
                type="button"
                onClick={onNewPatient}
                className="mt-6 rounded-xl bg-teal-300 px-5 py-3 font-bold text-[#06211f]"
              >
                Start New Patient
              </button>
            </div>
          )}

          {!loading && !error && logs.length > 0 && (
            <div className="space-y-3">
              {logs.map((entry) => {
                const expanded = expandedId === entry.id
                const referred = entry.escalationDecision === 'ESCALATE'
                const symptoms = entry.patientSummary.symptoms.length
                  ? entry.patientSummary.symptoms.join(' + ')
                  : 'No symptoms recorded'

                return (
                  <article
                    key={entry.id}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-black/10 backdrop-blur-md"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : entry.id)}
                      className="grid w-full gap-4 p-5 text-left sm:grid-cols-[130px_1fr_auto_auto] sm:items-center sm:p-6"
                    >
                      <div>
                        <div className="font-semibold text-white">
                          {relativeTime(entry.timestamp, now)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {new Date(entry.timestamp).toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div>
                        <span className="inline-flex rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-bold text-teal-100">
                          {entry.district}
                        </span>
                        <div className="mt-3 font-semibold text-slate-100">
                          {entry.patientSummary.sex}, {entry.patientSummary.age}, {symptoms}
                        </div>
                      </div>

                      <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-black ${
                        referred
                          ? 'bg-red-500/20 text-red-200 ring-1 ring-red-400/30'
                          : 'bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-300/20'
                      }`}>
                        {referred ? 'REFERRED' : 'HOME MANAGEMENT'}
                      </span>

                      <ChevronDown
                        size={20}
                        className={`text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {expanded && (
                      <div className="grid gap-5 border-t border-white/10 bg-black/10 p-5 sm:grid-cols-2 sm:p-6">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300">
                            Escalation justification
                          </h3>
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                            {entry.escalationJustification}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300">
                            Differential summary
                          </h3>
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                            {entry.differentialSummary}
                          </p>
                        </div>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
