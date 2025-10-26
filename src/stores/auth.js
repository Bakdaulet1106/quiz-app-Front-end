import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const mockUsers = [
  {
    id: 1,
    email: 'admin@quiz.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: 2,
    email: 'student@quiz.com',
    password: 'student123',
    role: 'student',
    name: 'Student User'
  }
]

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isStudent = computed(() => user.value?.role === 'student')
  const userName = computed(() => user.value?.name || '')

  const initializeAuth = () => {
    const savedUser = localStorage.getItem('quiz_app_user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  const login = async (email, password) => {
    isLoading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const foundUser = mockUsers.find(u => u.email === email && u.password === password)
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser
        user.value = userWithoutPassword
        localStorage.setItem('quiz_app_user', JSON.stringify(userWithoutPassword))
        return userWithoutPassword
      }
      throw new Error('Неверный email или пароль')
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
      await new Promise(resolve => setTimeout(resolve, 500))
      const existingUser = mockUsers.find(u => u.email === userData.email)
      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует')
      }

      const newUser = {
        id: Date.now(),
        ...userData,
        role: 'student'
      }

      const { password: _, ...userWithoutPassword } = newUser
      user.value = userWithoutPassword
      localStorage.setItem('quiz_app_user', JSON.stringify(userWithoutPassword))
      return userWithoutPassword
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    user.value = null
    localStorage.removeItem('quiz_app_user')
  }

  const clearError = () => {
    error.value = null
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    isStudent,
    userName,
    initializeAuth,
    login,
    register,
    logout,
    clearError
  }
})