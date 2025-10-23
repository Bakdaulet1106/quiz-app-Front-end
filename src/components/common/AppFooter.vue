<template>
  <footer class="app-footer">
    <div class="container">
      <div class="app-footer__content">
        <div class="app-footer__section">
          <h3 class="app-footer__title">🎯 QuizMaster</h3>
          <p class="app-footer__description">
            Современная платформа для создания и прохождения квизов
          </p>
        </div>
        
        <div class="app-footer__section">
          <h4 class="app-footer__subtitle">Быстрые ссылки</h4>
          <div class="app-footer__links">
            <router-link to="/dashboard" class="app-footer__link">Дашборд</router-link>
            <router-link to="/student" class="app-footer__link" v-if="authStore.isStudent">Студент</router-link>
            <router-link to="/admin" class="app-footer__link" v-if="authStore.isAdmin">Админка</router-link>
          </div>
        </div>
        
        <div class="app-footer__section">
          <h4 class="app-footer__subtitle">Статистика</h4>
          <div class="app-footer__stats">
            <div class="app-footer__stat" v-if="authStore.isAuthenticated">
              <span class="app-footer__stat-label">Роль:</span>
              <span class="app-footer__stat-value">{{ authStore.isAdmin ? 'Администратор' : 'Студент' }}</span>
            </div>
            <div class="app-footer__stat" v-if="resultsStore.totalQuizzesTaken > 0">
              <span class="app-footer__stat-label">Пройдено тестов:</span>
              <span class="app-footer__stat-value">{{ resultsStore.totalQuizzesTaken }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="app-footer__bottom">
        <p class="app-footer__copyright">
          &copy; 2024 QuizMaster. Все права защищены.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useResultsStore } from '@/stores/results'

const authStore = useAuthStore()
const resultsStore = useResultsStore()
</script>

<style scoped>
.app-footer {
  background-color: var(--bg-dark);
  color: var(--text-light);
  margin-top: auto;
}

.app-footer__content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

.app-footer__section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.app-footer__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
}

.app-footer__subtitle {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-light);
}

.app-footer__description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
}

.app-footer__links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.app-footer__link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: var(--transition);
}

.app-footer__link:hover {
  color: var(--primary-color);
  transform: translateX(5px);
}

.app-footer__stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.app-footer__stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-footer__stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
}

.app-footer__stat-value {
  color: var(--text-light);
  font-weight: 600;
}

.app-footer__bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 0;
  text-align: center;
}

.app-footer__copyright {
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .app-footer__content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    text-align: center;
  }

  .app-footer__stat {
    justify-content: center;
    gap: 0.5rem;
  }
}
</style>