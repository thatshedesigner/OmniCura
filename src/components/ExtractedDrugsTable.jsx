import React from 'react'

export default function ExtractedDrugsTable({ uploadedImage, extractedDrugs }) {
  return (
    <div className="rounded-xl p-6 bg-white border border-gray-200 w-full">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#3b82f6] flex items-center justify-center">📄</div>
          <div>
            <div className="font-bold text-lg">Extracted Prescription</div>
            <div className="text-xs font-semibold tracking-widest uppercase text-gray-400">OCR RESULTS</div>
          </div>
        </div>
        <div>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Parsed Successfully</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="text-xs uppercase text-gray-400">Original Prescription</div>
          <img src={uploadedImage.previewUrl} alt="prescription" className="mt-2 rounded-xl border border-gray-200 w-full object-contain max-h-64" />
        </div>
        <div>
          <div className="text-xs uppercase text-gray-400">EXTRACTED MEDICATIONS</div>
          <div className="mt-3 bg-white rounded-md">
            <div className="divide-y divide-gray-100">
              <div className="grid grid-cols-4 text-xs text-gray-400 p-3">
                <div>DRUG NAME</div>
                <div>DOSAGE</div>
                <div>FREQUENCY</div>
                <div>CONFIDENCE</div>
              </div>
              {extractedDrugs.map((d, i) => (
                <div key={i} className="grid grid-cols-4 items-center p-3 text-sm">
                  <div className="font-semibold text-gray-900 font-mono">{d.name}</div>
                  <div className="text-gray-700">{d.dosage}</div>
                  <div className="text-gray-600">{d.frequency}</div>
                  <div>
                    <span className={`${d.confidence >= 90 ? 'bg-green-100 text-green-700' : d.confidence >=70 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'} text-xs px-2 py-0.5 rounded-full`}>{d.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-400 italic">⚡ Extracted using Anthropic Vision API with medical NLP</div>
        </div>
      </div>
    </div>
  )
}
