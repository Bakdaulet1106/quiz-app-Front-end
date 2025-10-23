<template>
  <div class="question-list">
    <div class="question-list__header">
      <h2 class="question-list__title">Банк вопросов</h2>
      <BaseButton 
        variant="primary" 
        @click="$emit('add-question')"
        class="question-list__add-btn"
      >
        ➕ Добавить вопрос
      </BaseButton>
    </div>

    <div v-if="questionsStore.isLoading" class="question-list__loading">
      <LoadingSpinner size="large" />
      <p>Загрузка вопросов...</p>
    </div>

    <div v-else-if="filteredQuestions.length === 0" class="question-list__empty">
      <p>Вопросы не найдены</p>
    </div>

    <div v-else class="question-list__content">
      <div class="question-list__filters">
        <div class="question-list__filter">
          <label for="category" class="question-list__filter-label">Категория:</label>
          <select 
            id="category" 
            v-model="filters.category" 
            class="question-list__filter-select"
          >
            <option value="">Все категории</option>
            <option 
              v-for="category in categories" 
              :key="category" 
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>

        <div class="question-list__filter">
          <label for="difficulty" class="question-list__filter-label">Сложность:</label>
          <select 
            id="difficulty" 
            v-model="filters.difficulty" 
            class="question-list__filter-select"
          >
            <option value="">Все уровни</option>
            <option value="easy">Легкий</option>
            <option value="medium">Средний</option>
            <option value="hard">Сложный</option>
          </select>
        </div>
      </div>

      <div class="question-list__stats">
        Всего вопросов: {{ filteredQuestions.length }}
      </div>

      <div class="question-list__items">
        <div 
          v-for="question in filteredQuestions" 
          :key="question.id"
          class="question-list__item"
        >
          <div class="question-list__item-content">
            <h3 class="question-list__item-question">{{ question.question }}</h3>
            
            <div class="question-list__item-meta">
              <span class="question-list__item-category">{{ question.category }}</span>
              <span 
                class="question-list__item-difficulty"
                :style="{ color: getDifficultyColor(question.difficulty) }"
              >
                {{ getDifficultyLabel(question.difficulty) }}
              </span>
              <span class="question-list__item-points">{{ question.points }} баллов</span>
            </div>

            <div class="question-list__item-options">
              <div 
                v-for="(option, index) in question.options" 
                :key="index"
                class="question-list__option"
                :class="{ 
                  'question-list__option--correct': index === question.correctAnswer 
                }"
              >
                <span class="question-list__option-index">{{ String.fromCharCode(65 + index) }}</span>
                <span class="question-list__option-text">{{ option }}</span>
                <span 
                  v-if="index === question.correctAnswer" 
                  class="question-list__option-correct"
                >
                  ✓
                </span>
              </div>
            </div>
          </div>

          <div class="question-list__item-actions">
            <BaseButton 
              variant="secondary" 
              size="small"
              @click="$emit('edit-question', question)"
            >
              ✏️ Редактировать
            </BaseButton>
            <BaseButton 
              variant="danger" 
              size="small"
              @click="handleDeleteQuestion(question.id)"
              :loading="deletingQuestionId === question.id"
            >
              🗑️ Удалить
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuestionsStore } from '@/stores/questions'
import { getDifficultyColor, getDifficultyLabel } from '@/utils/helpers'
import { CATEGORIES } from '@/utils/constants'
import BaseButton from '@/components/common/BaseButton.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const emit = defineEmits(['add-question', 'edit-question'])

const questionsStore = useQuestionsStore()
const deletingQuestionId = ref(null)

const filters = ref({
  category: '',
  difficulty: ''
})

const categories = computed(() => {
  const allCategories = questionsStore.questions.map(q => q.category)
  return [...new Set(allCategories)].sort()
})

const filteredQuestions = computed(() => {
  let filtered = questionsStore.questions

  if (filters.value.category) {
    filtered = filtered.filter(q => q.category === filters.value.category)
  }

  if (filters.value.difficulty) {
    filtered = filtered.filter(q => q.difficulty === filters.value.difficulty)
  }

  return filtered
})

const handleDeleteQuestion = async (questionId) => {
  if (!confirm('Вы уверены, что хотите удалить этот вопрос?')) return

  deletingQuestionId.value = questionId
  try {
    await questionsStore.deleteQuestion(questionId)
  } catch (error) {
    alert('Ошибка при удалении вопроса')
  } finally {
    deletingQuestionId.value = null
  }
}

onMounted(async () => {
  await questionsStore.loadQuestions()
})
</script>

<style scoped>
.question-list {
  padding: 1rem 0;
}

.question-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.question-list__title {
  color: var(--text-primary);
  margin: 0;
}

.question-list__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  color: var(--text-secondary);
}

.question-list__empty {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
  font-size: 1.125rem;
}

.question-list__filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.question-list__filter {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.question-list__filter-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.question-list__filter-select {
  padding: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius);
  background-color: var(--bg-secondary);
  min-width: 150px;
}

.question-list__stats {
  background-color: var(--bg-primary);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.question-list__items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.question-list__item {
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  border-left: 4px solid var(--primary-color);
}

.question-list__item-content {
  margin-bottom: 1.5rem;
}

.question-list__item-question {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.125rem;
  line-height: 1.5;
}

.question-list__item-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.question-list__item-category {
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.question-list__item-difficulty {
  font-weight: 600;
  font-size: 0.875rem;
}

.question-list__item-points {
  background-color: var(--info-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.question-list__item-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.question-list__option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: var(--bg-primary);
  border-radius: var(--border-radius);
  border: 1px solid #e2e8f0;
}

.question-list__option--correct {
  background-color: rgba(76, 201, 240, 0.1);
  border-color: var(--success-color);
}

.question-list__option-index {
  background-color: var(--primary-color);
  color: white;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.question-list__option-text {
  flex: 1;
}

.question-list__option-correct {
  color: var(--success-color);
  font-weight: 600;
  font-size: 1.125rem;
}

.question-list__item-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
}

@media (max-width: 768px) {
  .question-list__header {
    flex-direction: column;
    align-items: stretch;
  }

  .question-list__add-btn {
    align-self: flex-start;
  }

  .question-list__filters {
    flex-direction: column;
  }

  .question-list__filter-select {
    min-width: auto;
  }

  .question-list__item-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .question-list__item-actions {
    flex-direction: column;
  }
}
</style>