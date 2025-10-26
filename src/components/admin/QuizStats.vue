<template>
  <div class="quiz-stats">
    <h2 class="quiz-stats__title">Статистика квизов</h2>

    <div class="quiz-stats__content">
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
            <div class="quiz-stats__metric-value">{{ resultsStore.averageScore }}%</div>
            <div class="quiz-stats__metric-label">Средний результат</div>
          </div>
        </div>

        <div class="quiz-stats__metric">
          <div class="quiz-stats__metric-icon">🎯</div>
          <div class="quiz-stats__metric-info">
            <div class="quiz-stats__metric-value">{{ resultsStore.bestScore }}%</div>
            <div class="quiz-stats__metric-label">Лучший результат</div>
          </div>
        </div>
      </div>

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
import { computed } from 'vue'
import { useResultsStore } from '@/stores/results'

const resultsStore = useResultsStore()

const uniqueUsers = computed(() => {
  const userIds = new Set(resultsStore.results.map(result => result.userId))
  return userIds.size
})

const recentResults = computed(() => 
  resultsStore.results
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, 10)
)

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
    year: 'numeric'
  })
}
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