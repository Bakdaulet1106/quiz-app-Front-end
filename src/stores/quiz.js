import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useQuizStore = defineStore('quiz', () => {
  const timeRemaining = ref(0)
  const timerInterval = ref(null)
  const isTimerRunning = ref(false)

  const formattedTime = computed(() => {
    const minutes = Math.floor(timeRemaining.value / 60)
    const seconds = timeRemaining.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  const isTimeUp = computed(() => timeRemaining.value <= 0)

  const startTimer = (duration) => {
    timeRemaining.value = duration
    isTimerRunning.value = true
    
    timerInterval.value = setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--
      } else {
        stopTimer()
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

  return {
    timeRemaining,
    isTimerRunning,
    formattedTime,
    isTimeUp,
    startTimer,
    stopTimer,
    resetTimer
  }
})