const SUPPORTED_MEDIA_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
])

const EXTRACTION_PROMPT = `You are a medical OCR system. Read this prescription image carefully and extract only medication information that is actually visible.

Return only valid JSON in this exact shape:
{
  "drugs": [
    {
      "name": "medication name",
      "dosage": "visible dosage or Not visible",
      "frequency": "visible frequency or Not visible",
      "confidence": 0
    }
  ],
  "prescriber": "visible prescriber name or null",
  "date": "visible date or null",
  "rawText": "all legible prescription text"
}

Confidence must be an integer from 0 to 100. Do not guess medication names. If no medication can be read confidently, return an empty drugs array.`

export function validateImagePayload(payload) {
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
    const error = new Error('ANTHROPIC_API_KEY is not configured')
    error.status = 500
    throw error
  }

  const { base64Image, mediaType } = validateImagePayload(payload)
  const requestBody = {
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType,
            data: base64Image,
          },
        },
        {
          type: 'text',
          text: EXTRACTION_PROMPT,
        },
      ],
    }],
  }

  console.log('Sending prescription image to Anthropic', {
    mediaType,
    base64Length: base64Image.length,
  })

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(requestBody),
  })

  const responseText = await response.text()

  if (!response.ok) {
    const error = new Error(
      `Anthropic API returned ${response.status} ${response.statusText}`
    )
    error.status = response.status
    error.responseBody = responseText
    throw error
  }

  return JSON.parse(responseText)
}
