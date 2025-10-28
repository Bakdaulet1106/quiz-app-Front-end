import { STORAGE_KEYS } from '../utils/constants'

export const StorageService = {
  // LocalStorage methods
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Storage set error:', error)
      return false
    }
  },

  getItem(key) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Storage get error:', error)
      return null
    }
  },

  removeItem(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Storage remove error:', error)
      return false
    }
  },

  // User specific methods
  setUser(user) {
    return this.setItem(STORAGE_KEYS.USER, user)
  },

  getUser() {
    return this.getItem(STORAGE_KEYS.USER)
  },

  clearUser() {
    return this.removeItem(STORAGE_KEYS.USER)
  },

  // Quiz progress methods
  saveQuizProgress(quizId, progress) {
    const allProgress = this.getItem(STORAGE_KEYS.QUIZ_PROGRESS) || {}
    allProgress[quizId] = {
      ...progress,
      savedAt: new Date().toISOString()
    }
    return this.setItem(STORAGE_KEYS.QUIZ_PROGRESS, allProgress)
  },

  getQuizProgress(quizId) {
    const allProgress = this.getItem(STORAGE_KEYS.QUIZ_PROGRESS) || {}
    return allProgress[quizId] || null
  },

  clearQuizProgress(quizId) {
    const allProgress = this.getItem(STORAGE_KEYS.QUIZ_PROGRESS) || {}
    delete allProgress[quizId]
    return this.setItem(STORAGE_KEYS.QUIZ_PROGRESS, allProgress)
  }
}