import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import SearchLanding from './components/SearchLanding'
import AgentPipeline from './components/AgentPipeline'
import ResultsPage from './components/ResultsPage'
import ModeSwitcher from './components/ModeSwitcher'
import UploadZone from './components/UploadZone'
import PrescriptionPipeline from './components/PrescriptionPipeline'
import ExtractedDrugsTable from './components/ExtractedDrugsTable'
import InteractionCard from './components/InteractionCard'
import ClinicalSummary from './components/ClinicalSummary'
import RiskScoreCircle from './components/RiskScoreCircle'
import { mock } from './data/mockData'
import { AlertTriangle } from 'lucide-react'
import { SAMPLE_EXTRACT, sampleBase64, INTERACTION_DB } from './data/prescriptionMock'
import SessionSetup from './components/SessionSetup'
import { useSession } from './context/SessionContext'
import SymptomIntake from './components/SymptomIntake'
import PatientAssessment from './components/PatientAssessment'

export default function App() {
  const { sessionStarted, district, month, inventory } = useSession()
  const [query, setQuery] = useState('')
  const [phase, setPhase] = useState('idle') // idle | analyzing | results
  const [agentsCompleted, setAgentsCompleted] = useState(0)
  const [showToast, setShowToast] = useState(false)
  // Prescription analyzer states
  const [mode, setMode] = useState('repurposing') // 'repurposing' | 'prescription'
  const [prescriptionPhase, setPrescriptionPhase] = useState('upload') // upload | analyzing | results
  const [uploadedImage, setUploadedImage] = useState(null)
  const [ocrStep, setOcrStep] = useState(0)
  const [extractedDrugs, setExtractedDrugs] = useState([])
  const [interactions, setInteractions] = useState([])
  const [expandedInteraction, setExpandedInteraction] = useState(null)
  const [prescriptionError, setPrescriptionError] = useState(null)
  const [patientProfile, setPatientProfile] = useState(null)
  const [patientAssessment, setPatientAssessment] = useState(null)
  const [assessmentLoading, setAssessmentLoading] = useState(false)
  const [assessmentError, setAssessmentError] = useState(null)

  useEffect(() => {
    let interval
    if (phase === 'analyzing') {
      interval = setInterval(() => {
        setAgentsCompleted((c) => {
          if (c >= 6) {
            clearInterval(interval)
            return 6
          }
          return c + 1
        })
      }, 1500)
    }
    return () => clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (agentsCompleted === 6 && phase === 'analyzing') {
      setTimeout(() => setPhase('results'), 800)
    }
  }, [agentsCompleted])

  function startAnalysis() {
    if (!query) return
    setPhase('analyzing')
    setAgentsCompleted(0)
  }

  function handleComplete() {
    setPhase('results')
  }

  function handleDownload() {
    // simple PDF blob simulation
    const blob = new Blob([`OmniCura Report for ${mock.gene}\n\nSummary:\n${mock.summary.recommendation}`], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `OmniCura-${mock.gene}-report.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 4000)
  }

  // Prescription analyzer helpers
  const analyzePrescription = async (base64Image, mediaType) => {
    console.log('=== PRESCRIPTION ANALYSIS START ===')
    console.log('Image base64 length:', base64Image?.length)
    console.log('Media type:', mediaType)

    if (!base64Image || !mediaType) {
      throw new Error('Uploaded image is missing base64 data or a media type')
    }

    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Image, mediaType })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error || `Prescription API failed with ${response.status}`)
    }

    const data = await response.json()

    if (!Array.isArray(data.drugs)) {
      throw new Error('Gemini returned an invalid prescription format')
    }

    return data
  }

  // start analyzing when uploadedImage.toAnalyze is set (file Analyze button)
  useEffect(() => {
    if (uploadedImage?.toAnalyze) {
      setPrescriptionError(null)
      setExtractedDrugs([])
      setInteractions([])
      setPrescriptionPhase('analyzing')
    }
  }, [uploadedImage?.toAnalyze])

  const findInteractions = (drugs) => {
    const names = drugs.map(d => d.name.toLowerCase())
    const results = []
    for (const rule of INTERACTION_DB) {
      const [a,b] = rule.drugs
      if (names.includes(a) && names.includes(b) || names.includes(b) && names.includes(a)) {
        results.push({
          pair: `${a.charAt(0).toUpperCase()+a.slice(1)} ↔ ${b.charAt(0).toUpperCase()+b.slice(1)}`,
          severity: rule.severity,
          type: rule.type,
          significance: rule.significance,
          recommendation: rule.recommendation,
          mechanism: rule.mechanism || 'See clinical literature for mechanism.',
          alternatives: rule.alternatives || 'Consider alternatives per guideline.'
        })
      }
    }
    // sort by severity
    const order = { critical: 0, severe: 1, moderate: 2, minor: 3 }
    results.sort((x,y) => order[x.severity] - order[y.severity])
    return results
  }

  const handlePrescriptionComplete = async () => {
    // perform API analyze (or fallback)
    console.log('handlePrescriptionComplete called')
    console.log('uploadedImage:', {
      hasBase64: !!uploadedImage.base64,
      base64Length: uploadedImage.base64?.length,
      mediaType: uploadedImage.mediaType,
      filename: uploadedImage.filename
    })
    
    try {
      const res = uploadedImage.isDemo
        ? SAMPLE_EXTRACT
        : await analyzePrescription(uploadedImage.base64, uploadedImage.mediaType)
      const drugs = res.drugs

      setExtractedDrugs(drugs)
      setInteractions(findInteractions(drugs))
      setPrescriptionPhase('results')
    } catch (error) {
      console.error('Prescription analysis failed:', error)
      setPrescriptionError('This prescription could not be analyzed. Check the image quality and try again.')
      setUploadedImage((image) => ({ ...image, toAnalyze: false }))
      setPrescriptionPhase('upload')
    }
  }

  const assessPatient = async (profile) => {
    const normalizedProfile = {
      age: {
        value: profile.basics.age,
        unit: profile.basics.ageUnit,
      },
      sex: profile.basics.sex,
      pregnancy: profile.basics.pregnancyStatus === 'Possibly pregnant'
        ? 'possible'
        : profile.basics.pregnancyStatus === 'Confirmed pregnant'
          ? 'confirmed'
          : 'none',
      symptoms: profile.symptoms,
      vitals: {
        temperature: profile.vitals.temperatureCelsius,
        breathingRate: profile.vitals.breathingRatePerMinute,
        muac: profile.vitals.muacCm,
        pallor: profile.vitals.pallorVisible,
        jaundice: profile.vitals.jaundiceVisible,
      },
      duration: profile.duration,
      patientWords: profile.patientWords || '',
      district,
      month,
      ashaKit: Object.entries(inventory)
        .filter(([, available]) => available)
        .map(([item]) => item),
    }

    setPatientProfile(normalizedProfile)
    setPatientAssessment(null)
    setAssessmentError(null)
    setAssessmentLoading(true)

    try {
      const response = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientProfile: normalizedProfile }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Assessment could not be completed')
      }
      setPatientAssessment(data)
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientProfile: normalizedProfile,
          assessment: data,
        }),
      }).catch((logError) => {
        console.error('Assessment logging failed:', logError)
      })
    } catch (error) {
      console.error('Patient assessment failed:', error)
      setAssessmentError('The assessment could not be completed. Refer if the patient looks seriously ill.')
    } finally {
      setAssessmentLoading(false)
    }
  }

  if (!sessionStarted) {
    return <SessionSetup />
  }

  if (!patientProfile) {
    return <SymptomIntake onSubmit={assessPatient} />
  }

  if (!patientAssessment || assessmentLoading || assessmentError) {
    return (
      <PatientAssessment
        assessment={patientAssessment}
        loading={assessmentLoading}
        error={assessmentError}
        onRetry={() => assessPatient({
          basics: {
            age: patientProfile.age.value,
            ageUnit: patientProfile.age.unit,
            sex: patientProfile.sex,
            pregnancyStatus: patientProfile.pregnancy === 'possible'
              ? 'Possibly pregnant'
              : patientProfile.pregnancy === 'confirmed'
                ? 'Confirmed pregnant'
                : null,
          },
          symptoms: patientProfile.symptoms,
          vitals: {
            temperatureCelsius: patientProfile.vitals.temperature,
            breathingRatePerMinute: patientProfile.vitals.breathingRate,
            muacCm: patientProfile.vitals.muac,
            pallorVisible: patientProfile.vitals.pallor,
            jaundiceVisible: patientProfile.vitals.jaundice,
          },
          duration: patientProfile.duration,
          patientWords: patientProfile.patientWords,
        })}
        onNewPatient={() => {
          setPatientProfile(null)
          setPatientAssessment(null)
          setAssessmentError(null)
        }}
      />
    )
  }

  return (
    <PatientAssessment
      assessment={patientAssessment}
      loading={false}
      error={null}
      onRetry={() => assessPatient({
        basics: {
          age: patientProfile.age.value,
          ageUnit: patientProfile.age.unit,
          sex: patientProfile.sex,
          pregnancyStatus: patientProfile.pregnancy === 'possible'
            ? 'Possibly pregnant'
            : patientProfile.pregnancy === 'confirmed'
              ? 'Confirmed pregnant'
              : null,
        },
        symptoms: patientProfile.symptoms,
        vitals: {
          temperatureCelsius: patientProfile.vitals.temperature,
          breathingRatePerMinute: patientProfile.vitals.breathingRate,
          muacCm: patientProfile.vitals.muac,
          pallorVisible: patientProfile.vitals.pallor,
          jaundiceVisible: patientProfile.vitals.jaundice,
        },
        duration: patientProfile.duration,
        patientWords: patientProfile.patientWords,
      })}
      onNewPatient={() => {
        setPatientProfile(null)
        setPatientAssessment(null)
        setAssessmentError(null)
      }}
    />
  )

  return (
      <div className="min-h-screen">
        <Navbar />
        <ModeSwitcher mode={mode} setMode={setMode} />

        {mode === 'repurposing' && (
        <>
          {phase === 'idle' && (
            <SearchLanding query={query} setQuery={setQuery} onSubmit={startAnalysis} />
          )}

          {phase === 'analyzing' && (
            <div>
              <div className="pt-24 px-6 max-w-6xl mx-auto">
                <div className="flex items-center gap-3">
                  <div className="relative w-[700px] max-w-full">
                    <input value={query} readOnly className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm" />
                  </div>
                  <button className="bg-[#3b82f6] text-white px-6 py-3 rounded-xl font-semibold opacity-75 cursor-not-allowed">Analyzing...</button>
                </div>
              </div>
              <AgentPipeline query={query} agentsCompleted={agentsCompleted} setAgentsCompleted={setAgentsCompleted} onComplete={handleComplete} />
            </div>
          )}

          {phase === 'results' && (
            <div>
              <div className="pt-24 px-6 max-w-6xl mx-auto">
                <div className="flex items-center gap-3">
                  <div className="relative w-[700px] max-w-full">
                    <input value={query} readOnly className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm" />
                  </div>
                  <button onClick={() => { setPhase('analyzing'); setAgentsCompleted(0) }} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-3 rounded-xl font-semibold">Analyze</button>
                </div>
              </div>
              <ResultsPage query={query} onDownload={handleDownload} />
            </div>
          )}
        </>
      )}

      {mode === 'prescription' && (
        <div className="pt-6">
          <div className="flex justify-center">
            <div className="w-full max-w-4xl px-6">
              {prescriptionPhase === 'upload' && (
                <UploadZone uploadedImage={uploadedImage} setUploadedImage={setUploadedImage} analysisError={prescriptionError} onClearError={() => setPrescriptionError(null)} onError={setPrescriptionError} onUseSample={() => {
                  // load demo prescription
                  const dataUrl = sampleBase64
                  const base64 = dataUrl.split(',')[1]
                  setPrescriptionError(null)
                  setUploadedImage({ base64, mediaType: 'image/png', filename: 'demo-prescription.png', previewUrl: dataUrl, toAnalyze: true, isDemo: true })
                  setPrescriptionPhase('analyzing')
                }} />
              )}

              {prescriptionPhase === 'analyzing' && (
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-2xl">
                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                      <img src={uploadedImage.previewUrl} className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                      <div className="text-sm text-gray-500">{uploadedImage.filename} • Analyzing...</div>
                    </div>
                    <PrescriptionPipeline uploadedImage={uploadedImage} ocrStep={ocrStep} setOcrStep={setOcrStep} onComplete={() => { setOcrStep(4); handlePrescriptionComplete() }} />
                  </div>
                </div>
              )}

              {prescriptionPhase === 'results' && (
                <div className="flex flex-col items-center">
                  <ExtractedDrugsTable uploadedImage={uploadedImage} extractedDrugs={extractedDrugs} />

                  <div className="mt-6 w-full max-w-4xl">
                    <div className="rounded-xl p-6 bg-white border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center"><AlertTriangle /></div>
                          <div>
                            <div className="font-bold text-lg">Drug Interaction Analysis</div>
                            <div className="text-xs font-semibold tracking-widest uppercase text-gray-400">REAL-TIME SAFETY CHECK</div>
                          </div>
                        </div>
                        <div>
                          <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">{interactions.filter(i=>i.severity==='critical').length} Critical · {interactions.filter(i=>i.severity==='severe').length} Severe</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex gap-3 text-xs text-gray-600">
                          <div className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full" /> Critical</div>
                          <div className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500 rounded-full" /> Severe</div>
                          <div className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-500 rounded-full" /> Moderate</div>
                          <div className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full" /> Minor</div>
                        </div>

                        <div className="mt-4 space-y-4">
                          {interactions.length === 0 ? (
                            <div className="rounded-xl p-6 bg-green-50 border border-green-100 text-green-700">No dangerous interactions detected</div>
                          ) : (
                            interactions.map((it, idx) => (
                              <InteractionCard key={idx} inter={it} index={idx} expandedInteraction={expandedInteraction} setExpandedInteraction={setExpandedInteraction} />
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ClinicalSummary extractedDrugs={extractedDrugs} interactions={interactions} showDownload={!uploadedImage?.isDemo} onDownload={() => { handleDownload(); setShowToast(true); setTimeout(()=>setShowToast(false),4000) }} onReset={() => { setPrescriptionPhase('upload'); setUploadedImage(null); setExtractedDrugs([]); setInteractions([]); setPrescriptionError(null) }} />
                      <div className="flex items-center justify-center">
                        {/* Risk score logic */}
                        <RiskScoreCircle level={interactions.filter(i=>i.severity==='critical').length >=2 ? 'HIGH' : (interactions.filter(i=>i.severity==='critical').length===1 || interactions.filter(i=>i.severity==='severe').length>=2 ? 'MEDIUM' : 'LOW')} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 w-72">
          <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-200">
            <div className="font-semibold">Report Generated Successfully</div>
            <div className="text-sm text-gray-500">Your clinical report has been prepared for download.</div>
          </div>
        </div>
      )}
    </div>
  )
}
