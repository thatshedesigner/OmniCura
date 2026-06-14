import { promises as fs } from 'node:fs'
import { randomUUID } from 'node:crypto'
import os from 'node:os'
import path from 'node:path'

const FILE_NAME = 'assessments.json'

async function readEntries(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

async function writeEntry(filePath, entry) {
  const entries = await readEntries(filePath)
  entries.push(entry)
  await fs.writeFile(filePath, `${JSON.stringify(entries, null, 2)}\n`, 'utf8')
  return filePath
}

function formatAge(age) {
  if (typeof age === 'string') return age
  if (age?.value !== undefined && age?.unit) {
    return `${age.value} ${age.unit}`
  }
  return 'Age not recorded'
}

function normalizeEntry(entry, index) {
  const reasoning = entry.reasoningSummary || {}
  const symptoms = entry.patientSummary?.symptoms
    || entry.patientSummary?.chiefSymptoms
    || []

  return {
    id: entry.id || `legacy-${entry.timestamp || 'unknown'}-${index}`,
    timestamp: entry.timestamp,
    district: entry.district || 'District not recorded',
    patientSummary: {
      age: formatAge(entry.patientSummary?.age),
      sex: entry.patientSummary?.sex || 'Not recorded',
      symptoms: Array.isArray(symptoms) ? symptoms : [],
    },
    escalationDecision: entry.escalationDecision === 'ESCALATE' ? 'ESCALATE' : 'MONITOR',
    escalationJustification: entry.escalationJustification
      || reasoning.escalationJustification
      || 'No justification recorded.',
    differentialSummary: entry.differentialSummary
      || reasoning.differential
      || 'No differential recorded.',
  }
}

export async function readAssessmentLogs() {
  const projectPath = path.join(process.cwd(), FILE_NAME)
  const tempPath = path.join(os.tmpdir(), FILE_NAME)
  const paths = projectPath === tempPath ? [projectPath] : [projectPath, tempPath]
  const entries = []

  for (const filePath of paths) {
    const fileEntries = await readEntries(filePath)
    entries.push(...fileEntries)
  }

  const uniqueEntries = new Map()
  entries.forEach((entry, index) => {
    const normalized = normalizeEntry(entry, index)
    uniqueEntries.set(normalized.id, normalized)
  })

  return [...uniqueEntries.values()]
    .filter((entry) => entry.timestamp)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export async function logAssessment(patientProfile, assessment) {
  const entry = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    district: patientProfile.district,
    patientSummary: {
      age: formatAge(patientProfile.age),
      sex: patientProfile.sex,
      symptoms: patientProfile.symptoms,
    },
    escalationDecision: assessment.escalationDecision,
    escalationJustification: assessment.escalationJustification,
    differentialSummary: assessment.differential,
  }

  const projectPath = path.join(process.cwd(), FILE_NAME)
  try {
    return await writeEntry(projectPath, entry)
  } catch (error) {
    if (!['EROFS', 'EACCES', 'EPERM'].includes(error.code)) throw error
    return writeEntry(path.join(os.tmpdir(), FILE_NAME), entry)
  }
}
