<template>
  <div class="register-form">
    <h2 class="register-form__title">Регистрация</h2>
    <form @submit.prevent="handleSubmit" class="register-form__form">
      <div class="register-form__field">
        <label for="name" class="register-form__label">Имя</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="register-form__input"
          :class="{ 'register-form__input--error': errors.name }"
          placeholder="Введите ваше имя"
          @blur="validateField('name')"
        />
        <span v-if="errors.name" class="register-form__error">{{ errors.name }}</span>
      </div>

      <div class="register-form__field">
        <label for="email" class="register-form__label">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="register-form__input"
          :class="{ 'register-form__input--error': errors.email }"
          placeholder="Введите ваш email"
          @blur="validateField('email')"
        />
        <span v-if="errors.email" class="register-form__error">{{ errors.email }}</span>
      </div>

      <div class="register-form__field">
        <label for="password" class="register-form__label">Пароль</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="register-form__input"
          :class="{ 'register-form__input--error': errors.password }"
          placeholder="Введите пароль (мин. 6 символов)"
          @blur="validateField('password')"
        />
        <span v-if="errors.password" class="register-form__error">{{ errors.password }}</span>
      </div>

      <div class="register-form__field">
        <label for="confirmPassword" class="register-form__label">Подтвердите пароль</label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          class="register-form__input"
          :class="{ 'register-form__input--error': errors.confirmPassword }"
          placeholder="Повторите пароль"
          @blur="validateField('confirmPassword')"
        />
        <span v-if="errors.confirmPassword" class="register-form__error">{{ errors.confirmPassword }}</span>
      </div>

      <BaseButton
        type="submit"
        variant="primary"
        size="large"
        :loading="authStore.isLoading"
        :disabled="!isFormValid"
        fullWidth
        class="register-form__submit"
      >
        Зарегистрироваться
      </BaseButton>

      <div class="register-form__footer">
        <p class="register-form__text">
          Уже есть аккаунт?
          <a @click="$emit('switch-to-login')" class="register-form__link">
            Войти
          </a>
        </p>
      </div>

      <div v-if="authStore.error" class="register-form__server-error">
        ❌ {{ authStore.error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { validateEmail, validatePassword, validateName } from '@/utils/validators'
import BaseButton from '@/components/common/BaseButton.vue'

const emit = defineEmits(['switch-to-login'])

const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateField = (field) => {
  switch (field) {
    case 'name':
      errors.value.name = validateName(form.value.name)
      break
    case 'email':
      errors.value.email = validateEmail(form.value.email)
      break
    case 'password':
      errors.value.password = validatePassword(form.value.password)
      break
    case 'confirmPassword':
      if (!form.value.confirmPassword) {
        errors.value.confirmPassword = 'Подтвердите пароль'
      } else if (form.value.password !== form.value.confirmPassword) {
        errors.value.confirmPassword = 'Пароли не совпадают'
      } else {
        errors.value.confirmPassword = ''
      }
      break
  }
}

const isFormValid = computed(() => {
  return form.value.name && 
         form.value.email && 
         form.value.password && 
         form.value.confirmPassword &&
         !errors.value.name && 
         !errors.value.email && 
         !errors.value.password && 
         !errors.value.confirmPassword
})

const handleSubmit = async () => {
  // Validate all fields
  validateField('name')
  validateField('email')
  validateField('password')
  validateField('confirmPassword')

  if (!isFormValid.value) return

  try {
    await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    })
  } catch (error) {
    // Error handling is done in the store
  }
}

// Clear errors when form changes
watch([() => form.value.name, () => form.value.email, () => form.value.password, () => form.value.confirmPassword], () => {
  if (authStore.error) {
    authStore.clearError()
  }
})
</script>

<style scoped>
.register-form {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}

.register-form__title {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-primary);
  font-size: 1.75rem;
}

.register-form__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.register-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.register-form__label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.register-form__input {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  background-color: var(--bg-primary);
}

.register-form__input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: var(--bg-secondary);
}

.register-form__input--error {
  border-color: var(--danger-color);
}

.register-form__error {
  color: var(--danger-color);
  font-size: 0.875rem;
  font-weight: 500;
}

.register-form__submit {
  margin-top: 0.5rem;
}

.register-form__footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.register-form__text {
  color: var(--text-secondary);
  margin: 0;
}

.register-form__link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.register-form__link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.register-form__server-error {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--danger-color);
  font-weight: 500;
  text-align: center;
}

@media (max-width: 480px) {
  .register-form {
    padding: 1.5rem;
    margin: 1rem;
  }
}
</style>