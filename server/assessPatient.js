import { systemPrompt } from './systemPrompt.js'
import { buildDiseaseContextPrompt } from './diseaseContext.js'

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
const STEP_PATTERN = /STEP\s+([1-5])\s+[^A-Za-z0-9\n]{1,12}([^:\n]+):?\s*/gi
const TEMPORARY_UNAVAILABLE =
  'Assessment system temporarily unavailable. If emergency, refer to PHC immediately.'
const ASSESSMENT_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    dangerSignCheck: { type: 'STRING' },
    isDangerSignPresent: { type: 'BOOLEAN' },
    differential: { type: 'STRING' },
    recommendedAction: { type: 'STRING' },
    monitoringPlan: { type: 'STRING' },
    escalationDecision: {
      type: 'STRING',
      enum: ['ESCALATE', 'MONITOR'],
    },
    escalationJustification: { type: 'STRING' },
    referralNote: { type: 'STRING' },
  },
  required: [
    'dangerSignCheck',
    'isDangerSignPresent',
    'differential',
    'recommendedAction',
    'monitoringPlan',
    'escalationDecision',
    'escalationJustification',
    'referralNote',
  ],
}

function requirePatientProfile(payload) {
  const patientProfile = payload?.patientProfile || payload

  if (
    !patientProfile?.age ||
    !patientProfile?.sex ||
    !Array.isArray(patientProfile?.symptoms) ||
    !patientProfile?.vitals ||
    !patientProfile?.duration ||
    !patientProfile?.district ||
    !patientProfile?.month ||
    !Array.isArray(patientProfile?.ashaKit)
  ) {
    const error = new Error('A complete patientProfile is required')
    error.status = 400
    throw error
  }

  const ageValue = Number(patientProfile.age.value)
  if (
    !Number.isFinite(ageValue)
    || ageValue < 0
    || !['months', 'years'].includes(patientProfile.age.unit)
  ) {
    const error = new Error('Patient age is invalid')
    error.status = 400
    throw error
  }

  return {
    ...patientProfile,
    age: {
      value: ageValue,
      unit: patientProfile.age.unit,
    },
    pregnancy: patientProfile.pregnancy || 'none',
    symptoms: patientProfile.symptoms.filter(
      (symptom) => typeof symptom === 'string' && symptom.trim()
    ),
    vitals: {
      temperature: finiteNumberOrNull(patientProfile.vitals.temperature),
      breathingRate: finiteNumberOrNull(patientProfile.vitals.breathingRate),
      muac: finiteNumberOrNull(patientProfile.vitals.muac),
      pallor: booleanOrNull(patientProfile.vitals.pallor),
      jaundice: booleanOrNull(patientProfile.vitals.jaundice),
    },
    duration: {
      value: finiteNumberOrNull(patientProfile.duration.value),
      unit: ['days', 'weeks'].includes(patientProfile.duration.unit)
        ? patientProfile.duration.unit
        : 'days',
    },
    patientWords: typeof patientProfile.patientWords === 'string'
      ? patientProfile.patientWords.trim()
      : '',
    district: String(patientProfile.district).trim(),
    month: String(patientProfile.month).trim(),
    ashaKit: patientProfile.ashaKit.filter(
      (item) => typeof item === 'string' && item.trim()
    ),
  }
}

function finiteNumberOrNull(value) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function booleanOrNull(value) {
  return typeof value === 'boolean' ? value : null
}

function valueOrNotRecorded(value, suffix = '') {
  return value === null || value === undefined || value === ''
    ? 'Not recorded'
    : `${value}${suffix}`
}

export function buildPatientMessage(patientProfile) {
  return `PATIENT PROFILE

AGE
- Value: ${patientProfile.age.value}
- Unit: ${patientProfile.age.unit}

SEX AND PREGNANCY
- Sex: ${patientProfile.sex}
- Pregnancy status: ${patientProfile.pregnancy || 'none'}

OBSERVED SYMPTOMS
- ${patientProfile.symptoms.length ? patientProfile.symptoms.join('\n- ') : 'None selected'}

VITALS AND OBSERVATIONS
- Temperature: ${valueOrNotRecorded(patientProfile.vitals.temperature, ' °C')}
- Breathing rate: ${valueOrNotRecorded(patientProfile.vitals.breathingRate, ' breaths per minute')}
- MUAC: ${valueOrNotRecorded(patientProfile.vitals.muac, ' cm')}
- Pallor visible: ${patientProfile.vitals.pallor === null ? 'Not recorded' : patientProfile.vitals.pallor ? 'Yes' : 'No'}
- Jaundice visible: ${patientProfile.vitals.jaundice === null ? 'Not recorded' : patientProfile.vitals.jaundice ? 'Yes' : 'No'}

DURATION
- ${valueOrNotRecorded(patientProfile.duration.value)} ${patientProfile.duration.unit}

PATIENT'S OWN WORDS
- ${patientProfile.patientWords || 'Not provided'}

GEOGRAPHY AND TIME
- District: ${patientProfile.district}
- Current month: ${patientProfile.month}

ASHA KIT AVAILABLE TODAY
- ${patientProfile.ashaKit.length ? patientProfile.ashaKit.join('\n- ') : 'No kit items marked available'}

Follow the system instructions exactly. Put the five reasoning steps into the structured response fields and finish with an explicit ESCALATE or MONITOR decision. Use an empty referralNote when the decision is MONITOR.`
}

