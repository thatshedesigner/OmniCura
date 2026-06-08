import React, { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

const severityOrder = { critical: 0, severe: 1, moderate: 2, minor: 3 }

export default function InteractionCard({ inter, index, expandedInteraction, setExpandedInteraction }) {
  const expanded = expandedInteraction === index
  const classes = inter.severity === 'critical' ? 'border-l-4 border-red-500 bg-red-50' : inter.severity === 'severe' ? 'border-l-4 border-orange-500 bg-orange-50' : inter.severity === 'moderate' ? 'border-l-4 border-yellow-500 bg-yellow-50' : 'border-l-4 border-green-500 bg-green-50'

  return (
    <div className={`rounded-xl p-4 ${classes}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="font-bold text-gray-900 text-base">{inter.pair}</div>
          <div className="text-xs uppercase text-gray-400">INTERACTION TYPE</div>
          <div className="text-sm text-gray-700">{inter.type}</div>
        </div>
        <div className="text-right">
          <div className={`text-xs font-black uppercase tracking-wider ${inter.severity === 'critical' ? 'text-red-700' : inter.severity === 'severe' ? 'text-orange-700' : inter.severity === 'moderate' ? 'text-yellow-700' : 'text-green-700'}`}>{inter.severity.toUpperCase()}</div>
        </div>
      </div>
      <div className="mt-3 text-xs uppercase text-gray-400">CLINICAL SIGNIFICANCE</div>
      <div className="text-sm text-gray-700">{inter.significance}</div>

      <div className="mt-3 text-xs uppercase text-gray-400">RECOMMENDATION</div>
      <div className="text-sm text-gray-700">{inter.recommendation}</div>

      <div className="mt-3">
        <div onClick={() => setExpandedInteraction(expanded ? null : index)} className="text-xs text-[#3b82f6] cursor-pointer">View Details {expanded ? '↑' : '↓'}</div>
        <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96' : 'max-h-0'}`}>
          <div className="mt-3 text-sm text-gray-700">
            <div className="font-semibold">Mechanism:</div>
            <div className="mt-1">{inter.mechanism}</div>
            <div className="mt-2 font-semibold">Alternatives:</div>
            <div className="mt-1">{inter.alternatives}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
