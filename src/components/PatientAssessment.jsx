import React, { useEffect, useState } from 'react'
import {
  AlertTriangle,
  Check,
  ClipboardCopy,
  FileText,
  Home,
  Hospital,
  Printer,
  RotateCcw,
} from 'lucide-react'

const LOADING_STEPS = [
  'Checking for danger signs...',
  'Building differential...',
  'Identifying available actions...',
  'Setting monitoring criteria...',
  'Making escalation decision...',
]

const RESULT_STEPS = [
  { key: 'dangerSignCheck', title: 'Danger Sign Check' },
  { key: 'differential', title: 'Differential Assessment' },
  { key: 'recommendedAction', title: 'Recommended Action' },
  { key: 'monitoringPlan', title: 'Monitoring Plan' },
  { key: 'escalation', title: 'Escalation Decision' },
]

function FormattedText({ text }) {
  const lines = String(text || '').split('\n').filter((line) => line.trim())

  return (
    <div className="space-y-2 text-[15px] leading-7 text-emerald-50/90">
      {lines.map((line, index) => {
        const cleanedLine = line
          .replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '')
          .replace(/\*\*/g, '')
        const isListItem = /^\s*(?:[-*•]|\d+[.)])\s+/.test(line)

        return isListItem ? (
          <div key={`${cleanedLine}-${index}`} className="flex gap-3">
            <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
            <span>{cleanedLine}</span>
          </div>
        ) : (
          <p key={`${cleanedLine}-${index}`}>{cleanedLine}</p>
        )
      })}
    </div>
  )
}

function StepCard({ number, title, danger = false, children }) {
  return (
    <section className={`rounded-3xl border bg-white/5 p-5 shadow-xl shadow-black/10 backdrop-blur-md sm:p-7 ${
      danger
        ? 'animate-pulse border-red-400 ring-2 ring-red-400/30'
        : 'border-white/10'
    }`}>
      <div className="mb-5 flex items-center gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-black ${
          danger ? 'bg-red-500 text-white' : 'bg-emerald-300 text-[#0b2d20]'
        }`}>
          {number}
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200/70">
            Step {number}
          </div>
          <h2 className="mt-1 text-xl font-bold text-white">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  )
}

function LoadingView() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((step) => Math.min(step + 1, LOADING_STEPS.length - 1))
    }, 800)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#163b2b] px-5 py-12 text-white">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-10">
        <div className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">
          ASHA decision support
        </div>
        <h1 className="mt-3 text-3xl font-bold">Assessing the patient</h1>
        <p className="mt-2 text-emerald-50/65">Safety checks always come first.</p>

        <div className="mt-9 space-y-3">
          {LOADING_STEPS.map((label, index) => {
            const complete = index < activeStep
            const active = index === activeStep

            return (
              <div
                key={label}
                className={`flex items-center gap-4 rounded-2xl border px-4 py-4 transition-all duration-300 ${
                  active
                    ? 'animate-pulse border-emerald-300/70 bg-emerald-300/15 text-white'
                    : complete
                      ? 'border-emerald-300/20 bg-emerald-300/5 text-emerald-100'
                      : 'border-white/5 bg-black/5 text-emerald-50/35'
                }`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  active || complete ? 'bg-emerald-300 text-[#0b2d20]' : 'bg-white/5'
                }`}>
                  {complete ? <Check size={18} strokeWidth={3} /> : index + 1}
                </div>
                <span className="font-semibold">{label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default function PatientAssessment({ assessment, loading, error, onRetry, onNewPatient }) {
  const [copied, setCopied] = useState(false)

  if (loading) return <LoadingView />

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#163b2b] px-6 text-white">
        <div className="max-w-lg rounded-3xl border border-red-300/30 bg-white/5 p-7 text-center shadow-2xl backdrop-blur-md">
          <AlertTriangle className="mx-auto text-red-300" size={42} />
          <h1 className="mt-4 text-2xl font-bold">Assessment unavailable</h1>
          <p className="mt-2 text-emerald-50/75">{error}</p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={onRetry}
              className="rounded-xl bg-emerald-300 px-6 py-3 font-bold text-[#0b2d20]"
            >
              Try again
            </button>
            <button
              onClick={onNewPatient}
              className="rounded-xl border border-emerald-300 px-6 py-3 font-bold text-emerald-200 transition hover:bg-emerald-300/10"
            >
              Back to Patient Form
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (!assessment) return null

  const escalate = assessment.escalationDecision === 'ESCALATE'
  const escalationContent = `${assessment.escalationDecision}\n${assessment.escalationJustification}`

  const copyReferralNote = async () => {
    try {
      await navigator.clipboard.writeText(assessment.referralNote)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch (copyError) {
      console.error('Referral note copy failed:', copyError)
    }
  }

  return (
    <main className="assessment-results min-h-screen bg-[#163b2b] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">
            ASHA decision support
          </div>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Assessment Results</h1>
          <p className="mt-2 text-emerald-50/65">Decision support only. This is not a diagnosis.</p>
        </header>

        <div className={`mb-6 flex w-full items-center gap-4 rounded-3xl px-5 py-5 text-white shadow-xl sm:px-7 ${
          escalate ? 'bg-[#DC2626]' : 'bg-[#16A34A]'
        }`}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            {escalate ? <Hospital size={29} /> : <Home size={29} />}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">
              Assessment status
            </div>
            <div className="mt-1 text-xl font-black sm:text-2xl">
              {escalate ? 'REFER TO PHC IMMEDIATELY' : 'Continue Home Management'}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {RESULT_STEPS.map((step, index) => {
            const content = step.key === 'escalation'
              ? escalationContent
              : assessment[step.key]

            return (
              <StepCard
                key={step.key}
                number={index + 1}
                title={step.title}
                danger={index === 0 && assessment.isDangerSignPresent}
              >
                <FormattedText text={content} />
              </StepCard>
            )
          })}
        </div>

        {assessment.referralNote && (
          <section
            id="referral-note"
            className="referral-note mt-7 rounded-3xl bg-white p-6 text-slate-900 shadow-2xl sm:p-9"
          >
            <div className="flex flex-col gap-5 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <FileText size={23} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Referral document
                  </div>
                  <h2 className="mt-1 text-2xl font-black">ASHA Worker Referral Note</h2>
                </div>
              </div>

              <div className="referral-actions flex flex-wrap gap-3">
                <button
                  onClick={copyReferralNote}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 font-bold hover:bg-slate-50"
                >
                  {copied ? <Check size={18} /> : <ClipboardCopy size={18} />}
                  {copied ? 'Copied' : 'Copy Note'}
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 font-bold text-white hover:bg-slate-700"
                >
                  <Printer size={18} />
                  Print Note
                </button>
              </div>
            </div>

            <pre className="mt-6 whitespace-pre-wrap font-mono text-sm leading-7 text-slate-800">
              {assessment.referralNote}
            </pre>
          </section>
        )}

        <button
          onClick={onNewPatient}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 font-bold text-white transition hover:bg-white/10"
        >
          <RotateCcw size={19} />
          Back to New Patient
        </button>
      </div>
    </main>
  )
}
