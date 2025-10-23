// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return 'Email обязателен'
  if (!emailRegex.test(email)) return 'Введите корректный email'
  return ''
}

// Password validation
export const validatePassword = (password) => {
  if (!password) return 'Пароль обязателен'
  if (password.length < 6) return 'Пароль должен содержать минимум 6 символов'
  return ''
}

// Name validation
export const validateName = (name) => {
  if (!name) return 'Имя обязательно'
  if (name.length < 2) return 'Имя должно содержать минимум 2 символа'
  return ''
}

// Question validation
export const validateQuestion = (question) => {
  if (!question.question) return 'Вопрос обязателен'
  if (question.options.length < 2) return 'Добавьте минимум 2 варианта ответа'
  if (question.options.some(opt => !opt.trim())) return 'Все варианты ответа должны быть заполнены'
  if (question.correctAnswer === null || question.correctAnswer === undefined) {
    return 'Выберите правильный ответ'
  }
  return ''
}

// Form validator
export const createValidator = (rules) => {
  return (data) => {
    const errors = {}
    Object.keys(rules).forEach(field => {
      const error = rules[field](data[field])
      if (error) {
        errors[field] = error
      }
    })
    return errors
  }
}