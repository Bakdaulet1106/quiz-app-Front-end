<template>
  <div class="quiz-view">
    <div class="container" v-if="currentQuiz">
      <!-- Quiz Header -->
      <div class="quiz-header">
        <div class="quiz-info">
          <h1 class="quiz-title">{{ currentQuiz.title }}</h1>
          <p class="quiz-description">{{ currentQuiz.description }}</p>
          <div class="quiz-meta">
            <span class="meta-item">
              <strong>{{ currentQuiz.questions.length }}</strong> questions
            </span>
            <span class="meta-item">
              <strong>{{ formatTime(currentQuiz.duration) }}</strong> time limit
            </span>
            <span class="meta-item" v-if="currentQuiz.category">
              Category: <strong>{{ currentQuiz.category }}</strong>
            </span>
          </div>
        </div>
        <QuizTimer
          :duration="currentQuiz.duration"
          :isActive="isQuizActive"
          @time-up="handleTimeUp"
        />
      </div>

      <!-- Quiz Progress -->
      <div class="quiz-progress">
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <div class="progress-text">
          Question {{ currentQuestionIndex + 1 }} of {{ currentQuiz.questions.length }}
        </div>
      </div>

      <!-- Current Question -->
      <div class="question-section" v-if="currentQuestion">
        <QuestionDisplay
          :question="currentQuestion"
          :selectedAnswer="userAnswers[currentQuestionIndex]"
          @answer-selected="handleAnswerSelect"
        />
      </div>

      <!-- Navigation Buttons -->
      <div class="navigation-buttons">
        <BaseButton
          @click="previousQuestion"
          :disabled="currentQuestionIndex === 0"
          variant="outline"
        >
          Previous
        </BaseButton>
        
        <BaseButton
          v-if="currentQuestionIndex < currentQuiz.questions.length - 1"
          @click="nextQuestion"
          variant="primary"
        >
          Next Question
        </BaseButton>
        
        <BaseButton
          v-else
          @click="submitQuiz"
          variant="primary"
          :isLoading="resultsStore.isLoading"
        >
          Submit Quiz
        </BaseButton>
      </div>

      <!-- Question Navigation -->
      <div class="question-navigation">
        <h3>Question Navigation</h3>
        <div class="navigation-grid">
          <button
            v-for="(question, index) in currentQuiz.questions"
            :key="index"
            @click="goToQuestion(index)"
            :class="[
              'nav-button',
              {
                'answered': userAnswers[index] !== undefined,
                'current': index === currentQuestionIndex
              }
            ]"
          >
            {{ index + 1 }}
          </button>
        </div>
      </div>
    </div>

    <LoadingSpinner v-else-if="quizStore.isLoading" class="loading-center" />

    <div v-else class="error-state">
      <div class="error-icon">❌</div>
      <h3>Quiz Not Found</h3>
      <p>The quiz you're looking for doesn't exist or is no longer available.</p>
      <BaseButton @click="$router.push('/quizzes')" variant="primary">
        Back to Quizzes
      </BaseButton>
    </div>

    <!-- Submit Confirmation Modal -->
    <BaseModal
      v-model:isOpen="showSubmitModal"
      title="Submit Quiz?"
      size="small"
    >
      <div class="submit-modal-content">
        <p>Are you sure you want to submit your quiz? You cannot change your answers after submission.</p>
        
        <div class="quiz-summary">
          <div class="summary-item">
            <span>Questions Answered:</span>
            <strong>{{ answeredQuestions }}/{{ currentQuiz?.questions.length }}</strong>
          </div>
          <div class="summary-item">
            <span>Time Remaining:</span>
            <strong>{{ formatTime(timeRemaining) }}</strong>
          </div>
        </div>
        
        <template #footer>
          <BaseButton @click="showSubmitModal = false" variant="outline">
            Continue Quiz
          </BaseButton>
          <BaseButton @click="confirmSubmit" variant="primary" :isLoading="resultsStore.isLoading">
            Submit Quiz
          </BaseButton>
        </template>
      </div>
    </BaseModal>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quizzes'
import { useResultsStore } from '../stores/results'
import { StorageService } from '../services/storageService'
import QuizTimer from '../components/student/QuizTimer.vue'
import QuestionDisplay from '../components/student/QuestionDisplay.vue'
import BaseModal from '../components/common/BaseModal.vue'
import BaseButton from '../components/common/BaseButton.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import { formatTime } from '../utils/helpers'

