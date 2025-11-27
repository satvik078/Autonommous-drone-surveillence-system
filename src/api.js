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
// FETCH DETECTIONS — backend now returns ARRAY, not {data:...}
// ------------------------------------------------------
export const fetchDetections = async () => {
  try {
    const response = await apiClient.get('/detections', {
      params: { t: Date.now() },
    })

    let detections = response.data   // backend returns pure array

    // URL FIXER (replaces localhost with ngrok)
    detections = detections.map((item) => ({
      ...item,
      image_url: item.image_url
        ? item.image_url.replace("http://localhost:8000", backendURL)
        : null,

      annotated_url: item.annotated_url
        ? item.annotated_url.replace("http://localhost:8000", backendURL)
        : null,

      crops: item.crops?.map((crop) => ({
        ...crop,
        crop_url: crop.crop_url.replace("http://localhost:8000", backendURL),
      })) || [],
    }))

    return detections
  } catch (error) {
    console.error("API ERROR (fetchDetections):", error)
    return []
  }
}

export default apiClient