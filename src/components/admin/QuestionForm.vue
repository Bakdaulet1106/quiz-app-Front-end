<template>
  <div class="question-form">
    <h2 class="question-form__title">
      {{ isEditing ? 'Редактировать вопрос' : 'Добавить вопрос' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="question-form__form">
      <div class="question-form__field">
        <label for="question" class="question-form__label">Вопрос *</label>
        <textarea
          id="question"
          v-model="form.question"
          class="question-form__textarea"
          :class="{ 'question-form__textarea--error': errors.question }"
          placeholder="Введите текст вопроса"
          rows="3"
          @blur="validateField('question')"
        ></textarea>
        <span v-if="errors.question" class="question-form__error">{{ errors.question }}</span>
      </div>

      <div class="question-form__row">
        <div class="question-form__field">
          <label for="category" class="question-form__label">Категория *</label>
          <select
            id="category"
            v-model="form.category"
            class="question-form__select"
            :class="{ 'question-form__select--error': errors.category }"
            @blur="validateField('category')"
          >
            <option value="">Выберите категорию</option>
            <option v-for="category in CATEGORIES" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <span v-if="errors.category" class="question-form__error">{{ errors.category }}</span>
        </div>

        <div class="question-form__field">
          <label for="difficulty" class="question-form__label">Сложность *</label>
          <select
            id="difficulty"
            v-model="form.difficulty"
            class="question-form__select"
            :class="{ 'question-form__select--error': errors.difficulty }"
            @blur="validateField('difficulty')"
          >
            <option value="">Выберите сложность</option>
            <option value="easy">Легкий</option>
            <option value="medium">Средний</option>
            <option value="hard">Сложный</option>
          </select>
          <span v-if="errors.difficulty" class="question-form__error">{{ errors.difficulty }}</span>
        </div>

        <div class="question-form__field">
          <label for="points" class="question-form__label">Баллы *</label>
          <input
            id="points"
            v-model.number="form.points"
            type="number"
            min="1"
            max="100"
            class="question-form__input"
            :class="{ 'question-form__input--error': errors.points }"
            placeholder="10"
            @blur="validateField('points')"
          />
          <span v-if="errors.points" class="question-form__error">{{ errors.points }}</span>
        </div>
      </div>

      <div class="question-form__options">
        <h3 class="question-form__options-title">Варианты ответов *</h3>
        
        <div 
          v-for="(option, index) in form.options" 
          :key="index"
          class="question-form__option"
        >
          <div class="question-form__option-content">
            <span class="question-form__option-letter">{{ String.fromCharCode(65 + index) }}</span>
            <input
              v-model="form.options[index]"
              type="text"
              class="question-form__option-input"
              :class="{ 'question-form__option-input--error': errors[`option${index}`] }"
              :placeholder="`Вариант ${String.fromCharCode(65 + index)}`"
              @blur="validateOption(index)"
            />
            <BaseButton
              v-if="form.options.length > 2"
              variant="danger"
              size="small"
              @click="removeOption(index)"
              class="question-form__remove-option"
            >
              ✕
            </BaseButton>
          </div>
          <span v-if="errors[`option${index}`]" class="question-form__error">
            {{ errors[`option${index}`] }}
          </span>
        </div>

        <BaseButton
          v-if="form.options.length < 6"
          variant="secondary"
          size="small"
          @click="addOption"
          class="question-form__add-option"
        >
          ➕ Добавить вариант
        </BaseButton>
      </div>

      <div class="question-form__field">
        <label class="question-form__label">Правильный ответ *</label>
        <div class="question-form__correct-answers">
          <div
            v-for="(option, index) in form.options"
            :key="index"
            class="question-form__correct-answer"
            :class="{
              'question-form__correct-answer--selected': form.correctAnswer === index
            }"
            @click="form.correctAnswer = index"
          >
            <span class="question-form__correct-letter">{{ String.fromCharCode(65 + index) }}</span>
            <span class="question-form__correct-text">{{ option || `Вариант ${String.fromCharCode(65 + index)}` }}</span>
            <span 
              v-if="form.correctAnswer === index" 
              class="question-form__correct-check"
            >
              ✓
            </span>
          </div>
        </div>
        <span v-if="errors.correctAnswer" class="question-form__error">{{ errors.correctAnswer }}</span>
      </div>

      <div class="question-form__actions">
        <BaseButton
          type="button"
          variant="secondary"
          @click="$emit('cancel')"
          :disabled="questionsStore.isLoading"
        >
          Отмена
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          :loading="questionsStore.isLoading"
          :disabled="!isFormValid"
        >
          {{ isEditing ? 'Обновить' : 'Создать' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuestionsStore } from '@/stores/questions'
import { validateQuestion } from '@/utils/validators'
import { CATEGORIES } from '@/utils/constants'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  question: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const questionsStore = useQuestionsStore()

const form = ref({
  question: '',
  category: '',
  difficulty: '',
  points: 10,
  options: ['', ''],
  correctAnswer: null
})

const errors = ref({})

const isEditing = computed(() => !!props.question)

const isFormValid = computed(() => {
  return form.value.question &&
         form.value.category &&
         form.value.difficulty &&
         form.value.points > 0 &&
         form.value.options.length >= 2 &&
         form.value.options.every(opt => opt.trim()) &&
         form.value.correctAnswer !== null
})

const validateField = (field) => {
  switch (field) {
    case 'question':
      errors.value.question = form.value.question ? '' : 'Вопрос обязателен'
      break
    case 'category':
      errors.value.category = form.value.category ? '' : 'Категория обязательна'
      break
    case 'difficulty':
      errors.value.difficulty = form.value.difficulty ? '' : 'Сложность обязательна'
      break
    case 'points':
      errors.value.points = form.value.points > 0 ? '' : 'Баллы должны быть больше 0'
      break
    case 'correctAnswer':
      errors.value.correctAnswer = form.value.correctAnswer !== null ? '' : 'Выберите правильный ответ'
      break
  }
}

const validateOption = (index) => {
  const key = `option${index}`
  errors.value[key] = form.value.options[index].trim() ? '' : 'Вариант ответа не может быть пустым'
}

const addOption = () => {
  if (form.value.options.length < 6) {
    form.value.options.push('')
  }
}

const removeOption = (index) => {
  if (form.value.options.length > 2) {
    form.value.options.splice(index, 1)
    
    // Adjust correct answer if needed
    if (form.value.correctAnswer === index) {
      form.value.correctAnswer = null
    } else if (form.value.correctAnswer > index) {
      form.value.correctAnswer--
    }
  }
}

const handleSubmit = async () => {
  // Validate all fields
  validateField('question')
  validateField('category')
  validateField('difficulty')
  validateField('points')
  validateField('correctAnswer')
  
  form.value.options.forEach((_, index) => validateOption(index))

  // Check if there are any errors
  const hasErrors = Object.values(errors.value).some(error => error)
  if (hasErrors) return

  try {
    if (isEditing.value) {
      await questionsStore.updateQuestion(props.question.id, form.value)
    } else {
      await questionsStore.addQuestion(form.value)
    }
    emit('submit')
  } catch (error) {
    // Error handling is done in the store
  }
}

// Initialize form when question prop changes
watch(() => props.question, (newQuestion) => {
  if (newQuestion) {
    form.value = { ...newQuestion }
  } else {
    form.value = {
      question: '',
      category: '',
      difficulty: '',
      points: 10,
      options: ['', ''],
      correctAnswer: null
    }
  }
  errors.value = {}
}, { immediate: true })

// Clear errors when form changes
watch(form, () => {
  if (questionsStore.error) {
    questionsStore.error = null
  }
}, { deep: true })
</script>

<style scoped>
.question-form {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 800px;
  margin: 0 auto;
}

.question-form__title {
  margin-bottom: 2rem;
  color: var(--text-primary);
  text-align: center;
}

.question-form__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.question-form__row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.question-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.question-form__label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.question-form__textarea,
.question-form__select,
.question-form__input {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  background-color: var(--bg-primary);
  font-family: inherit;
}

.question-form__textarea:focus,
.question-form__select:focus,
.question-form__input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: var(--bg-secondary);
}

.question-form__textarea--error,
.question-form__select--error,
.question-form__input--error {
  border-color: var(--danger-color);
}

.question-form__error {
  color: var(--danger-color);
  font-size: 0.875rem;
  font-weight: 500;
}

.question-form__options {
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  background-color: var(--bg-primary);
}

.question-form__options-title {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.125rem;
}

.question-form__option {
  margin-bottom: 1rem;
}

.question-form__option-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.question-form__option-letter {
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

.question-form__option-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  background-color: var(--bg-secondary);
}

.question-form__option-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.question-form__option-input--error {
  border-color: var(--danger-color);
}

.question-form__add-option {
  margin-top: 0.5rem;
}

.question-form__correct-answers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.question-form__correct-answer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius);
  background-color: var(--bg-primary);
  cursor: pointer;
  transition: var(--transition);
}

.question-form__correct-answer:hover {
  border-color: var(--primary-color);
}

.question-form__correct-answer--selected {
  border-color: var(--success-color);
  background-color: rgba(76, 201, 240, 0.1);
}

.question-form__correct-letter {
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

.question-form__correct-answer--selected .question-form__correct-letter {
  background-color: var(--success-color);
}

.question-form__correct-text {
  flex: 1;
  font-size: 0.875rem;
}

.question-form__correct-check {
  color: var(--success-color);
  font-weight: 600;
  font-size: 1.125rem;
}

.question-form__actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

@media (max-width: 768px) {
  .question-form {
    padding: 1.5rem;
    margin: 1rem;
  }

  .question-form__row {
    grid-template-columns: 1fr;
  }

  .question-form__correct-answers {
    grid-template-columns: 1fr;
  }

  .question-form__actions {
    flex-direction: column;
  }
}
</style>