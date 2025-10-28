import { defineStore } from 'pinia'
import { QuizService } from '../services/quizService'
import { StorageService } from '../services/storageService'
import { calculateScore } from '../utils/helpers'

export const useResultsStore = defineStore('results', {
  state: () => ({
    results: [],
    currentResult: null,
    isLoading: false,
    error: null
  }),

  getters: {
    userResults: (state) => {
      const authStore = useAuthStore()
      return state.results.filter(result => result.userId === authStore.user?.id)
    },
    
    averageScore: (state) => {
      const authStore = useAuthStore()
      const userResults = state.results.filter(result => result.userId === authStore.user?.id)
      if (userResults.length === 0) return 0
      
      const total = userResults.reduce((sum, result) => sum + result.score, 0)
      return Math.round(total / userResults.length)
    }
  },

  actions: {
    async loadResults() {
      this.isLoading = true
      this.error = null
      
      try {
        this.results = await QuizService.getAllResults()
      } catch (error) {
        this.error = 'Failed to load results'
        console.error('Load results error:', error)
      } finally {
        this.isLoading = false
      }
    },

    async submitQuizResult(quizData, userAnswers, timeSpent) {
      this.isLoading = true
      this.error = null
      
      try {
        const authStore = useAuthStore()
        const score = calculateScore(quizData.questions, userAnswers)
        
        const correctAnswers = quizData.questions.filter((question, index) => 
          userAnswers[index] === question.correctAnswer
        ).length

        const result = {
          quizId: quizData.id,
          quizTitle: quizData.title,
          userId: authStore.user.id,
          userName: authStore.user.name,
          score,
          correctAnswers,
          totalQuestions: quizData.questions.length,
          timeSpent,
          userAnswers,
          questions: quizData.questions,
          submittedAt: new Date().toISOString()
        }

        const savedResult = await QuizService.submitQuizResults(result)
        this.results.push(savedResult)
        this.currentResult = savedResult
        
        return { success: true, result: savedResult }
      } catch (error) {
        this.error = 'Failed to submit quiz results'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    clearCurrentResult() {
      this.currentResult = null
    }
  }
})