import React, { useRef } from 'react'
import { FileImage } from 'lucide-react'

export default function UploadZone({ uploadedImage, setUploadedImage, onUseSample, analysisError, onClearError, onError }) {
  const ref = useRef()
  const supportedImageTypes = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])

  const prepareImage = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const image = new Image()

      image.onload = () => {
        const maxDimension = 1600
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))
        const width = Math.max(1, Math.round(image.width * scale))
        const height = Math.max(1, Math.round(image.height * scale))
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        canvas.width = width
        canvas.height = height
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, width, height)
        context.drawImage(image, 0, 0, width, height)

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
        const base64 = dataUrl.split(',')[1]

        if (!base64 || base64.length > 4_000_000) {
          reject(new Error('The processed image is still too large to upload'))
          return
        }

        resolve({
          base64,
          mediaType: 'image/jpeg',
          previewUrl: dataUrl,
        })
      }

      image.onerror = () => reject(new Error('The selected image could not be decoded'))
      image.src = event.target.result
    }

    reader.onerror = () => reject(reader.error || new Error('Failed to read the selected image'))
    reader.readAsDataURL(file)
  })

  const handleFile = (file) => {
    onClearError()
    console.log('=== FILE UPLOAD ===')
    console.log('File name:', file.name)
    console.log('File type:', file.type)
    console.log('File size:', file.size, 'bytes')

    if (!supportedImageTypes.has(file.type)) {
      console.error('Unsupported image type for Anthropic Vision:', file.type || 'unknown')
      onError('Choose a JPG, PNG, GIF, or WEBP image.')
      return
    }

    prepareImage(file)
      .then(({ base64, mediaType, previewUrl }) => {
        console.log('Data URL generated, base64 length:', base64?.length)
        console.log('First 50 chars of base64:', base64?.substring(0, 50))
        setUploadedImage({ base64, mediaType, filename: file.name, previewUrl, isDemo: false })
      })
      .catch((error) => {
        console.error('Failed to prepare uploaded image:', error)
        onError(error.message)
      })
  }

  const onDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  return (
    <div className="pt-8 flex flex-col items-center">
      {!uploadedImage ? (
        <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop} className="w-full max-w-2xl border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer">
          <FileImage className="w-12 h-12 text-gray-400" />
          <h3 className="mt-4 text-xl font-bold text-gray-800">Upload Prescription</h3>
          <p className="mt-2 text-sm text-gray-500 text-center">Drag & drop or click to upload a photo of a handwritten prescription</p>
          <div className="mt-2 text-xs text-gray-400">Supports JPG, PNG, GIF, WEBP · Max 10MB</div>
          <div className="mt-6">
            <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <button onClick={() => ref.current?.click()} className="bg-[#3b82f6] text-white px-5 py-2 rounded-lg text-sm font-semibold">Choose File</button>
          </div>
          {analysisError && (
            <div className="mt-3 text-sm text-red-600 text-center">{analysisError}</div>
          )}
          <div className="mt-4">
            <button onClick={onUseSample} className="text-sm text-[#3b82f6] hover:underline">See demo →</button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl flex flex-col items-center">
          <img src={uploadedImage.previewUrl} alt="preview" className="max-h-72 rounded-xl object-contain border border-gray-200 shadow-sm" />
          <div className="mt-3 text-sm text-gray-500 font-mono">{uploadedImage.filename}</div>
          <div className="mt-3 flex gap-3">
            <button onClick={() => { onClearError(); setUploadedImage(null) }} className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm">Change Image</button>
            <button onClick={() => { onClearError(); setUploadedImage((s) => ({...s, toAnalyze: true})) }} className="bg-[#3b82f6] text-white px-6 py-2 rounded-lg font-semibold text-sm">Analyze Prescription</button>
          </div>
          {analysisError && (
            <div className="mt-3 text-sm text-red-600 text-center">{analysisError}</div>
          )}
          <div className="mt-3">
            <button onClick={onUseSample} className="text-sm text-[#3b82f6] hover:underline">See demo →</button>
          </div>
        </div>
      )}
    </div>
  )
}
