<template>
  <div class="quiz-manager">
    <form @submit.prevent="handleSubmit" class="quiz-form">
      <div class="form-section">
        <h3>Quiz Information</h3>
        
        <div class="form-group">
          <label for="quiz-title" class="form-label">Quiz Title *</label>
          <input
            id="quiz-title"
            v-model="form.title"
            type="text"
            class="form-input"
            :class="{ error: errors.title }"
            placeholder="Enter quiz title..."
            required
          />
          <div v-if="errors.title" class="error-message">{{ errors.title }}</div>
        </div>

        <div class="form-group">
          <label for="quiz-description" class="form-label">Description</label>
          <textarea
            id="quiz-description"
            v-model="form.description"
            class="form-textarea"
            placeholder="Describe what this quiz is about..."
            rows="3"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="quiz-category" class="form-label">Category *</label>
            <select
              id="quiz-category"
              v-model="form.category"
              class="form-select"
              :class="{ error: errors.category }"
              required
            >
              <option value="">Select Category</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
            <div v-if="errors.category" class="error-message">{{ errors.category }}</div>
          </div>

          <div class="form-group">
            <label for="quiz-duration" class="form-label">Duration (seconds) *</label>
            <input
              id="quiz-duration"
              v-model.number="form.duration"
              type="number"
              class="form-input"
              :class="{ error: errors.duration }"
              min="60"
              max="3600"
              required
            />
            <div v-if="errors.duration" class="error-message">{{ errors.duration }}</div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Select Questions</h3>
        
        <div class="questions-selection">
          <div class="selection-controls">
            <div class="search-box">
              <input
                v-model="questionSearch"
                type="text"
                placeholder="Search questions..."
                class="search-input"
              />
            </div>
            <div class="filter-controls">
              <select v-model="questionCategory" class="filter-select">
                <option value="">All Categories</option>
                <option v-for="cat in questionCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
          </div>

          <LoadingSpinner v-if="questionStore.isLoading" class="loading-center" />

          <div v-else class="questions-grid">
            <div
              v-for="question in filteredQuestions"
              :key="question.id"
              @click="toggleQuestion(question.id)"
              :class="[
                'question-card',
                { selected: form.questions.includes(question.id) }
              ]"
            >
              <div class="question-content">
                <h4 class="question-text">{{ question.question }}</h4>
                <div class="question-meta">
                  <span class="meta-badge category">{{ question.category }}</span>
                  <span class="meta-badge" :style="{ backgroundColor: getDifficultyColor(question.difficulty) }">
                    {{ question.difficulty }}
                  </span>
                </div>
              </div>
              <div class="selection-indicator">
                <div class="checkmark" v-if="form.questions.includes(question.id)">✓</div>
              </div>
            </div>
          </div>

          <div v-if="!questionStore.isLoading && filteredQuestions.length === 0" class="empty-state">
            <p>No questions found. Create some questions first!</p>
          </div>
        </div>

        <div class="selected-questions">
          <h4>Selected Questions ({{ form.questions.length }})</h4>
          <div v-if="form.questions.length === 0" class="no-selection">
            No questions selected yet
          </div>
          <div v-else class="selected-list">
            <div
              v-for="questionId in form.questions"
              :key="questionId"
              class="selected-item"
            >
              <span>{{ getQuestionText(questionId) }}</span>
              <button
                type="button"
                @click="removeQuestion(questionId)"
                class="remove-btn"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <BaseButton
          type="button"
          @click="$emit('cancel')"
          variant="outline"
          v-if="$emit('cancel')"
        >
          Cancel
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          :isLoading="quizStore.isLoading"
          :disabled="form.questions.length === 0"
        >
          {{ editingQuiz ? 'Update Quiz' : 'Create Quiz' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useQuizStore } from '../../stores/quizzes'
import { useQuestionStore } from '../../stores/questions'
import { QUIZ_CATEGORIES } from '../../utils/constants'
import { getDifficultyColor } from '../../utils/helpers'
import BaseButton from '../common/BaseButton.vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'QuizManager',
  components: {
    BaseButton,
    LoadingSpinner
  },
  emits: ['quiz-created', 'cancel'],
  setup(props, { emit }) {
    const quizStore = useQuizStore()
    const questionStore = useQuestionStore()

    const form = reactive({
      title: '',
      description: '',
      category: '',
      duration: 300, // 5 minutes default
      questions: []
    })

    const errors = reactive({})
    const questionSearch = ref('')
    const questionCategory = ref('')

    const categories = QUIZ_CATEGORIES
    const editingQuiz = false // For future extension

    const questionCategories = computed(() => questionStore.categories)

    const filteredQuestions = computed(() => {
      let questions = questionStore.questions

      if (questionSearch.value) {
        const searchLower = questionSearch.value.toLowerCase()
        questions = questions.filter(q =>
          q.question.toLowerCase().includes(searchLower)
        )
      }

      if (questionCategory.value) {
        questions = questions.filter(q => q.category === questionCategory.value)
      }

      return questions
    })

    const validateForm = () => {
      const newErrors = {}

      if (!form.title.trim()) {
        newErrors.title = 'Quiz title is required'
      }

      if (!form.category) {
        newErrors.category = 'Category is required'
      }

      if (!form.duration || form.duration < 60) {
        newErrors.duration = 'Duration must be at least 60 seconds'
      }

      if (form.questions.length === 0) {
        newErrors.questions = 'At least one question is required'
      }

      Object.assign(errors, newErrors)
      return Object.keys(newErrors).length === 0
    }

    const toggleQuestion = (questionId) => {
      const index = form.questions.indexOf(questionId)
      if (index > -1) {
        form.questions.splice(index, 1)
      } else {
        form.questions.push(questionId)
      }
    }

    const removeQuestion = (questionId) => {
      const index = form.questions.indexOf(questionId)
      if (index > -1) {
        form.questions.splice(index, 1)
      }
    }

    const getQuestionText = (questionId) => {
      const question = questionStore.questions.find(q => q.id === questionId)
      return question ? question.question : 'Unknown Question'
    }

    const handleSubmit = async () => {
      if (!validateForm()) return

      try {
        const result = await quizStore.createQuiz(form)
        
        if (result.success) {
          // Reset form
          Object.assign(form, {
            title: '',
            description: '',
            category: '',
            duration: 300,
            questions: []
          })
          
          emit('quiz-created')
        }
      } catch (error) {
        console.error('Error creating quiz:', error)
      }
    }

    onMounted(async () => {
      await questionStore.loadQuestions()
    })

    return {
      form,
      errors,
      questionSearch,
      questionCategory,
      categories,
      questionCategories,
      filteredQuestions,
      editingQuiz,
      quizStore,
      questionStore,
      getDifficultyColor,
      toggleQuestion,
      removeQuestion,
      getQuestionText,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.quiz-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.form-section {
  padding: var(--space-4);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  background: var(--gray-50);
}

.form-section h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-4);
}

.form-group {
  margin-bottom: var(--space-4);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-label {
  display: block;
  margin-bottom: var(--space-2);
  font-weight: 500;
  color: var(--gray-700);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius);
  font-size: var(--text-base);
  transition: var(--transition);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: var(--error-500);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.error-message {
  color: var(--error-500);
  font-size: var(--text-sm);
  margin-top: var(--space-1);
}

.questions-selection {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.selection-controls {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius);
  font-size: var(--text-sm);
}

.filter-select {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius);
  background: white;
  font-size: var(--text-sm);
  min-width: 150px;
}

.loading-center {
  display: flex;
  justify-content: center;
  padding: var(--space-8);
}

.questions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-3);
  max-height: 400px;
  overflow-y: auto;
  padding: var(--space-2);
}

