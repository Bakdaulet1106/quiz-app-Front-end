import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useQuestionsStore } from './questions'

export const useQuizStore = defineStore('quiz', () => {
  const questionsStore = useQuestionsStore()
  
  const timeRemaining = ref(0)
  const timerInterval = ref(null)
  const isTimerRunning = ref(false)

  // Getters
  const formattedTime = computed(() => {
    const minutes = Math.floor(timeRemaining.value / 60)
    const seconds = timeRemaining.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  const isTimeUp = computed(() => timeRemaining.value <= 0)

  // Actions
  const startTimer = (duration) => {
    timeRemaining.value = duration
    isTimerRunning.value = true
    
    timerInterval.value = setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--
      } else {
        stopTimer()
        questionsStore.completeQuiz()
      }
    }, 1000)
  }

  const stopTimer = () => {
    isTimerRunning.value = false
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
  }

  const resetTimer = () => {
    stopTimer()
    timeRemaining.value = 0
  }

  const pauseTimer = () => {
    isTimerRunning.value = false
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
  }

  const resumeTimer = () => {
    if (!isTimerRunning.value && timeRemaining.value > 0) {
      startTimer(timeRemaining.value)
    }
  }

  const addTime = (seconds) => {
    timeRemaining.value += seconds
  }

  return {
    // State
    timeRemaining,
    isTimerRunning,
    
    // Getters
    formattedTime,
    isTimeUp,
    
    // Actions
    startTimer,
    stopTimer,
    resetTimer,
    pauseTimer,
    resumeTimer,
    addTime
  }
})