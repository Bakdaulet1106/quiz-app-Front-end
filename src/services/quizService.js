import api from './api'
import { QuestionService } from './questionService'
import { shuffleArray } from '../utils/helpers'

export const QuizService = {
  async getAllQuizzes() {
    try {
      const response = await api.get('/quizzes')
      return response.data
    } catch (error) {
      console.error('Get quizzes error:', error)
      throw error
    }
  },

  async getQuizById(id) {
    try {
      const response = await api.get(`/quizzes/${id}`)
      const quiz = response.data
      
      // Fetch all questions for this quiz
      const questions = await Promise.all(
        quiz.questions.map(questionId => 
          QuestionService.getQuestionById(questionId)
        )
      )
      
      return {
        ...quiz,
        questions: shuffleArray(questions) // Shuffle questions for the quiz
      }
    } catch (error) {
      console.error('Get quiz error:', error)
      throw error
    }
  },

  async createQuiz(quizData) {
    try {
      const response = await api.post('/quizzes', {
        ...quizData,
        createdAt: new Date().toISOString(),
        isActive: true
      })
      return response.data
    } catch (error) {
      console.error('Create quiz error:', error)
      throw error
    }
  },

  async updateQuiz(id, quizData) {
    try {
      const response = await api.put(`/quizzes/${id}`, quizData)
      return response.data
    } catch (error) {
      console.error('Update quiz error:', error)
      throw error
    }
  },

  async deleteQuiz(id) {
    try {
      await api.delete(`/quizzes/${id}`)
      return true
    } catch (error) {
      console.error('Delete quiz error:', error)
      throw error
    }
  },

  async submitQuizResults(results) {
    try {
      const response = await api.post('/results', {
        ...results,
        submittedAt: new Date().toISOString()
      })
      return response.data
    } catch (error) {
      console.error('Submit results error:', error)
      throw error
    }
  },

  async getUserResults(userId) {
    try {
      const response = await api.get('/results')
      const allResults = response.data
      return allResults.filter(result => result.userId === userId)
    } catch (error) {
      console.error('Get user results error:', error)
      throw error
    }
  }
}