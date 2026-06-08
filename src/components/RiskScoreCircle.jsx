import React from 'react'

export default function RiskScoreCircle({ level }) {
  const mapping = {
    HIGH: { bg: 'bg-red-500', label: 'HIGH' },
    MEDIUM: { bg: 'bg-orange-500', label: 'MEDIUM' },
    LOW: { bg: 'bg-green-500', label: 'LOW' },
  }
  const { bg, label } = mapping[level]
  return (
    <div className="flex flex-col items-center">
      <div className="text-xs uppercase text-gray-400">OVERALL RISK LEVEL</div>
      <div className={`w-36 h-36 rounded-full ${bg} flex items-center justify-center mt-3`}>
        <div className="text-2xl font-black text-white">{label}</div>
      </div>
      <div className="mt-2 text-sm font-semibold text-gray-700">{level === 'HIGH' ? 'Physician Review Required' : level === 'MEDIUM' ? 'Consider Review' : 'Low Risk'}</div>
    </div>
  )
}
