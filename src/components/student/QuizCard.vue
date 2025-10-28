<template>
  <BaseCard class="quiz-card" hoverable>
    <div class="quiz-header">
      <h3 class="quiz-title">{{ quiz.title }}</h3>
      <div class="quiz-meta">
        <span class="meta-item">{{ quiz.questions.length }} questions</span>
        <span class="meta-item">{{ formatTime(quiz.duration) }}</span>
        <span class="meta-item" v-if="quiz.category">{{ quiz.category }}</span>
      </div>
    </div>
    
    <p class="quiz-description">{{ quiz.description }}</p>
    
    <div class="quiz-footer">
      <div class="quiz-stats">
        <div class="stat" v-if="quiz.difficulty">
          <span class="stat-label">Difficulty:</span>
          <span class="stat-value" :style="{ color: getDifficultyColor(quiz.difficulty) }">
            {{ quiz.difficulty }}
          </span>
        </div>
      </div>
      <BaseButton @click="$emit('start-quiz', quiz.id)" variant="primary">
        Start Quiz
      </BaseButton>
    </div>
  </BaseCard>
</template>

<script>
import BaseCard from '../common/BaseCard.vue'
import BaseButton from '../common/BaseButton.vue'
import { formatTime, getDifficultyColor } from '../../utils/helpers'

export default {
  name: 'QuizCard',
  components: {
    BaseCard,
    BaseButton
  },
  props: {
    quiz: {
      type: Object,
      required: true
    }
  },
  emits: ['start-quiz'],
  setup() {
    return {
      formatTime,
      getDifficultyColor
    }
  }
}
</script>

<style scoped>
.quiz-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: var(--transition);
}

.quiz-header {
  margin-bottom: var(--space-4);
}

.quiz-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
  line-height: 1.3;
}

.quiz-meta {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.meta-item {
  font-size: var(--text-sm);
  color: var(--gray-600);
  background: var(--gray-100);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius);
}

.quiz-description {
  color: var(--gray-600);
  line-height: 1.5;
  margin-bottom: var(--space-6);
  flex: 1;
}

.quiz-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
}

.quiz-stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.stat {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--gray-600);
}

.stat-value {
  font-size: var(--text-sm);
  font-weight: 600;
  text-transform: capitalize;
}

@media (max-width: 640px) {
  .quiz-footer {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-3);
  }
  
  .quiz-stats {
    text-align: center;
  }
}
</style>