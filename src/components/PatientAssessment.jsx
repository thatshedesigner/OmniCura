import React from 'react'
import { AlertTriangle, ClipboardList, LoaderCircle, RotateCcw } from 'lucide-react'

function StepCard({ number, title, children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-400 font-bold text-[#06211f]">
          {number}
        </div>
        <h2 className="text-lg font-bold text-white">STEP {number} - {title}</h2>
      </div>
      {children}
    </section>
  )
}

function ReasoningText({ children }) {
  return (
    <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
      {children}
    </div>
  )
}

export default function PatientAssessment({ assessment, loading, error, onRetry, onNewPatient }) {
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#061725] px-6 text-white">
        <div className="text-center">
          <LoaderCircle className="mx-auto animate-spin text-teal-300" size={42} />
          <h1 className="mt-5 text-2xl font-bold">Checking danger signs first</h1>
          <p className="mt-2 text-slate-400">Please wait while the patient details are assessed.</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#061725] px-6 text-white">
        <div className="max-w-lg rounded-3xl border border-red-400/30 bg-red-400/10 p-7 text-center backdrop-blur-md">
          <AlertTriangle className="mx-auto text-red-300" size={40} />
          <h1 className="mt-4 text-2xl font-bold">Assessment unavailable</h1>
          <p className="mt-2 text-slate-300">{error}</p>
          <button onClick={onRetry} className="mt-5 rounded-xl bg-teal-400 px-6 py-3 font-bold text-[#06211f]">
            Try again
          </button>
        </div>
      </main>
    )
  }

  const escalate = assessment.escalationDecision === 'ESCALATE'

  return (
    <main className="min-h-screen bg-[#061725] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
              ASHA decision support
            </div>
            <h1 className="mt-2 text-3xl font-bold">Patient assessment</h1>
            <p className="mt-2 text-slate-400">This is guidance, not a diagnosis.</p>
          </div>
          <div className={`rounded-2xl border px-5 py-3 text-lg font-black ${
            escalate
              ? 'border-red-400/50 bg-red-400/15 text-red-200'
              : 'border-teal-400/50 bg-teal-400/15 text-teal-100'
          }`}>
            {assessment.escalationDecision}
          </div>
        </header>

        <div className="space-y-5">
          <StepCard number="1" title="DANGER SIGN CHECK">
            {assessment.isDangerSignPresent && (
              <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 font-bold text-red-200">
                ESCALATE IMMEDIATELY
              </div>
            )}
            <ReasoningText>{assessment.dangerSignCheck}</ReasoningText>
          </StepCard>

          <StepCard number="2" title="DIFFERENTIAL">
            <ReasoningText>{assessment.differential}</ReasoningText>
          </StepCard>

          <StepCard number="3" title="RECOMMENDED ACTION">
            <ReasoningText>{assessment.recommendedAction}</ReasoningText>
          </StepCard>

          <StepCard number="4" title="MONITORING PLAN">
            <ReasoningText>{assessment.monitoringPlan}</ReasoningText>
          </StepCard>

          <StepCard number="5" title="ESCALATION DECISION">
            <div className={`rounded-2xl border p-5 ${
              escalate ? 'border-red-400/30 bg-red-400/10' : 'border-teal-400/30 bg-teal-400/10'
            }`}>
              <div className="text-2xl font-black">{assessment.escalationDecision}</div>
              <p className="mt-2 text-slate-200">{assessment.escalationJustification}</p>
            </div>

            {assessment.referralNote && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="mb-3 flex items-center gap-2 font-bold text-white">
                  <ClipboardList size={19} className="text-teal-300" />
                  Referral note
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-slate-200">
                  {assessment.referralNote}
                </pre>
              </div>
            )}
          </StepCard>
        </div>

        <button
          onClick={onNewPatient}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white hover:bg-white/10"
        >
          <RotateCcw size={19} />
          Start new patient
        </button>
      </div>
    </main>
  )
}
