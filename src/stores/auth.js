import { defineStore } from 'pinia'
import { AuthService } from '../services/authService'
import { USER_ROLES } from '../utils/constants'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === USER_ROLES.ADMIN,
    isStudent: (state) => state.user?.role === USER_ROLES.STUDENT,
    userName: (state) => state.user?.name || 'User'
  },

  actions: {
    async login(email, password) {
      this.isLoading = true
      this.error = null
      
      try {
        const result = await AuthService.login(email, password)
        
        if (result.success) {
          this.user = result.user
          return { success: true }
        } else {
          this.error = result.error
          return { success: false, error: result.error }
        }
      } catch (error) {
        this.error = 'Login failed. Please try again.'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async register(userData) {
      this.isLoading = true
      this.error = null
      
      try {
        const result = await AuthService.register(userData)
        
        if (result.success) {
          this.user = result.user
          return { success: true }
        } else {
          this.error = result.error
          return { success: false, error: result.error }
        }
      } catch (error) {
        this.error = 'Registration failed. Please try again.'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      AuthService.logout()
      this.user = null
      this.error = null
    },

    initialize() {
      const user = AuthService.getCurrentUser()
      if (user) {
        this.user = user
      }
    }
  }
})