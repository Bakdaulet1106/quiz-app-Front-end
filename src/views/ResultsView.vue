<template>
  <div class="results-view-page">
    <div class="container">
      <div class="results-view-page__header">
        <h1 class="results-view-page__title">Мои результаты</h1>
        <BaseButton variant="primary" @click="$router.push('/student')">
          🎯 Новый квиз
        </BaseButton>
      </div>

      <div v-if="resultsStore.isLoading" class="results-view-page__loading">
        <LoadingSpinner size="large" />
        <p>Загрузка результатов...</p>
      </div>

      <div v-else-if="resultsStore.userResults.length === 0" class="results-view-page__empty">
        <div class="results-view-page__empty-content">
          <div class="results-view-page__empty-icon">📊</div>
          <h2 class="results-view-page__empty-title">Пока нет результатов</h2>
          <p class="results-view-page__empty-description">
            Пройдите свой первый квиз, чтобы увидеть здесь статистику
          </p>
          <BaseButton variant="primary" @click="$router.push('/student')">
            🚀 Пройти первый квиз
          </BaseButton>
        </div>
      </div>

      <div v-else class="results-view-page__content">
        <!-- Общая статистика -->
        <div class="results-view-page__overview">
          <h2 class="results-view-page__section-title">Общая статистика</h2>
          <div class="results-view-page__stats">
            <div class="results-view-page__stat">
              <div class="results-view-page__stat-icon">📊</div>
              <div class="results-view-page__stat-info">
                <div class="results-view-page__stat-value">{{ resultsStore.totalQuizzesTaken }}</div>
                <div class="results-view-page__stat-label">Пройдено тестов</div>
              </div>
            </div>

            <div class="results-view-page__stat">
              <div class="results-view-page__stat-icon">⭐</div>
              <div class="results-view-page__stat-info">
                <div class="results-view-page__stat-value">{{ resultsStore.averageScore }}%</div>
                <div class="results-view-page__stat-label">Средний результат</div>
              </div>
            </div>

            <div class="results-view-page__stat">
              <div class="results-view-page__stat-icon">🎯</div>
              <div class="results-view-page__stat-info">
                <div class="results-view-page__stat-value">{{ resultsStore.bestScore }}%</div>
                <div class="results-view-page__stat-label">Лучший результат</div>
              </div>
            </div>
          </div>
        </div>

        <!-- История результатов -->
        <div class="results-view-page__history">
          <h2 class="results-view-page__section-title">История результатов</h2>
          <div class="results-view-page__results-list">
            <div
              v-for="result in sortedResults"
              :key="result.id"
              class="results-view-page__result-item"
            >
              <div class="results-view-page__result-main">
                <div class="results-view-page__result-date">
                  {{ formatDate(result.completedAt) }}
                </div>
                <div class="results-view-page__result-score">
                  <span 
                    class="results-view-page__score-badge"
                    :class="getScoreClass(result.score)"
                  >
                    {{ result.score }}%
                  </span>
                </div>
              </div>

              <div class="results-view-page__result-details">
                <div class="results-view-page__result-info">
                  <span class="results-view-page__info-item">
                    ✅ {{ result.correctAnswers }}/{{ result.totalQuestions }} правильных
                  </span>
                  <span class="results-view-page__info-item">
                    ⏱️ {{ formatTime(result.timeSpent) }}
                  </span>
                </div>

                <div class="results-view-page__result-actions">
                  <BaseButton
                    variant="secondary"
                    size="small"
                    @click="viewResultDetails(result)"
                  >
                    📝 Детали
                  </BaseButton>
                </div>
              </div>

              <!-- Детали результата -->
              <div 
                v-if="expandedResult === result.id"
                class="results-view-page__result-expanded"
              >
                <div class="results-view-page__questions-list">
                  <div
                    v-for="(answer, index) in result.answers"
                    :key="index"
                    class="results-view-page__question-item"
                  >
                    <div class="results-view-page__question-header">
                      <span class="results-view-page__question-number">
                        Вопрос {{ index + 1 }}
                      </span>
                      <span 
                        class="results-view-page__question-status"
                        :class="answer.isCorrect ? 'results-view-page__question-status--correct' : 'results-view-page__question-status--incorrect'"
                      >
                        {{ answer.isCorrect ? '✅ Правильно' : '❌ Неправильно' }}
                      </span>
                    </div>
                    
                    <div class="results-view-page__question-text">
                      {{ getQuestionText(result, index) }}
                    </div>

                    <div class="results-view-page__question-answers">
                      <div class="results-view-page__answer">
                        <span class="results-view-page__answer-label">Ваш ответ:</span>
                        <span class="results-view-page__answer-value">
                          {{ getAnswerText(result, index, answer.answerIndex) }}
                        </span>
                      </div>
                      
                      <div 
                        v-if="!answer.isCorrect"
                        class="results-view-page__answer"
                      >
                        <span class="results-view-page__answer-label">Правильный ответ:</span>
                        <span class="results-view-page__answer-value results-view-page__answer-value--correct">
                          {{ getAnswerText(result, index, getCorrectAnswerIndex(result, index)) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useResultsStore } from '@/stores/results'
import BaseButton from '@/components/common/BaseButton.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const resultsStore = useResultsStore()

const expandedResult = ref(null)

const sortedResults = computed(() => {
  return [...resultsStore.userResults].sort((a, b) => 
    new Date(b.completedAt) - new Date(a.completedAt)
  )
})

const getScoreClass = (score) => {
  if (score >= 80) return 'results-view-page__score-badge--excellent'
  if (score >= 60) return 'results-view-page__score-badge--good'
  if (score >= 40) return 'results-view-page__score-badge--average'
  return 'results-view-page__score-badge--poor'
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTime = (seconds) => {
  if (!seconds) return '--:--'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const viewResultDetails = (result) => {
  expandedResult.value = expandedResult.value === result.id ? null : result.id
}

const getQuestionText = (result, index) => {
  return result.questions?.[index]?.question || 'Вопрос не найден'
}

const getAnswerText = (result, questionIndex, answerIndex) => {
  const question = result.questions?.[questionIndex]
  if (!question || answerIndex === null || answerIndex === undefined) {
    return 'Ответ не выбран'
  }
  return question.options[answerIndex] || 'Вариант не найден'
}

const getCorrectAnswerIndex = (result, index) => {
  return result.questions?.[index]?.correctAnswer
}

onMounted(async () => {
  await resultsStore.loadResults()
})
</script>

<style scoped>
.results-view-page {
  padding: 2rem 0;
  min-height: calc(100vh - 200px);
}

.results-view-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.results-view-page__title {
  margin: 0;
  color: var(--text-primary);
  font-size: 2.5rem;
  font-weight: 700;
}

.results-view-page__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem;
  color: var(--text-secondary);
}

.results-view-page__empty {
  text-align: center;
  padding: 4rem 2rem;
}

.results-view-page__empty-content {
  max-width: 400px;
  margin: 0 auto;
}

.results-view-page__empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.results-view-page__empty-title {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.results-view-page__empty-description {
  margin: 0 0 2rem 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.results-view-page__content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.results-view-page__section-title {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  font-size: 1.5rem;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
}

.results-view-page__overview {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
}

.results-view-page__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.results-view-page__stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border-left: 4px solid var(--primary-color);
}

.results-view-page__stat-icon {
  font-size: 2rem;
}

.results-view-page__stat-info {
  flex: 1;
}

.results-view-page__stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.results-view-page__stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.results-view-page__history {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
}

.results-view-page__results-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.results-view-page__result-item {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  border: 1px solid #e2e8f0;
}

.results-view-page__result-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
}

.results-view-page__result-main:hover {
  background-color: rgba(67, 97, 238, 0.05);
}

.results-view-page__result-date {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1.125rem;
}

.results-view-page__score-badge {
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-weight: 700;
  color: white;
  font-size: 1.125rem;
  min-width: 80px;
  text-align: center;
  display: inline-block;
}

.results-view-page__score-badge--excellent {
  background-color: #10b981;
}

.results-view-page__score-badge--good {
  background-color: #3b82f6;
}

.results-view-page__score-badge--average {
  background-color: #f59e0b;
}

.results-view-page__score-badge--poor {
  background-color: #ef4444;
}

.results-view-page__result-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: rgba(0, 0, 0, 0.02);
  border-top: 1px solid #e2e8f0;
}

.results-view-page__result-info {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.results-view-page__info-item {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}

.results-view-page__result-expanded {
  border-top: 1px solid #e2e8f0;
  background-color: var(--bg-secondary);
}

.results-view-page__questions-list {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.results-view-page__question-item {
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border-left: 4px solid var(--primary-color);
}

.results-view-page__question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.results-view-page__question-number {
  font-weight: 600;
  color: var(--text-primary);
}

.results-view-page__question-status {
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.results-view-page__question-status--correct {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.results-view-page__question-status--incorrect {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.results-view-page__question-text {
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 1rem;
  font-style: italic;
}

.results-view-page__question-answers {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.results-view-page__answer {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.results-view-page__answer-label {
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 140px;
  font-size: 0.875rem;
}

.results-view-page__answer-value {
  flex: 1;
  color: var(--text-primary);
}

.results-view-page__answer-value--correct {
  color: #10b981;
  font-weight: 600;
}

@media (max-width: 768px) {
  .results-view-page {
    padding: 1rem 0;
  }

  .results-view-page__header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    margin-bottom: 2rem;
  }

  .results-view-page__title {
    font-size: 2rem;
  }

  .results-view-page__overview,
  .results-view-page__history {
    padding: 1.5rem;
  }

  .results-view-page__stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .results-view-page__stat {
    padding: 1.25rem;
  }

  .results-view-page__stat-value {
    font-size: 1.75rem;
  }

  .results-view-page__result-main {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    text-align: center;
  }

  .results-view-page__result-details {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .results-view-page__result-info {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }

  .results-view-page__questions-list {
    padding: 1rem;
  }

  .results-view-page__question-item {
    padding: 1.25rem;
  }

  .results-view-page__question-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .results-view-page__answer {
    flex-direction: column;
    gap: 0.25rem;
  }

  .results-view-page__answer-label {
    min-width: auto;
  }
}
</style>