import { assessPatient, TEMPORARY_UNAVAILABLE } from '../server/assessPatient.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const result = await assessPatient(payload, process.env.ANTHROPIC_API_KEY)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Patient assessment failed:', error)
    const status = error.status || 500
    return res.status(status).json({
      error: status === 503 ? TEMPORARY_UNAVAILABLE : error.message,
      details: error.responseBody || null,
    })
  }
}
