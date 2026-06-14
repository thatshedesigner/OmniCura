import { analyzePrescriptionImage } from '../server/analyzePrescription.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const result = await analyzePrescriptionImage(payload, process.env.GEMINI_KEY)
    return res.status(200).json(result)
  } catch (error) {
    console.error('Gemini prescription analysis failed:', error)

    return res.status(error.status || 500).json({
      error: error.message,
      details: error.responseBody || null,
    })
  }
}
