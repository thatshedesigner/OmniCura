import { assessPatient, TEMPORARY_UNAVAILABLE } from '../server/assessPatient.js'

export default async function handler(req, res) {
  try {
    console.log('API KEY EXISTS:', !!process.env.GEMINI_API_KEY)
    console.log('LEGACY GEMINI_KEY EXISTS:', !!process.env.GEMINI_KEY)

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_KEY
    const result = await assessPatient(payload, apiKey)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Patient assessment failed:', error)
    console.error('Patient assessment error message:', error?.message)
    console.error('Patient assessment error response:', error?.response || error?.responseBody)

    return res.status(500).json({
      error: true,
      message: error?.message || TEMPORARY_UNAVAILABLE,
      details: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    })
  }
}
