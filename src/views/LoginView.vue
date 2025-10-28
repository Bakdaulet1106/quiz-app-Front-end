<template>
  <div class="login-view">
    <div class="container">
      <div class="login-content">
        <div class="login-hero">
          <h1 class="hero-title">Welcome to QuizMaster</h1>
          <p class="hero-subtitle">
            Test your knowledge, track your progress, and become a quiz master!
            Join thousands of students already learning with our platform.
          </p>
          <div class="hero-features">
            <div class="feature">
              <div class="feature-icon">🎯</div>
              <span>Smart Quizzes</span>
            </div>
            <div class="feature">
              <div class="feature-icon">📊</div>
              <span>Progress Tracking</span>
            </div>
            <div class="feature">
              <div class="feature-icon">⏱️</div>
              <span>Timed Challenges</span>
            </div>
          </div>
        </div>
        <div class="login-form-container">
          <LoginForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '../components/auth/LoginForm.vue'

export default {
  name: 'LoginView',
  components: {
    LoginForm
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--gray-50) 100%);
  display: flex;
  align-items: center;
  padding: var(--space-8) 0;
}

.login-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
}

.login-hero {
  padding: var(--space-8);
}

.hero-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-4);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: var(--text-lg);
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: var(--space-8);
}

.hero-features {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.feature {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-weight: 500;
  color: var(--gray-700);
}

.feature-icon {
  font-size: var(--text-xl);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.login-form-container {
  display: flex;
  justify-content: center;
}

@media (max-width: 968px) {
  .login-content {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
  
  .login-hero {
    text-align: center;
    padding: var(--space-4);
  }
  
  .hero-features {
    align-items: center;
  }
}
</style>