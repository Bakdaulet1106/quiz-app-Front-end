<template>
  <div class="question-list">
    <!-- Filters and Search -->
    <div class="list-controls">
      <div class="search-box">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search questions..."
          class="search-input"
        />
      </div>
      <div class="filter-controls">
        <select v-model="filters.category" class="filter-select">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        <select v-model="filters.difficulty" class="filter-select">
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </div>

    <LoadingSpinner v-if="questionStore.isLoading" class="loading-center" />

    <div v-else-if="filteredQuestions.length === 0" class="empty-state">
      <div class="empty-icon">❓</div>
      <h3>No Questions Found</h3>
      <p v-if="filters.search || filters.category || filters.difficulty">
        No questions match your current filters. Try adjusting your search criteria.
      </p>
      <p v-else>
        No questions have been created yet. Create your first question to get started!
      </p>
    </div>

    <div v-else class="questions-table">
      <div class="table-header">
        <div class="table-cell">Question</div>
        <div class="table-cell">Category</div>
        <div class="table-cell">Difficulty</div>
        <div class="table-cell">Options</div>
        <div class="table-cell">Actions</div>
      </div>

      <div
        v-for="question in filteredQuestions"
        :key="question.id"
        class="table-row"
      >
        <div class="table-cell question-text">
          {{ question.question }}
        </div>
        <div class="table-cell">
          <span class="category-badge">{{ question.category }}</span>
        </div>
        <div class="table-cell">
          <span class="difficulty-badge" :style="{ backgroundColor: getDifficultyColor(question.difficulty) }">
            {{ question.difficulty }}
          </span>
        </div>
        <div class="table-cell">
          {{ question.options.length }} options
        </div>
        <div class="table-cell actions">
          <BaseButton
            @click="$emit('edit-question', question)"
            variant="outline"
            size="small"
          >
            Edit
          </BaseButton>
          <BaseButton
            @click="deleteQuestion(question.id)"
            variant="danger"
            size="small"
            :isLoading="deletingQuestionId === question.id"
          >
            Delete
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <BaseModal
      v-model:isOpen="showDeleteModal"
      title="Delete Question"
      size="small"
    >
      <div class="delete-modal-content">
        <p>Are you sure you want to delete this question? This action cannot be undone.</p>
        <template #footer>
          <BaseButton @click="showDeleteModal = false" variant="outline">
            Cancel
          </BaseButton>
          <BaseButton @click="confirmDelete" variant="danger" :isLoading="questionStore.isLoading">
            Delete Question
          </BaseButton>
        </template>
      </div>
    </BaseModal>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useQuestionStore } from '../../stores/questions'
import { getDifficultyColor } from '../../utils/helpers'
import BaseButton from '../common/BaseButton.vue'
import BaseModal from '../common/BaseModal.vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'QuestionList',
  components: {
    BaseButton,
    BaseModal,
    LoadingSpinner
  },
  emits: ['edit-question'],
  setup(props, { emit }) {
    const questionStore = useQuestionStore()
    const showDeleteModal = ref(false)
    const deletingQuestionId = ref(null)
    const questionToDelete = ref(null)

    const filters = reactive({
      search: '',
      category: '',
      difficulty: ''
    })

    const categories = computed(() => questionStore.categories)

    const filteredQuestions = computed(() => {
      let questions = questionStore.questions

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        questions = questions.filter(q =>
          q.question.toLowerCase().includes(searchLower) ||
          q.explanation?.toLowerCase().includes(searchLower)
        )
      }

      if (filters.category) {
        questions = questions.filter(q => q.category === filters.category)
      }

      if (filters.difficulty) {
        questions = questions.filter(q => q.difficulty === filters.difficulty)
      }

      return questions
    })

    const deleteQuestion = (questionId) => {
      questionToDelete.value = questionId
      showDeleteModal.value = true
    }

    const confirmDelete = async () => {
      if (!questionToDelete.value) return

      deletingQuestionId.value = questionToDelete.value
      const result = await questionStore.deleteQuestion(questionToDelete.value)
      
      if (result.success) {
        showDeleteModal.value = false
        questionToDelete.value = null
      }
      
      deletingQuestionId.value = null
    }

    onMounted(async () => {
      await questionStore.loadQuestions()
    })

    return {
      questionStore,
      showDeleteModal,
      deletingQuestionId,
      filters,
      categories,
      filteredQuestions,
      getDifficultyColor,
      deleteQuestion,
      confirmDelete
    }
  }
}
</script>

<style scoped>
.question-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.list-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius);
  font-size: var(--text-sm);
}

.filter-controls {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.filter-select {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius);
  background: white;
  font-size: var(--text-sm);
  min-width: 120px;
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
  margin: 0;
}

.questions-table {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
  font-weight: 600;
  color: var(--gray-700);
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
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
  min-height: 40px;
}

.question-text {
  font-weight: 500;
  color: var(--gray-700);
  line-height: 1.4;
}

.category-badge {
  padding: var(--space-1) var(--space-2);
  background: var(--gray-500);
  color: white;
  border-radius: var(--radius);
  font-size: var(--text-xs);
  font-weight: 600;
}

.difficulty-badge {
  padding: var(--space-1) var(--space-2);
  color: white;
  border-radius: var(--radius);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: capitalize;
}

.actions {
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
}

.delete-modal-content {
  text-align: center;
}

.delete-modal-content p {
  color: var(--gray-700);
  margin-bottom: var(--space-6);
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
  
  .table-cell {
    justify-content: space-between;
    border-bottom: 1px solid var(--gray-200);
    padding: var(--space-2) 0;
  }
  
  .table-cell:last-child {
    border-bottom: none;
  }
  
  .table-cell::before {
    content: attr(data-label);
    font-weight: 600;
    color: var(--gray-700);
  }
  
  .table-header {
    display: none;
  }
  
  .table-row {
    padding: var(--space-4);
    margin-bottom: var(--space-4);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius);
  }
  
  .actions {
    justify-content: center;
    margin-top: var(--space-3);
  }
}

@media (max-width: 768px) {
  .list-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-controls {
    justify-content: space-between;
  }
  
  .filter-select {
    flex: 1;
  }
}
</style>