<template>
  <div class="quiz-list-view">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Available Quizzes</h1>
        <p class="page-subtitle">Test your knowledge with our curated collection of quizzes</p>
      </div>

      <div class="filters-section" v-if="filteredQuizzes.length > 0">
        <div class="filters">
          <div class="filter-group">
            <label for="category-filter" class="filter-label">Category</label>
            <select id="category-filter" v-model="filters.category" class="filter-select">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div class="filter-group">
            <label for="difficulty-filter" class="filter-label">Difficulty</label>
            <select id="difficulty-filter" v-model="filters.difficulty" class="filter-select">
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
        <div class="search-box">
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search quizzes..."
            class="search-input"
          />
        </div>
      </div>

      <LoadingSpinner v-if="quizStore.isLoading" class="loading-center" />

      <div v-else-if="filteredQuizzes.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <h3>No Quizzes Available</h3>
        <p>There are no quizzes matching your criteria at the moment.</p>
        <BaseButton @click="clearFilters" variant="primary">Clear Filters</BaseButton>
      </div>

      <div v-else class="quizzes-grid">
        <QuizCard
          v-for="quiz in filteredQuizzes"
          :key="quiz.id"
          :quiz="quiz"
          @start-quiz="startQuiz"
        />
      </div>

      <!-- Admin Actions -->
      <div v-if="authStore.isAdmin" class="admin-actions">
        <BaseButton @click="showCreateModal = true" variant="primary">
          Create New Quiz
        </BaseButton>
      </div>

      <!-- Create Quiz Modal -->
      <BaseModal
        v-model:isOpen="showCreateModal"
        title="Create New Quiz"
        size="medium"
      >
        <QuizManager @quiz-created="handleQuizCreated" />
      </BaseModal>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quizzes'
import { useAuthStore } from '../stores/auth'
import QuizCard from '../components/student/QuizCard.vue'
import QuizManager from '../components/admin/QuizManager.vue'
import BaseModal from '../components/common/BaseModal.vue'
import BaseButton from '../components/common/BaseButton.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'

export default {
  name: 'QuizListView',
  components: {
    QuizCard,
    QuizManager,
    BaseModal,
    BaseButton,
    LoadingSpinner
  },
  setup() {
    const router = useRouter()
    const quizStore = useQuizStore()
    const authStore = useAuthStore()

    const showCreateModal = ref(false)
    const filters = reactive({
      category: '',
      difficulty: '',
      search: ''
    })

    const categories = computed(() => {
      return quizStore.categories
    })

    const filteredQuizzes = computed(() => {
      let quizzes = quizStore.activeQuizzes

      if (filters.category) {
        quizzes = quizzes.filter(quiz => quiz.category === filters.category)
      }

      if (filters.difficulty) {
        quizzes = quizzes.filter(quiz => quiz.difficulty === filters.difficulty)
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        quizzes = quizzes.filter(quiz =>
          quiz.title.toLowerCase().includes(searchLower) ||
          quiz.description.toLowerCase().includes(searchLower)
        )
      }

      return quizzes
    })

    const startQuiz = (quizId) => {
      router.push(`/quiz/${quizId}`)
    }

    const clearFilters = () => {
      filters.category = ''
      filters.difficulty = ''
      filters.search = ''
    }

    const handleQuizCreated = () => {
      showCreateModal.value = false
      quizStore.loadQuizzes()
    }

    onMounted(async () => {
      await quizStore.loadQuizzes()
    })

    return {
      quizStore,
      authStore,
      showCreateModal,
      filters,
      categories,
      filteredQuizzes,
      startQuiz,
      clearFilters,
      handleQuizCreated
    }
  }
}
</script>

<style scoped>
.quiz-list-view {
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

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--space-6);
  margin-bottom: var(--space-8);
  padding: var(--space-6);
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}

.filters {
  display: flex;
  gap: var(--space-6);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.filter-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--gray-700);
}

.filter-select {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius);
  background: white;
  font-size: var(--text-sm);
  min-width: 150px;
}

.search-box {
  flex-shrink: 0;
}

.search-input {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius);
  font-size: var(--text-sm);
  width: 250px;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

.quizzes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.admin-actions {
  display: flex;
  justify-content: center;
  padding: var(--space-6);
  border-top: 1px solid var(--gray-200);
}

@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-4);
  }
  
  .filters {
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .filter-select,
  .search-input {
    width: 100%;
  }
  
  .quizzes-grid {
    grid-template-columns: 1fr;
  }
}
</style>