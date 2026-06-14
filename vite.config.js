import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { analyzePrescriptionImage } from './server/analyzePrescription.js'

const MAX_REQUEST_BYTES = 15 * 1024 * 1024

function geminiApiPlugin(apiKey) {
  const handleRequest = async (req, res, next) => {
    if (req.url !== '/api/analyze' || req.method !== 'POST') {
      next()
      return
    }

    try {
      if (!apiKey) {
        throw new Error('GEMINI_KEY is not configured on the server')
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
      const result = await analyzePrescriptionImage(JSON.parse(requestBody), apiKey)

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(result))
    } catch (error) {
      console.error('Gemini prescription analysis failed:', error)

      res.statusCode = error.status || 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        error: error.message,
        details: error.responseBody || null,
      }))
    }
  }

  return {
    name: 'gemini-api',
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
    plugins: [
      react(),
      geminiApiPlugin(env.GEMINI_KEY),
    ],
  }
})
