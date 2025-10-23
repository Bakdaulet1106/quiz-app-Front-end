// Quiz categories
export const CATEGORIES = [
  'Vue.js',
  'JavaScript',
  'HTML/CSS',
  'React',
  'Angular',
  'Node.js',
  'General Programming'
]

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Легкий', color: '#4ade80' },
  { value: 'medium', label: 'Средний', color: '#f59e0b' },
  { value: 'hard', label: 'Сложный', color: '#ef4444' }
]

// Quiz settings
export const QUIZ_SETTINGS = {
  TIME_LIMIT: 300, // 5 minutes in seconds
  QUESTIONS_PER_QUIZ: 5,
  PASSING_SCORE: 60
}

// Storage keys
export const STORAGE_KEYS = {
  USER: 'quiz_app_user',
  TOKEN: 'quiz_app_token',
  OFFLINE_DATA: 'quiz_app_offline_data'
}

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: '/api/users',
  QUESTIONS: '/api/questions',
  RESULTS: '/api/quizResults'
}