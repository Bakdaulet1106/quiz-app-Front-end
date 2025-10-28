<template>
  <div class="quiz-timer" :class="timerClass">
    <div class="timer-content">
      <div class="timer-icon">⏱️</div>
      <div class="timer-text">
        <div class="time-display">{{ formatTime(timeRemaining) }}</div>
        <div class="time-label">Time Remaining</div>
      </div>
    </div>
    
    <div class="timer-progress">
      <div 
        class="progress-bar" 
        :style="{ width: progressPercentage + '%' }"
      ></div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { formatTime } from '../../utils/helpers'

export default {
  name: 'QuizTimer',
  props: {
    duration: {
      type: Number,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  emits: ['time-up'],
  setup(props, { emit }) {
    const timeRemaining = ref(props.duration)
    const timerInterval = ref(null)

    const progressPercentage = computed(() => {
      return (timeRemaining.value / props.duration) * 100
    })

    const timerClass = computed(() => {
      if (timeRemaining.value <= 60) return 'critical'
      if (timeRemaining.value <= 300) return 'warning'
      return 'normal'
    })

    const startTimer = () => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
      }

      timerInterval.value = setInterval(() => {
        if (timeRemaining.value > 0) {
          timeRemaining.value--
        } else {
          clearInterval(timerInterval.value)
          emit('time-up')
        }
      }, 1000)
    }

    const stopTimer = () => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
        timerInterval.value = null
      }
    }

    watch(() => props.isActive, (isActive) => {
      if (isActive && timeRemaining.value > 0) {
        startTimer()
      } else {
        stopTimer()
      }
    })

    onMounted(() => {
      if (props.isActive) {
        startTimer()
      }
    })

    onUnmounted(() => {
      stopTimer()
    })

    return {
      timeRemaining,
      progressPercentage,
      timerClass,
      formatTime
    }
  }
}
</script>

<style scoped>
.quiz-timer {
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  min-width: 150px;
  text-align: center;
  transition: var(--transition);
}

.quiz-timer.normal {
  border-color: var(--primary-500);
}

.quiz-timer.warning {
  border-color: var(--warning-500);
  background: var(--warning-50);
}

.quiz-timer.critical {
  border-color: var(--error-500);
  background: var(--error-50);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.timer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.timer-icon {
  font-size: var(--text-xl);
}

.timer-text {
  text-align: center;
}

.time-display {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--gray-900);
  line-height: 1;
  margin-bottom: var(--space-1);
}

.time-label {
  font-size: var(--text-xs);
  color: var(--gray-600);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.timer-progress {
  width: 100%;
  height: 4px;
  background: var(--gray-200);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 2px;
  transition: width 1s linear;
}

.quiz-timer.normal .progress-bar {
  background: var(--primary-500);
}

.quiz-timer.warning .progress-bar {
  background: var(--warning-500);
}

.quiz-timer.critical .progress-bar {
  background: var(--error-500);
}

@media (max-width: 640px) {
  .quiz-timer {
    min-width: 120px;
    padding: var(--space-3);
  }
  
  .timer-content {
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .time-display {
    font-size: var(--text-lg);
  }
}
</style>