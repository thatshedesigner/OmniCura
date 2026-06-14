import React, { useEffect, useMemo, useState } from 'react'
import { Activity, Clock3, HeartPulse, UserRound } from 'lucide-react'

const SYMPTOMS = [
  { icon: '🌡️', label: 'Fever' },
  { icon: '😮‍💨', label: 'Cough' },
  { icon: '🫁', label: 'Breathing difficulty' },
  { icon: '🤮', label: 'Vomiting' },
  { icon: '💩', label: 'Diarrhea' },
  { icon: '🔴', label: 'Rash' },
  { icon: '🦵', label: 'Swelling' },
  { icon: '⚡', label: 'Convulsions' },
  { icon: '😵', label: 'Unconscious/Unresponsive' },
  { icon: '💔', label: 'Chest pain' },
  { icon: '🤕', label: 'Belly pain' },
  { icon: '🤯', label: 'Severe headache' },
  { icon: '🩸', label: 'Bleeding' },
  { icon: '🚫', label: 'Not eating/drinking' },
  { icon: '👁️', label: 'Yellow eyes/skin' },
  { icon: '😰', label: 'Very weak/cannot stand' },
]

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20'

function ToggleGroup({ label, value, options, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-slate-200">{label}</legend>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`min-h-12 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
              value === option
                ? 'border-teal-400 bg-teal-400/15 text-teal-100'
                : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function YesNoToggle({ label, hint, value, onChange }) {
  return (
    <div>
      <div className="text-sm font-semibold text-slate-200">{label}</div>
      <div className="mt-1 text-xs text-slate-400">{hint}</div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {['Yes', 'No'].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-xl border px-4 py-3 font-semibold transition ${
              value === option
                ? 'border-teal-400 bg-teal-400/15 text-teal-100'
                : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function SectionCard({ icon, title, subtitle, children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-300/20 bg-teal-300/10 text-teal-200">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

export default function SymptomIntake({ onSubmit }) {
  const [age, setAge] = useState('')
  const [ageUnit, setAgeUnit] = useState('years')
  const [sex, setSex] = useState('')
  const [pregnancyStatus, setPregnancyStatus] = useState('')
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [temperature, setTemperature] = useState('')
  const [breathingRate, setBreathingRate] = useState('')
  const [muac, setMuac] = useState('')
  const [pallor, setPallor] = useState('')
  const [jaundice, setJaundice] = useState('')
  const [duration, setDuration] = useState('')
  const [durationUnit, setDurationUnit] = useState('days')
  const [patientWords, setPatientWords] = useState('')

  const numericAge = Number(age)
  const ageInYears = ageUnit === 'months' ? numericAge / 12 : numericAge
  const showPregnancy = sex === 'Female' && age !== '' && ageInYears >= 12 && ageInYears <= 49
  const showMuac = age !== '' && ageInYears < 5

  useEffect(() => {
    if (!showPregnancy) {
      setPregnancyStatus('')
    }
  }, [showPregnancy])

  useEffect(() => {
    if (!showMuac) {
      setMuac('')
    }
  }, [showMuac])

  const formComplete = useMemo(() => {
    const basicsComplete = age !== '' && numericAge >= 0 && Boolean(sex)
    const pregnancyComplete = !showPregnancy || Boolean(pregnancyStatus)
    return basicsComplete && pregnancyComplete
  }, [age, numericAge, sex, showPregnancy, pregnancyStatus])

  const toggleSymptom = (label) => {
    setSelectedSymptoms((current) => (
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    ))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!formComplete) return

    const patientProfile = {
      basics: {
        age: numericAge,
        ageUnit,
        sex,
        pregnancyStatus: showPregnancy ? pregnancyStatus : null,
      },
      symptoms: selectedSymptoms,
      vitals: {
        temperatureCelsius: temperature === '' ? null : Number(temperature),
        breathingRatePerMinute: breathingRate === '' ? null : Number(breathingRate),
        muacCm: showMuac && muac !== '' ? Number(muac) : null,
        pallorVisible: pallor === '' ? null : pallor === 'Yes',
        jaundiceVisible: jaundice === '' ? null : jaundice === 'Yes',
      },
      duration: {
        value: duration === '' ? null : Number(duration),
        unit: durationUnit,
      },
      patientWords: patientWords.trim() || null,
      recordedAt: new Date().toISOString(),
    }

    onSubmit(patientProfile)
  }

  return (
    <main className="min-h-screen bg-[#061725] px-4 py-8 text-white sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="mx-auto max-w-6xl">
        <header className="mb-7">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
            Patient consultation
          </div>
          <h1 className="mt-2 text-3xl font-bold">What do you see and hear?</h1>
          <p className="mt-2 max-w-2xl text-slate-400">
            Tap what applies. Add only measurements you can take.
          </p>
        </header>

        <div className="space-y-5">
          <SectionCard
            icon={<UserRound size={21} />}
            title="1. Patient basics"
            subtitle="Basic details about the patient"
          >
            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <label htmlFor="patient-age" className="mb-2 block text-sm font-semibold text-slate-200">
                  Age
                </label>
                <div className="flex gap-2">
                  <input
                    id="patient-age"
                    type="number"
                    min="0"
                    step="1"
                    value={age}
                    onChange={(event) => setAge(event.target.value)}
                    className={inputClass}
                    placeholder="Enter age"
                    required
                  />
                  <div className="grid shrink-0 grid-cols-2 rounded-xl border border-white/10 bg-white/5 p-1">
                    {['months', 'years'].map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => setAgeUnit(unit)}
                        className={`rounded-lg px-3 py-2 text-sm font-semibold capitalize ${
                          ageUnit === unit ? 'bg-teal-400 text-[#06211f]' : 'text-slate-300'
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <ToggleGroup
                label="Sex"
                value={sex}
                options={['Male', 'Female', 'Other']}
                onChange={setSex}
              />
            </div>

            {showPregnancy && (
              <div className="mt-5 border-t border-white/10 pt-5">
                <ToggleGroup
                  label="Pregnancy status"
                  value={pregnancyStatus}
                  options={['Not pregnant', 'Possibly pregnant', 'Confirmed pregnant']}
                  onChange={setPregnancyStatus}
                />
              </div>
            )}
          </SectionCard>

          <SectionCard
            icon={<HeartPulse size={21} />}
            title="2. Observed symptoms"
            subtitle="Select all signs that apply"
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {SYMPTOMS.map((symptom) => {
                const selected = selectedSymptoms.includes(symptom.label)
                return (
                  <button
                    key={symptom.label}
                    type="button"
                    onClick={() => toggleSymptom(symptom.label)}
                    aria-pressed={selected}
                    className={`min-h-24 rounded-2xl border p-3 text-left transition ${
                      selected
                        ? 'border-teal-400 bg-teal-400/15 text-white'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="block text-2xl" aria-hidden="true">{symptom.icon}</span>
                    <span className="mt-2 block text-sm font-semibold leading-tight">{symptom.label}</span>
                  </button>
                )
              })}
            </div>
          </SectionCard>

          <SectionCard
            icon={<Activity size={21} />}
            title="3. Vitals"
            subtitle="Enter only what you can measure"
          >
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-200">Temperature (°C)</span>
                <input
                  type="number"
                  min="30"
                  max="45"
                  step="0.1"
                  value={temperature}
                  onChange={(event) => setTemperature(event.target.value)}
                  placeholder="37.0"
                  className={inputClass}
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-200">
                  Breathing rate (per minute)
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={breathingRate}
                  onChange={(event) => setBreathingRate(event.target.value)}
                  placeholder="Count for one minute"
                  className={inputClass}
                />
              </label>

              {showMuac && (
                <label>
                  <span className="mb-2 block text-sm font-semibold text-slate-200">MUAC (cm)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={muac}
                    onChange={(event) => setMuac(event.target.value)}
                    placeholder="Mid-upper arm"
                    className={inputClass}
                  />
                </label>
              )}

              <YesNoToggle
                label="Pallor visible?"
                hint="Check inside the lower eyelid"
                value={pallor}
                onChange={setPallor}
              />

              <YesNoToggle
                label="Jaundice visible?"
                hint="Yellow tinge in eyes or skin"
                value={jaundice}
                onChange={setJaundice}
              />
            </div>
          </SectionCard>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-6">
            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <label htmlFor="symptom-duration" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <Clock3 size={17} className="text-teal-300" />
                  How long has this been going on?
                </label>
                <div className="flex gap-2">
                  <input
                    id="symptom-duration"
                    type="number"
                    min="0"
                    step="1"
                    value={duration}
                    onChange={(event) => setDuration(event.target.value)}
                    className={inputClass}
                    placeholder="Number"
                  />
                  <select
                    value={durationUnit}
                    onChange={(event) => setDurationUnit(event.target.value)}
                    className="rounded-xl border border-white/10 bg-[#0b2233] px-4 py-3 text-white outline-none focus:border-teal-400"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                  </select>
                </div>
              </div>

              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-200">
                  Patient&apos;s own words (optional)
                </span>
                <textarea
                  value={patientWords}
                  onChange={(event) => setPatientWords(event.target.value)}
                  placeholder="What does the patient say is wrong?"
                  rows="3"
                  className={`${inputClass} resize-none`}
                />
              </label>
            </div>
          </section>
        </div>

        <button
          type="submit"
          disabled={!formComplete}
          className="mt-6 w-full rounded-2xl bg-teal-400 px-6 py-4 text-lg font-bold text-[#06211f] shadow-lg shadow-teal-950/30 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Assess Patient
        </button>
      </form>
    </main>
  )
}
