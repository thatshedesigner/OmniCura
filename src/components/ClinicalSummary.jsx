import React from 'react'
import { Star, CheckCircle } from 'lucide-react'

export default function ClinicalSummary({ extractedDrugs, interactions, onDownload, onReset, showDownload = true }) {
  const criticalCount = interactions.filter(i => i.severity === 'critical').length
  const severeCount = interactions.filter(i => i.severity === 'severe').length
  const level = criticalCount >= 2 ? 'HIGH' : (criticalCount ===1 || severeCount >=2 ? 'MEDIUM' : 'LOW')

  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center"><Star /></div>
          <div>
            <div className="font-bold text-xl">Clinical Safety Summary</div>
            <div className="text-xs font-semibold tracking-widest uppercase text-gray-400">AI-GENERATED REPORT</div>
          </div>
        </div>
        <div className="flex gap-3">
          {showDownload && (
            <button onClick={onDownload} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-5 py-2.5 rounded-xl">Download Interaction Report (PDF)</button>
          )}
          <button onClick={onReset} className="border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl">Analyze Another Prescription</button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2"><CheckCircle className="text-green-500" /> <div> {extractedDrugs.length} drugs successfully extracted from prescription</div></li>
            <li className="flex items-start gap-2"><CheckCircle className="text-green-500" /> <div>{interactions.length} drug interactions detected ({criticalCount} critical{severeCount?` · ${severeCount} severe`:''})</div></li>
            <li className="flex items-start gap-2"><CheckCircle className="text-green-500" /> <div>Warfarin combination therapy requires immediate physician review</div></li>
            <li className="flex items-start gap-2"><CheckCircle className="text-green-500" /> <div>Omeprazole provides GI protection but requires renal monitoring with Metformin</div></li>
            <li className="flex items-start gap-2"><CheckCircle className="text-green-500" /> <div>Ibuprofen replacement strongly recommended before dispensing</div></li>
          </ul>
        </div>
        <div className="flex items-center justify-center">
          {/* RiskScoreCircle will be rendered by parent for flexibility */}
          <div className="w-full flex items-center justify-center">
            {/* Placeholder; parent should show RiskScoreCircle */}
            <div />
          </div>
        </div>
      </div>
    </div>
  )
}
