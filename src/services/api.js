import axios from 'axios'

const BASE_URL = 'http://localhost:3001'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('quiz_app_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
      console.warn('API недоступен, используется локальный режим')
      // Возвращаем mock данные для оффлайн режима
      return Promise.resolve({ data: [] })
    }
    return Promise.reject(error)
  }
)

export const apiService = {
  async get(url) {
    try {
      const response = await api.get(url)
      return response
    } catch (error) {
      console.error('API Error:', error)
      // Возвращаем пустой массив для оффлайн режима
      return { data: [] }
    }
  },

  async post(url, data) {
    try {
      const response = await api.post(url, data)
      return response
    } catch (error) {
      console.error('API Error:', error)
      // Возвращаем mock ответ для оффлайн режима
      return { data: { id: Date.now(), ...data } }
    }
  },

  async put(url, data) {
    try {
      const response = await api.put(url, data)
      return response
    } catch (error) {
      console.error('API Error:', error)
      return { data }
    }
  },

  async delete(url) {
    try {
      const response = await api.delete(url)
      return response
    } catch (error) {
      console.error('API Error:', error)
      return { data: {} }
    }
  }
}