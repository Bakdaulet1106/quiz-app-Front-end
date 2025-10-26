import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { apiService } from '@/services/api'
import { getRandomQuestions } from '@/utils/helpers'
import { QUIZ_SETTINGS } from '@/utils/constants'

// Mock вопросы для оффлайн режима
const mockQuestions = [
  {
    id: 1,
    question: "Что такое Vue.js?",
    options: ["Фреймворк", "Библиотека", "Язык программирования", "База данных"],
    correctAnswer: 0,
    category: "Vue.js",
    difficulty: "easy",
    points: 10
  },
  {
    id: 2,
    question: "Какой метод используется для создания реактивных данных в Composition API?",
    options: ["data()", "ref()", "computed()", "watch()"],
    correctAnswer: 1,
    category: "Vue.js",
    difficulty: "medium",
    points: 15
  },
  {
    id: 3,
    question: "Что такое Virtual DOM?",
    options: ["Реальная DOM структура", "Легковесная копия реальной DOM", "База данных", "Метод шифрования"],
    correctAnswer: 1,
    category: "Vue.js",
    difficulty: "medium",
    points: 15
  },
  {
    id: 4,
    question: "Какой директивой осуществляется условный рендеринг в Vue?",
    options: ["v-if", "v-for", "v-bind", "v-model"],
    correctAnswer: 0,
    category: "Vue.js",
    difficulty: "easy",
    points: 10
  },
  {
    id: 5,
    question: "Что возвращает функция computed?",
    options: ["Сырое значение", "Реактивную ссылку", "Функцию", "Оbject"],
    correctAnswer: 1,
    category: "Vue.js",
    difficulty: "hard",
    points: 20
  }
]

export const useQuestionsStore = defineStore('questions', () => {
  const questions = ref([])
  const isLoading = ref(false)
  const currentQuestionIndex = ref(0)
  const userAnswers = ref([])
  const quizStarted = ref(false)
  const quizCompleted = ref(false)

  const totalQuestions = computed(() => questions.value.length)
  const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
  const progress = computed(() => 
    totalQuestions.value > 0 ? ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100 : 0
  )
  const selectedAnswer = computed(() => 
    userAnswers.value[currentQuestionIndex.value]?.answerIndex
  )
  const correctAnswersCount = computed(() => 
    userAnswers.value.filter((answer, index) => 
      answer.answerIndex === questions.value[index]?.correctAnswer
    ).length
  )
  const score = computed(() => 
    totalQuestions.value > 0 ? Math.round((correctAnswersCount.value / totalQuestions.value) * 100) : 0
  )

  const loadQuestions = async () => {
    isLoading.value = true
    try {
      const response = await apiService.get('/questions')
      questions.value = response.data.length > 0 ? response.data : mockQuestions
    } catch (error) {
      console.error('Error loading questions:', error)
      questions.value = mockQuestions
    } finally {
      isLoading.value = false
    }
  }

  const startQuiz = (questionCount = QUIZ_SETTINGS.QUESTIONS_PER_QUIZ) => {
    const randomQuestions = getRandomQuestions(questions.value, questionCount)
    questions.value = randomQuestions
    userAnswers.value = []
    currentQuestionIndex.value = 0
    quizStarted.value = true
    quizCompleted.value = false
  }

  const submitAnswer = (answerIndex) => {
    userAnswers.value[currentQuestionIndex.value] = {
      questionId: currentQuestion.value.id,
      answerIndex,
      isCorrect: answerIndex === currentQuestion.value.correctAnswer,
      timestamp: Date.now()
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
      currentQuestionIndex.value++
    } else {
      completeQuiz()
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--
    }
  }

  const completeQuiz = () => {
    quizCompleted.value = true
    quizStarted.value = false
  }

  const resetQuiz = () => {
    questions.value = []
    userAnswers.value = []
    currentQuestionIndex.value = 0
    quizStarted.value = false
    quizCompleted.value = false
  }

  const addQuestion = async (questionData) => {
    try {
      const newQuestion = {
        id: Date.now(),
        ...questionData
      }
      await apiService.post('/questions', newQuestion)
      questions.value.push(newQuestion)
      return newQuestion
    } catch (error) {
      console.error('Error adding question:', error)
      // Добавляем локально при ошибке
      const newQuestion = {
        id: Date.now(),
        ...questionData
      }
      questions.value.push(newQuestion)
      return newQuestion
    }
  }

  const updateQuestion = async (questionId, questionData) => {
    try {
      await apiService.put(`/questions/${questionId}`, questionData)
      const index = questions.value.findIndex(q => q.id === questionId)
      if (index !== -1) {
        questions.value[index] = { ...questions.value[index], ...questionData }
      }
    } catch (error) {
      console.error('Error updating question:', error)
      // Обновляем локально при ошибке
      const index = questions.value.findIndex(q => q.id === questionId)
      if (index !== -1) {
        questions.value[index] = { ...questions.value[index], ...questionData }
      }
    }
  }

  const deleteQuestion = async (questionId) => {
    try {
      await apiService.delete(`/questions/${questionId}`)
      questions.value = questions.value.filter(q => q.id !== questionId)
    } catch (error) {
      console.error('Error deleting question:', error)
      // Удаляем локально при ошибке
      questions.value = questions.value.filter(q => q.id !== questionId)
    }
  }

  // Загружаем вопросы при инициализации
  onMounted(() => {
    loadQuestions()
  })

  return {
    questions,
    isLoading,
    currentQuestionIndex,
    userAnswers,
    quizStarted,
    quizCompleted,
    totalQuestions,
    currentQuestion,
    progress,
    selectedAnswer,
    correctAnswersCount,
    score,
    loadQuestions,
    startQuiz,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    completeQuiz,
    resetQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion
  }
})