import React from 'react'
import { Dna } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-[#3b82f6] flex items-center justify-center text-white">
          <Dna size={18} />
        </div>
        <div>
          <div className="font-bold text-lg">OmniCura</div>
          <div className="text-sm text-gray-400">Agentic AI for Drug Repurposing & Genomic Discovery</div>
        </div>
      </div>
    </header>
  )
}
