import React from 'react'
import { Dna, FileText } from 'lucide-react'

export default function ModeSwitcher({ mode, setMode }) {
  return (
    <div className="pt-20 flex justify-center">
      <div className="bg-gray-100 rounded-full p-1 inline-flex gap-1">
        <button onClick={() => setMode('repurposing')} className={`px-4 py-2 rounded-full flex items-center gap-2 ${mode === 'repurposing' ? 'bg-[#3b82f6] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          <Dna size={16} /> Drug Repurposing
        </button>
        <button onClick={() => setMode('prescription')} className={`px-4 py-2 rounded-full flex items-center gap-2 ${mode === 'prescription' ? 'bg-[#3b82f6] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          <FileText size={16} /> Prescription Analyzer
        </button>
      </div>
    </div>
  )
}
