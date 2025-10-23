import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService } from '@/services/api'
import { getRandomQuestions, shuffleArray } from '@/utils/helpers'
import { QUIZ_SETTINGS } from '@/utils/constants'

export const useQuestionsStore = defineStore('questions', () => {
  const questions = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const currentQuestionIndex = ref(0)
  const userAnswers = ref([])
  const quizStarted = ref(false)
  const quizCompleted = ref(false)

  // Getters
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

  // Actions
  const loadQuestions = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await apiService.get('/questions')
      questions.value = response.data
    } catch (err) {
      error.value = 'Не удалось загрузить вопросы'
      console.error('Error loading questions:', err)
    } finally {
      isLoading.value = false
    }
  }

  const startQuiz = (questionCount = QUIZ_SETTINGS.QUESTIONS_PER_QUIZ) => {
    const randomQuestions = getRandomQuestions(questions.value, questionCount)
    questions.value = randomQuestions.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }))
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
    } catch (err) {
      error.value = 'Не удалось добавить вопрос'
      throw err
    }
  }

  const updateQuestion = async (questionId, questionData) => {
    try {
      await apiService.put(`/questions/${questionId}`, questionData)
      const index = questions.value.findIndex(q => q.id === questionId)
      if (index !== -1) {
        questions.value[index] = { ...questions.value[index], ...questionData }
      }
    } catch (err) {
      error.value = 'Не удалось обновить вопрос'
      throw err
    }
  }

  const deleteQuestion = async (questionId) => {
    try {
      await apiService.delete(`/questions/${questionId}`)
      questions.value = questions.value.filter(q => q.id !== questionId)
    } catch (err) {
      error.value = 'Не удалось удалить вопрос'
      throw err
    }
  }

  const getQuestionsByCategory = (category) => {
    return questions.value.filter(q => q.category === category)
  }

  const getQuestionsByDifficulty = (difficulty) => {
    return questions.value.filter(q => q.difficulty === difficulty)
  }

  return {
    // State
    questions,
    isLoading,
    error,
    currentQuestionIndex,
    userAnswers,
    quizStarted,
    quizCompleted,
    
    // Getters
    totalQuestions,
    currentQuestion,
    progress,
    selectedAnswer,
    correctAnswersCount,
    score,
    
    // Actions
    loadQuestions,
    startQuiz,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    completeQuiz,
    resetQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionsByCategory,
    getQuestionsByDifficulty
  }
})