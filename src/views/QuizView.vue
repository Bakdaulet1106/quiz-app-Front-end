<template>
  <div class="quiz-view">
    <div class="container">
      <!-- Активный квиз -->
      <div v-if="questionsStore.quizStarted && !questionsStore.quizCompleted" class="quiz-view__active">
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
import { onMounted, onUnmounted } from 'vue'
import { useQuestionsStore } from '@/stores/questions'
import { useQuizStore } from '@/stores/quiz'
import QuestionCard from '@/components/student/QuestionCard.vue'
import QuizTimer from '@/components/student/QuizTimer.vue'
import ResultsView from '@/components/student/ResultsView.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const questionsStore = useQuestionsStore()
const quizStore = useQuizStore()

const startQuiz = () => {
  questionsStore.startQuiz()
  quizStore.startTimer(300)
}

const completeQuiz = () => {
  questionsStore.completeQuiz()
  quizStore.stopTimer()
}

onMounted(() => {
  // Если вопросы не загружены, возвращаемся на страницу студента
  if (questionsStore.questions.length === 0) {
    // В реальном приложении здесь был бы redirect
    console.log('No questions loaded')
  }
})

onUnmounted(() => {
  quizStore.stopTimer()
})
</script>

<style scoped>
.quiz-view {
  padding: 1rem 0;
  min-height: calc(100vh - 200px);
}

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