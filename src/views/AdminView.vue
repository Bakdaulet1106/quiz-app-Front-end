<template>
  <div class="admin-view">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Admin Dashboard</h1>
        <p class="page-subtitle">Manage quizzes, questions, and track platform analytics</p>
      </div>

      <!-- Admin Tabs -->
      <div class="admin-tabs">
        <div class="tabs-header">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-button', { active: activeTab === tab.id }]"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="tab-content">
          <!-- Questions Management -->
          <div v-if="activeTab === 'questions'" class="tab-panel">
            <div class="panel-header">
              <h2>Question Bank</h2>
              <BaseButton @click="showQuestionModal = true" variant="primary">
                Add New Question
              </BaseButton>
            </div>
            <QuestionList @edit-question="handleEditQuestion" />
          </div>

          <!-- Quizzes Management -->
          <div v-else-if="activeTab === 'quizzes'" class="tab-panel">
            <div class="panel-header">
              <h2>Quiz Management</h2>
              <BaseButton @click="showQuizModal = true" variant="primary">
                Create New Quiz
              </BaseButton>
            </div>
            <QuizManager @quiz-created="handleQuizCreated" />
          </div>

          <!-- Analytics -->
          <div v-else-if="activeTab === 'analytics'" class="tab-panel">
            <h2>Platform Analytics</h2>
            <div class="analytics-grid">
              <BaseCard class="analytics-card">
                <div class="analytics-content">
                  <div class="analytics-value">{{ totalQuizzes }}</div>
                  <div class="analytics-label">Total Quizzes</div>
                </div>
              </BaseCard>
              <BaseCard class="analytics-card">
                <div class="analytics-content">
                  <div class="analytics-value">{{ totalQuestions }}</div>
                  <div class="analytics-label">Questions in Bank</div>
                </div>
              </BaseCard>
              <BaseCard class="analytics-card">
                <div class="analytics-content">
                  <div class="analytics-value">{{ totalResults }}</div>
                  <div class="analytics-label">Quiz Attempts</div>
                </div>
              </BaseCard>
              <BaseCard class="analytics-card">
                <div class="analytics-content">
                  <div class="analytics-value">{{ averagePlatformScore }}%</div>
                  <div class="analytics-label">Average Score</div>
                </div>
              </BaseCard>
            </div>

            <!-- Recent Results -->
            <div class="recent-results">
              <h3>Recent Quiz Attempts</h3>
              <BaseCard>
                <div class="results-table">
                  <div class="table-header">
                    <div class="table-cell">Student</div>
                    <div class="table-cell">Quiz</div>
                    <div class="table-cell">Score</div>
                    <div class="table-cell">Date</div>
                  </div>
                  <div
                    v-for="result in recentResults"
                    :key="result.id"
                    class="table-row"
                  >
                    <div class="table-cell">{{ result.userName }}</div>
                    <div class="table-cell">{{ result.quizTitle }}</div>
                    <div class="table-cell">
                      <span class="score-badge" :class="getScoreClass(result.score)">
                        {{ result.score }}%
                      </span>
                    </div>
                    <div class="table-cell">{{ formatDate(result.submittedAt) }}</div>
                  </div>
                </div>
              </BaseCard>
            </div>
          </div>
        </div>
      </div>

      <!-- Question Modal -->
      <BaseModal
        v-model:isOpen="showQuestionModal"
        :title="editingQuestion ? 'Edit Question' : 'Add New Question'"
        size="large"
      >
        <QuestionForm
          :question="editingQuestion"
          @saved="handleQuestionSaved"
          @cancel="showQuestionModal = false"
        />
      </BaseModal>

      <!-- Quiz Modal -->
      <BaseModal
        v-model:isOpen="showQuizModal"
        title="Create New Quiz"
        size="xlarge"
      >
        <QuizManager @quiz-created="handleQuizCreated" />
      </BaseModal>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useQuizStore } from '../stores/quizzes'
