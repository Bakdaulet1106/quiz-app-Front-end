import api from './api'
import { StorageService } from './storageService'
import { shuffleArray } from '../utils/helpers'

export const QuestionService = {
  async getAllQuestions() {
    try {
      const response = await api.get('/questions')
      return response.data
    } catch (error) {
      console.error('Get questions error:', error)
      throw error
    }
  },

  async getQuestionById(id) {
    try {
      const response = await api.get(`/questions/${id}`)
      return response.data
    } catch (error) {
      console.error('Get question error:', error)
      throw error
    }
  },

  async createQuestion(questionData) {
    try {
      const response = await api.post('/questions', {
        ...questionData,
        createdAt: new Date().toISOString()
      })
      return response.data
    } catch (error) {
      console.error('Create question error:', error)
      throw error
    }
  },

  async updateQuestion(id, questionData) {
    try {
      const response = await api.put(`/questions/${id}`, questionData)
      return response.data
    } catch (error) {
      console.error('Update question error:', error)
      throw error
    }
  },

  async deleteQuestion(id) {
    try {
      await api.delete(`/questions/${id}`)
      return true
    } catch (error) {
      console.error('Delete question error:', error)
      throw error
    }
  },

  getRandomQuestions(questions, count) {
    return shuffleArray(questions).slice(0, count)
  },

  validateAnswer(question, selectedAnswer) {
    return question.correctAnswer === selectedAnswer
  }
}