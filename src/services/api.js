import axios from 'axios'

const API_BASE_URL = 'http://localhost:3002' // Изменено с 3001 на 3002

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!navigator.onLine) {
      throw new Error('No internet connection')
    }
    throw new Error(error.response?.data?.message || 'Network error')
  }
)

export default api