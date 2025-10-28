<template>
  <div class="register-view">
    <div class="container">
      <div class="register-content">
        <div class="register-hero">
          <h1 class="hero-title">Join QuizMaster Today</h1>
          <p class="hero-subtitle">
            Create your account and start your learning journey. 
            Access hundreds of quizzes and track your progress over time.
          </p>
          <div class="benefits">
            <div class="benefit">
              <div class="benefit-icon">🚀</div>
              <div class="benefit-content">
                <h3>Quick Start</h3>
                <p>Get started in seconds with instant account setup</p>
              </div>
            </div>
            <div class="benefit">
              <div class="benefit-icon">📈</div>
              <div class="benefit-content">
                <h3>Track Progress</h3>
                <p>Monitor your improvement with detailed analytics</p>
              </div>
            </div>
            <div class="benefit">
              <div class="benefit-icon">🏆</div>
              <div class="benefit-content">
                <h3>Earn Achievements</h3>
                <p>Unlock badges and climb the leaderboards</p>
              </div>
            </div>
          </div>
        </div>
        <div class="register-form-container">
          <RegisterForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RegisterForm from '../components/auth/RegisterForm.vue'

export default {
  name: 'RegisterView',
  components: {
    RegisterForm
  }
}
</script>

<style scoped>
.register-view {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--gray-50) 100%);
  display: flex;
  align-items: center;
  padding: var(--space-8) 0;
}

.register-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
}

.register-hero {
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

.benefits {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.benefit {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
}

.benefit-icon {
  font-size: var(--text-2xl);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.benefit-content h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-1);
}

.benefit-content p {
  color: var(--gray-600);
  line-height: 1.5;
  margin: 0;
}

.register-form-container {
  display: flex;
  justify-content: center;
}

@media (max-width: 968px) {
  .register-content {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
  
  .register-hero {
    text-align: center;
    padding: var(--space-4);
  }
  
  .benefits {
    align-items: center;
  }
  
  .benefit {
    text-align: left;
    max-width: 400px;
  }
}
</style>