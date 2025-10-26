export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return 'Email обязателен'
  if (!emailRegex.test(email)) return 'Введите корректный email'
  return ''
}

export const validatePassword = (password) => {
  if (!password) return 'Пароль обязателен'
  if (password.length < 6) return 'Пароль должен содержать минимум 6 символов'
  return ''
}

export const validateName = (name) => {
  if (!name) return 'Имя обязательно'
  if (name.length < 2) return 'Имя должно содержать минимум 2 символа'
  return ''
}