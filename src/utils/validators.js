export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateQuestion = (question) => {
  const errors = {}
  
  if (!question.question?.trim()) {
    errors.question = 'Question text is required'
  }
  
  if (!question.options || question.options.length < 2) {
    errors.options = 'At least 2 options are required'
  }
  
  if (question.options.some(opt => !opt.trim())) {
    errors.options = 'All options must have text'
  }
  
  if (question.correctAnswer === undefined || question.correctAnswer === null) {
    errors.correctAnswer = 'Correct answer must be selected'
  }
  
  if (!question.category?.trim()) {
    errors.category = 'Category is required'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}