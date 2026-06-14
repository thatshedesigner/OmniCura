import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const diseaseContext = require('./diseaseContext.json')

const MONTH_TO_SEASON = {
  january: 'winter',
  february: 'winter',
  march: 'summer',
  april: 'summer',
  may: 'summer',
  june: 'monsoon',
  july: 'monsoon',
  august: 'monsoon',
  september: 'monsoon',
  october: 'post_monsoon',
  november: 'post_monsoon',
  december: 'winter',
}

export function getCurrentSeason(monthName) {
  const normalizedMonth = String(monthName || '').trim().toLowerCase()
  const season = MONTH_TO_SEASON[normalizedMonth]

  if (!season) {
    throw new Error(`Unknown month name: ${monthName || 'empty'}`)
  }

  return season
}

export function getDistrictDiseaseContext(districtName) {
  const normalizedDistrict = String(districtName || '').split(',')[0].trim()
  return diseaseContext.districts[normalizedDistrict] || null
}

export function buildDiseaseContextPrompt(districtName, monthName) {
  const district = getDistrictDiseaseContext(districtName)
  if (!district) {
    return `DISTRICT DISEASE CONTEXT
No curated district record is available. Use only the patient findings and general public-health knowledge.`
  }

  const season = getCurrentSeason(monthName)
  const seasonalRisks = district.seasonal[season]

  return `DISTRICT DISEASE CONTEXT
District: ${String(districtName).split(',')[0].trim()}
State: ${district.state}
Season: ${season}
Baseline risks: ${district.endemic.join('; ')}
Seasonal risks now: ${seasonalRisks.join('; ')}
Historically high-burden concerns: ${district.high_burden.join('; ')}

Use this context only to weight a differential when the patient's symptoms fit. It is not live surveillance data, does not establish a diagnosis, and must never override danger signs, examination findings, or referral when uncertain.`
}

export { diseaseContext }
