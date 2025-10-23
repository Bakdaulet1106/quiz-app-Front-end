import { DIFFICULTY_LEVELS } from './constants'

// Shuffle array using Fisher-Yates algorithm
export const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Format time from seconds to MM:SS
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Calculate score percentage
export const calculateScore = (correct, total) => {
  return total > 0 ? Math.round((correct / total) * 100) : 0
}

// Get difficulty color
export const getDifficultyColor = (difficulty) => {
  const level = DIFFICULTY_LEVELS.find(d => d.value === difficulty)
  return level ? level.color : '#6b7280'
}

// Get difficulty label
export const getDifficultyLabel = (difficulty) => {
  const level = DIFFICULTY_LEVELS.find(d => d.value === difficulty)
  return level ? level.label : 'Неизвестно'
}

// Generate random questions
export const getRandomQuestions = (questions, count) => {
  return shuffleArray(questions).slice(0, count)
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}