import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
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

