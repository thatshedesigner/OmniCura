const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const DANGER_SIGN_LABELS = [
  'Unable to drink or breastfeed',
  'Vomits everything',
  'Had convulsions or fitting now',
  'Lethargic or unconscious',
  'Severe respiratory distress',
  'High fever with stiff neck',
  'Severe dehydration signs',
  'MUAC below 11.5 cm in a child under 5',
  'Very fast breathing for age',
]

function ageInYears(basics) {
  return basics.ageUnit === 'months' ? basics.age / 12 : basics.age
}

function hasText(text, patterns) {
  const normalized = (text || '').toLowerCase()
  return patterns.some((pattern) => normalized.includes(pattern))
}

export function checkDangerSigns(patientProfile) {
  const symptoms = new Set(patientProfile.symptoms || [])
  const words = patientProfile.patientWords || ''
  const vitals = patientProfile.vitals || {}
  const basics = patientProfile.basics || {}
  const years = ageInYears(basics)
  const present = []
  const uncertain = []

  if (symptoms.has('Not eating/drinking') || hasText(words, ['unable to drink', 'cannot drink', 'not breastfeeding'])) {
    present.push('Unable to drink or breastfeed')
  }

  if (hasText(words, ['vomits everything', 'vomiting everything', 'cannot keep anything down'])) {
    present.push('Vomits everything')
  } else if (symptoms.has('Vomiting')) {
    uncertain.push('Vomiting is present, but it is not clear whether the patient vomits everything')
  }

  if (symptoms.has('Convulsions')) {
    present.push('Had convulsions or fitting now')
  }

  if (symptoms.has('Unconscious/Unresponsive')) {
    present.push('Lethargic or unconscious')
  } else if (symptoms.has('Very weak/cannot stand')) {
    uncertain.push('Patient is very weak; lethargy is not fully assessed')
  }

  if (hasText(words, ['chest drawing in', 'chest indrawing', 'nostrils flaring', 'severe breathing'])) {
    present.push('Severe respiratory distress')
  } else if (symptoms.has('Breathing difficulty')) {
    uncertain.push('Breathing difficulty is present; severe distress signs were not recorded')
  }

  const highFever = Number.isFinite(vitals.temperatureCelsius) && vitals.temperatureCelsius >= 39
  if (highFever && hasText(words, ['stiff neck', 'neck stiffness'])) {
    present.push('High fever with stiff neck')
  } else if (highFever) {
    uncertain.push('High fever is present; neck stiffness was not recorded')
  }

  if (hasText(words, ['severe dehydration', 'sunken eyes', 'skin pinch goes back very slowly'])) {
    present.push('Severe dehydration signs')
  } else if (symptoms.has('Diarrhea') && symptoms.has('Very weak/cannot stand')) {
    uncertain.push('Diarrhea with severe weakness may indicate dehydration')
  }

  if (years < 5 && Number.isFinite(vitals.muacCm) && vitals.muacCm < 11.5) {
    present.push('MUAC below 11.5 cm in a child under 5')
  }

  const breathingRate = vitals.breathingRatePerMinute
  if (Number.isFinite(breathingRate)) {
    if (years < 1 && breathingRate > 60) {
      present.push('Very fast breathing for age')
    } else if (years >= 1 && years <= 5 && breathingRate > 50) {
      present.push('Very fast breathing for age')
    }
  }

  return {
    present,
    uncertain,
    absent: DANGER_SIGN_LABELS.filter((label) => !present.includes(label)),
    immediateEscalation: present.length > 0,
  }
}

function formatVitals(vitals) {
  const values = []
  if (Number.isFinite(vitals.temperatureCelsius)) values.push(`${vitals.temperatureCelsius} °C`)
  if (Number.isFinite(vitals.breathingRatePerMinute)) {
    values.push(`${vitals.breathingRatePerMinute} breaths/min`)
  }
  if (Number.isFinite(vitals.muacCm)) values.push(`MUAC ${vitals.muacCm} cm`)
  if (vitals.pallorVisible !== null) values.push(`Pallor: ${vitals.pallorVisible ? 'Yes' : 'No'}`)
  if (vitals.jaundiceVisible !== null) values.push(`Jaundice: ${vitals.jaundiceVisible ? 'Yes' : 'No'}`)
  return values.length ? values.join(', ') : 'Not recorded'
}