.question-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  background: white;
}

.question-card:hover {
  border-color: var(--primary-300);
}

.question-card.selected {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

.question-content {
  flex: 1;
}

.question-text {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--gray-700);
  margin-bottom: var(--space-2);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.question-meta {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.meta-badge {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius);
  font-size: var(--text-xs);
  font-weight: 600;
  color: white;
}

.meta-badge.category {
  background: var(--gray-500);
}

.selection-indicator {
  flex-shrink: 0;
}

.checkmark {
  width: 20px;
  height: 20px;
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: bold;
}

.empty-state {
  text-align: center;
  padding: var(--space-6);
  color: var(--gray-500);
}

.selected-questions {
  margin-top: var(--space-4);
  padding: var(--space-4);
  background: white;
  border-radius: var(--radius);
  border: 1px solid var(--gray-200);
}

.selected-questions h4 {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-3);
}

.no-selection {
  color: var(--gray-500);
  font-style: italic;
}

.selected-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.selected-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) var(--space-3);
  background: var(--gray-50);
  border-radius: var(--radius);
  font-size: var(--text-sm);
}

.remove-btn {
  background: var(--error-500);
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  transition: var(--transition);
}

.remove-btn:hover {
  background: var(--error-600);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--gray-200);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .selection-controls {
    flex-direction: column;
  }
  
  .questions-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>