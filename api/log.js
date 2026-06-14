import { logAssessment } from '../server/assessmentLog.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    if (!payload?.patientProfile || !payload?.assessment) {
      return res.status(400).json({ error: 'patientProfile and assessment are required' })
    }

    const filePath = await logAssessment(payload.patientProfile, payload.assessment)
    return res.status(201).json({ saved: true, filePath })
  } catch (error) {
    console.error('Assessment logging failed:', error)
    return res.status(500).json({ error: 'Assessment could not be logged' })
  }
}
