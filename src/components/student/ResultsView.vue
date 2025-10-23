<template>
  <div class="results-view">
    <div class="results-view__container">
      <!-- Заголовок с результатом -->
      <div class="results-view__header">
        <h1 class="results-view__title">Результаты квиза</h1>
        <div 
          class="results-view__score"
          :class="getScoreClass(questionsStore.score)"
        >
          <div class="results-view__score-value">{{ questionsStore.score }}%</div>
          <div class="results-view__score-label">Общий результат</div>
        </div>
      </div>

      <!-- Основная статистика -->
      <div class="results-view__stats">
        <div class="results-view__stat">
          <div class="results-view__stat-icon">✅</div>
          <div class="results-view__stat-info">
            <div class="results-view__stat-value">{{ questionsStore.correctAnswersCount }}</div>
            <div class="results-view__stat-label">Правильных ответов</div>
          </div>
        </div>

        <div class="results-view__stat">
          <div class="results-view__stat-icon">📊</div>
          <div class="results-view__stat-info">
            <div class="results-view__stat-value">{{ questionsStore.totalQuestions }}</div>
            <div class="results-view__stat-label">Всего вопросов</div>
          </div>
        </div>

        <div class="results-view__stat">
          <div class="results-view__stat-icon">⏱️</div>
          <div class="results-view__stat-info">
            <div class="results-view__stat-value">{{ formatTime(timeSpent) }}</div>
            <div class="results-view__stat-label">Затраченное время</div>
          </div>
        </div>

        <div class="results-view__stat">
          <div class="results-view__stat-icon">🎯</div>
          <div class="results-view__stat-info">
            <div class="results-view__stat-value">{{ calculatePoints() }}</div>
            <div class="results-view__stat-label">Заработано баллов</div>
          </div>
        </div>
      </div>

      <!-- Прогресс-бар -->
      <div class="results-view__progress">
        <div class="results-view__progress-info">
          <span>Прогресс выполнения</span>
          <span>{{ questionsStore.score }}%</span>
        </div>
        <div class="results-view__progress-bar">
          <div 
            class="results-view__progress-fill"
            :style="{ width: `${questionsStore.score}%` }"
            :class="getProgressClass(questionsStore.score)"
          ></div>
        </div>
      </div>

      <!-- Детали по вопросам -->
      <div class="results-view__details">
        <h2 class="results-view__details-title">Детали ответов</h2>
        <div class="results-view__questions">
          <div
            v-for="(answer, index) in questionsStore.userAnswers"
            :key="index"
            class="results-view__question"
          >
            <div class="results-view__question-header">
              <span class="results-view__question-number">Вопрос {{ index + 1 }}</span>
              <span 
                class="results-view__question-status"
                :class="answer.isCorrect ? 'results-view__question-status--correct' : 'results-view__question-status--incorrect'"
              >
                {{ answer.isCorrect ? '✅ Правильно' : '❌ Неправильно' }}
              </span>
            </div>
            
            <div class="results-view__question-text">
              {{ getQuestionText(index) }}
            </div>

            <div class="results-view__answers">
              <div class="results-view__answer">
                <span class="results-view__answer-label">Ваш ответ:</span>
                <span class="results-view__answer-value">
                  {{ getAnswerText(index, answer.answerIndex) }}
                </span>
              </div>
              
              <div 
                v-if="!answer.isCorrect"
                class="results-view__answer"
              >
                <span class="results-view__answer-label">Правильный ответ:</span>
                <span class="results-view__answer-value results-view__answer-value--correct">
                  {{ getAnswerText(index, getCorrectAnswerIndex(index)) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопки действий -->
      <div class="results-view__actions">
        <BaseButton
          variant="primary"
          size="large"
          @click="handleNewQuiz"
          class="results-view__action-btn"
        >
          🎯 Новый квиз
        </BaseButton>
        
        <BaseButton
          variant="secondary"
          size="large"
          @click="handleReviewAnswers"
          class="results-view__action-btn"
        >
          📝 Обзор ответов
        </BaseButton>

        <BaseButton
          variant="success"
          size="large"
          @click="handleSaveResult"
          :loading="isSaving"
          class="results-view__action-btn"
        >
          💾 Сохранить результат
        </BaseButton>
      </div>

      <!-- Сообщение о сохранении -->
      <div v-if="saveMessage" class="results-view__save-message">
        {{ saveMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionsStore } from '@/stores/questions'
import { useQuizStore } from '@/stores/quiz'
import { useResultsStore } from '@/stores/results'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const questionsStore = useQuestionsStore()
const quizStore = useQuizStore()
const resultsStore = useResultsStore()

const isSaving = ref(false)
const saveMessage = ref('')
const timeSpent = ref(0)

const getScoreClass = (score) => {
  if (score >= 80) return 'results-view__score--excellent'
  if (score >= 60) return 'results-view__score--good'
  if (score >= 40) return 'results-view__score--average'
  return 'results-view__score--poor'
}

const getProgressClass = (score) => {
  if (score >= 80) return 'results-view__progress-fill--excellent'
  if (score >= 60) return 'results-view__progress-fill--good'
  if (score >= 40) return 'results-view__progress-fill--average'
  return 'results-view__progress-fill--poor'
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const calculatePoints = () => {
  return questionsStore.userAnswers.reduce((total, answer, index) => {
    if (answer.isCorrect) {
      const question = questionsStore.questions[index]
      return total + (question?.points || 0)
    }
    return total
  }, 0)
}

const getQuestionText = (index) => {
  return questionsStore.questions[index]?.question || 'Вопрос не найден'
}

const getAnswerText = (questionIndex, answerIndex) => {
  const question = questionsStore.questions[questionIndex]
  if (!question || answerIndex === null || answerIndex === undefined) {
    return 'Ответ не выбран'
  }
  return question.options[answerIndex] || 'Вариант не найден'
}

const getCorrectAnswerIndex = (index) => {
  return questionsStore.questions[index]?.correctAnswer
}

const handleNewQuiz = () => {
  questionsStore.resetQuiz()
  quizStore.resetTimer()
  router.push('/student')
}

const handleReviewAnswers = () => {
  // Можно реализовать постраничный просмотр ответов
  questionsStore.currentQuestionIndex = 0
  router.push('/quiz?review=true')
}

const handleSaveResult = async () => {
  isSaving.value = true
  saveMessage.value = ''
  
  try {
    const resultData = {
      score: questionsStore.score,
      correctAnswers: questionsStore.correctAnswersCount,
      totalQuestions: questionsStore.totalQuestions,
      timeSpent: timeSpent.value,
      answers: questionsStore.userAnswers,
      questions: questionsStore.questions
    }
    
    await resultsStore.saveResult(resultData)
    saveMessage.value = '✅ Результат успешно сохранен!'
  } catch (error) {
    saveMessage.value = '❌ Ошибка при сохранении результата'
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  // Рассчитываем затраченное время
  const quizDuration = 300 // 5 минут в секундах
  timeSpent.value = quizDuration - quizStore.timeRemaining
})
</script>

<style scoped>
.results-view {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  padding: 2rem 1rem;
}

.results-view__container {
  max-width: 800px;
  margin: 0 auto;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.results-view__header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  padding: 3rem 2rem;
  text-align: center;
  color: white;
}

.results-view__title {
  margin: 0 0 2rem 0;
  font-size: 2rem;
  font-weight: 700;
}

.results-view__score {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 2rem;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.results-view__score-value {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.results-view__score-label {
  font-size: 0.875rem;
  opacity: 0.9;
  font-weight: 600;
}

.results-view__score--excellent {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.5);
}

.results-view__score--good {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
}

.results-view__score--average {
  background: rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.5);
}

.results-view__score--poor {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}

.results-view__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  background: var(--bg-primary);
}

.results-view__stat {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.results-view__stat-icon {
  font-size: 2rem;
}

.results-view__stat-info {
  flex: 1;
}

.results-view__stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
}

.results-view__stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.results-view__progress {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.results-view__progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.results-view__progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--bg-primary);
  border-radius: 4px;
  overflow: hidden;
}

.results-view__progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease-in-out;
}

.results-view__progress-fill--excellent {
  background-color: #10b981;
}

.results-view__progress-fill--good {
  background-color: #3b82f6;
}

.results-view__progress-fill--average {
  background-color: #f59e0b;
}

.results-view__progress-fill--poor {
  background-color: #ef4444;
}

.results-view__details {
  padding: 2rem;
}

.results-view__details-title {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 1.5rem;
}

.results-view__questions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.results-view__question {
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border-left: 4px solid var(--primary-color);
}

.results-view__question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.results-view__question-number {
  font-weight: 600;
  color: var(--text-primary);
}

.results-view__question-status {
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.results-view__question-status--correct {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.results-view__question-status--incorrect {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.results-view__question-text {
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 1rem;
  font-style: italic;
}

.results-view__answers {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.results-view__answer {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.results-view__answer-label {
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 120px;
  font-size: 0.875rem;
}

.results-view__answer-value {
  flex: 1;
  color: var(--text-primary);
}

.results-view__answer-value--correct {
  color: #10b981;
  font-weight: 600;
}

.results-view__actions {
  display: flex;
  gap: 1rem;
  padding: 2rem;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
  justify-content: center;
}

.results-view__action-btn {
  min-width: 160px;
}

.results-view__save-message {
  text-align: center;
  padding: 1rem 2rem 2rem;
  font-weight: 600;
  color: var(--success-color);
}

@media (max-width: 768px) {
  .results-view {
    padding: 1rem;
  }

  .results-view__header {
    padding: 2rem 1rem;
  }

  .results-view__title {
    font-size: 1.5rem;
  }

  .results-view__score {
    width: 120px;
    height: 120px;
    padding: 1.5rem;
  }

  .results-view__score-value {
    font-size: 2rem;
  }

  .results-view__stats {
    grid-template-columns: 1fr 1fr;
    padding: 1.5rem;
    gap: 1rem;
  }

  .results-view__progress,
  .results-view__details,
  .results-view__actions {
    padding: 1.5rem;
  }

  .results-view__question-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .results-view__actions {
    flex-direction: column;
  }

  .results-view__action-btn {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .results-view__stats {
    grid-template-columns: 1fr;
  }
}
</style>