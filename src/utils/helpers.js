import { QUIZ_DIFFICULTY } from './constants'

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case QUIZ_DIFFICULTY.EASY:
      return 'var(--success-500)'
    case QUIZ_DIFFICULTY.MEDIUM:
      return 'var(--warning-500)'
    case QUIZ_DIFFICULTY.HARD:
      return 'var(--error-500)'
    default:
      return 'var(--gray-500)'
  }
}

export const calculateScore = (questions, answers) => {
  const correct = questions.filter((question, index) => 
    answers[index] === question.correctAnswer
  ).length
  return Math.round((correct / questions.length) * 100)
}

export const isOnline = () => navigator.onLine