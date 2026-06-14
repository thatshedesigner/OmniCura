import { systemPrompt } from './systemPrompt.js'
import { buildDiseaseContextPrompt } from './diseaseContext.js'

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
const STEP_PATTERN = /STEP\s+([1-5])\s+[^A-Za-z0-9\n]{1,12}([^:\n]+):?\s*/gi
const TEMPORARY_UNAVAILABLE =
  'Assessment system temporarily unavailable. If emergency, refer to PHC immediately.'

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

  return patientProfile
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

Follow the system instructions exactly. Use exactly five STEP labels and finish with an explicit ESCALATE or MONITOR decision.`
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

  return {
    dangerSignCheck: sections[1],
    isDangerSignPresent: /ESCALATE IMMEDIATELY/i.test(sections[1]),
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
    const error = new Error('GEMINI_KEY is not configured')
    error.status = 503
    error.publicMessage = TEMPORARY_UNAVAILABLE
    throw error
  }

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
          maxOutputTokens: 2000,
          temperature: 0,
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
    const error = new Error(`Gemini API returned ${response.status}`)
    error.status = 503
    error.publicMessage = TEMPORARY_UNAVAILABLE
    error.responseBody = responseText
    throw error
  }

  const geminiResponse = JSON.parse(responseText)
  const rawResponse = geminiResponse?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join('\n')
    .trim()

  if (!rawResponse) {
    const error = new Error('Gemini returned no assessment text')
    error.status = 503
    error.publicMessage = TEMPORARY_UNAVAILABLE
    throw error
  }

  return parseAssessmentResponse(rawResponse)
}

export { TEMPORARY_UNAVAILABLE }
