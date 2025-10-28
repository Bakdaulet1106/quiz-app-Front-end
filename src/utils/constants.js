export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student'
}

export const QUIZ_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
}

export const QUIZ_CATEGORIES = [
  'General',
  'Programming',
  'Mathematics',
  'Science',
  'History',
  'Geography',
  'Languages'
]

export const STORAGE_KEYS = {
  USER: 'quiz_app_user',
  QUIZ_PROGRESS: 'quiz_app_progress',
  OFFLINE_DATA: 'quiz_app_offline'
}

export const API_ENDPOINTS = {
  LOGIN: '/api/users',
  QUESTIONS: '/api/questions',
  QUIZZES: '/api/quizzes',
  RESULTS: '/api/results'
}