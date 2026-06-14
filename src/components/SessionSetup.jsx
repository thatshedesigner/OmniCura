import React from 'react'
import {
  CalendarDays,
  Check,
  HeartPulse,
  MapPin,
  PackageCheck,
  ShieldCheck,
} from 'lucide-react'
import { CHW_KIT_ITEMS, useSession } from '../context/SessionContext'

const DISTRICTS = [
  'Koraput, Odisha',
  'Kandhamal, Odisha',
  'Sitapur, Uttar Pradesh',
  'Bahraich, Uttar Pradesh',
  'Gaya, Bihar',
  'Purnea, Bihar',
  'Korba, Chhattisgarh',
  'Bastar, Chhattisgarh',
  'Barmer, Rajasthan',
  'Dungarpur, Rajasthan',
  'Shivpuri, Madhya Pradesh',
  'Sidhi, Madhya Pradesh',
  'Pakur, Jharkhand',
  'Khunti, Jharkhand',
  'Nandurbar, Maharashtra',
  'Gadchiroli, Maharashtra',
  'Mewat, Haryana',
  'Banswara, Rajasthan',
  'Supaul, Bihar',
  'Nabarangpur, Odisha',
]

export default function SessionSetup() {
  const {
    district,
    setDistrict,
    month,
    inventory,
    toggleInventoryItem,
    startSession,
  } = useSession()

  const availableCount = Object.values(inventory).filter(Boolean).length
  const setupComplete = Boolean(district && month)

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#163b2b] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-lime-200/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <header className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">
            <HeartPulse className="text-emerald-200" />
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-200">
              OmniCura Community Health
            </div>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Set up today&apos;s field session</h1>
          </div>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-100">
                <MapPin size={17} />
                District
              </span>
              <select
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0e2b20]/80 px-4 py-3 text-white outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/20"
              >
                <option value="">Select your district</option>
                {DISTRICTS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <div>
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-100">
                <CalendarDays size={17} />
                Current month
              </span>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0e2b20]/80 px-4 py-3">
                <span>{month}</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-200">
                  <Check size={15} />
                  Confirmed
                </span>
              </div>
            </div>
          </div>

          <section className="mt-8">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-100">
                  <PackageCheck size={18} />
                  CHW kit inventory
                </div>
                <p className="mt-1 text-sm text-white/60">Select everything available in your kit today.</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-emerald-100">
                {availableCount} of {CHW_KIT_ITEMS.length} available
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CHW_KIT_ITEMS.map((item) => {
                const checked = inventory[item]
                return (
                  <label
                    key={item}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                      checked
                        ? 'border-emerald-300/50 bg-emerald-300/15'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleInventoryItem(item)}
                      className="h-4 w-4 rounded border-white/30 bg-transparent accent-emerald-400"
                    />
                    <span className="text-sm text-white/90">{item}</span>
                  </label>
                )
              })}
            </div>
          </section>

          <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <ShieldCheck size={18} className="text-emerald-200" />
              Session details remain available throughout this consultation.
            </div>
            <button
              type="button"
              onClick={startSession}
              disabled={!setupComplete}
              className="rounded-xl bg-emerald-300 px-6 py-3 font-bold text-[#123326] transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Start Patient Consultation
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
