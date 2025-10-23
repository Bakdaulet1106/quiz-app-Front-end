<template>
  <div class="quiz-view">
    <div class="container">
      <!-- Режим просмотра результатов -->
      <div v-if="isReviewMode" class="quiz-view__review-mode">
        <div class="quiz-view__review-header">
          <h1 class="quiz-view__review-title">Обзор ответов</h1>
          <BaseButton variant="primary" @click="finishReview">
            ← Вернуться к результатам
          </BaseButton>
        </div>
        
        <QuestionCard :show-results="true" />
        
        <div class="quiz-view__review-navigation">
          <BaseButton
            variant="secondary"
            @click="previousQuestion"
            :disabled="questionsStore.currentQuestionIndex === 0"
          >
            ← Предыдущий вопрос
          </BaseButton>
          <span class="quiz-view__review-counter">
            Вопрос {{ questionsStore.currentQuestionIndex + 1 }} из {{ questionsStore.totalQuestions }}
          </span>
          <BaseButton
            variant="secondary"
            @click="nextQuestion"
            :disabled="questionsStore.currentQuestionIndex === questionsStore.totalQuestions - 1"
          >
            Следующий вопрос →
          </BaseButton>
        </div>
      </div>

      <!-- Активный квиз -->
      <div v-else-if="questionsStore.quizStarted && !questionsStore.quizCompleted" class="quiz-view__active">
        <div class="quiz-view__header">
          <div class="quiz-view__quiz-info">
            <h1 class="quiz-view__title">Прохождение квиза</h1>
            <div class="quiz-view__progress">
              <div class="quiz-view__progress-text">
                Вопрос {{ questionsStore.currentQuestionIndex + 1 }} из {{ questionsStore.totalQuestions }}
              </div>
              <div class="quiz-view__progress-bar">
                <div 
                  class="quiz-view__progress-fill"
                  :style="{ width: `${questionsStore.progress}%` }"
                ></div>
              </div>
            </div>
          </div>

          <QuizTimer :duration="300" />
        </div>

        <QuestionCard />

        <div v-if="quizStore.isTimeUp" class="quiz-view__time-up">
          <div class="quiz-view__time-up-content">
            <h2>⏰ Время вышло!</h2>
            <p>Квиз будет завершен автоматически</p>
            <BaseButton variant="primary" @click="completeQuiz">
              Посмотреть результаты
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Завершенный квиз -->
      <div v-else-if="questionsStore.quizCompleted" class="quiz-view__completed">
        <ResultsView />
      </div>

      <!-- Начало квиза -->
      <div v-else class="quiz-view__start">
        <div class="quiz-view__start-content">
          <h1 class="quiz-view__start-title">Готовы начать?</h1>
          <div class="quiz-view__quiz-details">
            <div class="quiz-view__detail">
              <span class="quiz-view__detail-icon">❓</span>
              <span class="quiz-view__detail-text">
                {{ questionsStore.questions.length }} вопросов
              </span>
            </div>
            <div class="quiz-view__detail">
              <span class="quiz-view__detail-icon">⏱️</span>
              <span class="quiz-view__detail-text">5 минут</span>
            </div>
            <div class="quiz-view__detail">
              <span class="quiz-view__detail-icon">🎯</span>
              <span class="quiz-view__detail-text">Случайная выборка вопросов</span>
            </div>
          </div>

          <div class="quiz-view__instructions">
            <h3>Инструкции:</h3>
            <ul>
              <li>📝 Выбирайте один правильный ответ из предложенных вариантов</li>
              <li>⏱️ Следите за временем - на весь тест отводится 5 минут</li>
              <li>↔️ Используйте кнопки "Назад" и "Далее" для навигации</li>
              <li>✅ Результаты будут показаны сразу после завершения</li>
            </ul>
          </div>

          <BaseButton
            variant="primary"
            size="large"
            @click="startQuiz"
            class="quiz-view__start-button"
          >
            🚀 Начать квиз
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuestionsStore } from '@/stores/questions'
import { useQuizStore } from '@/stores/quiz'
import QuestionCard from '@/components/student/QuestionCard.vue'
import QuizTimer from '@/components/student/QuizTimer.vue'
import ResultsView from '@/components/student/ResultsView.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const questionsStore = useQuestionsStore()
const quizStore = useQuizStore()

const isReviewMode = ref(false)

const startQuiz = () => {
  questionsStore.startQuiz()
}

const completeQuiz = () => {
  questionsStore.completeQuiz()
  quizStore.stopTimer()
}

const previousQuestion = () => {
  if (questionsStore.currentQuestionIndex > 0) {
    questionsStore.currentQuestionIndex--
  }
}

const nextQuestion = () => {
  if (questionsStore.currentQuestionIndex < questionsStore.totalQuestions - 1) {
    questionsStore.currentQuestionIndex++
  }
}

