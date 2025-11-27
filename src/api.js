import axios from 'axios'

const backendURL = import.meta.env.VITE_BACKEND_URL

if (!backendURL) {
  console.warn("⚠️ VITE_BACKEND_URL is NOT SET. Set it in .env file.")
}

const apiClient = axios.create({
  baseURL: backendURL,
  timeout: 8000,
  headers: {
    'Cache-Control': 'no-cache',
    'ngrok-skip-browser-warning': 'true'
  },
})

// ------------------------------------------------------
// FETCH DETECTIONS (with auto-fix for image URLs)
// ------------------------------------------------------
export const fetchDetections = async () => {
  try {
    const response = await apiClient.get('/detections', {
      params: { t: Date.now() }, // Prevent caching
    })

    const data = response.data?.data || []

    // Map each detection to replace localhost URLs with ngrok
    const mapped = data.map((item) => ({
      ...item,

      // Fix image URLs returned from backend
      image_url: item.image_url
        ? item.image_url.replace("http://localhost:8000", backendURL)
        : null,

      annotated_url: item.annotated_url
        ? item.annotated_url.replace("http://localhost:8000", backendURL)
        : null,

      // Fix crop URLs
      crops: item.crops?.map(crop => ({
        ...crop,
        crop_url: crop.crop_url.replace("http://localhost:8000", backendURL)
      })) || [],
    }))

    return mapped
  } catch (error) {
    console.error("API ERROR (fetchDetections):", error)
    return []
  }
}

export default apiClient
