import { defineStore } from 'pinia'
import { QuestionService } from '../services/questionService'

export const useQuestionStore = defineStore('questions', {
  state: () => ({
    questions: [],
    currentQuestion: null,
    isLoading: false,
    error: null
  }),

  getters: {
    questionsByCategory: (state) => {
      return (category) => state.questions.filter(q => q.category === category)
    },
    
    categories: (state) => {
      return [...new Set(state.questions.map(q => q.category))]
    },
    
    questionsCount: (state) => state.questions.length
  },

  actions: {
    async loadQuestions() {
      this.isLoading = true
      this.error = null
      
      try {
        this.questions = await QuestionService.getAllQuestions()
      } catch (error) {
        this.error = 'Failed to load questions'
        console.error('Load questions error:', error)
      } finally {
        this.isLoading = false
      }
    },

    async createQuestion(questionData) {
      this.isLoading = true
      this.error = null
      
      try {
        const newQuestion = await QuestionService.createQuestion(questionData)
        this.questions.push(newQuestion)
        return { success: true, question: newQuestion }
      } catch (error) {
        this.error = 'Failed to create question'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async updateQuestion(id, questionData) {
      this.isLoading = true
      this.error = null
      
      try {
        const updatedQuestion = await QuestionService.updateQuestion(id, questionData)
        const index = this.questions.findIndex(q => q.id === id)
        if (index !== -1) {
          this.questions[index] = updatedQuestion
        }
        return { success: true, question: updatedQuestion }
      } catch (error) {
        this.error = 'Failed to update question'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async deleteQuestion(id) {
      this.isLoading = true
      this.error = null
      
      try {
        await QuestionService.deleteQuestion(id)
        this.questions = this.questions.filter(q => q.id !== id)
        return { success: true }
      } catch (error) {
        this.error = 'Failed to delete question'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    setCurrentQuestion(question) {
      this.currentQuestion = question
    },

    clearCurrentQuestion() {
      this.currentQuestion = null
    }
  }
})