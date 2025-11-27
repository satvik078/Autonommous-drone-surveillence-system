import axios from 'axios'

const backendURL = import.meta.env.VITE_BACKEND_URL

const apiClient = axios.create({
  baseURL: backendURL,
  timeout: 8000,
  headers: {
    'Cache-Control': 'no-cache',
  },
})

export const fetchDetections = async () => {
  const response = await apiClient.get('/detections', {
    params: { t: Date.now() }, // bust any stray caches
  })
  return response.data
}

export default apiClient

