<template>
  <div class="login-form">
    <h2 class="login-form__title">Вход в систему</h2>
    <form @submit.prevent="handleSubmit" class="login-form__form">
      <div class="login-form__field">
        <label for="email" class="login-form__label">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="login-form__input"
          :class="{ 'login-form__input--error': errors.email }"
          placeholder="Введите ваш email"
          @blur="validateField('email')"
        />
        <span v-if="errors.email" class="login-form__error">{{ errors.email }}</span>
      </div>

      <div class="login-form__field">
        <label for="password" class="login-form__label">Пароль</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="login-form__input"
          :class="{ 'login-form__input--error': errors.password }"
          placeholder="Введите ваш пароль"
          @blur="validateField('password')"
        />
        <span v-if="errors.password" class="login-form__error">{{ errors.password }}</span>
      </div>

      <BaseButton
        type="submit"
        variant="primary"
        size="large"
        :loading="authStore.isLoading"
        :disabled="!isFormValid"
        fullWidth
        class="login-form__submit"
      >
        Войти
      </BaseButton>

      <div class="login-form__footer">
        <p class="login-form__text">
          Нет аккаунта?
          <a @click="$emit('switch-to-register')" class="login-form__link">
            Зарегистрироваться
          </a>
        </p>
      </div>

      <div v-if="authStore.error" class="login-form__server-error">
        ❌ {{ authStore.error }}
      </div>
    </form>

    <div class="login-form__demo">
      <h4>Демо аккаунты:</h4>
      <div class="login-form__demo-accounts">
        <div class="login-form__demo-account">
          <strong>Админ:</strong> admin@quiz.com / admin123
        </div>
        <div class="login-form__demo-account">
          <strong>Студент:</strong> student@quiz.com / student123
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { validateEmail, validatePassword } from '@/utils/validators'
import BaseButton from '@/components/common/BaseButton.vue'

const emit = defineEmits(['switch-to-register'])

const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const errors = ref({
  email: '',
  password: ''
})

const validateField = (field) => {
  switch (field) {
    case 'email':
      errors.value.email = validateEmail(form.value.email)
      break
    case 'password':
      errors.value.password = validatePassword(form.value.password)
      break
  }
}

const isFormValid = computed(() => {
  return form.value.email && 
         form.value.password && 
         !errors.value.email && 
         !errors.value.password
})

const handleSubmit = async () => {
  validateField('email')
  validateField('password')

  if (!isFormValid.value) return

  try {
    await authStore.login(form.value.email, form.value.password)
  } catch (error) {
    // Error handled in store
  }
}

watch([() => form.value.email, () => form.value.password], () => {
  if (authStore.error) {
    authStore.clearError()
  }
})
</script>

<style scoped>
.login-form {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}

.login-form__title {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-primary);
  font-size: 1.75rem;
}

.login-form__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.login-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.login-form__label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.login-form__input {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  background-color: var(--bg-primary);
}

.login-form__input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: var(--bg-secondary);
}

.login-form__input--error {
  border-color: var(--danger-color);
}

.login-form__error {
  color: var(--danger-color);
  font-size: 0.875rem;
  font-weight: 500;
}

.login-form__submit {
  margin-top: 0.5rem;
}

.login-form__footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.login-form__text {
  color: var(--text-secondary);
  margin: 0;
}

.login-form__link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.login-form__link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.login-form__server-error {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--danger-color);
  font-weight: 500;
  text-align: center;
}

.login-form__demo {
  margin-top: 2rem;
  padding: 1rem;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: var(--border-radius);
  border: 1px solid var(--primary-color);
}

.login-form__demo h4 {
  margin: 0 0 0.5rem 0;
  color: var(--primary-color);
  font-size: 0.875rem;
}

.login-form__demo-accounts {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.login-form__demo-account {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

@media (max-width: 480px) {
  .login-form {
    padding: 1.5rem;
    margin: 1rem;
  }
}
</style>