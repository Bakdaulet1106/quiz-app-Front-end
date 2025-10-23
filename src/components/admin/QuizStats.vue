<template>
  <div class="quiz-stats">
    <h2 class="quiz-stats__title">Статистика квизов</h2>

    <div v-if="resultsStore.isLoading" class="quiz-stats__loading">
      <LoadingSpinner size="large" />
      <p>Загрузка статистики...</p>
    </div>

    <div v-else class="quiz-stats__content">
      <!-- Основные метрики -->
      <div class="quiz-stats__metrics">
        <div class="quiz-stats__metric">
          <div class="quiz-stats__metric-icon">📊</div>
          <div class="quiz-stats__metric-info">
            <div class="quiz-stats__metric-value">{{ resultsStore.results.length }}</div>
            <div class="quiz-stats__metric-label">Всего пройдено тестов</div>
          </div>
        </div>

        <div class="quiz-stats__metric">
          <div class="quiz-stats__metric-icon">👥</div>
          <div class="quiz-stats__metric-info">
            <div class="quiz-stats__metric-value">{{ uniqueUsers }}</div>
            <div class="quiz-stats__metric-label">Уникальных пользователей</div>
          </div>
        </div>

        <div class="quiz-stats__metric">
          <div class="quiz-stats__metric-icon">⭐</div>
          <div class="quiz-stats__metric-info">
            <div class="quiz-stats__metric-value">{{ averageScore }}%</div>
            <div class="quiz-stats__metric-label">Средний результат</div>
          </div>
        </div>

        <div class="quiz-stats__metric">
          <div class="quiz-stats__metric-icon">🎯</div>
          <div class="quiz-stats__metric-info">
            <div class="quiz-stats__metric-value">{{ bestScore }}%</div>
            <div class="quiz-stats__metric-label">Лучший результат</div>
          </div>
        </div>
      </div>

      <!-- Статистика по категориям -->
      <div class="quiz-stats__section">
        <h3 class="quiz-stats__section-title">Статистика по категориям</h3>
        <div class="quiz-stats__categories">
          <div 
            v-for="stat in categoryStats" 
            :key="stat.category"
            class="quiz-stats__category"
          >
            <div class="quiz-stats__category-header">
              <span class="quiz-stats__category-name">{{ stat.category }}</span>
              <span class="quiz-stats__category-percentage">{{ stat.percentage }}%</span>
            </div>
            <div class="quiz-stats__progress">
              <div 
                class="quiz-stats__progress-bar"
                :style="{ width: `${stat.percentage}%` }"
                :class="getProgressColor(stat.percentage)"
              ></div>
            </div>
            <div class="quiz-stats__category-details">
              <span>{{ stat.correct }}/{{ stat.total }} правильных</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Статистика по сложности -->
      <div class="quiz-stats__section">
        <h3 class="quiz-stats__section-title">Статистика по сложности</h3>
        <div class="quiz-stats__difficulties">
          <div 
            v-for="stat in difficultyStats" 
            :key="stat.difficulty"
            class="quiz-stats__difficulty"
          >
            <div class="quiz-stats__difficulty-header">
              <span class="quiz-stats__difficulty-name">
                {{ getDifficultyLabel(stat.difficulty) }}
              </span>
              <span class="quiz-stats__difficulty-percentage">{{ stat.percentage }}%</span>
            </div>
            <div class="quiz-stats__progress">
              <div 
                class="quiz-stats__progress-bar"
                :style="{ width: `${stat.percentage}%` }"
                :class="getProgressColor(stat.percentage)"
              ></div>
            </div>
            <div class="quiz-stats__difficulty-details">
              <span>{{ stat.correct }}/{{ stat.total }} правильных</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Последние результаты -->
      <div class="quiz-stats__section">
        <h3 class="quiz-stats__section-title">Последние результаты</h3>
        <div class="quiz-stats__recent-results">
          <div 
            v-for="result in recentResults" 
            :key="result.id"
            class="quiz-stats__result"
          >
            <div class="quiz-stats__result-user">
              <strong>{{ result.userName }}</strong>
            </div>
            <div class="quiz-stats__result-score">
              <span 
                class="quiz-stats__score-badge"
                :class="getScoreClass(result.score)"
              >
                {{ result.score }}%
              </span>
            </div>
            <div class="quiz-stats__result-details">
              {{ result.correctAnswers }}/{{ result.totalQuestions }} вопросов
            </div>
            <div class="quiz-stats__result-time">
              {{ formatTime(result.completedAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useResultsStore } from '@/stores/results'
import { getDifficultyLabel } from '@/utils/helpers'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const resultsStore = useResultsStore()

const uniqueUsers = computed(() => {
  const userIds = new Set(resultsStore.results.map(result => result.userId))
  return userIds.size
})

const averageScore = computed(() => {
  if (resultsStore.results.length === 0) return 0
  const total = resultsStore.results.reduce((sum, result) => sum + result.score, 0)
  return Math.round(total / resultsStore.results.length)
})

const bestScore = computed(() => {
  if (resultsStore.results.length === 0) return 0
  return Math.max(...resultsStore.results.map(result => result.score))
})

const categoryStats = computed(() => {
  return resultsStore.getCategoryStats()
})

const difficultyStats = computed(() => {
  return resultsStore.getDifficultyStats()
})

const recentResults = computed(() => {
  return resultsStore.results
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, 10)
})

const getProgressColor = (percentage) => {
  if (percentage >= 80) return 'quiz-stats__progress-bar--excellent'
  if (percentage >= 60) return 'quiz-stats__progress-bar--good'
  if (percentage >= 40) return 'quiz-stats__progress-bar--average'
  return 'quiz-stats__progress-bar--poor'
}

const getScoreClass = (score) => {
  if (score >= 80) return 'quiz-stats__score-badge--excellent'
  if (score >= 60) return 'quiz-stats__score-badge--good'
  if (score >= 40) return 'quiz-stats__score-badge--average'
  return 'quiz-stats__score-badge--poor'
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  await resultsStore.loadResults()
})
</script>

