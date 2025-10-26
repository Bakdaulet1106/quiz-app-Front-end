const isBrowser = typeof window !== 'undefined'

export const storage = {
  getItem(key) {
    if (!isBrowser) return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error getting item from storage:', error)
      return null
    }
  },

  setItem(key, value) {
    if (!isBrowser) return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error setting item to storage:', error)
    }
  },

  removeItem(key) {
    if (!isBrowser) return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing item from storage:', error)
    }
  }
}