<template>
  <div class="dashboard-view">
    <div class="container">
      <!-- Приветствие -->
      <div class="dashboard-view__welcome">
        <h1 class="dashboard-view__title">
          Добро пожаловать, {{ authStore.userName }}! 👋
        </h1>
        <p class="dashboard-view__subtitle">
          {{ welcomeMessage }}
        </p>
      </div>

      <!-- Быстрые действия -->
      <div class="dashboard-view__quick-actions">
        <h2 class="dashboard-view__section-title">Быстрые действия</h2>
        <div class="dashboard-view__actions-grid">
          <router-link 
            v-if="authStore.isStudent"
            to="/student" 
            class="dashboard-view__action-card"
          >
            <div class="dashboard-view__action-icon">🎓</div>
            <h3 class="dashboard-view__action-title">Пройти квиз</h3>
            <p class="dashboard-view__action-description">
              Начните новый тест и проверьте свои знания
            </p>
          </router-link>

          <router-link 
            v-if="authStore.isAdmin"
            to="/admin" 
            class="dashboard-view__action-card"
          >
            <div class="dashboard-view__action-icon">⚙️</div>
            <h3 class="dashboard-view__action-title">Управление вопросами</h3>
            <p class="dashboard-view__action-description">
              Добавляйте и редактируйте вопросы в банке
            </p>
          </router-link>

          <router-link 
            to="/results" 
            class="dashboard-view__action-card"
          >
            <div class="dashboard-view__action-icon">📊</div>
            <h3 class="dashboard-view__action-title">Мои результаты</h3>
            <p class="dashboard-view__action-description">
              Просмотрите историю пройденных тестов
            </p>
          </router-link>

          <div 
            v-if="authStore.isAdmin"
            class="dashboard-view__action-card"
            @click="showStats = true"
          >
            <div class="dashboard-view__action-icon">📈</div>
            <h3 class="dashboard-view__action-title">Статистика</h3>
            <p class="dashboard-view__action-description">
              Аналитика по всем пройденным тестам
            </p>
          </div>
        </div>
      </div>

      <!-- Последние результаты (для студентов) -->
      <div 
        v-if="authStore.isStudent && recentResults.length > 0"
        class="dashboard-view__recent-results"
      >
        <h2 class="dashboard-view__section-title">Последние результаты</h2>
        <div class="dashboard-view__results-grid">
          <div
            v-for="result in recentResults"
            :key="result.id"
            class="dashboard-view__result-card"
          >
            <div class="dashboard-view__result-header">
              <h3 class="dashboard-view__result-title">Тест {{ formatDate(result.completedAt) }}</h3>
              <span 
                class="dashboard-view__result-score"
                :class="getScoreClass(result.score)"
              >
                {{ result.score }}%
              </span>
            </div>
            <div class="dashboard-view__result-details">
              <span>{{ result.correctAnswers }}/{{ result.totalQuestions }} правильных</span>
              <span>{{ formatTime(result.timeSpent) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Статистика (для администраторов) -->
      <div 
        v-if="authStore.isAdmin && stats"
        class="dashboard-view__admin-stats"
      >
        <h2 class="dashboard-view__section-title">Общая статистика</h2>
        <div class="dashboard-view__stats-grid">
          <div class="dashboard-view__stat-item">
            <div class="dashboard-view__stat-value">{{ stats.totalQuizzes }}</div>
            <div class="dashboard-view__stat-label">Всего тестов</div>
          </div>
          <div class="dashboard-view__stat-item">
            <div class="dashboard-view__stat-value">{{ stats.totalUsers }}</div>
            <div class="dashboard-view__stat-label">Пользователей</div>
          </div>
          <div class="dashboard-view__stat-item">
            <div class="dashboard-view__stat-value">{{ stats.averageScore }}%</div>
            <div class="dashboard-view__stat-label">Средний результат</div>
          </div>
          <div class="dashboard-view__stat-item">
            <div class="dashboard-view__stat-value">{{ stats.totalQuestions }}</div>
            <div class="dashboard-view__stat-label">Вопросов в базе</div>
          </div>
        </div>
      </div>

      <!-- Сообщение если нет результатов -->
      <div 
        v-if="authStore.isStudent && recentResults.length === 0"
        class="dashboard-view__no-results"
      >
        <div class="dashboard-view__no-results-content">
          <div class="dashboard-view__no-results-icon">📝</div>
          <h3 class="dashboard-view__no-results-title">Пока нет результатов</h3>
          <p class="dashboard-view__no-results-description">
            Пройдите свой первый тест, чтобы увидеть здесь статистику
          </p>
          <BaseButton 
            variant="primary" 
            @click="$router.push('/student')"
          >
            🚀 Начать первый квиз
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useResultsStore } from '@/stores/results'
import { useQuestionsStore } from '@/stores/questions'
import BaseButton from '@/components/common/BaseButton.vue'

const authStore = useAuthStore()
const resultsStore = useResultsStore()
const questionsStore = useQuestionsStore()

const showStats = ref(false)

const welcomeMessage = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Хорошего утра! Готовы проверить свои знания?'
  if (hour < 18) return 'Прекрасного дня! Время для нового вызова!'
  return 'Прекрасного вечера! Идеальное время для обучения!'
})

