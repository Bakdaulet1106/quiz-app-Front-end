import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService } from '@/services/api'
import { useAuthStore } from './auth'

export const useResultsStore = defineStore('results', () => {
  const results = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const authStore = useAuthStore()

  // Getters
  const userResults = computed(() => {
    if (authStore.isAdmin) {
      return results.value
    }
    return results.value.filter(result => result.userId === authStore.user?.id)
  })

  const averageScore = computed(() => {
    if (userResults.value.length === 0) return 0
    const total = userResults.value.reduce((sum, result) => sum + result.score, 0)
    return Math.round(total / userResults.value.length)
  })

  const bestScore = computed(() => {
    if (userResults.value.length === 0) return 0
    return Math.max(...userResults.value.map(result => result.score))
  })

  const totalQuizzesTaken = computed(() => userResults.value.length)

  const recentResults = computed(() => 
    userResults.value
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 5)
  )

  // Actions
  const loadResults = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await apiService.get('/quizResults')
      results.value = response.data
    } catch (err) {
      error.value = 'Не удалось загрузить результаты'
      console.error('Error loading results:', err)
    } finally {
      isLoading.value = false
    }
  }

  const saveResult = async (quizData) => {
    try {
      const result = {
        id: Date.now(),
        userId: authStore.user?.id,
        userName: authStore.user?.name,
        score: quizData.score,
        correctAnswers: quizData.correctAnswers,
        totalQuestions: quizData.totalQuestions,
        timeSpent: quizData.timeSpent,
        completedAt: new Date().toISOString(),
        answers: quizData.answers,
        questions: quizData.questions
      }

      await apiService.post('/quizResults', result)
      results.value.push(result)
      return result
    } catch (err) {
      error.value = 'Не удалось сохранить результат'
      console.error('Error saving result:', err)
      // Сохраняем локально для оффлайн режима
      const offlineResult = {
        ...result,
        id: `offline_${Date.now()}`,
        isOffline: true
      }
      results.value.push(offlineResult)
      return offlineResult
    }
  }

  const getUserResults = (userId) => {
    return results.value.filter(result => result.userId === userId)
  }

  const getCategoryStats = () => {
    const categoryStats = {}
    
    results.value.forEach(result => {
      result.questions?.forEach(question => {
        const category = question.category
        if (!categoryStats[category]) {
          categoryStats[category] = { total: 0, correct: 0 }
        }
        categoryStats[category].total++
        
        const userAnswer = result.answers.find(a => a.questionId === question.id)
        if (userAnswer?.isCorrect) {
          categoryStats[category].correct++
        }
      })
    })

    return Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      total: stats.total,
      correct: stats.correct,
      percentage: Math.round((stats.correct / stats.total) * 100) || 0
    }))
  }

  const getDifficultyStats = () => {
    const difficultyStats = {}
    
    results.value.forEach(result => {
      result.questions?.forEach(question => {
        const difficulty = question.difficulty
        if (!difficultyStats[difficulty]) {
          difficultyStats[difficulty] = { total: 0, correct: 0 }
        }
        difficultyStats[difficulty].total++
        
        const userAnswer = result.answers.find(a => a.questionId === question.id)
        if (userAnswer?.isCorrect) {
          difficultyStats[difficulty].correct++
        }
      })
    })

    return Object.entries(difficultyStats).map(([difficulty, stats]) => ({
      difficulty,
      total: stats.total,
      correct: stats.correct,
      percentage: Math.round((stats.correct / stats.total) * 100) || 0
    }))
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    results,
    isLoading,
    error,
    
    // Getters
    userResults,
    averageScore,
    bestScore,
    totalQuizzesTaken,
    recentResults,
    
    // Actions
    loadResults,
    saveResult,
    getUserResults,
    getCategoryStats,
    getDifficultyStats,
    clearError
  }
})