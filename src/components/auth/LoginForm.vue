<template>
  <BaseCard class="auth-form">
    <template #header>
      <h2 class="form-title">Welcome Back</h2>
      <p class="form-subtitle">Sign in to your account</p>
    </template>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="email" class="form-label">Email Address</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="form-input"
          :class="{ error: errors.email }"
          placeholder="Enter your email"
          required
        />
        <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
      </div>

      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="form-input"
          :class="{ error: errors.password }"
          placeholder="Enter your password"
          required
        />
        <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
      </div>

      <div v-if="authStore.error" class="error-message mb-4">
        {{ authStore.error }}
      </div>

      <BaseButton
        type="submit"
        variant="primary"
        size="large"
        :isLoading="authStore.isLoading"
        class="submit-button"
      >
        Sign In
      </BaseButton>
    </form>

    <template #footer>
      <p class="form-footer">
        Don't have an account?
        <router-link to="/register" class="form-link">Sign up here</router-link>
      </p>
    </template>
  </BaseCard>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { validateEmail } from '../../utils/validators'
import BaseCard from '../common/BaseCard.vue'
import BaseButton from '../common/BaseButton.vue'

export default {
  name: 'LoginForm',
  components: {
    BaseCard,
    BaseButton
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const form = reactive({
      email: '',
      password: ''
    })

    const errors = reactive({
      email: '',
      password: ''
    })

    const validateForm = () => {
      let isValid = true

      // Clear previous errors
      Object.keys(errors).forEach(key => errors[key] = '')

      if (!form.email) {
        errors.email = 'Email is required'
        isValid = false
      } else if (!validateEmail(form.email)) {
        errors.email = 'Please enter a valid email address'
        isValid = false
      }

      if (!form.password) {
        errors.password = 'Password is required'
        isValid = false
      } else if (form.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
        isValid = false
      }

      return isValid
    }

    const handleSubmit = async () => {
      if (!validateForm()) return

      const result = await authStore.login(form.email, form.password)
      
      if (result.success) {
        router.push('/')
      }
    }

    return {
      form,
      errors,
      authStore,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.auth-form {
  max-width: 400px;
  margin: 0 auto;
}

.form-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--gray-900);
  text-align: center;
  margin-bottom: var(--space-2);
}

.form-subtitle {
  color: var(--gray-600);
  text-align: center;
  margin: 0;
}

.form {
  margin-top: var(--space-6);
}

.form-group {
  margin-bottom: var(--space-4);
}

.form-label {
  display: block;
  margin-bottom: var(--space-2);
  font-weight: 500;
  color: var(--gray-700);
}

.form-input {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius);
  font-size: var(--text-base);
  transition: var(--transition);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: var(--error-500);
}

.error-message {
  color: var(--error-500);
  font-size: var(--text-sm);
  margin-top: var(--space-1);
}

.submit-button {
  width: 100%;
  margin-top: var(--space-4);
}

.form-footer {
  text-align: center;
  color: var(--gray-600);
  margin: 0;
}

.form-link {
  color: var(--primary-500);
  text-decoration: none;
  font-weight: 500;
}

.form-link:hover {
  text-decoration: underline;
}
</style>