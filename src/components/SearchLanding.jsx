import React from 'react'
import { Search } from 'lucide-react'

export default function SearchLanding({ query, setQuery, onSubmit }) {
  const examples = ['BRCA1 Repurposing', "APOE in Alzheimer's", 'TP53 Trials']

  return (
    <div className="min-h-screen flex items-center justify-center pt-24">
      <div className="w-full max-w-4xl px-6">
        <div className="flex items-center justify-center gap-3">
          <div className="relative w-[700px] max-w-full">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
              placeholder="Ask about genes, drugs, diseases, or repurposing opportunities..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
          </div>
          <button
            onClick={onSubmit}
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Analyze
          </button>
        </div>

        <div className="mt-16 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <Search size={32} className="text-gray-400" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Start Your Biomedical Analysis</h2>
          <p className="mt-2 text-gray-500 text-center max-w-md mx-auto">
            Enter a query about genes, drugs, diseases, or repurposing opportunities to begin the agentic AI analysis.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => {
                  setQuery(ex)
                  setTimeout(onSubmit, 150)
                }}
                className="border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
