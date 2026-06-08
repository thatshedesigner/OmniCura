import React, { useEffect } from 'react'
import { ScanText, FlaskConical, RefreshCw, CheckCircle } from 'lucide-react'

export default function PrescriptionPipeline({ uploadedImage, ocrStep, setOcrStep, onComplete }) {
  useEffect(() => {
    let t1, t2
    if (uploadedImage?.toAnalyze) {
      setOcrStep(1)
      t1 = setTimeout(() => {
        setOcrStep(2)
        t2 = setTimeout(() => {
          setOcrStep(4)
          onComplete()
        }, 2000)
      }, 2000)
    }
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [uploadedImage?.toAnalyze])

  const progress = ocrStep === 0 ? 0 : ocrStep === 1 ? 25 : ocrStep === 2 ? 50 : ocrStep === 3 ? 75 : 100

  const StepCard = ({ step, title, desc, icon, state }) => (
    <div className={`rounded-xl border border-gray-200 p-4 bg-white w-full ${state === 'active' ? 'bg-blue-50' : state === 'complete' ? 'bg-green-50' : 'bg-white'}`}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[#3b82f6]">{icon}</div>
        <div>
          <div className={`font-semibold ${state === 'active' ? 'text-[#3b82f6]' : state === 'complete' ? 'text-green-700' : 'text-gray-800'}`}>{title}</div>
          <div className={`text-sm ${state === 'active' ? 'text-[#2563eb]' : state === 'complete' ? 'text-green-600' : 'text-gray-500'}`}>{desc}</div>
        </div>
        <div className="ml-auto">
          {state === 'pending' && <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">{step}</div>}
          {state === 'active' && <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#3b82f6]"><RefreshCw className="animate-spin" size={18} /></div>}
          {state === 'complete' && <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle size={18} /></div>}
        </div>
      </div>
    </div>
  )

  const s1 = ocrStep === 0 ? 'pending' : (ocrStep === 1 ? 'active' : (ocrStep >=2 ? 'complete' : 'pending'))
  const s2 = ocrStep < 2 ? 'pending' : (ocrStep === 2 ? 'active' : (ocrStep >=4 ? 'complete' : 'pending'))

  return (
    <div className="pt-8 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div className="bg-[#3b82f6] h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-6 space-y-4">
          <StepCard step={1} title="OCR + Handwriting Recognition" desc="Parsing handwritten drug names, dosages, and frequencies" icon={<ScanText />} state={s1} />
          <StepCard step={2} title="Medical NLP + Interaction Analysis" desc="Cross-referencing extracted drugs against interaction databases" icon={<FlaskConical />} state={s2} />
        </div>
      </div>
    </div>
  )
}
