import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export const useResultsStore = defineStore('results', () => {
  const results = ref([])
  const authStore = useAuthStore()

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

  const saveResult = async (quizData) => {
    const result = {
      id: Date.now(),
      userId: authStore.user?.id,
      userName: authStore.user?.name,
      score: quizData.score,
      correctAnswers: quizData.correctAnswers,
      totalQuestions: quizData.totalQuestions,
      timeSpent: quizData.timeSpent || 0,
      completedAt: new Date().toISOString(),
      answers: quizData.answers,
      questions: quizData.questions
    }

    results.value.push(result)
    return result
  }

  return {
    results,
    userResults,
    averageScore,
    bestScore,
    totalQuizzesTaken,
    recentResults,
    saveResult
  }
})