import api from './api'
import { StorageService } from './storageService'

export const AuthService = {
  async login(email, password) {
    try {
      const response = await api.get('/users')
      const users = response.data
      
      const user = users.find(u => u.email === email && u.password === password)
      
      if (user) {
        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          token: btoa(JSON.stringify(user)) // Simple token for demo
        }
        
        StorageService.setUser(userData)
        return { success: true, user: userData }
      } else {
        return { success: false, error: 'Invalid email or password' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/users', {
        ...userData,
        role: 'student',
        createdAt: new Date().toISOString()
      })
      
      const user = response.data
      const userWithToken = {
        ...user,
        token: btoa(JSON.stringify(user))
      }
      
      StorageService.setUser(userWithToken)
      return { success: true, user: userWithToken }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Registration failed. Please try again.' }
    }
  },

  logout() {
    StorageService.clearUser()
  },

  getCurrentUser() {
    return StorageService.getUser()
  },

  isAuthenticated() {
    return !!StorageService.getUser()
  }
}