function parseStructuredAssessment(rawResponse, patientProfile) {
  const jsonText = rawResponse
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
  const parsed = JSON.parse(jsonText)
  const requiredStrings = [
    'dangerSignCheck',
    'differential',
    'recommendedAction',
    'monitoringPlan',
    'escalationJustification',
  ]

  if (
    requiredStrings.some((field) => typeof parsed[field] !== 'string' || !parsed[field].trim())
    || !['ESCALATE', 'MONITOR'].includes(parsed.escalationDecision)
  ) {
    const error = new Error('Gemini returned an incomplete structured assessment')
    error.status = 502
    throw error
  }

  const deterministicDangerSigns = getDeterministicDangerSigns(patientProfile)
  const isDangerSignPresent =
    deterministicDangerSigns.length > 0 || Boolean(parsed.isDangerSignPresent)
  const escalationDecision = isDangerSignPresent
    ? 'ESCALATE'
    : parsed.escalationDecision
  const dangerSignCheck = deterministicDangerSigns.length
    ? `Danger signs identified from the recorded patient data:\n- ${deterministicDangerSigns.join('\n- ')}\n\n${parsed.dangerSignCheck.trim()}`
    : parsed.dangerSignCheck.trim()
  const escalationJustification = deterministicDangerSigns.length
    ? `Immediate referral is required because: ${deterministicDangerSigns.join('; ')}. ${parsed.escalationJustification.trim()}`
    : parsed.escalationJustification.trim()
  const referralNote = escalationDecision === 'ESCALATE'
    ? parsed.referralNote?.trim() || buildFallbackReferralNote(
      patientProfile,
      deterministicDangerSigns,
      parsed.differential
    )
    : null

  return {
    dangerSignCheck,
    isDangerSignPresent,
    differential: parsed.differential.trim(),
    recommendedAction: parsed.recommendedAction.trim(),
    monitoringPlan: parsed.monitoringPlan.trim(),
    escalationDecision,
    escalationJustification,
    referralNote,
    rawResponse,
  }
}

function getDeterministicDangerSigns(patientProfile) {
  const symptoms = new Set(
    patientProfile.symptoms.map((symptom) => symptom.trim().toLowerCase())
  )
  const ageInYears = patientProfile.age.unit === 'months'
    ? patientProfile.age.value / 12
    : patientProfile.age.value
  const signs = []

  if (symptoms.has('not eating/drinking')) signs.push('Unable or unwilling to drink')
  if (symptoms.has('convulsions')) signs.push('Convulsions or fitting reported')
  if (symptoms.has('unconscious/unresponsive')) signs.push('Unconscious or unresponsive')
  if (symptoms.has('very weak/cannot stand')) signs.push('Very weak or unable to stand')
  if (ageInYears < 5 && patientProfile.vitals.muac !== null && patientProfile.vitals.muac < 11.5) {
    signs.push('MUAC below 11.5 cm in a child under 5')
  }

  const breathingRate = patientProfile.vitals.breathingRate
  if (breathingRate !== null) {
    if (ageInYears < 1 && breathingRate > 60) {
      signs.push('Breathing rate above 60 per minute in an infant')
    } else if (ageInYears >= 1 && ageInYears <= 5 && breathingRate > 50) {
      signs.push('Breathing rate above 50 per minute in a child aged 1 to 5')
    }
  }

  return signs
}

function buildFallbackReferralNote(patientProfile, dangerSigns, differential) {
  const vitals = [
    patientProfile.vitals.temperature !== null
      ? `Temperature ${patientProfile.vitals.temperature} °C`
      : null,
    patientProfile.vitals.breathingRate !== null
      ? `Breathing rate ${patientProfile.vitals.breathingRate}/minute`
      : null,
    patientProfile.vitals.muac !== null
      ? `MUAC ${patientProfile.vitals.muac} cm`
      : null,
  ].filter(Boolean)

  return `---
ASHA WORKER REFERRAL NOTE
Date: ${new Date().toISOString().slice(0, 10)}
Patient: ${patientProfile.age.value} ${patientProfile.age.unit}, ${patientProfile.sex}
District: ${patientProfile.district}
Presenting complaint: ${patientProfile.patientWords || patientProfile.symptoms.join(', ') || 'Not recorded'}
Symptoms observed: ${patientProfile.symptoms.join(', ') || 'None selected'}
Vitals: ${vitals.join('; ') || 'Not recorded'}
ASHA assessment: ${differential}
Action taken before referral: Follow ASHA protocol using available kit items only
Reason for referral: ${dangerSigns.join('; ') || 'High clinical uncertainty or danger sign'}
Refer to: Nearest PHC / CHC / District Hospital (circle appropriate)
---`
}

