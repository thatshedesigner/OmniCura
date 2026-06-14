import { analyzePrescriptionImage } from '../server/analyzePrescription.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY
    const result = await analyzePrescriptionImage(payload, apiKey)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Anthropic prescription analysis failed:', error)
    if (error.responseBody) {
      console.error('Anthropic error response:', error.responseBody)
    }

    return res.status(error.status || 500).json({
      error: error.message,
      details: error.responseBody || null,
    })
  }
}
