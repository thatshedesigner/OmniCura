import React, { useEffect } from 'react'
import { RefreshCw, CheckCircle } from 'lucide-react'

const AGENTS = [
  { id: 1, name: 'Master Agent', desc: 'Breaking query into subtasks' },
  { id: 2, name: 'Genomic Insight Agent', desc: 'Analyzing genomic data' },
  { id: 3, name: 'Literature Intelligence Agent', desc: 'Scanning research papers' },
  { id: 4, name: 'Drug Repurposing Agent', desc: 'Identifying drug candidates' },
  { id: 5, name: 'Clinical Trials Agent', desc: 'Searching trial databases' },
  { id: 6, name: 'Patent Landscape Agent', desc: 'Analyzing patent status' },
]

export default function AgentPipeline({ query, agentsCompleted, setAgentsCompleted, onComplete }) {
  useEffect(() => {
    if (agentsCompleted >= 6) {
      const t = setTimeout(onComplete, 800)
      return () => clearTimeout(t)
    }
  }, [agentsCompleted])

  useEffect(() => {
    if (agentsCompleted === 0) return
  }, [agentsCompleted])

  useEffect(() => {
    // start interval only when analyzing
    if (agentsCompleted >= 6) return
    // handled by parent
  }, [])

  return (
    <div className="min-h-screen pt-32 flex flex-col items-center px-6">
      <h3 className="text-xl font-bold text-gray-900 text-center">Agentic Analysis in Progress</h3>

      <div className="w-full max-w-4xl mt-6">
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#3b82f6] h-2 rounded-full transition-all duration-700"
            style={{ width: `${(agentsCompleted / 6) * 100}%` }}
          />
        </div>
        <div className="text-center text-gray-500 text-sm mt-2">{agentsCompleted} of 6 agents completed</div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          {AGENTS.map((a, idx) => {
            const n = idx + 1
            let state = 'pending'
            if (agentsCompleted >= n) state = 'complete'
            else if (agentsCompleted + 1 === n) state = 'active'

            return (
              <div key={a.id} className={`rounded-xl border border-gray-200 p-4 ${state === 'active' ? 'bg-blue-50' : state === 'complete' ? 'bg-green-50' : 'bg-white'}`}>
                <div className="flex items-center gap-3">
                  <div>
                    {state === 'pending' && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold">{n}</div>
                    )}
                    {state === 'active' && (
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#3b82f6]"><RefreshCw className="animate-spin" size={18} /></div>
                    )}
                    {state === 'complete' && (
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle size={18} /></div>
                    )}
                  </div>
                  <div>
                    <div className={`font-semibold ${state === 'active' ? 'text-[#3b82f6]' : state === 'complete' ? 'text-green-700' : 'text-gray-800'}`}>{a.name}</div>
                    <div className={`text-sm ${state === 'active' ? 'text-[#2563eb]' : state === 'complete' ? 'text-green-600' : 'text-gray-500'}`}>{a.desc}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
