import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth'
import { router } from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isStudent = computed(() => user.value?.role === 'student')
  const userName = computed(() => user.value?.name || '')

  // Actions
  const initializeAuth = () => {
    const savedUser = authService.getCurrentUser()
    if (savedUser) {
      user.value = savedUser
    }
  }

  const login = async (email, password) => {
    isLoading.value = true
    error.value = null
    
    try {
      const userData = await authService.login(email, password)
      user.value = userData
      await router.push(isAdmin.value ? '/admin' : '/student')
      return userData
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData) => {
    isLoading.value = true
    error.value = null
    
    try {
      const newUser = await authService.register(userData)
      user.value = newUser
      await router.push('/student')
      return newUser
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    user.value = null
    authService.logout()
    await router.push('/login')
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    isAdmin,
    isStudent,
    userName,
    
    // Actions
    initializeAuth,
    login,
    register,
    logout,
    clearError
  }
})