function buildReferralNote(
  patientProfile,
  session,
  dangerCheck,
  actionTaken = 'None before referral',
  fallbackReason = 'High uncertainty or needs PHC assessment'
) {
  const { basics, symptoms, vitals } = patientProfile
  const age = `${basics.age} ${basics.ageUnit}`
  const complaint = patientProfile.patientWords || symptoms.join(', ') || 'Not stated'

  return [
    '---',
    'ASHA WORKER REFERRAL NOTE',
    `Date: ${new Date().toLocaleDateString('en-IN')}`,
    `Patient: ${age} ${basics.sex}`,
    `District: ${session.district}`,
    `Presenting complaint: ${complaint}`,
    `Symptoms observed: ${symptoms.length ? symptoms.join(', ') : 'None selected'}`,
    `Vitals: ${formatVitals(vitals)}`,
    `ASHA assessment: Urgent danger sign assessment; possible serious illness`,
    `Action taken before referral: ${actionTaken}`,
    `Reason for referral: ${dangerCheck.present.join(', ') || fallbackReason}`,
    'Refer to: Nearest PHC / CHC / District Hospital (circle appropriate)',
    '---',
  ].join('\n')
}

const KIT_ACTION_ALIASES = {
  'ORS packets': ['ors', 'oral rehydration'],
  'Paracetamol 500mg': ['paracetamol', 'acetaminophen'],
  'Iron-Folic Acid tablets': ['iron-folic', 'iron folic', 'ifa tablet'],
  'Zinc tablets': ['zinc'],
  'Oral contraceptives': ['oral contraceptive'],
  Condoms: ['condom'],
  'Rapid Diagnostic Test (malaria)': ['malaria test', 'rapid diagnostic test', 'rdt'],
  'Pregnancy test kit': ['pregnancy test'],
  'Basic thermometer': ['thermometer', 'check temperature'],
  'Blood pressure cuff': ['blood pressure', 'bp cuff'],
}

function enforceAvailableKitActions(actions, inventory) {
  const unavailableAliases = Object.entries(KIT_ACTION_ALIASES)
    .filter(([item]) => !inventory?.[item])
    .flatMap(([, aliases]) => aliases)

  const safeActions = (actions || []).filter((action) => {
    const normalized = action.toLowerCase()
    return !unavailableAliases.some((alias) => normalized.includes(alias))
  })

  return safeActions.length
    ? safeActions
    : ['No safe kit action is available. Contact or refer to the nearest PHC for advice.']
}

function immediateEscalationResult(patientProfile, session, dangerCheck) {
  return {
    step1: {
      title: 'DANGER SIGN CHECK',
      present: dangerCheck.present,
      absent: dangerCheck.absent,
      uncertain: dangerCheck.uncertain,
      summary: `ESCALATE IMMEDIATELY: ${dangerCheck.present.join(', ')}.`,
    },
    step2: {
      title: 'DIFFERENTIAL',
      conditions: [{
        condition: 'Serious illness needing urgent assessment',
        confidencePercent: 100,
        reasoning: 'One or more IMCI danger signs are present. Do not delay referral to decide the exact illness.',
      }],
    },
    step3: {
      title: 'RECOMMENDED ACTION',
      actions: [
        'Arrange urgent transport and contact the nearest PHC or CHC.',
        'Keep the patient safe and warm. Do not force food, drink, or medicine if unconscious or fitting.',
        'Use only basic first aid within ASHA training while transport is arranged.',
      ],
    },
    step4: {
      title: 'MONITORING PLAN',
      watchFor: ['Breathing, alertness, convulsions, and ability to drink during transport'],
      referImmediatelyIf: ['Referral is already required. Do not wait for symptoms to improve.'],
    },
    step5: {
      title: 'ESCALATION DECISION',
      decision: 'ESCALATE',
      justification: 'An IMCI danger sign is present, so home monitoring is not safe.',
      referralNote: buildReferralNote(patientProfile, session, dangerCheck),
    },
  }
}

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    step1: {
      type: 'OBJECT',
      properties: {
        title: { type: 'STRING' },
        present: { type: 'ARRAY', items: { type: 'STRING' } },
        absent: { type: 'ARRAY', items: { type: 'STRING' } },
        uncertain: { type: 'ARRAY', items: { type: 'STRING' } },
        summary: { type: 'STRING' },
      },
      required: ['title', 'present', 'absent', 'uncertain', 'summary'],
    },
    step2: {
      type: 'OBJECT',
      properties: {
        title: { type: 'STRING' },
        conditions: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              condition: { type: 'STRING' },
              confidencePercent: { type: 'INTEGER' },
              reasoning: { type: 'STRING' },
            },
            required: ['condition', 'confidencePercent', 'reasoning'],
          },
        },
      },
      required: ['title', 'conditions'],
    },
    step3: {
      type: 'OBJECT',
      properties: {
        title: { type: 'STRING' },
        actions: { type: 'ARRAY', items: { type: 'STRING' } },
      },
      required: ['title', 'actions'],
    },
    step4: {
      type: 'OBJECT',
      properties: {
        title: { type: 'STRING' },
        watchFor: { type: 'ARRAY', items: { type: 'STRING' } },
        referImmediatelyIf: { type: 'ARRAY', items: { type: 'STRING' } },
      },
      required: ['title', 'watchFor', 'referImmediatelyIf'],
    },
    step5: {
      type: 'OBJECT',
      properties: {
        title: { type: 'STRING' },
        decision: { type: 'STRING', enum: ['ESCALATE', 'MONITOR'] },
        justification: { type: 'STRING' },
        referralNote: { type: 'STRING', nullable: true },
      },
      required: ['title', 'decision', 'justification'],
    },
  },
  required: ['step1', 'step2', 'step3', 'step4', 'step5'],
}

