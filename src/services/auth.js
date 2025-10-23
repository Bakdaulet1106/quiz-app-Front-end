import { api } from './api'
import { storage } from './storage'
import { STORAGE_KEYS } from '@/utils/constants'

export const authService = {
  async login(email, password) {
    try {
      const response = await api.get('/users')
      const users = response.data
      const user = users.find(u => u.email === email && u.password === password)
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user
        storage.setItem(STORAGE_KEYS.USER, userWithoutPassword)
        storage.setItem(STORAGE_KEYS.TOKEN, 'mock-jwt-token')
        return userWithoutPassword
      }
      throw new Error('Неверный email или пароль')
    } catch (error) {
      throw new Error(error.message || 'Ошибка авторизации')
    }
  },

  async register(userData) {
    try {
      const response = await api.get('/users')
      const users = response.data
      
      const existingUser = users.find(u => u.email === userData.email)
      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует')
      }

      const newUser = {
        id: Date.now(),
        ...userData,
        role: 'student'
      }

      await api.post('/users', newUser)
      const { password: _, ...userWithoutPassword } = newUser
      
      storage.setItem(STORAGE_KEYS.USER, userWithoutPassword)
      storage.setItem(STORAGE_KEYS.TOKEN, 'mock-jwt-token')
      
      return userWithoutPassword
    } catch (error) {
      throw new Error(error.message || 'Ошибка регистрации')
    }
  },

  logout() {
    storage.removeItem(STORAGE_KEYS.USER)
    storage.removeItem(STORAGE_KEYS.TOKEN)
  },

  getCurrentUser() {
    return storage.getItem(STORAGE_KEYS.USER)
  },

  isAuthenticated() {
    return !!storage.getItem(STORAGE_KEYS.USER)
  }
}