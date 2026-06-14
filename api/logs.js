import { logAssessment, readAssessmentLogs } from '../server/assessmentLog.js'

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    if (req.method === 'POST') {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      if (!payload?.patientProfile || !payload?.assessment) {
        return res.status(400).json({ error: 'patientProfile and assessment are required' })
      }

      await logAssessment(payload.patientProfile, payload.assessment)
      return res.status(201).json({ saved: true })
    }

    const logs = await readAssessmentLogs()
    return res.status(200).json(logs)
  } catch (error) {
    console.error('Assessment log request failed:', error)
    return res.status(500).json({ error: 'Assessment log request failed' })
  }
}
