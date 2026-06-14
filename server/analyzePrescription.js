const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const EXTRACTION_PROMPT =
  'You are a medical assistant. Analyze this handwritten prescription image. Extract and clearly list: each medicine name, dosage, frequency, and any special instructions. If something is unclear, mention it.'

const SUPPORTED_MEDIA_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
])

function validateImagePayload(payload) {
  const base64Image = payload?.base64Image
  const mediaType = payload?.mediaType

  if (typeof base64Image !== 'string' || base64Image.length === 0) {
    const error = new Error('Missing base64 image data')
    error.status = 400
    throw error
  }

  if (!SUPPORTED_MEDIA_TYPES.has(mediaType)) {
    const error = new Error(`Unsupported image type: ${mediaType || 'unknown'}`)
    error.status = 400
    throw error
  }

  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64Image)) {
    const error = new Error('Image data is not valid base64')
    error.status = 400
    throw error
  }

  if (base64Image.length > 4_000_000) {
    const error = new Error('Image is too large to process')
    error.status = 413
    throw error
  }

  return { base64Image, mediaType }
}

export async function analyzePrescriptionImage(payload, apiKey) {
  if (!apiKey) {
    const error = new Error('GEMINI_KEY is not configured')
    error.status = 500
    throw error
  }

  const { base64Image, mediaType } = validateImagePayload(payload)
  const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: EXTRACTION_PROMPT },
          {
            inline_data: {
              mime_type: mediaType,
              data: base64Image,
            },
          },
        ],
      }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            medicines: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  name: { type: 'STRING' },
                  dosage: { type: 'STRING' },
                  frequency: { type: 'STRING' },
                  specialInstructions: { type: 'STRING' },
                  confidence: { type: 'INTEGER' },
                },
                required: ['name', 'dosage', 'frequency', 'specialInstructions', 'confidence'],
              },
            },
          },
          required: ['medicines'],
        },
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

    const error = new Error(
      upstreamMessage || `Gemini API returned ${response.status} ${response.statusText}`
    )
    error.status = response.status
    error.responseBody = responseText
    throw error
  }

  const geminiResponse = JSON.parse(responseText)
  const resultText = geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!resultText) {
    const error = new Error('Gemini returned no prescription result')
    error.status = 502
    throw error
  }

  const parsed = JSON.parse(resultText)
  const medicines = Array.isArray(parsed.medicines) ? parsed.medicines : []

  return {
    drugs: medicines.map((medicine) => ({
      name: medicine.name || 'Unclear',
      dosage: medicine.dosage || 'Unclear',
      frequency: medicine.frequency || 'Unclear',
      specialInstructions: medicine.specialInstructions || '',
      confidence: Number.isFinite(medicine.confidence)
        ? Math.max(0, Math.min(100, medicine.confidence))
        : 0,
    })),
  }
}