export default {
  name: 'QuizView',
  components: {
    QuizTimer,
    QuestionDisplay,
    BaseModal,
    BaseButton,
    LoadingSpinner
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const quizStore = useQuizStore()
    const resultsStore = useResultsStore()

    const currentQuestionIndex = ref(0)
    const userAnswers = ref([])
    const isQuizActive = ref(true)
    const showSubmitModal = ref(false)
    const timeRemaining = ref(0)
    const startTime = ref(null)

    const quizId = parseInt(route.params.id)

    const currentQuiz = computed(() => quizStore.currentQuiz)
    const currentQuestion = computed(() => {
      return currentQuiz.value?.questions[currentQuestionIndex.value]
    })

    const progressPercentage = computed(() => {
      if (!currentQuiz.value) return 0
      return ((currentQuestionIndex.value + 1) / currentQuiz.value.questions.length) * 100
    })

    const answeredQuestions = computed(() => {
      return userAnswers.value.filter(answer => answer !== undefined).length
    })

    const loadProgress = () => {
      const progress = StorageService.getQuizProgress(quizId)
      if (progress) {
        userAnswers.value = progress.answers || []
        currentQuestionIndex.value = progress.currentQuestionIndex || 0
        timeRemaining.value = progress.timeRemaining || currentQuiz.value.duration
      } else {
        userAnswers.value = new Array(currentQuiz.value.questions.length).fill(undefined)
        timeRemaining.value = currentQuiz.value.duration
      }
      startTime.value = Date.now()
    }

    const saveProgress = () => {
      if (!currentQuiz.value) return

      const timeSpent = Math.floor((Date.now() - startTime.value) / 1000)
      const remainingTime = Math.max(0, currentQuiz.value.duration - timeSpent)

      StorageService.saveQuizProgress(quizId, {
        answers: userAnswers.value,
        currentQuestionIndex: currentQuestionIndex.value,
        timeRemaining: remainingTime,
        startTime: startTime.value
      })
    }

    const handleAnswerSelect = (answerIndex) => {
      userAnswers.value[currentQuestionIndex.value] = answerIndex
      saveProgress()
    }

    const nextQuestion = () => {
      if (currentQuestionIndex.value < currentQuiz.value.questions.length - 1) {
        currentQuestionIndex.value++
        saveProgress()
      }
    }

    const previousQuestion = () => {
      if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--
        saveProgress()
      }
    }

    const goToQuestion = (index) => {
      currentQuestionIndex.value = index
      saveProgress()
    }

    const submitQuiz = () => {
      showSubmitModal.value = true
    }

    const confirmSubmit = async () => {
      const timeSpent = Math.floor((Date.now() - startTime.value) / 1000)
      
      const result = await resultsStore.submitQuizResult(
        currentQuiz.value,
        userAnswers.value,
        timeSpent
      )
      
      if (result.success) {
        StorageService.clearQuizProgress(quizId)
        router.push(`/results/${result.result.id}`)
      }
    }

    const handleTimeUp = () => {
      isQuizActive.value = false
      submitQuiz()
    }

    const handleBeforeUnload = (event) => {
      if (isQuizActive.value) {
        saveProgress()
        event.preventDefault()
        event.returnValue = 'Your quiz progress will be saved. Are you sure you want to leave?'
      }
    }

    onMounted(async () => {
      await quizStore.loadQuizById(quizId)
      if (quizStore.currentQuiz) {
        loadProgress()
        window.addEventListener('beforeunload', handleBeforeUnload)
      }
    })

    onUnmounted(() => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    })

    return {
      quizStore,
      resultsStore,
      currentQuiz,
      currentQuestion,
      currentQuestionIndex,
      userAnswers,
      isQuizActive,
      showSubmitModal,
      timeRemaining,
      progressPercentage,
      answeredQuestions,
      handleAnswerSelect,
      nextQuestion,
      previousQuestion,
      goToQuestion,
      submitQuiz,
      confirmSubmit,
      handleTimeUp,
      formatTime
    }
  }
}
</script>

<style scoped>
.quiz-view {
  padding-bottom: var(--space-8);
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-6);
  margin-bottom: var(--space-8);
  padding: var(--space-6);
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}

.quiz-info {
  flex: 1;
}

.quiz-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.quiz-description {
  color: var(--gray-600);
  margin-bottom: var(--space-4);
  line-height: 1.6;
}

.quiz-meta {
  display: flex;
  gap: var(--space-6);
  flex-wrap: wrap;
}

.meta-item {
  color: var(--gray-600);
  font-size: var(--text-sm);
}

.meta-item strong {
  color: var(--gray-900);
}

.quiz-progress {
  margin-bottom: var(--space-6);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--gray-200);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: var(--space-2);
}

.progress-fill {
  height: 100%;
  background: var(--primary-500);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  color: var(--gray-600);
  font-size: var(--text-sm);
  font-weight: 500;
}

.question-section {
  margin-bottom: var(--space-6);
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
  padding: var(--space-4);
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}

.question-navigation {
  background: white;
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}

.question-navigation h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-4);
}

.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: var(--space-2);
}

.nav-button {
  width: 50px;
  height: 50px;
  border: 2px solid var(--gray-300);
  border-radius: var(--radius);
  background: white;
  color: var(--gray-700);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button:hover {
  border-color: var(--primary-500);
  color: var(--primary-500);
}

.nav-button.answered {
  background: var(--primary-500);
  border-color: var(--primary-500);
  color: white;
}

.nav-button.current {
  border-color: var(--primary-700);
  background: var(--primary-100);
  color: var(--primary-700);
}

.loading-center {
  display: flex;
  justify-content: center;
  padding: var(--space-12);
}

.error-state {
  text-align: center;
  padding: var(--space-12);
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  max-width: 500px;
  margin: 0 auto;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: var(--space-4);
}

.error-state h3 {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.error-state p {
  color: var(--gray-600);
  margin-bottom: var(--space-6);
}

.submit-modal-content {
  text-align: center;
}

.submit-modal-content p {
  color: var(--gray-700);
  margin-bottom: var(--space-6);
  line-height: 1.6;
}

.quiz-summary {
  background: var(--gray-50);
  padding: var(--space-4);
  border-radius: var(--radius);
  margin-bottom: var(--space-6);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
  color: var(--gray-700);
}

.summary-item:not(:last-child) {
  border-bottom: 1px solid var(--gray-200);
}

@media (max-width: 768px) {
  .quiz-header {
    flex-direction: column;
    text-align: center;
  }
  
  .quiz-meta {
    justify-content: center;
  }
  
  .navigation-buttons {
    flex-direction: column;
    gap: var(--space-3);
  }
  
  .navigation-grid {
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  }
  
  .nav-button {
    width: 40px;
    height: 40px;
  }
}
</style>