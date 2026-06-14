import React from 'react'
import { ClipboardList, HeartPulse, UserPlus } from 'lucide-react'

export default function CHWNavigation({ currentView, onAuditTrail, onNewPatient }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#071a26]/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-300 text-[#0b2d20]">
            <HeartPulse size={19} />
          </div>
          <div className="min-w-0">
            <div className="truncate font-bold">OmniCura Community Health</div>
            <div className="hidden text-xs text-emerald-100/55 sm:block">
              Accountable decision support for ASHA workers
            </div>
          </div>
        </div>

        {currentView === 'audit' ? (
          <button
            type="button"
            onClick={onNewPatient}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10"
          >
            <UserPlus size={16} />
            <span className="hidden sm:inline">New Patient</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onAuditTrail}
            className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-emerald-100/75 hover:bg-white/5 hover:text-white"
          >
            <ClipboardList size={16} />
            Audit Trail
          </button>
        )}
      </div>
    </header>
  )
}
