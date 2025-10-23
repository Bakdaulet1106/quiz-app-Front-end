<template>
  <div class="quiz-timer">
    <div 
      class="quiz-timer__circle"
      :class="{
        'quiz-timer__circle--warning': timeRemaining <= 60,
        'quiz-timer__circle--danger': timeRemaining <= 30
      }"
    >
      <svg class="quiz-timer__svg" viewBox="0 0 100 100">
        <circle 
          class="quiz-timer__background"
          cx="50" 
          cy="50" 
          r="45" 
        />
        <circle 
          class="quiz-timer__progress"
          cx="50" 
          cy="50" 
          r="45" 
          :stroke-dasharray="circumference"
          :stroke-dashoffset="progressOffset"
        />
      </svg>
      <div class="quiz-timer__content">
        <div class="quiz-timer__time">{{ formattedTime }}</div>
        <div class="quiz-timer__label">осталось</div>
      </div>
    </div>

    <div class="quiz-timer__controls" v-if="showControls">
      <BaseButton 
        v-if="isTimerRunning"
        variant="warning" 
        size="small"
        @click="pauseTimer"
        class="quiz-timer__control-btn"
      >
        ⏸️ Пауза
      </BaseButton>
      <BaseButton 
        v-else
        variant="success" 
        size="small"
        @click="resumeTimer"
        class="quiz-timer__control-btn"
      >
        ▶️ Продолжить
      </BaseButton>
    </div>

    <div 
      v-if="timeRemaining <= 60 && timeRemaining > 0"
      class="quiz-timer__warning"
    >
      ⚠️ Время заканчивается!
    </div>

    <div 
      v-if="timeRemaining === 0"
      class="quiz-timer__time-up"
    >
      ⏰ Время вышло!
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useQuizStore } from '@/stores/quiz'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  duration: {
    type: Number,
    default: 300 // 5 minutes in seconds
  },
  showControls: {
    type: Boolean,
    default: true
  }
})

const quizStore = useQuizStore()

const timeRemaining = computed(() => quizStore.timeRemaining)
const isTimerRunning = computed(() => quizStore.isTimerRunning)

const formattedTime = computed(() => {
  const minutes = Math.floor(timeRemaining.value / 60)
  const seconds = timeRemaining.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const circumference = 2 * Math.PI * 45
const progressOffset = computed(() => {
  const progress = (props.duration - timeRemaining.value) / props.duration
  return circumference * (1 - progress)
})

const pauseTimer = () => {
  quizStore.pauseTimer()
}

const resumeTimer = () => {
  quizStore.resumeTimer()
}

onMounted(() => {
  quizStore.startTimer(props.duration)
})

onUnmounted(() => {
  quizStore.stopTimer()
})
</script>

<style scoped>
.quiz-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.quiz-timer__circle {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--bg-secondary);
  box-shadow: var(--shadow);
}

.quiz-timer__svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.quiz-timer__background {
  fill: none;
  stroke: var(--bg-primary);
  stroke-width: 8;
}

.quiz-timer__progress {
  fill: none;
  stroke: var(--primary-color);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s linear;
}

.quiz-timer__circle--warning .quiz-timer__progress {
  stroke: var(--warning-color);
  animation: pulse 1s infinite;
}

.quiz-timer__circle--danger .quiz-timer__progress {
  stroke: var(--danger-color);
  animation: pulse 0.5s infinite;
}

.quiz-timer__content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.quiz-timer__time {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.quiz-timer__label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quiz-timer__controls {
  display: flex;
  gap: 0.5rem;
}

.quiz-timer__control-btn {
  font-size: 0.75rem;
  padding: 0.5rem 1rem;
}

.quiz-timer__warning {
  background-color: rgba(248, 150, 30, 0.1);
  color: var(--warning-color);
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--warning-color);
  font-weight: 600;
  text-align: center;
  animation: pulse 1s infinite;
}

.quiz-timer__time-up {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--danger-color);
  font-weight: 600;
  text-align: center;
  animation: pulse 0.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@media (max-width: 768px) {
  .quiz-timer__circle {
    width: 100px;
    height: 100px;
  }

  .quiz-timer__time {
    font-size: 1.25rem;
  }

  .quiz-timer__label {
    font-size: 0.7rem;
  }
}
</style>