import { useQuestionStore } from '../stores/questions'
import { useResultsStore } from '../stores/results'
import QuestionList from '../components/admin/QuestionList.vue'
import QuestionForm from '../components/admin/QuestionForm.vue'
import QuizManager from '../components/admin/QuizManager.vue'
import BaseCard from '../components/common/BaseCard.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseModal from '../components/common/BaseModal.vue'

export default {
  name: 'AdminView',
  components: {
    QuestionList,
    QuestionForm,
    QuizManager,
    BaseCard,
    BaseButton,
    BaseModal
  },
  setup() {
    const quizStore = useQuizStore()
    const questionStore = useQuestionStore()
    const resultsStore = useResultsStore()

    const activeTab = ref('questions')
    const showQuestionModal = ref(false)
    const showQuizModal = ref(false)
    const editingQuestion = ref(null)

    const tabs = [
      { id: 'questions', label: 'Questions' },
      { id: 'quizzes', label: 'Quizzes' },
      { id: 'analytics', label: 'Analytics' }
    ]

    const totalQuizzes = computed(() => quizStore.quizzes.length)
    const totalQuestions = computed(() => questionStore.questions.length)
    const totalResults = computed(() => resultsStore.results.length)

    const averagePlatformScore = computed(() => {
      if (resultsStore.results.length === 0) return 0
      const total = resultsStore.results.reduce((sum, result) => sum + result.score, 0)
      return Math.round(total / resultsStore.results.length)
    })

    const recentResults = computed(() => {
      return resultsStore.results.slice(0, 10).sort((a, b) => 
        new Date(b.submittedAt) - new Date(a.submittedAt)
      )
    })

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
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

    const handleEditQuestion = (question) => {
      editingQuestion.value = question
      showQuestionModal.value = true
    }

    const handleQuestionSaved = () => {
      showQuestionModal.value = false
      editingQuestion.value = null
      questionStore.loadQuestions()
    }

    const handleQuizCreated = () => {
      showQuizModal.value = false
      quizStore.loadQuizzes()
    }

    onMounted(async () => {
      await Promise.all([
        quizStore.loadQuizzes(),
        questionStore.loadQuestions(),
        resultsStore.loadResults()
      ])
    })

    return {
      activeTab,
      tabs,
      showQuestionModal,
      showQuizModal,
      editingQuestion,
      totalQuizzes,
      totalQuestions,
      totalResults,
      averagePlatformScore,
      recentResults,
      formatDate,
      getScoreClass,
      handleEditQuestion,
      handleQuestionSaved,
      handleQuizCreated
    }
  }
}
</script>

<style scoped>
.admin-view {
  padding-bottom: var(--space-8);
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

.admin-tabs {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.tabs-header {
  display: flex;
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
}

.tab-button {
  padding: var(--space-4) var(--space-6);
  background: none;
  border: none;
  font-weight: 500;
  color: var(--gray-600);
  cursor: pointer;
  transition: var(--transition);
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: var(--primary-600);
  background: var(--gray-100);
}

.tab-button.active {
  color: var(--primary-600);
  border-bottom-color: var(--primary-600);
  background: white;
}

.tab-content {
  padding: var(--space-6);
}

.tab-panel h2 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-6);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.analytics-card {
  text-align: center;
}

.analytics-content {
  padding: var(--space-6);
}

.analytics-value {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--primary-600);
  margin-bottom: var(--space-2);
}

.analytics-label {
  color: var(--gray-600);
  font-weight: 500;
}

.recent-results h3 {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-4);
}

.results-table {
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
  font-weight: 600;
  color: var(--gray-700);
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: var(--space-4);
  padding: var(--space-4);
  border-bottom: 1px solid var(--gray-200);
  transition: var(--transition);
}

.table-row:hover {
  background: var(--gray-50);
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  display: flex;
  align-items: center;
}

.score-badge {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius);
  font-weight: 600;
  color: white;
  font-size: var(--text-sm);
  min-width: 50px;
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

@media (max-width: 768px) {
  .tabs-header {
    flex-direction: column;
  }
  
  .panel-header {
    flex-direction: column;
    gap: var(--space-4);
    align-items: flex-start;
  }
  
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
}
</style>