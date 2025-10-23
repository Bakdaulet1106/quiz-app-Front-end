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
  },

  clear() {
    if (!isBrowser) return
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  }
}

// IndexedDB wrapper for more complex offline storage
export const createOfflineDB = () => {
  if (!isBrowser) return null

  const DB_NAME = 'QuizAppDB'
  const DB_VERSION = 1
  const STORE_NAME = 'offlineData'

  let db = null

  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const database = event.target.result
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      }
    })
  }

  const getDB = async () => {
    if (!db) {
      db = await openDB()
    }
    return db
  }

  return {
    async set(key, data) {
      try {
        const database = await getDB()
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        store.put({ id: key, data, timestamp: Date.now() })
      } catch (error) {
        console.error('Error saving to IndexedDB:', error)
      }
    },

    async get(key) {
      try {
        const database = await getDB()
        const transaction = database.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        return new Promise((resolve) => {
          const request = store.get(key)
          request.onsuccess = () => resolve(request.result?.data || null)
          request.onerror = () => resolve(null)
        })
      } catch (error) {
        console.error('Error reading from IndexedDB:', error)
        return null
      }
    },

    async remove(key) {
      try {
        const database = await getDB()
        const transaction = database.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        store.delete(key)
      } catch (error) {
        console.error('Error removing from IndexedDB:', error)
      }
    }
  }
}

export const offlineDB = createOfflineDB()