function splitStepSections(rawResponse) {
  const matches = [...rawResponse.matchAll(STEP_PATTERN)]
  if (matches.length !== 5) {
    const error = new Error('The assessment response did not contain exactly five STEP sections')
    error.status = 502
    throw error
  }

  const sections = {}
  matches.forEach((match, index) => {
    const stepNumber = Number(match[1])
    const start = match.index + match[0].length
    const end = matches[index + 1]?.index ?? rawResponse.length
    sections[stepNumber] = rawResponse.slice(start, end).trim()
  })
  return sections
}

function parseEscalation(step5) {
  const decisionMatch = step5.match(/\b(ESCALATE|MONITOR)\b/i)
  const escalationDecision = decisionMatch?.[1]?.toUpperCase()

  if (!escalationDecision) {
    const error = new Error('The assessment response did not include ESCALATE or MONITOR')
    error.status = 502
    throw error
  }

  const referralIndex = step5.search(/---\s*ASHA WORKER REFERRAL NOTE/i)
  const referralNote = escalationDecision === 'ESCALATE' && referralIndex >= 0
    ? step5.slice(referralIndex).trim()
    : null
  const escalationJustification = (
    referralIndex >= 0 ? step5.slice(0, referralIndex) : step5
  )
    .replace(/\b(ESCALATE|MONITOR)\b/i, '')
    .replace(/^[^A-Za-z0-9]+/, '')
    .trim()

  return { escalationDecision, escalationJustification, referralNote }
}

export function parseAssessmentResponse(rawResponse) {
  const sections = splitStepSections(rawResponse)
  const escalation = parseEscalation(sections[5])
  const dangerSignCheck = sections[1]
  const dangerSignsExplicitlyAbsent =
    /\bno\b.{0,25}\bdanger signs?\b|\bdanger signs?\b.{0,25}\b(?:absent|not present|none)\b/i
      .test(dangerSignCheck)
  const dangerSignsExplicitlyPresent =
    /ESCALATE IMMEDIATELY|\bdanger signs?\b.{0,35}\b(?:present|identified|found)\b/i
      .test(dangerSignCheck)

  return {
    dangerSignCheck,
    isDangerSignPresent: dangerSignsExplicitlyPresent && !dangerSignsExplicitlyAbsent,
    differential: sections[2],
    recommendedAction: sections[3],
    monitoringPlan: sections[4],
    ...escalation,
    rawResponse,
  }
}

export async function assessPatient(payload, apiKey) {
  const patientProfile = requirePatientProfile(payload)
  const contextualSystemPrompt = `${systemPrompt}

${buildDiseaseContextPrompt(patientProfile.district, patientProfile.month)}`

  if (!apiKey) {
    const error = new Error('GEMINI_API_KEY is not configured')
    error.status = 503
    error.publicMessage = TEMPORARY_UNAVAILABLE
    throw error
  }

  const requestAssessment = async () => {
    let response
    try {
      response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: contextualSystemPrompt }],
          },
          contents: [{
            role: 'user',
            parts: [{ text: buildPatientMessage(patientProfile) }],
          }],
          generationConfig: {
            maxOutputTokens: 4096,
            temperature: 0,
            responseMimeType: 'application/json',
            responseSchema: ASSESSMENT_RESPONSE_SCHEMA,
          },
        }),
      })
    } catch (error) {
      const serviceError = new Error(error.message)
      serviceError.status = 503
      serviceError.publicMessage = TEMPORARY_UNAVAILABLE
      throw serviceError
    }

    const responseText = await response.text()
    if (!response.ok) {
      let upstreamMessage
      try {
        upstreamMessage = JSON.parse(responseText)?.error?.message
      } catch {
        upstreamMessage = null
      }

      const error = new Error(
        upstreamMessage || `Gemini API returned ${response.status} ${response.statusText}`
      )
      error.status = 503
      error.publicMessage = TEMPORARY_UNAVAILABLE
      error.responseBody = responseText
      error.response = responseText
      throw error
    }

    const geminiResponse = JSON.parse(responseText)
    const candidate = geminiResponse?.candidates?.[0]
    const rawResponse = candidate?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join('\n')
      .trim()

    if (!rawResponse) {
      const error = new Error(
        `Gemini returned no assessment text${candidate?.finishReason ? ` (${candidate.finishReason})` : ''}`
      )
      error.status = 503
      error.publicMessage = TEMPORARY_UNAVAILABLE
      throw error
    }

    return rawResponse
  }

  let rawResponse = await requestAssessment()
  try {
    return parseStructuredAssessment(rawResponse, patientProfile)
  } catch (parseError) {
    console.warn('Gemini structured assessment was incomplete; retrying once:', parseError.message)
    rawResponse = await requestAssessment()
    return parseStructuredAssessment(rawResponse, patientProfile)
  }
}

export { TEMPORARY_UNAVAILABLE }
