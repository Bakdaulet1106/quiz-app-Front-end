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
      console.warn('API недоступен, используется оффлайн режим')
    }
    return Promise.reject(error)
  }
)

// Offline fallback
const offlineStorage = {
  get: (key) => {
    const data = localStorage.getItem(`offline_${key}`)
    return data ? JSON.parse(data) : null
  },
  set: (key, data) => {
    localStorage.setItem(`offline_${key}`, JSON.stringify(data))
  }
}

export const apiService = {
  async get(url) {
    try {
      const response = await api.get(url)
      // Сохраняем данные для оффлайн использования
      offlineStorage.set(url, response.data)
      return response
    } catch (error) {
      // Пробуем получить данные из оффлайн хранилища
      const offlineData = offlineStorage.get(url)
      if (offlineData) {
        return { data: offlineData }
      }
      throw error
    }
  },

  async post(url, data) {
    try {
      const response = await api.post(url, data)
      return response
    } catch (error) {
      // Сохраняем для синхронизации когда онлайн
      const pendingRequests = offlineStorage.get('pending_requests') || []
      pendingRequests.push({ url, data, method: 'POST', timestamp: Date.now() })
      offlineStorage.set('pending_requests', pendingRequests)
      return { data: { id: Date.now(), ...data } } // Mock response for offline
    }
  },

  async put(url, data) {
    try {
      const response = await api.put(url, data)
      return response
    } catch (error) {
      const pendingRequests = offlineStorage.get('pending_requests') || []
      pendingRequests.push({ url, data, method: 'PUT', timestamp: Date.now() })
      offlineStorage.set('pending_requests', pendingRequests)
      return { data }
    }
  },

  async delete(url) {
    try {
      const response = await api.delete(url)
      return response
    } catch (error) {
      const pendingRequests = offlineStorage.get('pending_requests') || []
      pendingRequests.push({ url, method: 'DELETE', timestamp: Date.now() })
      offlineStorage.set('pending_requests', pendingRequests)
      return { data: {} }
    }
  }
}