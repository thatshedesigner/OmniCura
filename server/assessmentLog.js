import { promises as fs } from 'node:fs'
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

export async function logAssessment(patientProfile, assessment) {
  const entry = {
    timestamp: new Date().toISOString(),
    district: patientProfile.district,
    patientSummary: {
      age: patientProfile.age,
      sex: patientProfile.sex,
      chiefSymptoms: patientProfile.symptoms,
    },
    escalationDecision: assessment.escalationDecision,
    reasoningSummary: {
      dangerSignCheck: assessment.dangerSignCheck,
      differential: assessment.differential,
      escalationJustification: assessment.escalationJustification,
    },
  }

  const projectPath = path.join(process.cwd(), FILE_NAME)
  try {
    return await writeEntry(projectPath, entry)
  } catch (error) {
    if (!['EROFS', 'EACCES', 'EPERM'].includes(error.code)) throw error
    return writeEntry(path.join(os.tmpdir(), FILE_NAME), entry)
  }
}