function assessmentPrompt(patientProfile, session, dangerCheck) {
  const availableKit = Object.entries(session.inventory || {})
    .filter(([, available]) => available)
    .map(([item]) => item)

  return `You are a clinical decision support tool for ASHA workers in rural India. You are not a doctor.

Use plain language for a health worker with Class 10 education. Never diagnose. Give probable conditions only. Default to referral when uncertain.

You must return exactly five structured steps:
1. DANGER SIGN CHECK
2. DIFFERENTIAL with 2-3 probable conditions, percentage confidence, and one short reason each
3. RECOMMENDED ACTION using only available kit items
4. MONITORING PLAN for 24-48 hours
5. ESCALATION DECISION ending in ESCALATE or MONITOR with one clear justification

Safety rules:
- The deterministic danger-sign result below has already been checked. Do not contradict it.
- Never recommend prescription-only medicines or actions outside ASHA training.
- Never recommend an item not listed as available.
- Give an exact medicine dose only when it is a standard ASHA-kit action and the patient data is sufficient. If weight or another required fact is missing, say the dose cannot be safely chosen and refer.
- If confidence is low, say so and choose ESCALATE.
- If ESCALATE, include a referral note in the required ASHA format. If MONITOR, referralNote must be null.

Geography weighting:
- Odisha during June-September: malaria probability is higher.
- Bihar during November-February: acute respiratory infection probability is higher.
- Uttar Pradesh during September-November: dengue probability is higher.
- For other district/month combinations, do not invent a local outbreak.
- Explain any geography weighting in the differential.

Session:
${JSON.stringify({
    district: session.district,
    month: session.month,
    availableKit,
  }, null, 2)}

Patient:
${JSON.stringify(patientProfile, null, 2)}

Deterministic danger check:
${JSON.stringify(dangerCheck, null, 2)}

Referral note format when ESCALATE:
---
ASHA WORKER REFERRAL NOTE
Date: [date]
Patient: [age] [sex]
District: [district]
Presenting complaint: [chief complaint]
Symptoms observed: [list]
Vitals: [if recorded]
ASHA assessment: [top differential]
Action taken before referral: [what was given]
Reason for referral: [specific danger sign or high uncertainty]
Refer to: Nearest PHC / CHC / District Hospital (circle appropriate)
---`
}

export async function assessPatient(payload, apiKey) {
  const patientProfile = payload?.patientProfile
  const session = payload?.session

  if (!patientProfile?.basics || !session?.district || !session?.month) {
    const error = new Error('Patient profile and session details are required')
    error.status = 400
    throw error
  }

  const dangerCheck = checkDangerSigns(patientProfile)
  if (dangerCheck.immediateEscalation) {
    return immediateEscalationResult(patientProfile, session, dangerCheck)
  }

  if (!apiKey) {
    const error = new Error('GEMINI_KEY is not configured')
    error.status = 500
    throw error
  }

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: assessmentPrompt(patientProfile, session, dangerCheck) }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    }),
  })

  const responseText = await response.text()
  if (!response.ok) {
    let upstreamMessage
    try {
      upstreamMessage = JSON.parse(responseText)?.error?.message
    } catch {
      upstreamMessage = null
    }
    const error = new Error(upstreamMessage || `Gemini API returned ${response.status}`)
    error.status = response.status
    error.responseBody = responseText
    throw error
  }

  const geminiResponse = JSON.parse(responseText)
  const resultText = geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!resultText) {
    const error = new Error('Gemini returned no assessment')
    error.status = 502
    throw error
  }

  const result = JSON.parse(resultText)
  result.step1.present = dangerCheck.present
  result.step1.absent = dangerCheck.absent
  result.step1.uncertain = dangerCheck.uncertain
  result.step3.actions = enforceAvailableKitActions(result.step3.actions, session.inventory)

  if (result.step5.decision === 'ESCALATE' && !result.step5.referralNote) {
    result.step5.referralNote = buildReferralNote(
      patientProfile,
      session,
      dangerCheck,
      result.step3.actions.join('; '),
      result.step5.justification
    )
  }

  if (result.step5.decision === 'MONITOR') {
    result.step5.referralNote = null
  }

  return result
}