const finishReview = () => {
  router.push('/results')
}

// Обработка автоматического завершения при истечении времени
const handleTimeUp = () => {
  if (questionsStore.quizStarted && !questionsStore.quizCompleted) {
    completeQuiz()
  }
}

// Проверяем параметр review в URL
onMounted(() => {
  isReviewMode.value = route.query.review === 'true'
  
  // Если вопросы не загружены, возвращаемся на страницу студента
  if (isReviewMode.value && questionsStore.questions.length === 0) {
    router.push('/student')
  }
})

// Следим за изменением времени
onMounted(() => {
  // Подписываемся на событие истечения времени
  const unwatch = quizStore.$onAction(({ name, after }) => {
    if (name === 'startTimer') {
      after(() => {
        // Таймер будет автоматически завершать квиз через store
      })
    }
  })

  onUnmounted(() => {
    unwatch()
  })
})
</script>

<style scoped>
.quiz-view {
  padding: 1rem 0;
  min-height: calc(100vh - 200px);
}

/* Режим просмотра */
.quiz-view__review-mode {
  max-width: 1000px;
  margin: 0 auto;
}

.quiz-view__review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
  border-bottom: 2px solid var(--bg-primary);
}

.quiz-view__review-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 2rem;
}

.quiz-view__review-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.quiz-view__review-counter {
  font-weight: 600;
  color: var(--text-primary);
}

/* Активный квиз */
.quiz-view__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
  flex-wrap: wrap;
}

.quiz-view__quiz-info {
  flex: 1;
  min-width: 300px;
}

.quiz-view__title {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 2rem;
}

.quiz-view__progress {
  background: var(--bg-secondary);
  padding: 1rem 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.quiz-view__progress-text {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.quiz-view__progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--bg-primary);
  border-radius: 4px;
  overflow: hidden;
}

.quiz-view__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border-radius: 4px;
  transition: width 0.3s ease;
}

.quiz-view__time-up {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.quiz-view__time-up-content {
  background: var(--bg-secondary);
  padding: 3rem;
  border-radius: var(--border-radius-lg);
  text-align: center;
  box-shadow: var(--shadow-lg);
  max-width: 400px;
  width: 90%;
}

.quiz-view__time-up-content h2 {
  margin: 0 0 1rem 0;
  color: var(--danger-color);
  font-size: 1.75rem;
}

.quiz-view__time-up-content p {
  margin: 0 0 2rem 0;
  color: var(--text-secondary);
  font-size: 1.125rem;
}

/* Начало квиза */
.quiz-view__start {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.quiz-view__start-content {
  background: var(--bg-secondary);
  padding: 3rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.quiz-view__start-title {
  margin: 0 0 2rem 0;
  color: var(--text-primary);
  font-size: 2.5rem;
  font-weight: 700;
}

.quiz-view__quiz-details {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.quiz-view__detail {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-primary);
  padding: 1rem 1.5rem;
  border-radius: var(--border-radius);
  border-left: 4px solid var(--primary-color);
}

.quiz-view__detail-icon {
  font-size: 1.5rem;
}

.quiz-view__detail-text {
  font-weight: 600;
  color: var(--text-primary);
}

.quiz-view__instructions {
  text-align: left;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--info-color);
}

.quiz-view__instructions h3 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.25rem;
}

.quiz-view__instructions ul {
  margin: 0;
  padding-left: 1rem;
}

.quiz-view__instructions li {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.quiz-view__start-button {
  font-size: 1.25rem;
  padding: 1rem 2rem;
  min-width: 200px;
}

@media (max-width: 768px) {
  .quiz-view {
    padding: 0.5rem 0;
  }

  .quiz-view__review-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    text-align: center;
  }

  .quiz-view__review-title {
    font-size: 1.5rem;
  }

  .quiz-view__review-navigation {
    flex-direction: column;
    gap: 1rem;
  }

  .quiz-view__header {
    flex-direction: column;
    align-items: stretch;
  }

  .quiz-view__quiz-info {
    min-width: auto;
  }

  .quiz-view__title {
    font-size: 1.5rem;
    text-align: center;
  }

  .quiz-view__start-content {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }

  .quiz-view__start-title {
    font-size: 2rem;
  }

  .quiz-view__quiz-details {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .quiz-view__detail {
    justify-content: center;
  }

  .quiz-view__time-up-content {
    padding: 2rem;
    margin: 1rem;
  }
}

@media (max-width: 480px) {
  .quiz-view__start-content {
    padding: 1.5rem 1rem;
  }

  .quiz-view__start-title {
    font-size: 1.75rem;
  }

  .quiz-view__instructions {
    padding: 1rem;
  }

  .quiz-view__instructions h3 {
    font-size: 1.125rem;
  }
}
</style>