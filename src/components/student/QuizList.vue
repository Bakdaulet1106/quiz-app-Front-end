<template>
  <div class="quiz-list">
    <div class="quiz-list__header">
      <h2 class="quiz-list__title">Доступные квизы</h2>
      <div class="quiz-list__filters">
        <div class="quiz-list__filter">
          <label for="category" class="quiz-list__filter-label">Категория:</label>
          <select 
            id="category" 
            v-model="filters.category" 
            class="quiz-list__filter-select"
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

        <div class="quiz-list__filter">
          <label for="difficulty" class="quiz-list__filter-label">Сложность:</label>
          <select 
            id="difficulty" 
            v-model="filters.difficulty" 
            class="quiz-list__filter-select"
          >
            <option value="">Все уровни</option>
            <option value="easy">Легкий</option>
            <option value="medium">Средний</option>
            <option value="hard">Сложный</option>
          </select>
        </div>
      </div>
    </div>

    <div class="quiz-list__content">
      <div class="quiz-list__stats">
        Найдено квизов: {{ availableQuizzes.length }}
      </div>

      <div class="quiz-list__items">
        <QuizCard 
          v-for="quiz in availableQuizzes" 
          :key="quiz.id"
          :quiz="quiz"
          @start-quiz="handleStartQuiz"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionsStore } from '@/stores/questions'
import { getRandomQuestions } from '@/utils/helpers'
import { QUIZ_SETTINGS } from '@/utils/constants'
import QuizCard from './QuizCard.vue'

const router = useRouter()
const questionsStore = useQuestionsStore()

const filters = ref({
  category: '',
  difficulty: ''
})

const categories = computed(() => {
  const allCategories = questionsStore.questions.map(q => q.category)
  return [...new Set(allCategories)].sort()
})

const availableQuizzes = computed(() => {
  let filtered = questionsStore.questions

  if (filters.value.category) {
    filtered = filtered.filter(q => q.category === filters.value.category)
  }

  if (filters.value.difficulty) {
    filtered = filtered.filter(q => q.difficulty === filters.value.difficulty)
  }

  const quizMap = new Map()

  filtered.forEach(question => {
    const key = `${question.category}-${question.difficulty}`
    if (!quizMap.has(key)) {
      quizMap.set(key, {
        id: key,
        title: `${question.category} - ${getDifficultyLabel(question.difficulty)}`,
        category: question.category,
        difficulty: question.difficulty,
        questionCount: Math.min(
          filtered.filter(q => q.category === question.category && q.difficulty === question.difficulty).length,
          QUIZ_SETTINGS.QUESTIONS_PER_QUIZ
        ),
        questions: []
      })
    }
  })

  return Array.from(quizMap.values()).filter(quiz => quiz.questionCount >= 3)
})

const getDifficultyLabel = (difficulty) => {
  const labels = {
    easy: 'Легкий',
    medium: 'Средний',
    hard: 'Сложный'
  }
  return labels[difficulty] || difficulty
}

const handleStartQuiz = (quiz) => {
  const categoryQuestions = questionsStore.questions.filter(
    q => q.category === quiz.category && q.difficulty === quiz.difficulty
  )
  
  const randomQuestions = getRandomQuestions(categoryQuestions, quiz.questionCount)
  
  questionsStore.questions = randomQuestions
  questionsStore.startQuiz(quiz.questionCount)
  
  router.push('/quiz')
}
</script>

<style scoped>
.quiz-list {
  padding: 1rem 0;
}

.quiz-list__header {
  margin-bottom: 2rem;
}

.quiz-list__title {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  text-align: center;
}

.quiz-list__filters {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.quiz-list__filter {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quiz-list__filter-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-primary);
  text-align: center;
}

.quiz-list__filter-select {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius);
  background-color: var(--bg-secondary);
  min-width: 150px;
  cursor: pointer;
}

.quiz-list__filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.quiz-list__stats {
  background-color: var(--bg-primary);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
}

.quiz-list__items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .quiz-list__filters {
    flex-direction: column;
    align-items: center;
  }

  .quiz-list__filter-select {
    min-width: 200px;
  }

  .quiz-list__items {
    grid-template-columns: 1fr;
  }
}
</style>