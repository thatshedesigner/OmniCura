import React from 'react'
import { Dna, BookOpen, Pill, FlaskConical, FileText, Star, CheckCircle, MapPin, TrendingUp, AlertTriangle, Download } from 'lucide-react'
import { mock } from '../data/mockData'

function Badge({ children, className = '' }) {
  return <span className={`text-xs font-semibold px-3 py-1 rounded-full ${className}`}>{children}</span>
}

export default function ResultsPage({ query, onDownload }) {
  return (
    <div className="pt-28 pb-20 max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genomic Insights */}
        <div className="rounded-xl p-6 bg-[#f9fafb] border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#3b82f6] flex items-center justify-center"><Dna /></div>
              <div>
                <div className="font-bold text-lg">Genomic Insights</div>
                <div className="text-xs font-semibold tracking-widest uppercase text-gray-400">GENE ANALYSIS</div>
              </div>
            </div>
            <div>
              <Badge className="bg-[#10b981] text-white">{mock.confidence}% Confidence</Badge>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-3xl font-black text-gray-900 mb-4">{mock.gene}</div>

            <div className="text-xs font-semibold tracking-widest uppercase text-gray-400">BIOLOGICAL FUNCTION</div>
            <p className="mt-2 text-sm text-gray-700">{mock.biologicalFunction}</p>

            <div className="mt-4 text-xs font-semibold tracking-widest uppercase text-gray-400">ASSOCIATED DISEASES</div>
            <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
              {mock.diseases.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>

            <div className="mt-4 text-xs font-semibold tracking-widest uppercase text-gray-400">PATHOGENIC VARIANTS</div>
            <div className="mt-2 flex gap-2 flex-wrap">
              {mock.pathogenicVariants.map((v) => (
                <div key={v} className="bg-red-100 text-red-700 border border-red-200 rounded-md px-3 py-1 text-xs font-mono flex items-center gap-2">
                  <AlertTriangle size={14} />
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Literature Intelligence */}
        <div className="rounded-xl p-6 bg-white border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center"><BookOpen /></div>
            <div>
              <div className="font-bold text-lg">Literature Intelligence</div>
              <div className="text-xs font-semibold tracking-widest uppercase text-gray-400">RESEARCH FINDINGS</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="flex flex-col gap-6">
                {mock.literature.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-purple-600 rounded-full mt-1" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">{entry.year} <span className="text-gray-400 font-normal">|</span> <span className="italic text-gray-500">{entry.journal}</span></div>
                      <div className="text-sm text-gray-700 mt-1">{entry.finding}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Drug Repurposing */}
        <div className="rounded-xl p-6 bg-white border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 text-green-500 flex items-center justify-center"><Pill /></div>
            <div>
              <div className="font-bold text-lg">Drug Repurposing Opportunities</div>
              <div className="text-xs font-semibold tracking-widest uppercase text-gray-400">CANDIDATE DRUGS</div>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {mock.drugs.map((d) => (
              <div key={d.name} className="border border-gray-200 rounded-xl p-4 bg-white">
                <div className="font-mono text-xl font-semibold text-gray-900">{d.name}</div>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs uppercase text-gray-400">ORIGINAL</div>
                    <div className="text-sm text-gray-700">{d.original}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-gray-400">PROPOSED</div>
                    <div className="text-sm text-green-600 font-semibold">{d.proposed} →</div>
                  </div>
                </div>
                <div className="mt-3 text-xs uppercase text-gray-400">MECHANISM OF ACTION</div>
                <div className="mt-1 text-sm text-gray-700">{d.mechanism}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Trials */}
        <div className="rounded-xl p-6 bg-white border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center"><FlaskConical /></div>
            <div>
              <div className="font-bold text-lg">Clinical Trials</div>
              <div className="text-xs font-semibold tracking-widest uppercase text-gray-400">TRIAL DATABASE</div>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {mock.trials.map((t) => (
              <div key={t.id} className="border border-gray-200 rounded-xl p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${t.phase.includes('3') ? 'bg-blue-100 text-blue-800' : t.phase.includes('2') ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>{t.phase}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === 'Recruiting' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>{t.status}</span>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={14} />{t.location}</div>
                </div>
                <div className="mt-2 font-semibold text-gray-900">{t.name}</div>
                <div className="mt-1 text-xs font-mono text-gray-400">{t.id}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patent Landscape full width */}
      <div className="mt-6 rounded-xl p-6 bg-white border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center"><FileText /></div>
          <div>
            <div className="font-bold text-lg">Patent Landscape</div>
            <div className="text-xs font-semibold tracking-widest uppercase text-gray-400">INTELLECTUAL PROPERTY ANALYSIS</div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400">
              <tr>
                <th className="p-3">PATENT ID</th>
                <th className="p-3">TITLE</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">YEAR</th>
                <th className="p-3">REPURPOSING</th>
              </tr>
            </thead>
            <tbody>
              {mock.patents.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="p-3 font-mono text-sm">{p.id}</td>
                  <td className="p-3">{p.title}</td>
                  <td className="p-3">
                    {p.status === 'Active' ? (
                      <span className="bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs font-medium">Active</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs font-medium">Expired</span>
                    )}
                  </td>
                  <td className="p-3">{p.year}</td>
                  <td className="p-3 text-green-600">✓</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Analysis Summary */}
      <div className="mt-6 rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center"><Star /></div>
            <div>
              <div className="font-bold text-xl">AI Analysis Summary</div>
              <div className="text-xs font-semibold tracking-widest uppercase text-gray-400">CLINICAL-GRADE REPORT</div>
            </div>
          </div>

          <div className="ml-auto text-right">
            <button onClick={onDownload} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2">
              <Download /> Download Report (PDF)
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2"><TrendingUp className="text-green-500" /> <div className="font-semibold text-gray-900">Key Findings</div></div>
            <ul className="mt-3 space-y-2">
              {mock.summary.keyFindings.map((k) => (
                <li key={k} className="flex items-start gap-2">
                  <div className="text-green-500 mt-1"><CheckCircle /></div>
                  <div className="text-sm text-gray-700">{k}</div>
                </li>
              ))}
            </ul>

            <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4">
              <div className="font-bold">Repurposing Recommendation</div>
              <div className="mt-2 text-sm text-gray-700">{mock.summary.recommendation}</div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="text-xs uppercase text-gray-400">OVERALL CONFIDENCE</div>
            <div className="w-36 h-36 rounded-full bg-[#10b981] flex items-center justify-center mt-3">
              <div className="text-4xl font-black text-white">{mock.summary.overallConfidence}%</div>
            </div>
            <div className="mt-2 text-sm font-semibold text-gray-700">High Confidence</div>
          </div>
        </div>
      </div>
    </div>
  )
}