<style scoped>
.quiz-stats {
  padding: 1rem 0;
}

.quiz-stats__title {
  margin-bottom: 2rem;
  color: var(--text-primary);
  text-align: center;
}

.quiz-stats__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  color: var(--text-secondary);
}

.quiz-stats__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.quiz-stats__metric {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid var(--primary-color);
}

.quiz-stats__metric-icon {
  font-size: 2rem;
}

.quiz-stats__metric-info {
  flex: 1;
}

.quiz-stats__metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
}

.quiz-stats__metric-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.quiz-stats__section {
  margin-bottom: 2rem;
}

.quiz-stats__section-title {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  font-size: 1.25rem;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
}

.quiz-stats__categories,
.quiz-stats__difficulties {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quiz-stats__category,
.quiz-stats__difficulty {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.quiz-stats__category-header,
.quiz-stats__difficulty-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.quiz-stats__category-name,
.quiz-stats__difficulty-name {
  font-weight: 600;
  color: var(--text-primary);
}

.quiz-stats__category-percentage,
.quiz-stats__difficulty-percentage {
  font-weight: 700;
  color: var(--primary-color);
  font-size: 1.125rem;
}

.quiz-stats__progress {
  width: 100%;
  height: 8px;
  background-color: var(--bg-primary);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.quiz-stats__progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.quiz-stats__progress-bar--excellent {
  background-color: #10b981;
}

.quiz-stats__progress-bar--good {
  background-color: #3b82f6;
}

.quiz-stats__progress-bar--average {
  background-color: #f59e0b;
}

.quiz-stats__progress-bar--poor {
  background-color: #ef4444;
}

.quiz-stats__category-details,
.quiz-stats__difficulty-details {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.quiz-stats__recent-results {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quiz-stats__result {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  align-items: center;
  background: var(--bg-secondary);
  padding: 1rem 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.quiz-stats__result:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.quiz-stats__result-user {
  font-weight: 500;
  color: var(--text-primary);
}

.quiz-stats__result-score {
  text-align: center;
}

.quiz-stats__score-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
}

.quiz-stats__score-badge--excellent {
  background-color: #10b981;
}

.quiz-stats__score-badge--good {
  background-color: #3b82f6;
}

.quiz-stats__score-badge--average {
  background-color: #f59e0b;
}

.quiz-stats__score-badge--poor {
  background-color: #ef4444;
}

.quiz-stats__result-details {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.quiz-stats__result-time {
  text-align: right;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .quiz-stats__metrics {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .quiz-stats__metric {
    padding: 1rem;
  }

  .quiz-stats__metric-value {
    font-size: 1.5rem;
  }

  .quiz-stats__result {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 0.5rem;
  }

  .quiz-stats__result-time {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .quiz-stats__metrics {
    grid-template-columns: 1fr;
  }
}
</style>