import { DIFFICULTY_LEVELS } from './constants'

export const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export const calculateScore = (correct, total) => {
  return total > 0 ? Math.round((correct / total) * 100) : 0
}

export const getDifficultyColor = (difficulty) => {
  const level = DIFFICULTY_LEVELS.find(d => d.value === difficulty)
  return level ? level.color : '#6b7280'
}

export const getDifficultyLabel = (difficulty) => {
  const level = DIFFICULTY_LEVELS.find(d => d.value === difficulty)
  return level ? level.label : 'Неизвестно'
}

export const getRandomQuestions = (questions, count) => {
  return shuffleArray(questions).slice(0, count)
}