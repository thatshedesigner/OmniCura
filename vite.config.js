import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const MAX_REQUEST_BYTES = 15 * 1024 * 1024

function anthropicApiPlugin(apiKey) {
  const handleRequest = async (req, res, next) => {
    if (req.url !== '/api/analyze-prescription' || req.method !== 'POST') {
      next()
      return
    }

    try {
      if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY is not configured on the server')
      }

      const chunks = []
      let size = 0

      for await (const chunk of req) {
        size += chunk.length
        if (size > MAX_REQUEST_BYTES) {
          const error = new Error('Uploaded image request exceeds the 15MB limit')
          error.status = 413
          throw error
        }
        chunks.push(chunk)
      }

      const requestBody = Buffer.concat(chunks).toString('utf8')
      const parsedBody = JSON.parse(requestBody)
      const imageSource = parsedBody?.messages?.[0]?.content?.find(
        (block) => block.type === 'image'
      )?.source

      if (
        imageSource?.type !== 'base64' ||
        typeof imageSource.data !== 'string' ||
        imageSource.data.length === 0
      ) {
        const error = new Error('Anthropic request is missing base64 image data')
        error.status = 400
        throw error
      }

      console.log('Sending prescription image to Anthropic', {
        mediaType: imageSource.media_type,
        base64Length: imageSource.data.length,
      })

      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'x-api-key': apiKey,
        },
        body: requestBody,
      })

      const responseText = await anthropicResponse.text()

      if (!anthropicResponse.ok) {
        const error = new Error(
          `Anthropic API returned ${anthropicResponse.status} ${anthropicResponse.statusText}`
        )
        error.status = anthropicResponse.status
        error.responseBody = responseText
        throw error
      }

      res.statusCode = anthropicResponse.status
      res.setHeader('Content-Type', 'application/json')
      res.end(responseText)
    } catch (error) {
      console.error('Anthropic prescription analysis failed:', error)
      if (error.responseBody) {
        console.error('Anthropic error response:', error.responseBody)
      }

      res.statusCode = error.status || 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        error: error.message,
        details: error.responseBody || null,
      }))
    }
  }

  return {
    name: 'anthropic-api',
    configureServer(server) {
      server.middlewares.use(handleRequest)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleRequest)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), anthropicApiPlugin(env.ANTHROPIC_API_KEY)],
  }
})
