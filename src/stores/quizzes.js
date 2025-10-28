import { defineStore } from 'pinia'
import { QuizService } from '../services/quizService'

export const useQuizStore = defineStore('quizzes', {
  state: () => ({
    quizzes: [],
    currentQuiz: null,
    isLoading: false,
    error: null
  }),

  getters: {
    activeQuizzes: (state) => state.quizzes.filter(quiz => quiz.isActive),
    quizzesByCategory: (state) => {
      return (category) => state.quizzes.filter(quiz => quiz.category === category)
    },
    categories: (state) => {
      return [...new Set(state.quizzes.map(quiz => quiz.category))]
    }
  },

  actions: {
    async loadQuizzes() {
      this.isLoading = true
      this.error = null
      
      try {
        this.quizzes = await QuizService.getAllQuizzes()
      } catch (error) {
        this.error = 'Failed to load quizzes'
        console.error('Load quizzes error:', error)
      } finally {
        this.isLoading = false
      }
    },

    async loadQuizById(id) {
      this.isLoading = true
      this.error = null
      
      try {
        this.currentQuiz = await QuizService.getQuizById(id)
        return { success: true, quiz: this.currentQuiz }
      } catch (error) {
        this.error = 'Failed to load quiz'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async createQuiz(quizData) {
      this.isLoading = true
      this.error = null
      
      try {
        const newQuiz = await QuizService.createQuiz(quizData)
        this.quizzes.push(newQuiz)
        return { success: true, quiz: newQuiz }
      } catch (error) {
        this.error = 'Failed to create quiz'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async updateQuiz(id, quizData) {
      this.isLoading = true
      this.error = null
      
      try {
        const updatedQuiz = await QuizService.updateQuiz(id, quizData)
        const index = this.quizzes.findIndex(q => q.id === id)
        if (index !== -1) {
          this.quizzes[index] = updatedQuiz
        }
        return { success: true, quiz: updatedQuiz }
      } catch (error) {
        this.error = 'Failed to update quiz'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async deleteQuiz(id) {
      this.isLoading = true
      this.error = null
      
      try {
        await QuizService.deleteQuiz(id)
        this.quizzes = this.quizzes.filter(q => q.id !== id)
        return { success: true }
      } catch (error) {
        this.error = 'Failed to delete quiz'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    clearCurrentQuiz() {
      this.currentQuiz = null
    }
  }
})