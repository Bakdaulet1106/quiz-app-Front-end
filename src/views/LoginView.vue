<template>
  <div class="login-view">
    <div class="login-view__background">
      <div class="login-view__container">
        <div class="login-view__content">
          <div class="login-view__header">
            <h1 class="login-view__title">🎯 QuizMaster</h1>
            <p class="login-view__subtitle">
              Современная платформа для тестирования знаний
            </p>
          </div>

          <div class="login-view__form-container">
            <LoginForm 
              v-if="activeTab === 'login'"
              @switch-to-register="activeTab = 'register'"
            />
            <RegisterForm 
              v-else
              @switch-to-login="activeTab = 'login'"
            />
          </div>

          <div class="login-view__demo">
            <h3>Демо доступ:</h3>
            <div class="login-view__demo-accounts">
              <div class="login-view__demo-account">
                <strong>Администратор:</strong><br>
                Email: admin@quiz.com<br>
                Пароль: admin123
              </div>
              <div class="login-view__demo-account">
                <strong>Студент:</strong><br>
                Email: student@quiz.com<br>
                Пароль: student123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const activeTab = ref('login')
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-view__background {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.login-view__container {
  width: 100%;
  max-width: 500px;
}

.login-view__content {
  text-align: center;
}

.login-view__header {
  margin-bottom: 3rem;
  color: white;
}

.login-view__title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.login-view__subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 500;
}

.login-view__form-container {
  margin-bottom: 2rem;
}

.login-view__demo {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: var(--border-radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.login-view__demo h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
}

.login-view__demo-accounts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  text-align: left;
}

.login-view__demo-account {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  line-height: 1.4;
}

.login-view__demo-account strong {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--warning-color);
}

@media (max-width: 768px) {
  .login-view__title {
    font-size: 2.5rem;
  }

  .login-view__subtitle {
    font-size: 1.125rem;
  }

  .login-view__demo-accounts {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .login-view__demo-account {
    padding: 0.75rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .login-view__title {
    font-size: 2rem;
  }

  .login-view__background {
    padding: 1rem;
  }
}
</style>