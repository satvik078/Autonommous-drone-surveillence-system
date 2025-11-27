import axios from 'axios'

const apiClient = axios.create({
  baseURL:'https://unchevroned-squirrelish-eugenio.ngrok-free.dev',
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

