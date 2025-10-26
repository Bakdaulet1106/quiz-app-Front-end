<template>
  <div class="question-card">
    <div class="question-card__header">
      <div class="question-card__progress">
        Вопрос {{ currentQuestionNumber }} из {{ totalQuestions }}
      </div>
      <div class="question-card__points">
        {{ currentQuestion.points }} баллов
      </div>
    </div>

    <div class="question-card__meta">
      <span class="question-card__category">{{ currentQuestion.category }}</span>
      <span 
        class="question-card__difficulty"
        :style="{ color: getDifficultyColor(currentQuestion.difficulty) }"
      >
        {{ getDifficultyLabel(currentQuestion.difficulty) }}
      </span>
    </div>

    <div class="question-card__content">
      <h2 class="question-card__question">{{ currentQuestion.question }}</h2>
      
      <div class="question-card__options">
        <div
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          :class="[
            'question-card__option',
            {
              'question-card__option--selected': selectedAnswer === index,
              'question-card__option--correct': showResults && index === currentQuestion.correctAnswer,
              'question-card__option--incorrect': showResults && selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswer
            }
          ]"
          @click="!showResults && selectAnswer(index)"
        >
          <div class="question-card__option-content">
            <span class="question-card__option-letter">{{ String.fromCharCode(65 + index) }}</span>
            <span class="question-card__option-text">{{ option }}</span>
            <div v-if="showResults" class="question-card__option-feedback">
              <span 
                v-if="index === currentQuestion.correctAnswer"
                class="question-card__correct-mark"
              >
                ✓ Правильный ответ
              </span>
              <span 
                v-else-if="selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswer"
                class="question-card__incorrect-mark"
              >
                ✗ Ваш ответ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="question-card__navigation" v-if="!showResults">
      <BaseButton
        variant="secondary"
        @click="previousQuestion"
        :disabled="currentQuestionNumber === 1"
      >
        ← Назад
      </BaseButton>
      
      <BaseButton
        variant="primary"
        @click="nextQuestion"
        :disabled="selectedAnswer === null"
      >
        {{ isLastQuestion ? 'Завершить' : 'Далее →' }}
      </BaseButton>
    </div>

    <div v-if="showResults" class="question-card__results">
      <div 
        class="question-card__result-feedback"
        :class="isAnswerCorrect ? 'question-card__result-feedback--correct' : 'question-card__result-feedback--incorrect'"
      >
        <span v-if="isAnswerCorrect" class="question-card__result-icon">✅</span>
        <span v-else class="question-card__result-icon">❌</span>
        <span class="question-card__result-text">
          {{ isAnswerCorrect ? 'Правильно!' : 'Неправильно!' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useQuestionsStore } from '@/stores/questions'
import { getDifficultyColor, getDifficultyLabel } from '@/utils/helpers'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  showResults: {
    type: Boolean,
    default: false
  }
})

const questionsStore = useQuestionsStore()

const currentQuestion = computed(() => questionsStore.currentQuestion)
const currentQuestionNumber = computed(() => questionsStore.currentQuestionIndex + 1)
const totalQuestions = computed(() => questionsStore.totalQuestions)
const selectedAnswer = computed(() => questionsStore.selectedAnswer)
const isLastQuestion = computed(() => currentQuestionNumber.value === totalQuestions.value)

const isAnswerCorrect = computed(() => {
  return selectedAnswer.value === currentQuestion.value.correctAnswer
})

const selectAnswer = (answerIndex) => {
  questionsStore.submitAnswer(answerIndex)
}

const nextQuestion = () => {
  questionsStore.nextQuestion()
}

const previousQuestion = () => {
  questionsStore.previousQuestion()
}
</script>

<style scoped>
.question-card {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.question-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--bg-primary);
}

.question-card__progress {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1.125rem;
}

.question-card__points {
  background-color: var(--info-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 0.875rem;
}

.question-card__meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.question-card__category {
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.question-card__difficulty {
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  background-color: var(--bg-primary);
  border-radius: 1rem;
}

.question-card__content {
  margin-bottom: 2rem;
}

.question-card__question {
  margin: 0 0 2rem 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  line-height: 1.6;
  text-align: center;
}

.question-card__options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.question-card__option {
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius);
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: var(--transition);
  background-color: var(--bg-primary);
}

.question-card__option:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.question-card__option--selected {
  border-color: var(--primary-color);
  background-color: rgba(67, 97, 238, 0.1);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.question-card__option--correct {
  border-color: var(--success-color);
  background-color: rgba(76, 201, 240, 0.1);
}

.question-card__option--incorrect {
  border-color: var(--danger-color);
  background-color: rgba(247, 37, 133, 0.1);
}

.question-card__option-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.question-card__option-letter {
  background-color: var(--primary-color);
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.question-card__option--correct .question-card__option-letter {
  background-color: var(--success-color);
}

.question-card__option--incorrect .question-card__option-letter {
  background-color: var(--danger-color);
}

.question-card__option-text {
  flex: 1;
  font-size: 1rem;
  line-height: 1.5;
}

.question-card__option-feedback {
  margin-left: auto;
}

.question-card__correct-mark {
  color: var(--success-color);
  font-weight: 600;
  font-size: 0.875rem;
}

.question-card__incorrect-mark {
  color: var(--danger-color);
  font-weight: 600;
  font-size: 0.875rem;
}

.question-card__navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 2px solid var(--bg-primary);
}

.question-card__results {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--bg-primary);
}

.question-card__result-feedback {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  font-weight: 600;
}

.question-card__result-feedback--correct {
  background-color: rgba(76, 201, 240, 0.1);
  border: 1px solid var(--success-color);
  color: var(--success-color);
}

.question-card__result-feedback--incorrect {
  background-color: rgba(247, 37, 133, 0.1);
  border: 1px solid var(--danger-color);
  color: var(--danger-color);
}

.question-card__result-icon {
  font-size: 1.25rem;
}

.question-card__result-text {
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .question-card {
    padding: 1.5rem;
    margin: 1rem;
  }

  .question-card__header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .question-card__meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .question-card__question {
    font-size: 1.125rem;
    text-align: left;
  }

  .question-card__option-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .question-card__option-feedback {
    margin-left: 0;
    align-self: flex-start;
  }

  .question-card__navigation {
    flex-direction: column;
    gap: 1rem;
  }

  .question-card__navigation button {
    width: 100%;
  }
}
</style>