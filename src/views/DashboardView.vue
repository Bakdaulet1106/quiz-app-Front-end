<template>
  <div class="dashboard-view">
    <div class="container">
      <!-- Welcome Section -->
      <section class="welcome-section">
        <div class="welcome-content">
          <h1 class="welcome-title">
            Welcome back, {{ authStore.userName }}!
          </h1>
          <p class="welcome-subtitle">
            {{ dashboardMessage }}
          </p>
        </div>
        <div class="welcome-stats" v-if="authStore.isStudent">
          <div class="stat-card">
            <div class="stat-value">{{ completedQuizzes }}</div>
            <div class="stat-label">Quizzes Completed</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ averageScore }}%</div>
            <div class="stat-label">Average Score</div>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="actions-section">
        <h2 class="section-title">Quick Actions</h2>
        <div class="actions-grid">
          <router-link to="/quizzes" class="action-card">
            <div class="action-icon">📝</div>
            <h3>Take a Quiz</h3>
            <p>Test your knowledge with our quiz collection</p>
          </router-link>
          
          <router-link to="/results" class="action-card" v-if="authStore.isStudent">
            <div class="action-icon">📊</div>
            <h3>View Results</h3>
            <p>Check your previous quiz performances</p>
          </router-link>
          
          <router-link to="/admin" class="action-card" v-if="authStore.isAdmin">
            <div class="action-icon">⚙️</div>
            <h3>Admin Panel</h3>
            <p>Manage quizzes and questions</p>
          </router-link>
          
          <div class="action-card" v-if="authStore.isStudent">
            <div class="action-icon">🎯</div>
            <h3>Your Progress</h3>
            <p>Continue your learning journey</p>
          </div>
        </div>
      </section>

      <!-- Recent Activity -->
      <section class="activity-section" v-if="authStore.isStudent && recentResults.length > 0">
        <h2 class="section-title">Recent Activity</h2>
        <BaseCard>
          <div class="activity-list">
            <div v-for="result in recentResults" :key="result.id" class="activity-item">
              <div class="activity-info">
                <h4 class="quiz-title">{{ result.quizTitle }}</h4>
                <p class="activity-date">{{ formatDate(result.submittedAt) }}</p>
              </div>
              <div class="activity-score">
                <span class="score-value">{{ result.score }}%</span>
                <div class="score-bar">
                  <div 
                    class="score-progress" 
                    :style="{ width: result.score + '%' }"
                    :class="getScoreClass(result.score)"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </section>

      <!-- Admin Quick Stats -->
      <section class="admin-section" v-if="authStore.isAdmin">
        <h2 class="section-title">Admin Overview</h2>
        <div class="stats-grid">
          <BaseCard class="stat-item">
            <div class="stat-content">
              <div class="stat-number">{{ totalQuizzes }}</div>
              <div class="stat-description">Total Quizzes</div>
            </div>
          </BaseCard>
          <BaseCard class="stat-item">
            <div class="stat-content">
              <div class="stat-number">{{ totalQuestions }}</div>
              <div class="stat-description">Questions in Bank</div>
            </div>
          </BaseCard>
          <BaseCard class="stat-item">
            <div class="stat-content">
              <div class="stat-number">{{ totalResults }}</div>
              <div class="stat-description">Quiz Attempts</div>
            </div>
          </BaseCard>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useResultsStore } from '../stores/results'
import { useQuizStore } from '../stores/quizzes'
import { useQuestionStore } from '../stores/questions'
import BaseCard from '../components/common/BaseCard.vue'

export default {
  name: 'DashboardView',
  components: {
    BaseCard
  },
  setup() {
    const authStore = useAuthStore()
    const resultsStore = useResultsStore()
    const quizStore = useQuizStore()
    const questionStore = useQuestionStore()

    const dashboardMessage = computed(() => {
      if (authStore.isAdmin) {
        return 'Manage your quiz platform and track student progress.'
      } else {
        return 'Continue your learning journey and track your progress.'
      }
    })

    const completedQuizzes = computed(() => {
      return resultsStore.userResults.length
    })

    const averageScore = computed(() => {
      return resultsStore.averageScore
    })

    const recentResults = computed(() => {
      return resultsStore.userResults.slice(0, 3)
    })

    const totalQuizzes = computed(() => {
      return quizStore.quizzes.length
    })

    const totalQuestions = computed(() => {
      return questionStore.questions.length
    })

    const totalResults = computed(() => {
      return resultsStore.results.length
    })

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const getScoreClass = (score) => {
      if (score >= 80) return 'excellent'
      if (score >= 60) return 'good'
      if (score >= 40) return 'average'
      return 'poor'
    }

    onMounted(async () => {
      if (authStore.isStudent) {
        await resultsStore.loadResults()
      }
      if (authStore.isAdmin) {
        await quizStore.loadQuizzes()
        await questionStore.loadQuestions()
        await resultsStore.loadResults()
      }
    })

    return {
      authStore,
      dashboardMessage,
      completedQuizzes,
      averageScore,
      recentResults,
      totalQuizzes,
      totalQuestions,
      totalResults,
      formatDate,
      getScoreClass
    }
  }
}
</script>

<style scoped>
.dashboard-view {
  padding-bottom: var(--space-8);
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-8);
  gap: var(--space-8);
}

.welcome-content {
  flex: 1;
}

.welcome-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.welcome-subtitle {
  font-size: var(--text-lg);
  color: var(--gray-600);
  margin: 0;
}

.welcome-stats {
  display: flex;
  gap: var(--space-6);
}

.stat-card {
  background: white;
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  text-align: center;
  min-width: 120px;
}

.stat-value {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--primary-600);
  margin-bottom: var(--space-1);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--gray-600);
  font-weight: 500;
}

.section-title {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-6);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.action-card {
  background: white;
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  text-decoration: none;
  color: inherit;
  transition: var(--transition);
  border: 1px solid var(--gray-200);
}

.action-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
  border-color: var(--primary-300);
}

.action-icon {
  font-size: var(--text-2xl);
  margin-bottom: var(--space-3);
}

.action-card h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.action-card p {
  color: var(--gray-600);
  margin: 0;
  line-height: 1.5;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  border-radius: var(--radius);
  transition: var(--transition);
}

.activity-item:hover {
  background: var(--gray-50);
}

.activity-info {
  flex: 1;
}

.quiz-title {
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-1);
}

.activity-date {
  color: var(--gray-500);
  font-size: var(--text-sm);
  margin: 0;
}

.activity-score {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.score-value {
  font-weight: 600;
  color: var(--gray-700);
  min-width: 50px;
  text-align: right;
}

.score-bar {
  width: 80px;
  height: 6px;
  background: var(--gray-200);
  border-radius: 3px;
  overflow: hidden;
}

.score-progress {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.score-progress.excellent {
  background: var(--success-500);
}

.score-progress.good {
  background: var(--primary-500);
}

.score-progress.average {
  background: var(--warning-500);
}

.score-progress.poor {
  background: var(--error-500);
}

.admin-section {
  margin-top: var(--space-8);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-6);
}

.stat-item {
  text-align: center;
}

.stat-content {
  padding: var(--space-6);
}

.stat-number {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--primary-600);
  margin-bottom: var(--space-2);
}

.stat-description {
  color: var(--gray-600);
  font-weight: 500;
}

@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    text-align: center;
  }
  
  .welcome-stats {
    justify-content: center;
  }
  
  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }
  
  .activity-score {
    width: 100%;
    justify-content: space-between;
  }
}
</style>