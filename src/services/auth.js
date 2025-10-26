import { storage } from './storage'

const STORAGE_KEYS = {
  USER: 'quiz_app_user'
}

export const authService = {
  getCurrentUser() {
    return storage.getItem(STORAGE_KEYS.USER)
  },

  isAuthenticated() {
    return !!storage.getItem(STORAGE_KEYS.USER)
  }
}