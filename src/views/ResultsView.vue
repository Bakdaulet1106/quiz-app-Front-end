<template>
  <div class="results-view">
    <div class="container">
      <!-- Single Result View -->
      <div v-if="currentResult" class="single-result">
        <div class="result-header">
          <h1 class="result-title">Quiz Results</h1>
          <BaseButton @click="$router.push('/quizzes')" variant="primary">
            Take Another Quiz
          </BaseButton>
        </div>

        <!-- Score Overview -->
        <BaseCard class="score-overview">
          <div class="score-main">
            <div class="score-circle">
              <div class="score-value">{{ currentResult.score }}%</div>
              <div class="score-label">Overall Score</div>
            </div>
            <div class="score-details">
              <div class="detail-item">
                <div class="detail-value">{{ currentResult.correctAnswers }}</div>
                <div class="detail-label">Correct Answers</div>
              </div>
              <div class="detail-item">
                <div class="detail-value">{{ currentResult.totalQuestions }}</div>
                <div class="detail-label">Total Questions</div>
              </div>
              <div class="detail-item">
                <div class="detail-value">{{ formatTime(currentResult.timeSpent) }}</div>
                <div class="detail-label">Time Spent</div>
              </div>
            </div>
          </div>
          <div class="quiz-info">
            <h3>{{ currentResult.quizTitle }}</h3>
            <p>Completed on {{ formatDate(currentResult.submittedAt) }}</p>
          </div>
        </BaseCard>

        <!-- Question Review -->
        <div class="questions-review">
          <h2 class="section-title">Question Review</h2>
          <div class="questions-list">
            <div
              v-for="(question, index) in currentResult.questions"
              :key="index"
              class="question-review-item"
            >
              <QuestionDisplay
                :question="question"
                :selectedAnswer="currentResult.userAnswers[index]"
                :showCorrect="true"
                :isReview="true"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Results List View -->
      <div v-else>
        <div class="page-header">
          <h1 class="page-title">Your Results</h1>
          <p class="page-subtitle">Track your quiz performance and progress</p>
        </div>

        <LoadingSpinner v-if="resultsStore.isLoading" class="loading-center" />

        <div v-else-if="resultsStore.userResults.length === 0" class="empty-state">
          <div class="empty-icon">📊</div>
          <h3>No Results Yet</h3>
          <p>Take your first quiz to see your results here!</p>
          <BaseButton @click="$router.push('/quizzes')" variant="primary">
            Browse Quizzes
          </BaseButton>
        </div>

        <div v-else class="results-list">
          <BaseCard
            v-for="result in resultsStore.userResults"
            :key="result.id"
            class="result-item"
            hoverable
            @click="viewResult(result.id)"
          >
            <div class="result-content">
              <div class="result-main">
                <h3 class="quiz-name">{{ result.quizTitle }}</h3>
                <p class="result-date">{{ formatDate(result.submittedAt) }}</p>
              </div>
              <div class="result-stats">
                <div class="score-badge" :class="getScoreClass(result.score)">
                  {{ result.score }}%
                </div>
                <div class="result-details">
                  <span>{{ result.correctAnswers }}/{{ result.totalQuestions }} correct</span>
                  <span class="time-spent">{{ formatTime(result.timeSpent) }}</span>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useResultsStore } from '../stores/results'
import BaseCard from '../components/common/BaseCard.vue'
import BaseButton from '../components/common/BaseButton.vue'
import QuestionDisplay from '../components/student/QuestionDisplay.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import { formatTime } from '../utils/helpers'

export default {
  name: 'ResultsView',
  components: {
    BaseCard,
    BaseButton,
    QuestionDisplay,
    LoadingSpinner
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const resultsStore = useResultsStore()

    const resultId = route.params.id ? parseInt(route.params.id) : null

    const currentResult = computed(() => {
      if (resultId) {
        return resultsStore.results.find(r => r.id === resultId) || resultsStore.currentResult
      }
      return null
    })

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getScoreClass = (score) => {
      if (score >= 80) return 'excellent'
      if (score >= 60) return 'good'
      if (score >= 40) return 'average'
      return 'poor'
    }

    const viewResult = (id) => {
      router.push(`/results/${id}`)
    }

    onMounted(async () => {
      await resultsStore.loadResults()
    })

    return {
      resultsStore,
      currentResult,
      formatDate,
      formatTime,
      getScoreClass,
      viewResult
    }
  }
}
</script>

<style scoped>
.results-view {
  padding-bottom: var(--space-8);
}

.single-result {
  max-width: 800px;
  margin: 0 auto;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
}

.result-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--gray-900);
  margin: 0;
}

.score-overview {
  margin-bottom: var(--space-8);
}

.score-main {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  margin-bottom: var(--space-6);
}

.score-circle {
  text-align: center;
  flex-shrink: 0;
}

.score-value {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-600);
  line-height: 1;
  margin-bottom: var(--space-2);
}

.score-label {
  color: var(--gray-600);
  font-weight: 500;
}

.score-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
  flex: 1;
}

.detail-item {
  text-align: center;
  padding: var(--space-4);
  background: var(--gray-50);
  border-radius: var(--radius);
}

.detail-value {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-1);
}

.detail-label {
  color: var(--gray-600);
  font-size: var(--text-sm);
}

.quiz-info {
  text-align: center;
  padding-top: var(--space-4);
  border-top: 1px solid var(--gray-200);
}

.quiz-info h3 {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-1);
}

.quiz-info p {
  color: var(--gray-600);
  margin: 0;
}

.section-title {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-6);
}

.questions-review {
  margin-bottom: var(--space-8);
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.question-review-item {
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.page-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.page-subtitle {
  font-size: var(--text-lg);
  color: var(--gray-600);
  margin: 0;
}

.loading-center {
  display: flex;
  justify-content: center;
  padding: var(--space-12);
}

.empty-state {
  text-align: center;
  padding: var(--space-12);
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--space-4);
}

.empty-state h3 {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.empty-state p {
  color: var(--gray-600);
  margin-bottom: var(--space-6);
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.result-item {
  cursor: pointer;
  transition: var(--transition);
}

.result-item:hover {
  transform: translateY(-2px);
}

.result-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
}

.result-main {
  flex: 1;
}

.quiz-name {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-1);
}

.result-date {
  color: var(--gray-600);
  font-size: var(--text-sm);
  margin: 0;
}

.result-stats {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.score-badge {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius);
  font-weight: 600;
  color: white;
  min-width: 60px;
  text-align: center;
}

.score-badge.excellent {
  background: var(--success-500);
}

.score-badge.good {
  background: var(--primary-500);
}

.score-badge.average {
  background: var(--warning-500);
}

.score-badge.poor {
  background: var(--error-500);
}

.result-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-1);
  color: var(--gray-600);
  font-size: var(--text-sm);
}

.time-spent {
  font-size: var(--text-xs);
  color: var(--gray-500);
}

@media (max-width: 768px) {
  .result-header {
    flex-direction: column;
    gap: var(--space-4);
    text-align: center;
  }
  
  .score-main {
    flex-direction: column;
    text-align: center;
  }
  
  .score-details {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  
  .result-content {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
  
  .result-stats {
    width: 100%;
    justify-content: space-between;
  }
}
</style>