const recentResults = computed(() => {
  return resultsStore.recentResults.slice(0, 3)
})

const stats = computed(() => {
  if (resultsStore.results.length === 0) return null
  
  return {
    totalQuizzes: resultsStore.results.length,
    totalUsers: new Set(resultsStore.results.map(r => r.userId)).size,
    averageScore: resultsStore.averageScore,
    totalQuestions: questionsStore.questions.length
  }
})

const getScoreClass = (score) => {
  if (score >= 80) return 'dashboard-view__result-score--excellent'
  if (score >= 60) return 'dashboard-view__result-score--good'
  if (score >= 40) return 'dashboard-view__result-score--average'
  return 'dashboard-view__result-score--poor'
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('ru-RU')
}

const formatTime = (seconds) => {
  if (!seconds) return '--:--'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

onMounted(async () => {
  await resultsStore.loadResults()
  await questionsStore.loadQuestions()
})
</script>

<style scoped>
.dashboard-view {
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
}

.dashboard-view__welcome {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: var(--border-radius-lg);
  color: white;
}

.dashboard-view__title {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.dashboard-view__subtitle {
  margin: 0;
  font-size: 1.25rem;
  opacity: 0.9;
}

.dashboard-view__section-title {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  font-size: 1.5rem;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
}

.dashboard-view__quick-actions {
  margin-bottom: 3rem;
}

.dashboard-view__actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.dashboard-view__action-card {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
  text-decoration: none;
  color: inherit;
  transition: var(--transition);
  border: 2px solid transparent;
  cursor: pointer;
  display: block;
}

.dashboard-view__action-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.dashboard-view__action-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.dashboard-view__action-title {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.dashboard-view__action-description {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.dashboard-view__recent-results {
  margin-bottom: 3rem;
}

.dashboard-view__results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.dashboard-view__result-card {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  border-left: 4px solid var(--primary-color);
}

.dashboard-view__result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.dashboard-view__result-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
}

.dashboard-view__result-score {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 0.875rem;
  color: white;
}

.dashboard-view__result-score--excellent {
  background-color: #10b981;
}

.dashboard-view__result-score--good {
  background-color: #3b82f6;
}

.dashboard-view__result-score--average {
  background-color: #f59e0b;
}

.dashboard-view__result-score--poor {
  background-color: #ef4444;
}

.dashboard-view__result-details {
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.dashboard-view__admin-stats {
  margin-bottom: 3rem;
}

.dashboard-view__stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.dashboard-view__stat-item {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  text-align: center;
  border-top: 4px solid var(--primary-color);
}

.dashboard-view__stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
  margin-bottom: 0.5rem;
}

.dashboard-view__stat-label {
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dashboard-view__no-results {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
}

.dashboard-view__no-results-content {
  max-width: 400px;
  margin: 0 auto;
}

.dashboard-view__no-results-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.dashboard-view__no-results-title {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.dashboard-view__no-results-description {
  margin: 0 0 2rem 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .dashboard-view {
    padding: 1rem 0;
  }

  .dashboard-view__welcome {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .dashboard-view__title {
    font-size: 2rem;
  }

  .dashboard-view__subtitle {
    font-size: 1.125rem;
  }

  .dashboard-view__actions-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-view__action-card {
    padding: 1.5rem;
  }

  .dashboard-view__results-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-view__stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .dashboard-view__stat-item {
    padding: 1.5rem;
  }

  .dashboard-view__stat-value {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .dashboard-view__stats-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-view__result-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .dashboard-view__result-details {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>